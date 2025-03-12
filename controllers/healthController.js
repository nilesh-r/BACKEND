// controllers/healthController.js - Health check controller
const supabase = require('../config/db');

/**
 * Check server and database health
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function checkHealth(req, res) {
  try {
    // Check database connection
    const { data, error } = await supabase.from('transcriptions').select('count', { count: 'exact' }).limit(0);
    
    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection failed',
        error: error.message
      });
    }
    
    // Return success
    res.status(200).json({
      status: 'success',
      message: 'Server is healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
}

module.exports = {
  checkHealth
};