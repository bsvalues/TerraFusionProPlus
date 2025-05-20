const express = require('express');
const router = express.Router();

// Sample pipeline data
const pipelines = [
  {
    id: '1',
    name: 'API Gateway CI/CD',
    description: 'Continuous integration and deployment for API Gateway',
    lastRun: '2025-05-19T14:30:00Z',
    lastRunStatus: 'success',
    nextScheduledRun: '2025-05-20T14:30:00Z',
    owner: 'DevOps Team',
    steps: [
      { name: 'Build', status: 'success', duration: 45 },
      { name: 'Test', status: 'success', duration: 120 },
      { name: 'Deploy', status: 'success', duration: 60 }
    ]
  },
  {
    id: '2',
    name: 'Customer Portal Build',
    description: 'Build process for customer portal frontend',
    lastRun: '2025-05-19T13:15:00Z',
    lastRunStatus: 'success',
    nextScheduledRun: '2025-05-20T13:15:00Z',
    owner: 'Frontend Team',
    steps: [
      { name: 'Install Dependencies', status: 'success', duration: 30 },
      { name: 'Lint', status: 'success', duration: 15 },
      { name: 'Build', status: 'success', duration: 45 },
      { name: 'Test', status: 'success', duration: 60 }
    ]
  },
  {
    id: '3',
    name: 'Billing Service Pipeline',
    description: 'CI/CD pipeline for billing microservice',
    lastRun: '2025-05-18T09:45:00Z',
    lastRunStatus: 'failed',
    nextScheduledRun: null,
    owner: 'Backend Team',
    steps: [
      { name: 'Build', status: 'success', duration: 40 },
      { name: 'Unit Tests', status: 'success', duration: 35 },
      { name: 'Integration Tests', status: 'failed', duration: 85 },
      { name: 'Deploy', status: 'skipped', duration: 0 }
    ]
  },
  {
    id: '4',
    name: 'Analytics Engine Nightly Build',
    description: 'Nightly build for analytics processing engine',
    lastRun: '2025-05-19T01:00:00Z',
    lastRunStatus: 'running',
    nextScheduledRun: '2025-05-20T01:00:00Z',
    owner: 'Data Team',
    steps: [
      { name: 'Build', status: 'success', duration: 60 },
      { name: 'Unit Tests', status: 'success', duration: 90 },
      { name: 'Integration Tests', status: 'running', duration: 120 },
      { name: 'Performance Tests', status: 'pending', duration: 0 },
      { name: 'Deploy', status: 'pending', duration: 0 }
    ]
  },
  {
    id: '5',
    name: 'Admin Dashboard Deployment',
    description: 'Deployment pipeline for admin dashboard',
    lastRun: '2025-05-16T15:20:00Z',
    lastRunStatus: 'success',
    nextScheduledRun: null,
    owner: 'Frontend Team',
    steps: [
      { name: 'Build', status: 'success', duration: 35 },
      { name: 'Test', status: 'success', duration: 45 },
      { name: 'Deploy to Staging', status: 'success', duration: 25 },
      { name: 'Smoke Tests', status: 'success', duration: 15 },
      { name: 'Deploy to Production', status: 'success', duration: 30 }
    ]
  },
  {
    id: '6',
    name: 'Authentication Service CI',
    description: 'Continuous integration for auth service',
    lastRun: '2025-05-19T10:10:00Z',
    lastRunStatus: 'success',
    nextScheduledRun: '2025-05-20T10:10:00Z',
    owner: 'Security Team',
    steps: [
      { name: 'Build', status: 'success', duration: 40 },
      { name: 'Lint', status: 'success', duration: 20 },
      { name: 'Unit Tests', status: 'success', duration: 55 },
      { name: 'Integration Tests', status: 'success', duration: 75 },
      { name: 'Security Scan', status: 'success', duration: 60 }
    ]
  },
  {
    id: '7',
    name: 'Notification Service Build',
    description: 'Build and test pipeline for notification microservice',
    lastRun: '2025-05-18T14:25:00Z',
    lastRunStatus: 'failed',
    nextScheduledRun: null,
    owner: 'Backend Team',
    steps: [
      { name: 'Build', status: 'success', duration: 30 },
      { name: 'Unit Tests', status: 'success', duration: 45 },
      { name: 'Integration Tests', status: 'failed', duration: 65 },
      { name: 'Deploy', status: 'skipped', duration: 0 }
    ]
  }
];

// Get all pipelines
router.get('/', (req, res) => {
  res.json(pipelines);
});

// Get pipeline by id
router.get('/:id', (req, res) => {
  const pipeline = pipelines.find(p => p.id === req.params.id);
  
  if (!pipeline) {
    return res.status(404).json({ message: 'Pipeline not found' });
  }
  
  res.json(pipeline);
});

// Create new pipeline
router.post('/', (req, res) => {
  // In a real implementation, this would validate and create a new pipeline
  const newPipeline = {
    id: String(pipelines.length + 1),
    ...req.body,
    lastRun: null,
    lastRunStatus: 'pending',
    nextScheduledRun: req.body.nextScheduledRun || null
  };
  
  pipelines.push(newPipeline);
  res.status(201).json(newPipeline);
});

// Update pipeline
router.put('/:id', (req, res) => {
  const index = pipelines.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Pipeline not found' });
  }
  
  pipelines[index] = {
    ...pipelines[index],
    ...req.body
  };
  
  res.json(pipelines[index]);
});

// Delete pipeline
router.delete('/:id', (req, res) => {
  const index = pipelines.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Pipeline not found' });
  }
  
  const deleted = pipelines.splice(index, 1);
  res.json(deleted[0]);
});

// Run a pipeline
router.post('/:id/run', (req, res) => {
  const pipeline = pipelines.find(p => p.id === req.params.id);
  
  if (!pipeline) {
    return res.status(404).json({ message: 'Pipeline not found' });
  }
  
  // In a real implementation, this would trigger the pipeline to run
  pipeline.lastRun = new Date().toISOString();
  pipeline.lastRunStatus = 'running';
  
  // Reset all steps to pending
  pipeline.steps = pipeline.steps.map(step => ({
    ...step,
    status: 'pending',
    duration: 0
  }));
  
  // Start the first step
  if (pipeline.steps.length > 0) {
    pipeline.steps[0].status = 'running';
  }
  
  res.json(pipeline);
});

module.exports = router;