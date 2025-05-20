const express = require('express');
const router = express.Router();

// Sample deployment data for demonstration
const deployments = [
  { 
    id: 'dep-1', 
    name: 'Production', 
    status: 'success', 
    lastDeployed: new Date(Date.now() - 86400000), 
    version: 'v1.2.3',
    environment: 'production',
    commit: '67a8e2d',
    branch: 'main',
    logs: [
      { timestamp: new Date(Date.now() - 90000000), level: 'info', message: 'Starting deployment' },
      { timestamp: new Date(Date.now() - 89000000), level: 'info', message: 'Building application' },
      { timestamp: new Date(Date.now() - 88000000), level: 'info', message: 'Running tests' },
      { timestamp: new Date(Date.now() - 87000000), level: 'info', message: 'Tests passed' },
      { timestamp: new Date(Date.now() - 86500000), level: 'info', message: 'Deploying to production' },
      { timestamp: new Date(Date.now() - 86400000), level: 'info', message: 'Deployment completed successfully' }
    ]
  },
  { 
    id: 'dep-2', 
    name: 'Staging', 
    status: 'in-progress', 
    lastDeployed: new Date(Date.now() - 3600000), 
    version: 'v1.2.4-rc1',
    environment: 'staging',
    commit: '3fe791b',
    branch: 'feature/new-dashboard',
    logs: [
      { timestamp: new Date(Date.now() - 3900000), level: 'info', message: 'Starting deployment' },
      { timestamp: new Date(Date.now() - 3800000), level: 'info', message: 'Building application' },
      { timestamp: new Date(Date.now() - 3700000), level: 'info', message: 'Running tests' },
      { timestamp: new Date(Date.now() - 3650000), level: 'info', message: 'Tests passed' },
      { timestamp: new Date(Date.now() - 3630000), level: 'info', message: 'Deploying to staging' },
      { timestamp: new Date(Date.now() - 3600000), level: 'info', message: 'Deployment in progress...' }
    ]
  },
  { 
    id: 'dep-3', 
    name: 'Development', 
    status: 'success', 
    lastDeployed: new Date(Date.now() - 7200000), 
    version: 'v1.2.4-dev',
    environment: 'development',
    commit: 'f9e4d2c',
    branch: 'develop',
    logs: [
      { timestamp: new Date(Date.now() - 7500000), level: 'info', message: 'Starting deployment' },
      { timestamp: new Date(Date.now() - 7400000), level: 'info', message: 'Building application' },
      { timestamp: new Date(Date.now() - 7300000), level: 'warning', message: 'Minor test failures, continuing deployment' },
      { timestamp: new Date(Date.now() - 7250000), level: 'info', message: 'Deploying to development' },
      { timestamp: new Date(Date.now() - 7200000), level: 'info', message: 'Deployment completed successfully' }
    ]
  }
];

// Get all deployments
router.get('/status', (req, res) => {
  res.json(deployments);
});

// Get deployment by ID
router.get('/:id', (req, res) => {
  const deployment = deployments.find(d => d.id === req.params.id);
  if (!deployment) {
    return res.status(404).json({ error: 'Deployment not found' });
  }
  res.json(deployment);
});

// Get deployment logs
router.get('/:id/logs', (req, res) => {
  const deployment = deployments.find(d => d.id === req.params.id);
  if (!deployment) {
    return res.status(404).json({ error: 'Deployment not found' });
  }
  res.json(deployment.logs);
});

// Create a new deployment
router.post('/', (req, res) => {
  const { name, environment, branch, version } = req.body;
  
  if (!name || !environment) {
    return res.status(400).json({ error: 'Name and environment are required' });
  }
  
  const newDeployment = {
    id: `dep-${deployments.length + 1}`,
    name,
    environment,
    branch: branch || 'main',
    version: version || `v1.0.0-${environment}`,
    status: 'pending',
    lastDeployed: new Date(),
    logs: [
      { timestamp: new Date(), level: 'info', message: 'Deployment requested' }
    ]
  };
  
  // In a real app, this would trigger an actual deployment process
  // For demo purposes, we'll just add it to our array
  deployments.push(newDeployment);
  
  res.status(201).json(newDeployment);
});

// Update deployment status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const deployment = deployments.find(d => d.id === req.params.id);
  
  if (!deployment) {
    return res.status(404).json({ error: 'Deployment not found' });
  }
  
  if (!status || !['pending', 'in-progress', 'success', 'failed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required' });
  }
  
  deployment.status = status;
  deployment.logs.push({
    timestamp: new Date(),
    level: status === 'failed' ? 'error' : 'info',
    message: `Deployment status updated to ${status}`
  });
  
  res.json(deployment);
});

module.exports = router;