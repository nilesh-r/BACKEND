// services/transcriptionService.js - Service for handling transcription API calls
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
require('dotenv').config();

/**
 * Transcribe audio file using DeepInfra's Whisper API
 * @param {string} filePath - Path to the audio file
 * @returns {Promise<string>} - Transcription text
 */
async function transcribeAudio(filePath) {
  try {
    // Validate API key
    const apiKey = process.env.DEEPINFRA_API_KEY;
    if (!apiKey) {
      throw new Error('DeepInfra API key not configured');
    }

    // Read file as buffer
    const fileBuffer = fs.readFileSync(filePath);
    
    // Create form data
    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: path.basename(filePath),
      contentType: 'audio/mpeg',
    });
    
    // Make API request to DeepInfra
    const response = await axios.post(
      'https://api.deepinfra.com/v1/inference/openai/whisper-large-v3',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          ...formData.getHeaders()
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );
    
    // Check for valid response
    if (!response.data || !response.data.text) {
      throw new Error('Invalid response from transcription service');
    }
    
    return response.data.text;
  } catch (error) {
    console.error('Transcription service error:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
    }
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

module.exports = {
  transcribeAudio
};
