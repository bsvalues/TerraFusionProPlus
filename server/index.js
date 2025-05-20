const express = require('express');
const path = require('path');
const cors = require('cors');
const { createServer: createViteServer } = require('vite');
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

  // API Routes
  app.use('/api/deployments', deployments);
  app.use('/api/pipelines', pipelines);
  app.use('/api/monitoring', monitoring);

  // Environment info endpoint
  app.get('/api/environments', (req, res) => {
    // For now, returning mock data until we implement actual environments endpoints
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

  // Development setup with Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    // Create Vite server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      root: path.resolve(__dirname, '../client'),
      appType: 'spa'
    });

    // Use vite's connect instance as middleware
    app.use(vite.middlewares);
    
    // Log requests in development
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.url}`);
      next();
    });
  } else {
    // Production: serve static files
    app.use(express.static(path.join(__dirname, '../client/dist')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

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