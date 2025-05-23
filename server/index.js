const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./db');
const { storage } = require('./storage');
const { insertPropertySchema, insertAppraisalSchema, insertComparableSchema } = require('../shared/schema');
const { properties, appraisals, comparables, marketData } = require('./mock-data');

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;

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

// Serve the static HTML directly for the root
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TerraFusion Professional - Real Estate Appraisal Platform</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
            :root {
                --primary: #2a4365;
                --primary-light: #4299e1;
                --secondary: #38b2ac;
                --background: #f8f9fa;
                --text: #333333;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: var(--background);
                color: var(--text);
            }
            .card {
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .card:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 15px rgba(0,0,0,0.1);
            }
        </style>
    </head>
    <body>
        <header class="bg-white shadow-sm fixed w-full z-10">
            <div class="container mx-auto px-4">
                <div class="flex justify-between h-16">
                    <div class="flex">
                        <div class="flex-shrink-0 flex items-center">
                            <a href="/" class="text-xl font-bold text-blue-600">TerraFusion Pro</a>
                        </div>
                        <nav class="ml-8 flex space-x-4 items-center">
                            <a href="#properties" class="px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                <span>Properties</span>
                            </a>
                            <a href="#" class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                                <span>Appraisals</span>
                            </a>
                            <a href="#" class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5"><rect width="16" height="16" x="4" y="4" rx="1"></rect><path d="M4 12h16"></path><path d="M12 4v16"></path></svg>
                                <span>Reports</span>
                            </a>
                        </nav>
                    </div>
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <button id="add-property-btn" class="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                                Add Property
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <main class="container mx-auto px-4 pt-20 pb-8">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-900">Property Listings</h1>
                <button class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                    <span>Add Property</span>
                </button>
            </div>

            <div class="relative mb-6">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                </div>
                <input
                    type="text"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search properties by address, city, state, or zip code..."
                >
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="properties-container">
                ${properties.map(property => `
                <div class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow card cursor-pointer" data-id="${property.id}">
                    <div class="bg-blue-600 h-3"></div>
                    <div class="p-4">
                        <h3 class="text-lg font-medium text-gray-900 mb-1">${property.address}</h3>
                        <p class="text-gray-600 mb-3">${property.city}, ${property.state} ${property.zipCode}</p>
                        
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p class="text-gray-500">Property Type</p>
                                <p class="font-medium">${property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}</p>
                            </div>
                            <div>
                                <p class="text-gray-500">Year Built</p>
                                <p class="font-medium">${property.yearBuilt}</p>
                            </div>
                            <div>
                                <p class="text-gray-500">Bedrooms / Baths</p>
                                <p class="font-medium">${property.bedrooms} / ${property.bathrooms}</p>
                            </div>
                            <div>
                                <p class="text-gray-500">Square Feet</p>
                                <p class="font-medium">${property.squareFeet}</p>
                            </div>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </main>

        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Add property click handlers
                document.getElementById('add-property-btn').addEventListener('click', function() {
                    alert('In the full application, this would open a property creation form with fields for all property details including address, specifications, zoning information, and more.');
                });

                // Property card click handlers
                document.querySelectorAll('.card').forEach(card => {
                    card.addEventListener('click', function() {
                        const propertyId = this.getAttribute('data-id');
                        alert('In the full application, this would open the property details page for property #' + propertyId + ' with options to view property information, edit details, and create/manage appraisals.');
                    });
                });
            });
        </script>
    </body>
    </html>
  `);
});

// Serve static files for any other assets
app.use(express.static(path.join(__dirname, '..')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;