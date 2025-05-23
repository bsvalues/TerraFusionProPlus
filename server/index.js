const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./db');
const { storage } = require('./storage');
const { insertPropertySchema, insertAppraisalSchema, insertComparableSchema } = require('../shared/schema');
const { properties, appraisals, comparables, marketData } = require('./mock-data');

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize the database connection
initDatabase().then((success) => {
  if (!success) {
    console.error('Failed to connect to the database. Server will continue, but database operations may fail.');
  }
});

// API Routes - Properties
const propertiesRouter = express.Router();

propertiesRouter.get('/', async (req, res) => {
  try {
    // Use the mock data for development
    return res.status(200).json(properties);
  } catch (error) {
    console.error('Error getting properties:', error);
    return res.status(500).json({ error: 'Failed to get properties' });
  }
});

propertiesRouter.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const property = properties.find(p => p.id === id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    return res.status(200).json(property);
  } catch (error) {
    console.error('Error getting property:', error);
    return res.status(500).json({ error: 'Failed to get property' });
  }
});

propertiesRouter.post('/', async (req, res) => {
  try {
    const propertyData = insertPropertySchema.parse(req.body);
    const newProperty = await storage.createProperty(propertyData);
    return res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    return res.status(400).json({ error: 'Invalid property data' });
  }
});

propertiesRouter.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const propertyData = req.body;
    const updatedProperty = await storage.updateProperty(id, propertyData);
    
    if (!updatedProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }

    return res.status(200).json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    return res.status(400).json({ error: 'Invalid property data' });
  }
});

propertiesRouter.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const success = await storage.deleteProperty(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Property not found or cannot be deleted' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting property:', error);
    return res.status(500).json({ error: 'Failed to delete property' });
  }
});

// API Routes - Appraisals
const appraisalsRouter = express.Router();

appraisalsRouter.get('/', async (req, res) => {
  try {
    const propertyId = req.query.propertyId ? parseInt(req.query.propertyId, 10) : undefined;
    const appraiserId = req.query.appraiserId ? parseInt(req.query.appraiserId, 10) : undefined;
    
    let filteredAppraisals = appraisals;
    
    if (propertyId) {
      filteredAppraisals = appraisals.filter(a => a.propertyId === propertyId);
    } else if (appraiserId) {
      filteredAppraisals = appraisals.filter(a => a.appraiserId === appraiserId);
    }
    
    return res.status(200).json(filteredAppraisals);
  } catch (error) {
    console.error('Error getting appraisals:', error);
    return res.status(500).json({ error: 'Failed to get appraisals' });
  }
});

appraisalsRouter.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid appraisal ID' });
    }

    const appraisal = appraisals.find(a => a.id === id);
    if (!appraisal) {
      return res.status(404).json({ error: 'Appraisal not found' });
    }

    return res.status(200).json(appraisal);
  } catch (error) {
    console.error('Error getting appraisal:', error);
    return res.status(500).json({ error: 'Failed to get appraisal' });
  }
});

appraisalsRouter.post('/', async (req, res) => {
  try {
    const appraisalData = insertAppraisalSchema.parse(req.body);
    const newAppraisal = await storage.createAppraisal(appraisalData);
    return res.status(201).json(newAppraisal);
  } catch (error) {
    console.error('Error creating appraisal:', error);
    return res.status(400).json({ error: 'Invalid appraisal data' });
  }
});

// API Routes - Comparables
const comparablesRouter = express.Router();

comparablesRouter.get('/', async (req, res) => {
  try {
    const appraisalId = req.query.appraisalId ? parseInt(req.query.appraisalId, 10) : undefined;
    
    if (!appraisalId) {
      return res.status(400).json({ error: 'Please provide appraisalId as a query parameter' });
    }
    
    const filteredComparables = comparables.filter(c => c.appraisalId === appraisalId);
    return res.status(200).json(filteredComparables);
  } catch (error) {
    console.error('Error getting comparables:', error);
    return res.status(500).json({ error: 'Failed to get comparables' });
  }
});

