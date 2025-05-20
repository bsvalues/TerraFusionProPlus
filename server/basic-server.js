require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

// Create Express app without complex routers
const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());

// Create database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Database connected successfully. Server time:', res.rows[0].now);
  }
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'TerraFusionProfessional API is running',
    version: '1.0.0'
  });
});

// Mock property data endpoint
app.get('/api/properties', (req, res) => {
  const properties = [
    {
      id: 1,
      address: '123 Main Street',
      city: 'Austin',
      state: 'TX',
      zip_code: '78701',
      property_type: 'Single Family',
      year_built: 2005,
      square_feet: 2450,
      bedrooms: 3,
      bathrooms: 2.5,
      lot_size: 8500,
      description: 'Beautiful family home in a desirable neighborhood'
    },
    {
      id: 2,
      address: '456 Oak Avenue',
      city: 'Austin',
      state: 'TX',
      zip_code: '78704',
      property_type: 'Condo',
      year_built: 2010,
      square_feet: 1200,
      bedrooms: 2,
      bathrooms: 2,
      lot_size: 0,
      description: 'Modern condo in vibrant South Congress area'
    }
  ];
  
  res.json(properties);
});

// Mock appraisals data endpoint
app.get('/api/appraisals', (req, res) => {
  const appraisals = [
    {
      id: 1,
      propertyId: 1,
      appraiserId: 1,
      status: 'Completed',
      purpose: 'Refinance',
      marketValue: 975000,
      createdAt: '2024-05-10T00:00:00Z',
      completedAt: '2024-05-20T00:00:00Z',
      clientName: 'First National Bank',
      address: '123 Main Street',
      appraiserName: 'John Doe'
    },
    {
      id: 2,
      propertyId: 2,
      appraiserId: 1,
      status: 'In Progress',
      purpose: 'Purchase',
      marketValue: null,
      createdAt: '2024-05-15T00:00:00Z',
      completedAt: null,
      clientName: 'HomeFirst Mortgage',
      address: '456 Oak Avenue',
      appraiserName: 'John Doe'
    }
  ];
  
  res.json(appraisals);
});

// Mock comparables data endpoint
app.get('/api/comparables', (req, res) => {
  const comparables = [
    {
      id: 1,
      appraisalId: 1,
      address: '789 Pine Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      salePrice: 950000,
      saleDate: '2024-02-15T00:00:00Z',
      squareFeet: 2350,
      bedrooms: 3,
      bathrooms: 2.5,
      yearBuilt: 2004,
      propertyType: 'Single Family',
      createdAt: '2024-05-15T00:00:00Z'
    },
    {
      id: 2,
      appraisalId: 1,
      address: '101 Cedar Road',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      salePrice: 1025000,
      saleDate: '2024-01-20T00:00:00Z',
      squareFeet: 2600,
      bedrooms: 4,
      bathrooms: 3,
      yearBuilt: 2010,
      propertyType: 'Single Family',
      createdAt: '2024-05-15T00:00:00Z'
    }
  ];
  
  res.json(comparables);
});

// Mock market analysis data endpoint
app.get('/api/market-analysis', (req, res) => {
  const data = {
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
  
  res.json(data);
});

// Handle static files if client/dist exists
try {
  const distPath = path.join(__dirname, '../client/dist');
  if (require('fs').existsSync(distPath)) {
    app.use(express.static(distPath));
    
    // Catch-all route for client-side routing
    app.get('*', (req, res) => {
      if (req.url.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.log('Client build directory not found, skipping static file serving');
  }
} catch (error) {
  console.log('Error setting up static file serving:', error.message);
}

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TerraFusionProfessional server running on port ${PORT}`);
});