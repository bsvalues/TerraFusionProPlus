const express = require('express');
const cors = require('cors');
const path = require('path');
const deploymentsRouter = require('./routes/deployments');
const pipelinesRouter = require('./routes/pipelines');
const monitoringRouter = require('./routes/monitoring');

// Create Express server
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/deployments', deploymentsRouter);
app.use('/api/pipelines', pipelinesRouter);
app.use('/api/monitoring', monitoringRouter);

// Environment route - not in a separate file since it's simple
app.get('/api/environments', (req, res) => {
  const environments = [
    { id: '1', name: 'Production', color: '#22c55e' },
    { id: '2', name: 'Staging', color: '#f59e0b' },
    { id: '3', name: 'Development', color: '#3b82f6' },
    { id: '4', name: 'Testing', color: '#a855f7' }
  ];
  
  res.json(environments);
});

// Settings route - not in a separate file since it's simple
app.get('/api/settings', (req, res) => {
  const settings = {
    notifications: {
      email: true,
      slack: true,
      sms: false
    },
    deployments: {
      autoApprove: false,
      requireTests: true,
      rollbackOnFailure: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30 // minutes
    }
  };
  
  res.json(settings);
});

// Special route to check server status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve static files - React build
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Start server
async function startServer() {
  try {
    app.listen(port, '0.0.0.0', () => {
      console.log(`✅ TerraFusion Professional server running on port ${port}`);
      console.log(`🔍 API available at http://localhost:${port}/api/status`);
      
      if (process.env.NODE_ENV === 'production') {
        console.log(`🌐 Frontend available at http://localhost:${port}`);
      } else {
        console.log(`🌐 Development mode: Frontend served separately`);
      }
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();