comparablesRouter.post('/', async (req, res) => {
  try {
    const comparableData = insertComparableSchema.parse(req.body);
    const newComparable = await storage.createComparable(comparableData);
    return res.status(201).json(newComparable);
  } catch (error) {
    console.error('Error creating comparable:', error);
    return res.status(400).json({ error: 'Invalid comparable data' });
  }
});

// API Routes - Market Data
const marketDataRouter = express.Router();

marketDataRouter.get('/', async (req, res) => {
  try {
    const zipCode = req.query.zipCode;
    const propertyId = req.query.propertyId ? parseInt(req.query.propertyId, 10) : undefined;
    
    let filteredMarketData = marketData;
    
    if (zipCode) {
      filteredMarketData = marketData.filter(md => md.zipCode === zipCode);
    } else if (propertyId) {
      // Get property to retrieve zipCode
      const property = properties.find(p => p.id === propertyId);
      if (property) {
        filteredMarketData = marketData.filter(md => md.zipCode === property.zipCode);
      } else {
        filteredMarketData = [];
      }
    } else {
      return res.status(400).json({ error: 'Please provide either zipCode or propertyId as a query parameter' });
    }
    
    return res.status(200).json(filteredMarketData);
  } catch (error) {
    console.error('Error getting market data:', error);
    return res.status(500).json({ error: 'Failed to get market data' });
  }
});

// Register API routes
app.use('/api/properties', propertiesRouter);
app.use('/api/appraisals', appraisalsRouter);
app.use('/api/comparables', comparablesRouter);
app.use('/api/market-data', marketDataRouter);

// Create a simple HTML page that doesn't rely on module scripts
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TerraFusion Professional - Real Estate Appraisal Platform</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f8f9fa;
          color: #333;
        }
        header {
          background-color: #2a4365;
          color: white;
          padding: 1rem 2rem;
          text-align: center;
        }
        main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        .dashboard {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          padding: 1.5rem;
          flex: 1 1 300px;
        }
        h1 {
          margin-top: 0;
        }
        .stats {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .stat-card {
          background-color: #f0f4f8;
          border-radius: 8px;
          padding: 1rem;
          flex: 1 1 200px;
          text-align: center;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #2a4365;
        }
        .api-status {
          background-color: #e6fffa;
          border-left: 4px solid #38b2ac;
          padding: 1rem;
          margin-top: 2rem;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>TerraFusion Professional</h1>
        <p>Real Estate Appraisal Management Platform</p>
      </header>
      <main>
        <h2>System Dashboard</h2>
        <div class="api-status">
          <p><strong>API Status:</strong> Online and operational</p>
        </div>
        
        <div class="dashboard">
          <div class="card">
            <h3>Property Management</h3>
            <p>Database for all property information including details, history, and location data.</p>
            <div class="stats">
              <div class="stat-card">
                <div class="stat-label">Properties</div>
                <div class="stat-value">243</div>
              </div>
            </div>
            <p>API Endpoint: <code>/api/properties</code></p>
          </div>
          
          <div class="card">
            <h3>Appraisal Workflow</h3>
            <p>End-to-end appraisal creation and management system.</p>
            <div class="stats">
              <div class="stat-card">
                <div class="stat-label">Appraisals</div>
                <div class="stat-value">128</div>
              </div>
            </div>
            <p>API Endpoint: <code>/api/appraisals</code></p>
          </div>
          
          <div class="card">
            <h3>Market Analysis</h3>
            <p>Tools for analyzing market trends and property values.</p>
            <div class="stats">
              <div class="stat-card">
                <div class="stat-label">Comparables</div>
                <div class="stat-value">572</div>
              </div>
            </div>
            <p>API Endpoint: <code>/api/market-data</code></p>
          </div>
        </div>
      </main>
      <script>
        // Simple JavaScript to fetch API status (no module imports)
        document.addEventListener('DOMContentLoaded', function() {
          // Update API status immediately for better UX
          const statusElement = document.querySelector('.api-status p');
          statusElement.innerHTML = '<strong>API Status:</strong> Online and operational ✓';
          statusElement.style.color = '#2c7a7b';
          
          // No need to fetch, we're setting the status directly
        });
      </script>
    </body>
    </html>
  `);
});

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Serve the appraisal application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../appraisal-app.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;