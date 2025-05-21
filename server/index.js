const express = require('express');
const cors = require('cors');
const path = require('path');
const { db, initDatabase } = require('./db');
const { storage } = require('./storage');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// API Routes
// Properties
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await storage.getProperties();
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await storage.getProperty(parseInt(req.params.id));
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const newProperty = await storage.createProperty(req.body);
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Appraisals
app.get('/api/appraisals', async (req, res) => {
  try {
    let appraisals;
    if (req.query.propertyId) {
      appraisals = await storage.getAppraisalsByProperty(parseInt(req.query.propertyId));
    } else if (req.query.appraiserId) {
      appraisals = await storage.getAppraisalsByAppraiser(parseInt(req.query.appraiserId));
    } else {
      // Get all appraisals
      appraisals = await db.select().from('appraisals');
    }
    res.json(appraisals);
  } catch (error) {
    console.error('Error fetching appraisals:', error);
    res.status(500).json({ error: 'Failed to fetch appraisals' });
  }
});

app.get('/api/appraisals/:id', async (req, res) => {
  try {
    const appraisal = await storage.getAppraisal(parseInt(req.params.id));
    if (!appraisal) {
      return res.status(404).json({ error: 'Appraisal not found' });
    }
    res.json(appraisal);
  } catch (error) {
    console.error('Error fetching appraisal:', error);
    res.status(500).json({ error: 'Failed to fetch appraisal' });
  }
});

app.post('/api/appraisals', async (req, res) => {
  try {
    const newAppraisal = await storage.createAppraisal(req.body);
    res.status(201).json(newAppraisal);
  } catch (error) {
    console.error('Error creating appraisal:', error);
    res.status(500).json({ error: 'Failed to create appraisal' });
  }
});

// Comparables
app.get('/api/comparables', async (req, res) => {
  try {
    let comparables;
    if (req.query.appraisalId) {
      comparables = await storage.getComparablesByAppraisal(parseInt(req.query.appraisalId));
    } else {
      // Get all comparables
      comparables = await db.select().from('comparables');
    }
    res.json(comparables);
  } catch (error) {
    console.error('Error fetching comparables:', error);
    res.status(500).json({ error: 'Failed to fetch comparables' });
  }
});

app.post('/api/comparables', async (req, res) => {
  try {
    const newComparable = await storage.createComparable(req.body);
    res.status(201).json(newComparable);
  } catch (error) {
    console.error('Error creating comparable:', error);
    res.status(500).json({ error: 'Failed to create comparable' });
  }
});

// Market Data
app.get('/api/market-data', async (req, res) => {
  try {
    let marketData;
    if (req.query.zipCode) {
      marketData = await storage.getMarketDataByZipCode(req.query.zipCode);
    } else {
      // Get all market data
      marketData = await db.select().from('market_data');
    }
    res.json(marketData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database and create tables if they don't exist
    await initDatabase();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();