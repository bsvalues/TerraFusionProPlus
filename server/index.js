const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./db');
const { storage } = require('./storage');
const { insertPropertySchema, insertAppraisalSchema, insertComparableSchema } = require('../shared/schema');

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3000;

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
    const properties = await storage.getProperties();
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

    const property = await storage.getProperty(id);
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
    
    let appraisals = [];
    
    if (propertyId) {
      appraisals = await storage.getAppraisalsByProperty(propertyId);
    } else if (appraiserId) {
      appraisals = await storage.getAppraisalsByAppraiser(appraiserId);
    } else {
      // In a real application, you might want to limit this or implement pagination
      // For now, we'll return an error asking for a filter
      return res.status(400).json({ error: 'Please provide either propertyId or appraiserId as a query parameter' });
    }
    
    return res.status(200).json(appraisals);
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

    const appraisal = await storage.getAppraisal(id);
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
    
    const comparables = await storage.getComparablesByAppraisal(appraisalId);
    return res.status(200).json(comparables);
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
    
    let marketData = [];
    
    if (zipCode) {
      marketData = await storage.getMarketDataByZipCode(zipCode);
    } else if (propertyId) {
      marketData = await storage.getMarketDataForProperty(propertyId);
    } else {
      return res.status(400).json({ error: 'Please provide either zipCode or propertyId as a query parameter' });
    }
    
    return res.status(200).json(marketData);
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

// Serve static files from the 'client/dist' directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Create a simple HTML response for the root route
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
          background-color: #f0f4f8;
          color: #333;
        }
        header {
          background-color: #1a3a5f;
          color: white;
          padding: 1rem 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
          margin: 0;
          font-size: 2rem;
        }
        main {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 2rem;
        }
        .hero {
          background-color: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          margin-bottom: 2rem;
        }
        h2 {
          color: #2c5282;
          margin-top: 0;
        }
        p {
          line-height: 1.6;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .feature-card {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .feature-card h3 {
          color: #3182ce;
          margin-top: 0;
        }
        footer {
          background-color: #1a3a5f;
          color: white;
          text-align: center;
          padding: 1rem;
          margin-top: 2rem;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>TerraFusion Professional</h1>
      </header>
      <main>
        <section class="hero">
          <h2>Advanced Real Estate Appraisal Platform</h2>
          <p>Welcome to TerraFusion Professional, a comprehensive solution for real estate appraisers. Streamline your appraisal process, manage properties efficiently, and generate accurate valuations with our powerful tools.</p>
        </section>
        
        <div class="features">
          <div class="feature-card">
            <h3>Property Management</h3>
            <p>Manage detailed property information including location, specifications, and ownership details in one centralized database.</p>
          </div>
          
          <div class="feature-card">
            <h3>Comparable Analysis</h3>
            <p>Find and analyze comparable properties with our advanced filtering system. Make adjustments and see results in real-time.</p>
          </div>
          
          <div class="feature-card">
            <h3>Market Data Integration</h3>
            <p>Access up-to-date market data, trends, and statistics to include in your appraisal reports for enhanced accuracy.</p>
          </div>
          
          <div class="feature-card">
            <h3>Comprehensive Reports</h3>
            <p>Generate professional appraisal reports with customizable templates that meet industry standards and regulations.</p>
          </div>
          
          <div class="feature-card">
            <h3>Team Collaboration</h3>
            <p>Work together seamlessly with team members on complex appraisals with our collaborative workflow system.</p>
          </div>
          
          <div class="feature-card">
            <h3>Mobile Access</h3>
            <p>Access your appraisal data on-the-go with our responsive design that works on desktop, tablet, and mobile devices.</p>
          </div>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 TerraFusion Professional. All rights reserved.</p>
      </footer>
    </body>
    </html>
  `);
});

// All other requests will be directed to the main index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;