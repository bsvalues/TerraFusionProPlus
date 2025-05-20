const express = require('express');
const router = express.Router();

// Sample monitoring metrics
const metrics = {
  cpu: {
    usage: 42,
    cores: 8,
    processes: 120
  },
  memory: {
    usage: 64,
    total: 32768,
    free: 11796
  },
  disk: {
    usage: 78,
    total: 1024000,
    free: 225280
  },
  network: {
    inbound: 24,
    outbound: 18,
    connections: 87
  }
};

// Sample alerts
const alerts = [
  {
    id: '1',
    severity: 'critical',
    message: 'High CPU usage on API Gateway server',
    source: 'API Gateway',
    timestamp: '2025-05-19T14:25:00Z',
    acknowledged: false
  },
  {
    id: '2',
    severity: 'warning',
    message: 'Database connection pool nearing capacity',
    source: 'Auth Database',
    timestamp: '2025-05-19T13:40:00Z',
    acknowledged: false
  },
  {
    id: '3',
    severity: 'critical',
    message: 'Payment processor connection timeout',
    source: 'Billing Service',
    timestamp: '2025-05-19T12:10:00Z',
    acknowledged: false
  },
  {
    id: '4',
    severity: 'info',
    message: 'Scheduled maintenance for analytics cluster',
    source: 'Admin',
    timestamp: '2025-05-19T10:30:00Z',
    acknowledged: true
  },
  {
    id: '5',
    severity: 'warning',
    message: 'High memory usage on search service',
    source: 'Search Service',
    timestamp: '2025-05-19T09:15:00Z',
    acknowledged: false
  },
  {
    id: '6',
    severity: 'warning',
    message: 'Disk space running low on log server',
    source: 'Logging System',
    timestamp: '2025-05-19T08:20:00Z',
    acknowledged: true
  },
  {
    id: '7',
    severity: 'info',
    message: 'New deployment completed for authentication service',
    source: 'CI/CD Pipeline',
    timestamp: '2025-05-19T07:45:00Z',
    acknowledged: true
  }
];

// Sample logs (simplified)
const logs = [
  {
    id: '1',
    level: 'error',
    message: 'Failed to connect to payment processor: Connection timeout',
    source: 'Billing Service',
    timestamp: '2025-05-19T12:10:00Z',
    metadata: { attempt: 3, processor: 'Stripe' }
  },
  {
    id: '2',
    level: 'warn',
    message: 'Database connection pool at 85% capacity',
    source: 'Auth Database',
    timestamp: '2025-05-19T13:40:00Z',
    metadata: { pool_size: 100, active: 85 }
  },
  {
    id: '3',
    level: 'info',
    message: 'User authentication successful',
    source: 'Auth Service',
    timestamp: '2025-05-19T14:15:22Z',
    metadata: { user_id: 'user-123', method: 'oauth' }
  },
  {
    id: '4',
    level: 'debug',
    message: 'Cache hit for product catalog',
    source: 'Product Service',
    timestamp: '2025-05-19T14:16:00Z',
    metadata: { cache_key: 'products:featured', hit_count: 247 }
  },
  {
    id: '5',
    level: 'error',
    message: 'Failed to process image upload: File too large',
    source: 'Media Service',
    timestamp: '2025-05-19T14:18:30Z',
    metadata: { file_size: '25MB', max_size: '10MB', user_id: 'user-456' }
  }
];

// Get metrics
router.get('/metrics', (req, res) => {
  res.json(metrics);
});

// Get alerts
router.get('/alerts', (req, res) => {
  // Optional filtering by acknowledgement status
  const acknowledged = req.query.acknowledged;
  
  if (acknowledged === 'true') {
    return res.json(alerts.filter(a => a.acknowledged));
  } else if (acknowledged === 'false') {
    return res.json(alerts.filter(a => !a.acknowledged));
  }
  
  res.json(alerts);
});

// Get alert by id
router.get('/alerts/:id', (req, res) => {
  const alert = alerts.find(a => a.id === req.params.id);
  
  if (!alert) {
    return res.status(404).json({ message: 'Alert not found' });
  }
  
  res.json(alert);
});

// Acknowledge alert
router.post('/alerts/:id/acknowledge', (req, res) => {
  const alert = alerts.find(a => a.id === req.params.id);
  
  if (!alert) {
    return res.status(404).json({ message: 'Alert not found' });
  }
  
  alert.acknowledged = true;
  res.json(alert);
});

// Get logs with optional filtering
router.get('/logs', (req, res) => {
  let filteredLogs = [...logs];
  
  // Filter by level
  if (req.query.level) {
    filteredLogs = filteredLogs.filter(log => log.level === req.query.level);
  }
  
  // Filter by source
  if (req.query.source) {
    filteredLogs = filteredLogs.filter(log => log.source === req.query.source);
  }
  
  // Filter by time range
  if (req.query.from) {
    const fromDate = new Date(req.query.from);
    filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= fromDate);
  }
  
  if (req.query.to) {
    const toDate = new Date(req.query.to);
    filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= toDate);
  }
  
  // Search in message
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    filteredLogs = filteredLogs.filter(log => 
      log.message.toLowerCase().includes(searchTerm)
    );
  }
  
  res.json(filteredLogs);
});

module.exports = router;