const express = require('express');
const path = require('path');
const cors = require('cors');
const deployments = require('./routes/deployments');
const pipelines = require('./routes/pipelines');
const monitoring = require('./routes/monitoring');

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 5000;
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Log requests
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // API Routes
  app.use('/api/deployments', deployments);
  app.use('/api/pipelines', pipelines);
  app.use('/api/monitoring', monitoring);

  // Environment info endpoint
  app.get('/api/environments', (req, res) => {
    // For now, returning data until we implement actual environments endpoints
    res.json([
      { id: 'env-1', name: 'Production', status: 'success', region: 'us-west-1', type: 'kubernetes' },
      { id: 'env-2', name: 'Staging', status: 'success', region: 'us-west-1', type: 'kubernetes' },
      { id: 'env-3', name: 'Development', status: 'success', region: 'us-east-1', type: 'kubernetes' },
    ]);
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', version: '1.0.0' });
  });
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' ? null : err.message
    });
  });

  // Start the server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
}

// Start the server
startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});