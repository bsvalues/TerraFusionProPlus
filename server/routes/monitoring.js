const express = require('express');
const router = express.Router();

// Sample monitoring data for demonstration
const monitoringData = {
  resources: {
    cpu: { currentUsage: 65, limit: 100, unit: '%' },
    memory: { currentUsage: 4.2, limit: 8, unit: 'GB' },
    disk: { currentUsage: 32, limit: 100, unit: 'GB' },
    network: { currentUsage: 42, limit: 100, unit: 'Mbps' }
  },
  
  alerts: [
    { id: 'alert-1', type: 'warning', message: 'CPU usage above 60% for 15 minutes', timestamp: new Date(Date.now() - 900000) },
    { id: 'alert-2', type: 'info', message: 'Scheduled maintenance completed', timestamp: new Date(Date.now() - 3600000) },
    { id: 'alert-3', type: 'error', message: 'Database connection timeout occurred', timestamp: new Date(Date.now() - 7200000) },
  ],
  
  // Historical time series data
  history: {
    cpu: [
      { timestamp: new Date(Date.now() - 3600000 * 24), value: 45 },
      { timestamp: new Date(Date.now() - 3600000 * 20), value: 42 },
      { timestamp: new Date(Date.now() - 3600000 * 16), value: 50 },
      { timestamp: new Date(Date.now() - 3600000 * 12), value: 70 },
      { timestamp: new Date(Date.now() - 3600000 * 8), value: 75 },
      { timestamp: new Date(Date.now() - 3600000 * 4), value: 60 },
      { timestamp: new Date(), value: 65 },
    ],
    memory: [
      { timestamp: new Date(Date.now() - 3600000 * 24), value: 3.5 },
      { timestamp: new Date(Date.now() - 3600000 * 20), value: 3.2 },
      { timestamp: new Date(Date.now() - 3600000 * 16), value: 3.8 },
      { timestamp: new Date(Date.now() - 3600000 * 12), value: 4.5 },
      { timestamp: new Date(Date.now() - 3600000 * 8), value: 4.8 },
      { timestamp: new Date(Date.now() - 3600000 * 4), value: 4.3 },
      { timestamp: new Date(), value: 4.2 },
    ],
    disk: [
      { timestamp: new Date(Date.now() - 3600000 * 24), value: 28 },
      { timestamp: new Date(Date.now() - 3600000 * 20), value: 29 },
      { timestamp: new Date(Date.now() - 3600000 * 16), value: 29 },
      { timestamp: new Date(Date.now() - 3600000 * 12), value: 30 },
      { timestamp: new Date(Date.now() - 3600000 * 8), value: 30 },
      { timestamp: new Date(Date.now() - 3600000 * 4), value: 31 },
      { timestamp: new Date(), value: 32 },
    ],
    network: [
      { timestamp: new Date(Date.now() - 3600000 * 24), value: 25 },
      { timestamp: new Date(Date.now() - 3600000 * 20), value: 20 },
      { timestamp: new Date(Date.now() - 3600000 * 16), value: 30 },
      { timestamp: new Date(Date.now() - 3600000 * 12), value: 45 },
      { timestamp: new Date(Date.now() - 3600000 * 8), value: 50 },
      { timestamp: new Date(Date.now() - 3600000 * 4), value: 40 },
      { timestamp: new Date(), value: 42 },
    ],
  },
  
  // Pod metrics for Kubernetes environments
  pods: [
    { 
      name: 'api-server-7d8f7d4b7b-2xvjl', 
      status: 'running', 
      cpu: { usage: '120m', limit: '500m' }, 
      memory: { usage: '256Mi', limit: '512Mi' },
      restarts: 0,
      age: '3d'
    },
    { 
      name: 'web-app-5b9b4b4b4b-x7z9m', 
      status: 'running', 
      cpu: { usage: '85m', limit: '250m' }, 
      memory: { usage: '128Mi', limit: '256Mi' },
      restarts: 1,
      age: '2d'
    },
    { 
      name: 'db-0', 
      status: 'running', 
      cpu: { usage: '300m', limit: '1000m' }, 
      memory: { usage: '1.0Gi', limit: '2.0Gi' },
      restarts: 0,
      age: '5d'
    }
  ],
  
  // System health checks
  healthChecks: [
    { name: 'API Server', status: 'healthy', lastChecked: new Date(Date.now() - 60000) },
    { name: 'Database', status: 'healthy', lastChecked: new Date(Date.now() - 120000) },
    { name: 'Front-end', status: 'healthy', lastChecked: new Date(Date.now() - 180000) },
    { name: 'Cache', status: 'healthy', lastChecked: new Date(Date.now() - 240000) },
    { name: 'Message Queue', status: 'degraded', lastChecked: new Date(Date.now() - 300000) },
  ]
};

// Get current resource metrics
router.get('/metrics', (req, res) => {
  res.json(monitoringData);
});

// Get specific resource metrics
router.get('/metrics/resources', (req, res) => {
  res.json(monitoringData.resources);
});

// Get historical data for a specific resource
router.get('/metrics/history/:resource', (req, res) => {
  const { resource } = req.params;
  const { startTime, endTime } = req.query;
  
  if (!monitoringData.history[resource]) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  
  let filteredData = monitoringData.history[resource];
  
  // Filter by time range if provided
  if (startTime && endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    filteredData = filteredData.filter(entry => {
      const timestamp = new Date(entry.timestamp);
      return timestamp >= start && timestamp <= end;
    });
  }
  
  res.json(filteredData);
});

// Get all active alerts
router.get('/alerts', (req, res) => {
  const { type } = req.query;
  
  if (type) {
    const filteredAlerts = monitoringData.alerts.filter(alert => alert.type === type);
    return res.json(filteredAlerts);
  }
  
  res.json(monitoringData.alerts);
});

// Get pod metrics
router.get('/pods', (req, res) => {
  res.json(monitoringData.pods);
});

// Get health check status
router.get('/health', (req, res) => {
  const { service } = req.query;
  
  if (service) {
    const serviceHealth = monitoringData.healthChecks.find(check => 
      check.name.toLowerCase() === service.toLowerCase()
    );
    
    if (!serviceHealth) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    return res.json(serviceHealth);
  }
  
  res.json(monitoringData.healthChecks);
});

// Create a new alert (for demonstration)
router.post('/alerts', (req, res) => {
  const { type, message } = req.body;
  
  if (!type || !message) {
    return res.status(400).json({ error: 'Type and message are required' });
  }
  
  if (!['info', 'warning', 'error'].includes(type)) {
    return res.status(400).json({ error: 'Type must be one of: info, warning, error' });
  }
  
  const newAlert = {
    id: `alert-${monitoringData.alerts.length + 1}`,
    type,
    message,
    timestamp: new Date()
  };
  
  monitoringData.alerts.unshift(newAlert);
  
  res.status(201).json(newAlert);
});

module.exports = router;