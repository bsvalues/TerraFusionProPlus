const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes for TerraFusionProfessional real estate appraisal platform
app.use('/api/properties', require('./routes/properties'));
app.use('/api/appraisals', require('./routes/appraisals'));
app.use('/api/comparables', require('./routes/comparables'));
app.use('/api/market-data', require('./routes/market-data'));
app.use('/api/users', require('./routes/users'));

// Serve static files from the React build if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Catch-all route to send back to the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} else {
  // Only provide API routes in development, Vite will handle the frontend
  app.get('/', (req, res) => {
    res.json({ 
      status: 'API is running',
      message: 'TerraFusionProfessional Real Estate Appraisal Platform',
      endpoints: [
        '/api/properties',
        '/api/appraisals',
        '/api/comparables',
        '/api/market-data',
        '/api/users'
      ]
    });
  });
}

// Create a pool connection to Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function initDatabase() {
  // Test database connection
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    client.release();
    return true;
  } catch (err) {
    console.error('Error connecting to database:', err);
    return false;
  }
}

async function startServer() {
  try {
    // Check database connection
    const dbConnected = await initDatabase();
    if (!dbConnected) {
      console.warn('Warning: Unable to connect to database. Some features may not work properly.');
    }
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`TerraFusionProfessional server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();