const express = require('express');
const router = express.Router();

// Sample deployment data
const deployments = [
  {
    id: '1',
    name: 'Production API Gateway',
    status: 'active',
    environment: 'production',
    lastDeployed: '2025-05-15T10:30:00Z',
    version: 'v1.2.3',
    health: 'healthy',
    instances: 3
  },
  {
    id: '2',
    name: 'Customer Portal Frontend',
    status: 'active',
    environment: 'production',
    lastDeployed: '2025-05-14T15:45:00Z',
    version: 'v2.1.0',
    health: 'healthy',
    instances: 2
  },
  {
    id: '3',
    name: 'Billing Service',
    status: 'active',
    environment: 'production',
    lastDeployed: '2025-05-10T08:15:00Z',
    version: 'v1.5.2',
    health: 'healthy',
    instances: 2
  },
  {
    id: '4',
    name: 'Analytics Engine',
    status: 'inactive',
    environment: 'staging',
    lastDeployed: '2025-05-01T14:20:00Z',
    version: 'v0.9.1',
    health: 'degraded',
    instances: 1
  },
  {
    id: '5',
    name: 'Admin Dashboard',
    status: 'active',
    environment: 'production',
    lastDeployed: '2025-05-12T11:10:00Z',
    version: 'v1.1.7',
    health: 'healthy',
    instances: 2
  },
  {
    id: '6',
    name: 'Authentication Service',
    status: 'active',
    environment: 'production',
    lastDeployed: '2025-05-08T09:30:00Z',
    version: 'v2.0.1',
    health: 'healthy',
    instances: 3
  },
  {
    id: '7',
    name: 'Notification Service',
    status: 'active',
    environment: 'staging',
    lastDeployed: '2025-05-16T13:25:00Z',
    version: 'v0.8.5',
    health: 'healthy',
    instances: 1
  }
];

// Get all deployments
router.get('/', (req, res) => {
  res.json(deployments);
});

// Get deployment by id
router.get('/:id', (req, res) => {
  const deployment = deployments.find(d => d.id === req.params.id);
  
  if (!deployment) {
    return res.status(404).json({ message: 'Deployment not found' });
  }
  
  res.json(deployment);
});

// Create new deployment
router.post('/', (req, res) => {
  // In a real implementation, this would validate and create a new deployment
  const newDeployment = {
    id: String(deployments.length + 1),
    ...req.body,
    lastDeployed: new Date().toISOString()
  };
  
  deployments.push(newDeployment);
  res.status(201).json(newDeployment);
});

// Update deployment
router.put('/:id', (req, res) => {
  const index = deployments.findIndex(d => d.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Deployment not found' });
  }
  
  deployments[index] = {
    ...deployments[index],
    ...req.body,
  };
  
  res.json(deployments[index]);
});

// Delete deployment
router.delete('/:id', (req, res) => {
  const index = deployments.findIndex(d => d.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Deployment not found' });
  }
  
  const deleted = deployments.splice(index, 1);
  res.json(deleted[0]);
});

module.exports = router;