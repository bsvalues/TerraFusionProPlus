require('dotenv').config();
const express = require('express');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TerraFusionProfessional API is running' });
});

// Mock data endpoints
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

// Mock market analysis data
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

// Mock appraisals data
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

// Serve static files (if client/dist exists)
try {
  if (require('fs').existsSync(path.join(__dirname, '../client/dist'))) {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    
    // Handle React routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }
} catch (error) {
  console.log('Client app not built yet, skipping static file serving');
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TerraFusionProfessional minimal server running on port ${PORT}`);
});