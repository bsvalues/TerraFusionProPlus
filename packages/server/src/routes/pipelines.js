const express = require('express');
const router = express.Router();

// Sample pipeline data
const pipelines = [
  {
    id: '1',
    name: 'API Gateway CI/CD',
    description: 'Continuous integration and deployment for API Gateway service',
    status: 'active',
    lastRun: '2025-05-18T16:30:00Z',
    lastRunStatus: 'success',
    createdBy: 'devops-team',
    stages: [
      {
        id: '1-1',
        name: 'Build',
        description: 'Compile code and run unit tests',
        order: 1,
        steps: [
          { id: '1-1-1', name: 'Checkout', status: 'success', duration: 5 },
          { id: '1-1-2', name: 'Install Dependencies', status: 'success', duration: 45 },
          { id: '1-1-3', name: 'Compile', status: 'success', duration: 30 },
          { id: '1-1-4', name: 'Unit Tests', status: 'success', duration: 120 }
        ]
      },
      {
        id: '1-2',
        name: 'Quality',
        description: 'Run static analysis and integration tests',
        order: 2,
        steps: [
          { id: '1-2-1', name: 'Lint Code', status: 'success', duration: 25 },
          { id: '1-2-2', name: 'Code Coverage', status: 'success', duration: 35 },
          { id: '1-2-3', name: 'Security Scan', status: 'success', duration: 60 },
          { id: '1-2-4', name: 'Integration Tests', status: 'success', duration: 180 }
        ]
      },
      {
        id: '1-3',
        name: 'Deploy',
        description: 'Build and deploy to environment',
        order: 3,
        steps: [
          { id: '1-3-1', name: 'Build Docker Image', status: 'success', duration: 90 },
          { id: '1-3-2', name: 'Push to Registry', status: 'success', duration: 45 },
          { id: '1-3-3', name: 'Deploy to Environment', status: 'success', duration: 120 },
          { id: '1-3-4', name: 'Run Health Checks', status: 'success', duration: 60 }
        ]
      }
    ],
    triggers: {
      onPush: true,
      onPullRequest: true,
      onSchedule: true,
      scheduleExpression: '0 0 * * *', // Daily at midnight
      branches: ['main', 'release/*']
    },
    metrics: {
      successRate: 98.5,
      averageDuration: 780,
      lastMonthRuns: 45,
      failureCount: 1
    }
  },
  {
    id: '2',
    name: 'Payment Processor CI/CD',
    description: 'Continuous integration and deployment for Payment Processor service',
    status: 'active',
    lastRun: '2025-05-18T14:15:00Z',
    lastRunStatus: 'failed',
    createdBy: 'finance-team',
    stages: [
      {
        id: '2-1',
        name: 'Build',
        description: 'Compile code and run unit tests',
        order: 1,
        steps: [
          { id: '2-1-1', name: 'Checkout', status: 'success', duration: 5 },
          { id: '2-1-2', name: 'Install Dependencies', status: 'success', duration: 40 },
          { id: '2-1-3', name: 'Compile', status: 'success', duration: 25 },
          { id: '2-1-4', name: 'Unit Tests', status: 'success', duration: 140 }
        ]
      },
      {
        id: '2-2',
        name: 'Quality',
        description: 'Run static analysis and integration tests',
        order: 2,
        steps: [
          { id: '2-2-1', name: 'Lint Code', status: 'success', duration: 20 },
          { id: '2-2-2', name: 'Code Coverage', status: 'success', duration: 30 },
          { id: '2-2-3', name: 'Security Scan', status: 'success', duration: 75 },
          { id: '2-2-4', name: 'Integration Tests', status: 'failed', duration: 90, error: 'Timeout waiting for payment gateway mock' }
        ]
      },
      {
        id: '2-3',
        name: 'Deploy',
        description: 'Build and deploy to environment',
        order: 3,
        steps: [
          { id: '2-3-1', name: 'Build Docker Image', status: 'skipped', duration: 0 },
          { id: '2-3-2', name: 'Push to Registry', status: 'skipped', duration: 0 },
          { id: '2-3-3', name: 'Deploy to Environment', status: 'skipped', duration: 0 },
          { id: '2-3-4', name: 'Run Health Checks', status: 'skipped', duration: 0 }
        ]
      }
    ],
    triggers: {
      onPush: true,
      onPullRequest: true,
      onSchedule: false,
      scheduleExpression: null,
      branches: ['main', 'develop']
    },
    metrics: {
      successRate: 85.2,
      averageDuration: 820,
      lastMonthRuns: 32,
      failureCount: 5
    }
  },
  {
    id: '3',
    name: 'User Service CI/CD',
    description: 'Continuous integration and deployment for User Service',
    status: 'active',
    lastRun: '2025-05-19T13:40:00Z',
    lastRunStatus: 'in-progress',
    createdBy: 'auth-team',
    stages: [
      {
        id: '3-1',
        name: 'Build',
        description: 'Compile code and run unit tests',
        order: 1,
        steps: [
          { id: '3-1-1', name: 'Checkout', status: 'success', duration: 4 },
          { id: '3-1-2', name: 'Install Dependencies', status: 'success', duration: 38 },
          { id: '3-1-3', name: 'Compile', status: 'success', duration: 22 },
          { id: '3-1-4', name: 'Unit Tests', status: 'success', duration: 135 }
        ]
      },
      {
        id: '3-2',
        name: 'Quality',
        description: 'Run static analysis and integration tests',
        order: 2,
        steps: [
          { id: '3-2-1', name: 'Lint Code', status: 'success', duration: 18 },
          { id: '3-2-2', name: 'Code Coverage', status: 'success', duration: 32 },
          { id: '3-2-3', name: 'Security Scan', status: 'in-progress', duration: 0 },
          { id: '3-2-4', name: 'Integration Tests', status: 'pending', duration: 0 }
        ]
      },
      {
        id: '3-3',
        name: 'Deploy',
        description: 'Build and deploy to environment',
        order: 3,
        steps: [
          { id: '3-3-1', name: 'Build Docker Image', status: 'pending', duration: 0 },
          { id: '3-3-2', name: 'Push to Registry', status: 'pending', duration: 0 },
          { id: '3-3-3', name: 'Deploy to Environment', status: 'pending', duration: 0 },
          { id: '3-3-4', name: 'Run Health Checks', status: 'pending', duration: 0 }
        ]
      }
    ],
    triggers: {
      onPush: true,
      onPullRequest: true,
      onSchedule: true,
      scheduleExpression: '0 0 * * MON', // Weekly on Monday
      branches: ['main', 'develop', 'feature/*']
    },
    metrics: {
      successRate: 92.7,
      averageDuration: 720,
      lastMonthRuns: 52,
      failureCount: 3
    }
  },
  {
    id: '4',
    name: 'Analytics Backend CI/CD',
    description: 'Continuous integration and deployment for Analytics Backend',
    status: 'inactive',
    lastRun: '2025-05-15T10:00:00Z',
    lastRunStatus: 'success',
    createdBy: 'data-team',
    stages: [
      {
        id: '4-1',
        name: 'Build',
        description: 'Compile code and run unit tests',
        order: 1,
        steps: [
          { id: '4-1-1', name: 'Checkout', status: 'success', duration: 5 },
          { id: '4-1-2', name: 'Install Dependencies', status: 'success', duration: 65 },
          { id: '4-1-3', name: 'Compile', status: 'success', duration: 40 },
          { id: '4-1-4', name: 'Unit Tests', status: 'success', duration: 210 }
        ]
      },
      {
        id: '4-2',
        name: 'Quality',
        description: 'Run static analysis and integration tests',
        order: 2,
        steps: [
          { id: '4-2-1', name: 'Lint Code', status: 'success', duration: 25 },
          { id: '4-2-2', name: 'Code Coverage', status: 'success', duration: 45 },
          { id: '4-2-3', name: 'Security Scan', status: 'success', duration: 90 },
          { id: '4-2-4', name: 'Integration Tests', status: 'success', duration: 240 }
        ]
      },
      {
        id: '4-3',
        name: 'Deploy',
        description: 'Build and deploy to environment',
        order: 3,
        steps: [
          { id: '4-3-1', name: 'Build Docker Image', status: 'success', duration: 120 },
          { id: '4-3-2', name: 'Push to Registry', status: 'success', duration: 65 },
          { id: '4-3-3', name: 'Deploy to Environment', status: 'success', duration: 180 },
          { id: '4-3-4', name: 'Run Health Checks', status: 'success', duration: 75 }
        ]
      }
    ],
    triggers: {
      onPush: false,
      onPullRequest: false,
      onSchedule: true,
      scheduleExpression: '0 0 * * 1-5', // Weekdays at midnight
      branches: ['main']
    },
    metrics: {
      successRate: 97.1,
      averageDuration: 1160,
      lastMonthRuns: 22,
      failureCount: 0
    }
  },
  {
    id: '5',
    name: 'Infrastructure Provisioning',
    description: 'Automated infrastructure provisioning with Terraform',
    status: 'active',
    lastRun: '2025-05-19T08:00:00Z',
    lastRunStatus: 'success',
    createdBy: 'infra-team',
    stages: [
      {
        id: '5-1',
        name: 'Validation',
        description: 'Validate infrastructure code',
        order: 1,
        steps: [
          { id: '5-1-1', name: 'Checkout', status: 'success', duration: 3 },
          { id: '5-1-2', name: 'Format Check', status: 'success', duration: 10 },
          { id: '5-1-3', name: 'Terraform Validate', status: 'success', duration: 15 },
          { id: '5-1-4', name: 'Security Scan', status: 'success', duration: 45 }
        ]
      },
      {
        id: '5-2',
        name: 'Plan',
        description: 'Generate and review execution plan',
        order: 2,
        steps: [
          { id: '5-2-1', name: 'Init', status: 'success', duration: 8 },
          { id: '5-2-2', name: 'Plan', status: 'success', duration: 25 },
          { id: '5-2-3', name: 'Plan Review', status: 'success', duration: 15 }
        ]
      },
      {
        id: '5-3',
        name: 'Apply',
        description: 'Apply infrastructure changes',
        order: 3,
        steps: [
          { id: '5-3-1', name: 'Approval', status: 'success', duration: 120 },
          { id: '5-3-2', name: 'Apply', status: 'success', duration: 180 },
          { id: '5-3-3', name: 'Verification', status: 'success', duration: 90 }
        ]
      }
    ],
    triggers: {
      onPush: false,
      onPullRequest: true,
      onSchedule: true,
      scheduleExpression: '0 1 * * 1', // Monday at 1 AM
      branches: ['main', 'infrastructure/*']
    },
    metrics: {
      successRate: 100.0,
      averageDuration: 510,
      lastMonthRuns: 8,
      failureCount: 0
    }
  }
];

