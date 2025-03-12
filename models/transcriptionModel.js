// models/transcriptionModel.js - Database operations for transcriptions
const supabase = require('../config/db');

/**
 * Save a new transcription to the database
 * @param {Object} transcriptionData - Transcription data to save
 * @returns {Promise<Object>} - Saved transcription data
 */
async function saveTranscription(transcriptionData) {
  const { data, error } = await supabase
    .from('transcriptions')
    .insert([transcriptionData])
    .select();
  
  if (error) {
    console.error('Error saving transcription:', error);
    throw new Error('Failed to save transcription to database');
  }
  
  return data[0];
}

/**
 * Get all transcriptions, optionally filtered by user ID
 * @param {string} userId - Optional user ID to filter by
 * @returns {Promise<Array>} - Array of transcription records
 */
async function getTranscriptions(userId = null) {
  let query = supabase
    .from('transcriptions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching transcriptions:', error);
    throw new Error('Failed to fetch transcriptions from database');
  }
  
  return data;
}

/**
 * Get a single transcription by ID
 * @param {string} id - Transcription ID
 * @returns {Promise<Object>} - Transcription record
 */
async function getTranscriptionById(id) {
  const { data, error } = await supabase
    .from('transcriptions')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching transcription:', error);
    throw new Error('Failed to fetch transcription from database');
  }
  
  return data;
}

/**
 * Delete a transcription by ID
 * @param {string} id - Transcription ID to delete
 * @returns {Promise<boolean>} - Success status
 */
async function deleteTranscription(id) {
  const { error } = await supabase
    .from('transcriptions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting transcription:', error);
    throw new Error('Failed to delete transcription');
  }
  
  return true;
}

module.exports = {
  saveTranscription,
  getTranscriptions,
  getTranscriptionById,
  deleteTranscription
};