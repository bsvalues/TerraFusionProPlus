const express = require('express');
const router = express.Router();

// Sample pipeline data for demonstration
const pipelines = [
  {
    id: 'pipe-1',
    name: 'Production Deploy',
    status: 'success',
    type: 'deploy',
    repository: 'terrafusion/main',
    commit: '67a8e2d',
    branch: 'main',
    triggered_by: 'John Smith',
    triggered_at: new Date(Date.now() - 1800000), // 30 minutes ago
    duration: '5m 23s',
    stages: [
      { name: 'Build', status: 'success', duration: '2m 12s' },
      { name: 'Test', status: 'success', duration: '1m 45s' },
      { name: 'Deploy', status: 'success', duration: '1m 26s' },
    ]
  },
  {
    id: 'pipe-2',
    name: 'Feature Branch Test',
    status: 'running',
    type: 'test',
    repository: 'terrafusion/main',
    commit: '3fe791b',
    branch: 'feature/new-dashboard',
    triggered_by: 'Jane Doe',
    triggered_at: new Date(Date.now() - 600000), // 10 minutes ago
    duration: 'Running',
    stages: [
      { name: 'Build', status: 'success', duration: '2m 30s' },
      { name: 'Test', status: 'running', duration: 'Running' },
      { name: 'Deploy', status: 'pending', duration: '-' },
    ]
  },
  {
    id: 'pipe-3',
    name: 'Hotfix Deploy',
    status: 'failed',
    type: 'deploy',
    repository: 'terrafusion/main',
    commit: 'f9e4d2c',
    branch: 'hotfix/auth-issue',
    triggered_by: 'Alice Wilson',
    triggered_at: new Date(Date.now() - 7200000), // 2 hours ago
    duration: '3m 12s',
    stages: [
      { name: 'Build', status: 'success', duration: '2m 05s' },
      { name: 'Test', status: 'failed', duration: '1m 07s' },
      { name: 'Deploy', status: 'cancelled', duration: '-' },
    ]
  }
];

// Get all pipelines or filter by status/type
router.get('/status', (req, res) => {
  const { status, type } = req.query;
  let filteredPipelines = [...pipelines];
  
  if (status) {
    filteredPipelines = filteredPipelines.filter(p => p.status === status);
  }
  
  if (type) {
    filteredPipelines = filteredPipelines.filter(p => p.type === type);
  }
  
  res.json(filteredPipelines);
});

// Get pipeline by ID
router.get('/:id', (req, res) => {
  const pipeline = pipelines.find(p => p.id === req.params.id);
  if (!pipeline) {
    return res.status(404).json({ error: 'Pipeline not found' });
  }
  res.json(pipeline);
});

// Trigger a new pipeline
router.post('/trigger', (req, res) => {
  const { name, repository, branch, type } = req.body;
  
  if (!name || !repository) {
    return res.status(400).json({ error: 'Name and repository are required' });
  }
  
  const newPipeline = {
    id: `pipe-${pipelines.length + 1}`,
    name,
    repository,
    branch: branch || 'main',
    type: type || 'build',
    status: 'pending',
    triggered_by: 'API User',
    triggered_at: new Date(),
    duration: 'Pending',
    stages: [
      { name: 'Build', status: 'pending', duration: '-' },
      { name: 'Test', status: 'pending', duration: '-' },
      { name: 'Deploy', status: 'pending', duration: '-' },
    ]
  };
  
  // In a real app, this would trigger an actual pipeline process
  // For demo purposes, we'll just add it to our array
  pipelines.push(newPipeline);
  
  // Simulate pipeline progress - in a real app this would be handled by a job queue/worker
  setTimeout(() => {
    const index = pipelines.findIndex(p => p.id === newPipeline.id);
    if (index !== -1) {
      pipelines[index].status = 'running';
      pipelines[index].stages[0].status = 'running';
    }
  }, 3000);
  
  res.status(201).json(newPipeline);
});

// Get pipeline stages
router.get('/:id/stages', (req, res) => {
  const pipeline = pipelines.find(p => p.id === req.params.id);
  if (!pipeline) {
    return res.status(404).json({ error: 'Pipeline not found' });
  }
  res.json(pipeline.stages);
});

// Update pipeline status (for demonstration)
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const pipeline = pipelines.find(p => p.id === req.params.id);
  
  if (!pipeline) {
    return res.status(404).json({ error: 'Pipeline not found' });
  }
  
  if (!status || !['pending', 'running', 'success', 'failed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required' });
  }
  
  pipeline.status = status;
  
  res.json(pipeline);
});

module.exports = router;