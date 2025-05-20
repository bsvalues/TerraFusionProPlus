const express = require('express');
const path = require('path');
const cors = require('cors');
const { db } = require('./db');
const { storage } = require('./storage');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes for real estate appraisal platform
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
      message: 'TerraFusion Professional - Real Estate Appraisal Platform',
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

async function startServer() {
  try {
    // Initialize database connection and schemas
    await db.execute('SELECT 1');
    console.log('Database connection established');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`TerraFusion Professional server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    console.error('Database error details:', error.message);
  }
}

startServer();