// routes/transcriptionRoutes.js - Routes for transcription operations
const express = require('express');
const router = express.Router();
const transcriptionController = require('../controllers/transcriptionController');
const upload = require('../config/upload');

// POST /api/transcribe - Upload and transcribe audio
router.post(
  '/transcribe',
  upload.single('audio'),
  transcriptionController.transcribeAudio
);

// GET /api/transcriptions - Get all transcriptions
router.get(
  '/transcriptions',
  transcriptionController.getAllTranscriptions
);

// GET /api/transcriptions/:id - Get single transcription
router.get(
  '/transcriptions/:id',
  transcriptionController.getTranscription
);

// DELETE /api/transcriptions/:id - Delete transcription
router.delete(
  '/transcriptions/:id',
  transcriptionController.deleteTranscription
);
