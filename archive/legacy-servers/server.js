const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./db');
const { storage } = require('./storage');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database initialization
let dbInitialized = false;

// API Endpoints
app.get('/api/properties', async (req, res) => {
  try {
    if (!dbInitialized) {
      await initDatabase();
      dbInitialized = true;
    }
    
    const properties = await storage.getProperties();
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    if (!dbInitialized) {
      await initDatabase();
      dbInitialized = true;
    }
    
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

app.get('/api/appraisals', async (req, res) => {
  try {
    if (!dbInitialized) {
      await initDatabase();
      dbInitialized = true;
    }
    
    // If property ID is provided, get appraisals for that property
    if (req.query.propertyId) {
      const appraisals = await storage.getAppraisalsByProperty(parseInt(req.query.propertyId));
      return res.json(appraisals);
    }
    
    // If appraiser ID is provided, get appraisals for that appraiser
    if (req.query.appraiserId) {
      const appraisals = await storage.getAppraisalsByAppraiser(parseInt(req.query.appraiserId));
      return res.json(appraisals);
    }
    
    // Default: return an empty array (in a real app, you'd return all appraisals)
    res.json([]);
  } catch (error) {
    console.error('Error fetching appraisals:', error);
    res.status(500).json({ error: 'Failed to fetch appraisals' });
  }
});

app.get('/api/appraisals/:id', async (req, res) => {
  try {
    if (!dbInitialized) {
      await initDatabase();
      dbInitialized = true;
    }
    
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

app.get('/api/comparables', async (req, res) => {
  try {
    if (!dbInitialized) {
      await initDatabase();
      dbInitialized = true;
    }
    
    if (req.query.appraisalId) {
      const comparables = await storage.getComparablesByAppraisal(parseInt(req.query.appraisalId));
      return res.json(comparables);
    }
    
    // Default: return an empty array
    res.json([]);
  } catch (error) {
    console.error('Error fetching comparables:', error);
    res.status(500).json({ error: 'Failed to fetch comparables' });
  }
});

app.get('/api/market-data', async (req, res) => {
  try {
    if (!dbInitialized) {
      await initDatabase();
      dbInitialized = true;
    }
    
    if (req.query.zipCode) {
      const marketData = await storage.getMarketDataByZipCode(req.query.zipCode);
      return res.json(marketData);
    }
    
    if (req.query.propertyId) {
      const marketData = await storage.getMarketDataForProperty(parseInt(req.query.propertyId));
      return res.json(marketData);
    }
    
    // Default: return an empty array
    res.json([]);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize database on startup
initDatabase()
  .then(() => {
    console.log('Database connected successfully at:', new Date().toISOString());
    dbInitialized = true;
  })
  .catch(err => {
    console.error('Database initialization error:', err);
  });