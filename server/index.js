// Simple Express server
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./init-db');
const { storage } = require('./storage');

// Create Express server
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'TerraFusion Professional API Server is running!' });
});

// User routes
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const newUser = await storage.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Property routes
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await storage.getProperties();
    res.json(properties);
  } catch (error) {
    console.error('Error getting properties:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const property = await storage.getProperty(propertyId);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    console.error('Error getting property:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const newProperty = await storage.createProperty(req.body);
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Appraisal routes
app.get('/api/appraisals', async (req, res) => {
  try {
    const propertyId = req.query.propertyId;
    const appraiserId = req.query.appraiserId;
    
    let appraisals = [];
    if (propertyId) {
      appraisals = await storage.getAppraisalsByProperty(parseInt(propertyId));
    } else if (appraiserId) {
      appraisals = await storage.getAppraisalsByAppraiser(parseInt(appraiserId));
    } else {
      // For simplicity, we're not implementing a getAll method here
      // In a real application, you'd add pagination and filtering
      appraisals = [];
    }
    
    res.json(appraisals);
  } catch (error) {
    console.error('Error getting appraisals:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/appraisals/:id', async (req, res) => {
  try {
    const appraisalId = parseInt(req.params.id);
    const appraisal = await storage.getAppraisal(appraisalId);
    
    if (!appraisal) {
      return res.status(404).json({ error: 'Appraisal not found' });
    }
    
    res.json(appraisal);
  } catch (error) {
    console.error('Error getting appraisal:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/appraisals', async (req, res) => {
  try {
    const newAppraisal = await storage.createAppraisal(req.body);
    res.status(201).json(newAppraisal);
  } catch (error) {
    console.error('Error creating appraisal:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Comparable routes
app.get('/api/comparables', async (req, res) => {
  try {
    const appraisalId = req.query.appraisalId;
    
    if (!appraisalId) {
      return res.status(400).json({ error: 'Appraisal ID is required' });
    }
    
    const comparables = await storage.getComparablesByAppraisal(parseInt(appraisalId));
    res.json(comparables);
  } catch (error) {
    console.error('Error getting comparables:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/comparables/:id', async (req, res) => {
  try {
    const comparableId = parseInt(req.params.id);
    const comparable = await storage.getComparable(comparableId);
    
    if (!comparable) {
      return res.status(404).json({ error: 'Comparable not found' });
    }
    
    res.json(comparable);
  } catch (error) {
    console.error('Error getting comparable:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/comparables', async (req, res) => {
  try {
    const newComparable = await storage.createComparable(req.body);
    res.status(201).json(newComparable);
  } catch (error) {
    console.error('Error creating comparable:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// For all other requests, just respond with an API message for now
// until client is built
app.get('/*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.json({ 
    message: 'TerraFusion Professional API Server is running', 
    info: 'Client application is not yet built'
  });
});

// Initialize the database before starting the server
async function startServer() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('Database initialized successfully');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`TerraFusion Professional API Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();