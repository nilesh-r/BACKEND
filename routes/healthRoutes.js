// routes/healthRoutes.js - Routes for health checking
const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// GET /api/health - Check server health
router.get('/health', healthController.checkHealth);

module.exports = router;
