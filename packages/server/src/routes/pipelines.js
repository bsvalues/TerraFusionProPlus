const express = require('express');
const router = express.Router();

// GET /api/pipelines - List all pipelines
router.get('/', async (req, res) => {
  try {
    // Mock pipeline data - would be replaced with actual DB calls
    const pipelines = [
      {
        id: 1,
        name: 'Production Release',
        status: 'active',
        lastRun: '2023-01-20T15:30:45Z',
        lastRunStatus: 'success',
        stages: [
          {
            name: 'Build',
            status: 'success',
            duration: '2m 15s'
          },
          {
            name: 'Test',
            status: 'success',
            duration: '5m 30s'
          },
          {
            name: 'Deploy',
            status: 'success',
            duration: '3m 45s'
          }
        ],
        triggers: ['push:main', 'schedule:daily']
      },
      {
        id: 2,
        name: 'Feature Branch Integration',
        status: 'active',
        lastRun: '2023-01-20T14:15:30Z',
        lastRunStatus: 'failed',
        stages: [
          {
            name: 'Build',
            status: 'success',
            duration: '1m 50s'
          },
          {
            name: 'Test',
            status: 'failed',
            duration: '4m 20s'
          },
          {
            name: 'Deploy',
            status: 'skipped',
            duration: '-'
          }
        ],
        triggers: ['push:feature/*', 'pull_request']
      },
      {
        id: 3,
        name: 'Nightly Database Backup',
        status: 'active',
        lastRun: '2023-01-21T01:00:00Z',
        lastRunStatus: 'success',
        stages: [
          {
            name: 'Backup',
            status: 'success',
            duration: '10m 25s'
          },
          {
            name: 'Verify',
            status: 'success',
            duration: '2m 10s'
          },
          {
            name: 'Archive',
            status: 'success',
            duration: '5m 15s'
          }
        ],
        triggers: ['schedule:nightly']
      }
    ];
    
    res.json(pipelines);
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    res.status(500).json({ error: 'Failed to fetch pipelines' });
  }
});

// GET /api/pipelines/:id - Get pipeline details
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Mock pipeline detail data - would be replaced with DB lookup
    const pipeline = {
      id,
      name: 'Production Release',
      description: 'Main production deployment pipeline for API services',
      status: 'active',
      lastRun: '2023-01-20T15:30:45Z',
      lastRunStatus: 'success',
      stages: [
        {
          name: 'Build',
          status: 'success',
          duration: '2m 15s',
          steps: [
            { name: 'Checkout', status: 'success', duration: '5s' },
            { name: 'Install Dependencies', status: 'success', duration: '45s' },
            { name: 'Compile', status: 'success', duration: '1m 25s' }
          ]
        },
        {
          name: 'Test',
          status: 'success',
          duration: '5m 30s',
          steps: [
            { name: 'Unit Tests', status: 'success', duration: '1m 20s' },
            { name: 'Integration Tests', status: 'success', duration: '3m 45s' },
            { name: 'Code Coverage', status: 'success', duration: '25s' }
          ]
        },
        {
          name: 'Deploy',
          status: 'success',
          duration: '3m 45s',
          steps: [
            { name: 'Create Artifacts', status: 'success', duration: '45s' },
            { name: 'Deploy to Production', status: 'success', duration: '2m 30s' },
            { name: 'Smoke Tests', status: 'success', duration: '30s' }
          ]
        }
      ],
      triggers: ['push:main', 'schedule:daily'],
      history: [
        {
          runId: 'run-123',
          startTime: '2023-01-20T15:30:45Z',
          endTime: '2023-01-20T15:42:15Z',
          status: 'success',
          commit: {
            id: 'abc123',
            message: 'Fix API rate limiting',
            author: 'jane.doe@example.com'
          }
        },
        {
          runId: 'run-122',
          startTime: '2023-01-19T10:15:30Z',
          endTime: '2023-01-19T10:28:10Z',
          status: 'success',
          commit: {
            id: 'def456',
            message: 'Add new dashboard features',
            author: 'john.smith@example.com'
          }
        },
        {
          runId: 'run-121',
          startTime: '2023-01-18T14:22:15Z',
          endTime: '2023-01-18T14:30:45Z',
          status: 'failed',
          commit: {
            id: 'ghi789',
            message: 'Refactor authentication system',
            author: 'jane.doe@example.com'
          }
        }
      ],
      config: {
        timeout: 3600,
        retryAttempts: 2,
        environment: {
          NODE_ENV: 'production',
          API_VERSION: 'v1.2.5'
        }
      }
    };
    
    res.json(pipeline);
  } catch (error) {
    console.error(`Error fetching pipeline ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch pipeline details' });
  }
});

// POST /api/pipelines - Create new pipeline
router.post('/', async (req, res) => {
  try {
    const newPipeline = req.body;
    
    // Validation would happen here
    if (!newPipeline.name) {
      return res.status(400).json({ error: 'Pipeline name is required' });
    }
    
    // Mock response - would normally save to DB and return
    res.status(201).json({
      id: 4,
      ...newPipeline,
      status: 'active',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating pipeline:', error);
    res.status(500).json({ error: 'Failed to create pipeline' });
  }
});

// PUT /api/pipelines/:id - Update pipeline
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    // Mock response - would normally update in DB
    res.json({
      id,
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error updating pipeline ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update pipeline' });
  }
});

// POST /api/pipelines/:id/run - Trigger pipeline run
router.post('/:id/run', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Mock response - would normally trigger the pipeline in the CI/CD system
    res.json({
      success: true,
      message: `Pipeline ${id} has been triggered`,
      runId: `run-${Date.now()}`,
      startTime: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error triggering pipeline ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to trigger pipeline' });
  }
});

// GET /api/pipelines/:id/runs - Get pipeline run history
router.get('/:id/runs', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Mock pipeline runs data - would be replaced with DB lookup
    const runs = [
      {
        runId: 'run-123',
        pipelineId: id,
        startTime: '2023-01-20T15:30:45Z',
        endTime: '2023-01-20T15:42:15Z',
        status: 'success',
        duration: '11m 30s',
        commit: {
          id: 'abc123',
          message: 'Fix API rate limiting',
          author: 'jane.doe@example.com'
        }
      },
      {
        runId: 'run-122',
        pipelineId: id,
        startTime: '2023-01-19T10:15:30Z',
        endTime: '2023-01-19T10:28:10Z',
        status: 'success',
        duration: '12m 40s',
        commit: {
          id: 'def456',
          message: 'Add new dashboard features',
          author: 'john.smith@example.com'
        }
      },
      {
        runId: 'run-121',
        pipelineId: id,
        startTime: '2023-01-18T14:22:15Z',
        endTime: '2023-01-18T14:30:45Z',
        status: 'failed',
        duration: '8m 30s',
        commit: {
          id: 'ghi789',
          message: 'Refactor authentication system',
          author: 'jane.doe@example.com'
        }
      }
    ];
    
    res.json(runs);
  } catch (error) {
    console.error(`Error fetching runs for pipeline ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch pipeline runs' });
  }
});

// DELETE /api/pipelines/:id - Delete pipeline
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Mock success - would normally delete from DB
    res.json({ 
      success: true, 
      message: `Pipeline ${id} has been deleted` 
    });
  } catch (error) {
    console.error(`Error deleting pipeline ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete pipeline' });
  }
});

module.exports = router;