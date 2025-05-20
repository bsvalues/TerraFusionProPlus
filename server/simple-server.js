require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Database connection
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : null;

// API routes
app.get('/api/health', async (req, res) => {
  // Check database connection if available
  if (pool) {
    try {
      const result = await pool.query('SELECT NOW()');
      return res.json({
        status: 'ok',
        message: 'TerraFusionProfessional API is running',
        dbConnected: true,
        serverTime: result.rows[0].now
      });
    } catch (error) {
      return res.json({
        status: 'ok',
        message: 'TerraFusionProfessional API is running',
        dbConnected: false,
        error: error.message
      });
    }
  }
  
  res.json({
    status: 'ok',
    message: 'TerraFusionProfessional API is running',
    dbConnected: false
  });
});

// Properties endpoint
app.get('/api/properties', async (req, res) => {
  if (!pool) {
    return res.status(503).json({ error: 'Database not configured' });
  }
  
  try {
    const result = await pool.query(`
      SELECT id, address, city, state, zip_code, property_type, year_built, 
             square_feet, bedrooms, bathrooms, lot_size
      FROM properties ORDER BY id ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Market analysis mock data
app.get('/api/market-analysis', (req, res) => {
  const marketData = {
    pricePerSqftTrend: [
      { month: "Jan", value: 450, year: 2024 },
      { month: "Feb", value: 452, year: 2024 },
      { month: "Mar", value: 458, year: 2024 },
      { month: "Apr", value: 465, year: 2024 },
      { month: "May", value: 472, year: 2024 },
      { month: "Jun", value: 480, year: 2024 }
    ],
    salesVolume: [
      { month: "Jan", sales: 120, year: 2024 },
      { month: "Feb", sales: 105, year: 2024 },
      { month: "Mar", sales: 130, year: 2024 },
      { month: "Apr", sales: 142, year: 2024 },
      { month: "May", sales: 155, year: 2024 },
      { month: "Jun", sales: 162, year: 2024 }
    ],
    daysOnMarket: [
      { month: "Jan", days: 32, year: 2024 },
      { month: "Feb", days: 30, year: 2024 },
      { month: "Mar", days: 28, year: 2024 },
      { month: "Apr", days: 25, year: 2024 },
      { month: "May", days: 22, year: 2024 },
      { month: "Jun", days: 20, year: 2024 }
    ],
    propertyTypes: [
      { name: 'Single Family', value: 65 },
      { name: 'Condo', value: 18 },
      { name: 'Multi-Family', value: 10 },
      { name: 'Townhouse', value: 7 }
    ],
    neighborhoodPrices: [
      { name: 'Downtown', medianPrice: 625000, pricePerSqft: 450 },
      { name: 'North End', medianPrice: 875000, pricePerSqft: 520 },
      { name: 'South Side', medianPrice: 425000, pricePerSqft: 320 },
      { name: 'Westview', medianPrice: 750000, pricePerSqft: 480 },
      { name: 'Eastside', medianPrice: 580000, pricePerSqft: 410 }
    ]
  };
  
  res.json(marketData);
});

// Serve static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TerraFusionProfessional server running on port ${PORT}`);
});