// controllers/transcriptionController.js - Controllers for transcription routes
const fs = require('fs');
const path = require('path');
const transcriptionService = require('../services/transcriptionService');
const transcriptionModel = require('../models/transcriptionModel');

/**
 * Upload and transcribe an audio file
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function transcribeAudio(req, res, next) {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No audio file uploaded'
      });
    }

    const filePath = req.file.path;
    const userId = req.body.userId || 'anonymous';
    const fileName = req.file.originalname;

    // Generate transcription
    const transcriptionText = await transcriptionService.transcribeAudio(filePath);
    
    // Save to database
    const transcriptionData = {
      user_id: userId,
      file_name: fileName,
      transcription_text: transcriptionText,
      file_path: req.file.filename,
      created_at: new Date()
    };
    
    const savedTranscription = await transcriptionModel.saveTranscription(transcriptionData);
    
    // Return success response
    res.status(200).json({
      status: 'success',
      data: {
        transcription: savedTranscription,
        text: transcriptionText
      }
    });
    
  } catch (error) {
    // Clean up file if there was an error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error removing file:', unlinkError);
      }
    }
    
    next(error);
  }
}

/**
 * Get all transcriptions with optional user filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getAllTranscriptions(req, res, next) {
  try {
    const userId = req.query.userId || null;
    const transcriptions = await transcriptionModel.getTranscriptions(userId);
    
    res.status(200).json({
      status: 'success',
      results: transcriptions.length,
      data: {
        transcriptions
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single transcription by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getTranscription(req, res, next) {
  try {
    const { id } = req.params;
    const transcription = await transcriptionModel.getTranscriptionById(id);
    
    res.status(200).json({
      status: 'success',
      data: {
        transcription
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a transcription by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function deleteTranscription(req, res, next) {
  try {
    const { id } = req.params;
    
    // Get the transcription to find the file
    const transcription = await transcriptionModel.getTranscriptionById(id);
    
    // Delete from database
    await transcriptionModel.deleteTranscription(id);
    
    // Delete the file if it exists
    if (transcription.file_path) {
      const filePath = path.join(__dirname, '..', 'uploads', transcription.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Transcription deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  transcribeAudio,
  getAllTranscriptions,
  getTranscription,
  deleteTranscription
};