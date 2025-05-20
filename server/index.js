const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/deployments', require('./routes/deployments'));
app.use('/api/monitoring', require('./routes/monitoring'));
app.use('/api/pipelines', require('./routes/pipelines'));

// Serve static files from the React build if in production
// In development, Vite will handle this
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
      message: 'TerraFusionProfessional API Server',
      endpoints: [
        '/api/deployments',
        '/api/monitoring',
        '/api/pipelines'
      ]
    });
  });
}

async function startServer() {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`TerraFusionProfessional server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();