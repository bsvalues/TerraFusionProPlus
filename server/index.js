require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple API endpoint to check if the server is running
app.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: 'TerraFusionProfessional Real Estate Appraisal Platform API',
    endpoints: [
      '/api/properties',
      '/api/appraisals',
      '/api/comparables',
      '/api/market-data',
      '/api/users'
    ]
  });
});

// Properties endpoints
app.get('/api/properties', (req, res) => {
  // Mock data response
  const properties = [
    {
      id: 1,
      address: '123 Main Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      propertyType: 'Single Family',
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1850,
      yearBuilt: 2005,
      lastAppraisalDate: '2025-03-15',
      lastAppraisalValue: 450000,
      createdAt: '2025-01-10T14:30:00Z',
    },
    {
      id: 2,
      address: '456 Oak Drive',
      city: 'Austin',
      state: 'TX',
      zipCode: '78704',
      propertyType: 'Townhouse',
      bedrooms: 2,
      bathrooms: 2.5,
      squareFeet: 1650,
      yearBuilt: 2010,
      lastAppraisalDate: '2025-02-20',
      lastAppraisalValue: 425000,
      createdAt: '2025-01-15T09:45:00Z',
    }
  ];
  
  res.json(properties);
});

app.get('/api/properties/:id', (req, res) => {
  const id = parseInt(req.params.id);
  // Mock data for a specific property
  const property = {
    id: id,
    address: '123 Main Street',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    propertyType: 'Single Family',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1850,
    yearBuilt: 2005,
    lastAppraisalDate: '2025-03-15',
    lastAppraisalValue: 450000,
    description: 'Beautiful single-family home in desirable neighborhood. Well-maintained with recent updates to kitchen and bathrooms. Fenced backyard with mature trees and covered patio.',
    parcelNumber: '12345-67890',
    ownerName: 'John Smith',
    ownerContact: 'john.smith@example.com',
    createdAt: '2025-01-10T14:30:00Z',
    updatedAt: '2025-05-15T09:45:00Z',
  };
  
  res.json(property);
});

// Appraisals endpoints
app.get('/api/appraisals', (req, res) => {
  // Mock data response
  const appraisals = [
    {
      id: 101,
      propertyId: 1,
      appraiserId: 1,
      appraiserName: 'Jane Appraiser',
      orderDate: '2025-03-10',
      inspectionDate: '2025-03-12',
      completedAt: '2025-03-15',
      marketValue: 450000,
      status: 'completed',
      clientName: 'ABC Mortgage',
      loanNumber: 'L12345',
    },
    {
      id: 102,
      propertyId: 2,
      appraiserId: 2,
      appraiserName: 'Bob Valuator',
      orderDate: '2024-08-05',
      inspectionDate: '2024-08-07',
      completedAt: '2024-08-10',
      marketValue: 425000,
      status: 'completed',
      clientName: 'First Bank',
      loanNumber: 'L98765',
    }
  ];
  
  res.json(appraisals);
});

app.get('/api/properties/:id/appraisals', (req, res) => {
  const propertyId = parseInt(req.params.id);
  
  // Mock appraisal data for the property
  const appraisals = [
    {
      id: 101,
      propertyId: propertyId,
      appraiserId: 1,
      appraiserName: 'Jane Appraiser',
      orderDate: '2025-03-10',
      inspectionDate: '2025-03-12',
      completedAt: '2025-03-15',
      marketValue: 450000,
      status: 'completed',
      clientName: 'ABC Mortgage',
      loanNumber: 'L12345',
    },
    {
      id: 102,
      propertyId: propertyId,
      appraiserId: 2,
      appraiserName: 'Bob Valuator',
      orderDate: '2024-08-05',
      inspectionDate: '2024-08-07',
      completedAt: '2024-08-10',
      marketValue: 425000,
      status: 'completed',
      clientName: 'First Bank',
      loanNumber: 'L98765',
    },
    {
      id: 103,
      propertyId: propertyId,
      appraiserId: 1,
      appraiserName: 'Jane Appraiser',
      orderDate: '2025-05-18',
      status: 'pending',
      clientName: 'XYZ Loans',
      loanNumber: 'L54321',
    },
  ];
  
  res.json(appraisals);
});

// Market data endpoints
app.get('/api/market-data/trends/:zipCode', (req, res) => {
  const zipCode = req.params.zipCode;
  
  // Mock market trend data
  const marketTrend = {
    zipCode: zipCode,
    period: 'yearly',
    trends: [
      {
        period: '2020',
        medianSalePrice: 450000,
        averageDaysOnMarket: 35,
        totalSales: 245,
        pricePerSquareFoot: 275,
      },
      {
        period: '2021',
        medianSalePrice: 485000,
        averageDaysOnMarket: 30,
        totalSales: 268,
        pricePerSquareFoot: 295,
        priceChange: {
          amount: 35000,
          percentage: 7.78
        }
      },
      {
        period: '2022',
        medianSalePrice: 525000,
        averageDaysOnMarket: 25,
        totalSales: 295,
        pricePerSquareFoot: 325,
        priceChange: {
          amount: 40000,
          percentage: 8.25
        }
      },
      {
        period: '2023',
        medianSalePrice: 550000,
        averageDaysOnMarket: 28,
        totalSales: 270,
        pricePerSquareFoot: 345,
        priceChange: {
          amount: 25000,
          percentage: 4.76
        }
      },
      {
        period: '2024',
        medianSalePrice: 595000,
        averageDaysOnMarket: 32,
        totalSales: 260,
        pricePerSquareFoot: 372,
        priceChange: {
          amount: 45000,
          percentage: 8.18
        }
      },
      {
        period: '2025',
        medianSalePrice: 635000,
        averageDaysOnMarket: 30,
        totalSales: 280,
        pricePerSquareFoot: 395,
        priceChange: {
          amount: 40000,
          percentage: 6.72
        }
      }
    ]
  };
  
  res.json(marketTrend);
});

// Dashboard data endpoint
app.get('/api/dashboard', (req, res) => {
  // Mock dashboard data
  const dashboardData = {
    activeAppraisals: 24,
    completedAppraisals: 37,
    totalProperties: 418,
    avgCompletionTime: 3.2,
    recentActivity: [
      {
        id: 1,
        type: 'appraisal_completed',
        title: 'Appraisal completed',
        description: '456 Oak Drive, Austin, TX 78704',
        timestamp: '2025-05-20T14:30:00Z',
      },
      {
        id: 2,
        type: 'property_added',
        title: 'New property added',
        description: '789 Pine Street, Austin, TX 78701',
        timestamp: '2025-05-20T12:15:00Z',
      }
    ],
    upcomingAppraisals: [
      {
        id: 101,
        propertyId: 201,
        address: '123 Main Street, Austin, TX 78701',
        clientName: 'ABC Mortgage',
        dueDate: '2025-05-23T00:00:00Z',
        status: 'scheduled',
      },
      {
        id: 102,
        propertyId: 202,
        address: '456 Oak Drive, Austin, TX 78704',
        clientName: 'First Credit Union',
        dueDate: '2025-05-25T00:00:00Z',
        status: 'in_progress',
      }
    ],
    performanceSummary: {
      completedThisMonth: 37,
      changeFromLastMonth: 4,
      averageValue: 450000,
      valueChangePercent: 2.5,
    }
  };
  
  res.json(dashboardData);
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;