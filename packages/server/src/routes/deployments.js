const express = require('express');
const router = express.Router();

// Sample deployment data
const deployments = [
  {
    id: '1',
    name: 'API Gateway Update',
    status: 'completed',
    environment: 'production',
    startTime: '2025-05-18T16:30:00Z',
    endTime: '2025-05-18T16:45:23Z',
    initiatedBy: 'jenkins-ci',
    artifacts: {
      image: 'api-gateway:1.2.3',
      configVersion: '89',
      commit: 'abc123def456'
    },
    logs: [
      { timestamp: '2025-05-18T16:30:00Z', message: 'Deployment started', level: 'info' },
      { timestamp: '2025-05-18T16:31:12Z', message: 'Pre-flight checks passed', level: 'info' },
      { timestamp: '2025-05-18T16:32:45Z', message: 'Rolling update initiated', level: 'info' },
      { timestamp: '2025-05-18T16:40:18Z', message: 'Health checks passed', level: 'info' },
      { timestamp: '2025-05-18T16:45:23Z', message: 'Deployment completed successfully', level: 'info' }
    ]
  },
  {
    id: '2',
    name: 'Payment Processor Update',
    status: 'failed',
    environment: 'staging',
    startTime: '2025-05-18T14:15:00Z',
    endTime: '2025-05-18T14:22:37Z',
    initiatedBy: 'maria.dev',
    artifacts: {
      image: 'payment-processor:2.1.0',
      configVersion: '54',
      commit: '789xyz456abc'
    },
    logs: [
      { timestamp: '2025-05-18T14:15:00Z', message: 'Deployment started', level: 'info' },
      { timestamp: '2025-05-18T14:16:20Z', message: 'Pre-flight checks passed', level: 'info' },
      { timestamp: '2025-05-18T14:18:05Z', message: 'Database migration failed', level: 'error' },
      { timestamp: '2025-05-18T14:22:37Z', message: 'Rolling back changes', level: 'warn' },
      { timestamp: '2025-05-18T14:22:37Z', message: 'Deployment failed', level: 'error' }
    ]
  },
  {
    id: '3',
    name: 'User Service Update',
    status: 'in-progress',
    environment: 'development',
    startTime: '2025-05-19T13:40:00Z',
    endTime: null,
    initiatedBy: 'alex.ops',
    artifacts: {
      image: 'user-service:3.0.1',
      configVersion: '30',
      commit: 'def789abc012'
    },
    logs: [
      { timestamp: '2025-05-19T13:40:00Z', message: 'Deployment started', level: 'info' },
      { timestamp: '2025-05-19T13:41:45Z', message: 'Pre-flight checks passed', level: 'info' },
      { timestamp: '2025-05-19T13:43:10Z', message: 'Database migration in progress', level: 'info' },
      { timestamp: '2025-05-19T13:46:30Z', message: 'Service update in progress', level: 'info' }
    ]
  },
  {
    id: '4',
    name: 'Analytics Backend Update',
    status: 'completed',
    environment: 'production',
    startTime: '2025-05-15T10:00:00Z',
    endTime: '2025-05-15T10:45:12Z',
    initiatedBy: 'jenkins-ci',
    artifacts: {
      image: 'analytics-backend:1.8.5',
      configVersion: '76',
      commit: '456def789ghi'
    },
    logs: [
      { timestamp: '2025-05-15T10:00:00Z', message: 'Deployment started', level: 'info' },
      { timestamp: '2025-05-15T10:02:30Z', message: 'Pre-flight checks passed', level: 'info' },
      { timestamp: '2025-05-15T10:15:45Z', message: 'Service update completed', level: 'info' },
      { timestamp: '2025-05-15T10:30:20Z', message: 'Running data verification', level: 'info' },
      { timestamp: '2025-05-15T10:45:12Z', message: 'Deployment completed successfully', level: 'info' }
    ]
  },
  {
    id: '5',
    name: 'Notification Service Update',
    status: 'scheduled',
    environment: 'production',
    startTime: '2025-05-25T02:00:00Z',
    endTime: null,
    initiatedBy: 'scheduled-job',
    artifacts: {
      image: 'notification-service:2.3.0',
      configVersion: '42',
      commit: '123ghi456jkl'
    },
    logs: []
  }
];

// Get all deployments
router.get('/', (req, res) => {
  // Filter deployments based on query params
  let filteredDeployments = [...deployments];
  
  if (req.query.status) {
    filteredDeployments = filteredDeployments.filter(d => d.status === req.query.status);
  }
  
  if (req.query.environment) {
    filteredDeployments = filteredDeployments.filter(d => d.environment === req.query.environment);
  }
  
  res.json(filteredDeployments);
});

// Get deployment by id
router.get('/:id', (req, res) => {
  const deployment = deployments.find(d => d.id === req.params.id);
  
  if (!deployment) {
    return res.status(404).json({ message: 'Deployment not found' });
  }
  
  res.json(deployment);
});

// Create a new deployment
router.post('/', (req, res) => {
  // In a real app, we would validate the request body
  const newDeployment = {
    id: String(deployments.length + 1),
    status: 'scheduled',
    startTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // Schedule 5 minutes from now
    endTime: null,
    logs: [],
    ...req.body
  };
  
  deployments.push(newDeployment);
  res.status(201).json(newDeployment);
});

// Update a deployment
router.patch('/:id', (req, res) => {
  const deploymentIndex = deployments.findIndex(d => d.id === req.params.id);
  
  if (deploymentIndex === -1) {
    return res.status(404).json({ message: 'Deployment not found' });
  }
  
  deployments[deploymentIndex] = {
    ...deployments[deploymentIndex],
    ...req.body
  };
  
  res.json(deployments[deploymentIndex]);
});

// Cancel a deployment
router.post('/:id/cancel', (req, res) => {
  const deploymentIndex = deployments.findIndex(d => d.id === req.params.id);
  
  if (deploymentIndex === -1) {
    return res.status(404).json({ message: 'Deployment not found' });
  }
  
  const deployment = deployments[deploymentIndex];
  
  if (deployment.status !== 'scheduled' && deployment.status !== 'in-progress') {
    return res.status(400).json({ message: 'Can only cancel scheduled or in-progress deployments' });
  }
  
  deployment.status = 'cancelled';
  deployment.endTime = new Date().toISOString();
  deployment.logs.push({
    timestamp: deployment.endTime,
    message: 'Deployment cancelled',
    level: 'warn'
  });
  
  res.json(deployment);
});

// Add a log entry to a deployment
router.post('/:id/logs', (req, res) => {
  const deploymentIndex = deployments.findIndex(d => d.id === req.params.id);
  
  if (deploymentIndex === -1) {
    return res.status(404).json({ message: 'Deployment not found' });
  }
  
  const newLog = {
    timestamp: new Date().toISOString(),
    level: 'info',
    ...req.body
  };
  
  deployments[deploymentIndex].logs.push(newLog);
  
  res.status(201).json(newLog);
});

module.exports = router;