// config/db.js - Supabase connection configuration
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Check for missing configuration but don't exit the process
if (!supabaseUrl || !supabaseKey) {
  console.warn('Warning: Missing Supabase configuration. Some features may not work.');
  console.warn('Please add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file');
}

// Create client even with missing config (will be handled in routes)
const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseKey || 'placeholder-key'
);

module.exports = supabase;