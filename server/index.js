const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// For development, allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TerraFusionProfessional API is running' });
});

// Mock Property Routes for now (will implement database later)
app.get('/api/properties', (req, res) => {
  const properties = [
    {
      id: 1,
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      propertyType: "Single Family",
      yearBuilt: 1985,
      squareFeet: 2100,
      bedrooms: 3,
      bathrooms: 2,
      lotSize: 5000,
      lastSalePrice: 950000,
      lastSaleDate: "2022-03-15"
    },
    {
      id: 2,
      address: "456 Oak Ave",
      city: "San Francisco",
      state: "CA",
      zipCode: "94122",
      propertyType: "Condo",
      yearBuilt: 2005,
      squareFeet: 1200,
      bedrooms: 2,
      bathrooms: 2,
      lotSize: 0,
      lastSalePrice: 750000,
      lastSaleDate: "2021-10-05"
    },
    {
      id: 3,
      address: "789 Pine Rd",
      city: "San Francisco",
      state: "CA",
      zipCode: "94110",
      propertyType: "Multi-Family",
      yearBuilt: 1940,
      squareFeet: 3200,
      bedrooms: 5,
      bathrooms: 3,
      lotSize: 3500,
      lastSalePrice: 1650000,
      lastSaleDate: "2022-05-20"
    }
  ];
  
  res.json(properties);
});

app.get('/api/properties/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  // Mock property data
  const property = {
    id: id,
    address: id === 1 ? "123 Main St" : "456 Oak Ave",
    city: "San Francisco",
    state: "CA",
    zipCode: id === 1 ? "94105" : "94122",
    propertyType: id === 1 ? "Single Family" : "Condo",
    yearBuilt: id === 1 ? 1985 : 2005,
    squareFeet: id === 1 ? 2100 : 1200,
    bedrooms: id === 1 ? 3 : 2,
    bathrooms: id === 1 ? 2 : 2,
    lotSize: id === 1 ? 5000 : 0,
    lastSalePrice: id === 1 ? 950000 : 750000,
    lastSaleDate: id === 1 ? "2022-03-15" : "2021-10-05"
  };
  
  res.json(property);
});

// Mock Comparable Properties for Appraisals
app.get('/api/comparables', (req, res) => {
  const comparables = [
    {
      id: 1,
      address: "123 Similar St",
      city: "San Francisco",
      state: "CA",
      salePrice: 925000,
      saleDate: "2022-01-10",
      squareFeet: 2050,
      bedrooms: 3,
      bathrooms: 2,
      yearBuilt: 1980,
      adjustedPrice: 945000
    },
    {
      id: 2,
      address: "456 Nearby Ave",
      city: "San Francisco",
      state: "CA",
      salePrice: 975000,
      saleDate: "2022-02-18",
      squareFeet: 2200,
      bedrooms: 3,
      bathrooms: 2.5,
      yearBuilt: 1990,
      adjustedPrice: 955000
    },
    {
      id: 3,
      address: "789 Comparable Rd",
      city: "San Francisco",
      state: "CA",
      salePrice: 920000,
      saleDate: "2022-03-05",
      squareFeet: 2000,
      bedrooms: 3,
      bathrooms: 2,
      yearBuilt: 1982,
      adjustedPrice: 940000
    }
  ];
  
  res.json(comparables);
});

// Mock Market Analysis Data
app.get('/api/market-analysis', (req, res) => {
  const marketData = {
    pricePerSqftTrend: [
      { month: "Jan", value: 450 },
      { month: "Feb", value: 452 },
      { month: "Mar", value: 458 },
      { month: "Apr", value: 465 },
      { month: "May", value: 472 },
      { month: "Jun", value: 480 }
    ],
    salesVolume: [
      { month: "Jan", sales: 120 },
      { month: "Feb", sales: 105 },
      { month: "Mar", sales: 130 },
      { month: "Apr", sales: 142 },
      { month: "May", sales: 155 },
      { month: "Jun", sales: 162 }
    ],
    daysOnMarket: [
      { month: "Jan", days: 32 },
      { month: "Feb", days: 30 },
      { month: "Mar", days: 28 },
      { month: "Apr", days: 25 },
      { month: "May", days: 22 },
      { month: "Jun", days: 20 }
    ],
    medianPrices: {
      currentYear: 950000,
      previousYear: 880000,
      percentChange: 7.95
    }
  };
  
  res.json(marketData);
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;