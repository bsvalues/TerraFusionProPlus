require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure database connection
if (process.env.DATABASE_URL) {
  // Create a pool for database connections
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  // Test database connection
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Database connection error:', err);
    } else {
      console.log('Database connected successfully. Server time:', res.rows[0].now);
    }
  });
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, '../client')));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TerraFusionProfessional API is running' });
});

// Serve HTML for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index-standalone.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TerraFusionProfessional server is running on port ${PORT}`);
});

module.exports = app;