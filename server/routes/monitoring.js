const express = require('express');
const router = express.Router();

// GET /api/monitoring/metrics - Get system metrics
router.get('/metrics', (req, res) => {
  try {
    // Mock monitoring data for now - would be replaced with real monitoring data
    const metrics = {
      cpu: {
        usage: 42.5,
        cores: 8,
        load: [1.2, 1.5, 1.7]
      },
      memory: {
        total: 16384,
        used: 8192,
        free: 8192,
        usage: 50.0
      },
      disk: {
        total: 1024000,
        used: 512000,
        free: 512000,
        usage: 50.0
      },
      network: {
        inbound: 25.6,
        outbound: 10.2,
        connections: 128
      }
    };
    
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    res.status(500).json({ error: 'Failed to fetch system metrics' });
  }
});

// GET /api/monitoring/alerts - Get alerts
router.get('/alerts', (req, res) => {
  try {
    // Mock alerts data
    const alerts = [
      {
        id: 1,
        severity: 'critical',
        message: 'Database CPU usage above 90%',
        timestamp: '2023-01-25T08:15:30Z',
        source: 'db-server-01',
        acknowledged: false
      },
      {
        id: 2,
        severity: 'warning',
        message: 'API response time degraded',
        timestamp: '2023-01-25T07:45:12Z',
        source: 'api-gateway',
        acknowledged: true
      },
      {
        id: 3,
        severity: 'info',
        message: 'Autoscaling event triggered',
        timestamp: '2023-01-25T06:30:45Z',
        source: 'k8s-cluster',
        acknowledged: true
      }
    ];
    
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// GET /api/monitoring/logs - Get system logs
router.get('/logs', (req, res) => {
  try {
    // Query parameters for filtering and pagination
    const limit = parseInt(req.query.limit) || 100;
    const level = req.query.level || 'all';
    const service = req.query.service || 'all';
    
    // Mock logs data
    const logs = [
      {
        timestamp: '2023-01-25T08:17:42Z',
        level: 'error',
        service: 'database',
        message: 'Connection timeout after 30s'
      },
      {
        timestamp: '2023-01-25T08:17:40Z',
        level: 'warn',
        service: 'api-gateway',
        message: 'Rate limit approaching for client 192.168.1.55'
      },
      {
        timestamp: '2023-01-25T08:17:35Z',
        level: 'info',
        service: 'auth-service',
        message: 'User login successful: user_id=12345'
      },
      {
        timestamp: '2023-01-25T08:17:30Z',
        level: 'debug',
        service: 'payment-processor',
        message: 'Processing payment request for order 98765'
      }
    ];
    
    // Apply filters (in a real implementation, this would be done at the DB level)
    let filteredLogs = logs;
    if (level !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    if (service !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.service === service);
    }
    
    // Apply limit
    filteredLogs = filteredLogs.slice(0, limit);
    
    res.json({
      logs: filteredLogs,
      total: logs.length,
      filtered: filteredLogs.length,
      limit
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// GET /api/monitoring/services - Get service health
router.get('/services', (req, res) => {
  try {
    // Mock service health data
    const services = [
      {
        id: 'api-gateway',
        name: 'API Gateway',
        status: 'healthy',
        uptime: '15d 7h 23m',
        version: '1.5.2',
        lastChecked: '2023-01-25T08:18:00Z'
      },
      {
        id: 'auth-service',
        name: 'Authentication Service',
        status: 'healthy',
        uptime: '10d 12h 45m',
        version: '2.1.0',
        lastChecked: '2023-01-25T08:18:00Z'
      },
      {
        id: 'database',
        name: 'Primary Database',
        status: 'degraded',
        uptime: '30d 5h 12m',
        version: 'PostgreSQL 14.2',
        lastChecked: '2023-01-25T08:18:00Z',
        issues: [
          'High CPU usage',
          'Slow query performance'
        ]
      },
      {
        id: 'payment-processor',
        name: 'Payment Processor',
        status: 'healthy',
        uptime: '5d 8h 30m',
        version: '1.2.3',
        lastChecked: '2023-01-25T08:18:00Z'
      }
    ];
    
    res.json(services);
  } catch (error) {
    console.error('Error fetching service health:', error);
    res.status(500).json({ error: 'Failed to fetch service health' });
  }
});

// POST /api/monitoring/alerts/:id/acknowledge - Acknowledge an alert
router.post('/alerts/:id/acknowledge', (req, res) => {
  try {
    const alertId = parseInt(req.params.id);
    
    // In a real implementation, we would update the alert in the database
    
    res.json({
      success: true,
      message: `Alert ${alertId} has been acknowledged`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error acknowledging alert ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to acknowledge alert' });
  }
});

module.exports = router;