// Get all pipelines
router.get('/', (req, res) => {
  // Filter pipelines based on query params
  let filteredPipelines = [...pipelines];
  
  if (req.query.status) {
    filteredPipelines = filteredPipelines.filter(p => p.status === req.query.status);
  }
  
  if (req.query.lastRunStatus) {
    filteredPipelines = filteredPipelines.filter(p => p.lastRunStatus === req.query.lastRunStatus);
  }
  
  // Return simplified version for list view if requested
  if (req.query.view === 'summary') {
    const summaryPipelines = filteredPipelines.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      status: p.status,
      lastRunStatus: p.lastRunStatus,
      lastRun: p.lastRun,
      metrics: p.metrics
    }));
    
    return res.json(summaryPipelines);
  }
  
  res.json(filteredPipelines);
});

// Get pipeline by id
router.get('/:id', (req, res) => {
  const pipeline = pipelines.find(p => p.id === req.params.id);
  
  if (!pipeline) {
    return res.status(404).json({ message: 'Pipeline not found' });
  }
  
  res.json(pipeline);
});

// Create a new pipeline
router.post('/', (req, res) => {
  // In a real app, we would validate the request body
  const newPipeline = {
    id: String(pipelines.length + 1),
    status: 'inactive',
    lastRun: null,
    lastRunStatus: null,
    stages: [],
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  pipelines.push(newPipeline);
  res.status(201).json(newPipeline);
});

// Update a pipeline
router.patch('/:id', (req, res) => {
  const pipelineIndex = pipelines.findIndex(p => p.id === req.params.id);
  
  if (pipelineIndex === -1) {
    return res.status(404).json({ message: 'Pipeline not found' });
  }
  
  pipelines[pipelineIndex] = {
    ...pipelines[pipelineIndex],
    ...req.body
  };
  
  res.json(pipelines[pipelineIndex]);
});

// Delete a pipeline
router.delete('/:id', (req, res) => {
  const pipelineIndex = pipelines.findIndex(p => p.id === req.params.id);
  
  if (pipelineIndex === -1) {
    return res.status(404).json({ message: 'Pipeline not found' });
  }
  
  const deleted = pipelines.splice(pipelineIndex, 1)[0];
  res.json({ message: 'Pipeline deleted successfully', pipeline: deleted });
});

// Trigger a pipeline run
router.post('/:id/run', (req, res) => {
  const pipeline = pipelines.find(p => p.id === req.params.id);
  
  if (!pipeline) {
    return res.status(404).json({ message: 'Pipeline not found' });
  }
  
  if (pipeline.status === 'inactive') {
    return res.status(400).json({ message: 'Cannot run an inactive pipeline' });
  }
  
  if (pipeline.lastRunStatus === 'in-progress') {
    return res.status(400).json({ message: 'Pipeline is already running' });
  }
  
  // Update pipeline to be in progress
  pipeline.lastRun = new Date().toISOString();
  pipeline.lastRunStatus = 'in-progress';
  
  // Reset all steps to pending
  pipeline.stages.forEach(stage => {
    stage.steps.forEach(step => {
      step.status = 'pending';
      step.duration = 0;
    });
    
    // Set first step of first stage to in-progress
    if (stage.order === 1) {
      stage.steps[0].status = 'in-progress';
    }
  });
  
  res.json({
    message: 'Pipeline run started',
    runId: `run-${Date.now()}`,
    pipeline
  });
});

// Get pipeline metrics
router.get('/metrics/summary', (req, res) => {
  const metrics = {
    totalPipelines: pipelines.length,
    activePipelines: pipelines.filter(p => p.status === 'active').length,
    successfulRuns: pipelines.filter(p => p.lastRunStatus === 'success').length,
    failedRuns: pipelines.filter(p => p.lastRunStatus === 'failed').length,
    inProgressRuns: pipelines.filter(p => p.lastRunStatus === 'in-progress').length,
    averageSuccessRate: Math.round(
      pipelines.reduce((acc, p) => acc + (p.metrics?.successRate || 0), 0) / pipelines.length
    ),
    mostFrequentlyRun: pipelines.sort((a, b) => 
      (b.metrics?.lastMonthRuns || 0) - (a.metrics?.lastMonthRuns || 0)
    )[0].name
  };
  
  res.json(metrics);
});

module.exports = router;