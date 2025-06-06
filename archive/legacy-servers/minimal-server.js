const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./init-db');

// Create Express server
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'TerraFusion Professional API Server is running!' });
});

// For all other requests, serve the client app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Initialize the database before starting the server
async function startServer() {
  try {
    // Initialize the database
    await initializeDatabase();
    
    // Start the server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`TerraFusion Professional API Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;