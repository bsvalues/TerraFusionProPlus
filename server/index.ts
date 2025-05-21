import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { db } from './db';
import { properties, appraisals, comparables, users, marketData } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// API Routes

// Properties endpoints
app.get('/api/properties', async (req, res) => {
  try {
    const search = req.query.search as string | undefined;
    
    // If search parameter is provided, filter the results
    if (search) {
      const searchLower = search.toLowerCase();
      const result = await db.select().from(properties);
      const filtered = result.filter(property => 
        property.address.toLowerCase().includes(searchLower) ||
        property.city.toLowerCase().includes(searchLower) ||
        property.zipCode.toLowerCase().includes(searchLower) ||
        property.propertyType.toLowerCase().includes(searchLower)
      );
      return res.json(filtered);
    }
    
    const result = await db.select().from(properties);
    res.json(result);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await db.select().from(properties).where(eq(properties.id, id));
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Error fetching property' });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const newProperty = req.body;
    const result = await db.insert(properties).values(newProperty).returning();
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Error creating property' });
  }
});

// Appraisals endpoints
app.get('/api/appraisals', async (req, res) => {
  try {
    const result = await db.select().from(appraisals);
    res.json(result);
  } catch (error) {
    console.error('Error fetching appraisals:', error);
    res.status(500).json({ message: 'Error fetching appraisals' });
  }
});

app.get('/api/appraisals/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await db.select().from(appraisals).where(eq(appraisals.id, id));
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Appraisal not found' });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching appraisal:', error);
    res.status(500).json({ message: 'Error fetching appraisal' });
  }
});

app.get('/api/properties/:id/appraisals', async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const result = await db.select().from(appraisals).where(eq(appraisals.propertyId, propertyId));
    res.json(result);
  } catch (error) {
    console.error('Error fetching property appraisals:', error);
    res.status(500).json({ message: 'Error fetching property appraisals' });
  }
});

app.post('/api/appraisals', async (req, res) => {
  try {
    const newAppraisal = req.body;
    const result = await db.insert(appraisals).values(newAppraisal).returning();
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error creating appraisal:', error);
    res.status(500).json({ message: 'Error creating appraisal' });
  }
});

// Comparables endpoints
app.get('/api/comparables', async (req, res) => {
  try {
    const result = await db.select().from(comparables);
    res.json(result);
  } catch (error) {
    console.error('Error fetching comparables:', error);
    res.status(500).json({ message: 'Error fetching comparables' });
  }
});

app.get('/api/appraisals/:id/comparables', async (req, res) => {
  try {
    const appraisalId = parseInt(req.params.id);
    const result = await db.select().from(comparables).where(eq(comparables.appraisalId, appraisalId));
    res.json(result);
  } catch (error) {
    console.error('Error fetching appraisal comparables:', error);
    res.status(500).json({ message: 'Error fetching appraisal comparables' });
  }
});

app.post('/api/comparables', async (req, res) => {
  try {
    const newComparable = req.body;
    const result = await db.insert(comparables).values(newComparable).returning();
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error creating comparable:', error);
    res.status(500).json({ message: 'Error creating comparable' });
  }
});

// Market data endpoints
app.get('/api/market-data', async (req, res) => {
  try {
    const result = await db.select().from(marketData);
    res.json(result);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ message: 'Error fetching market data' });
  }
});

app.get('/api/market-data/zipcode/:zipCode', async (req, res) => {
  try {
    const zipCode = req.params.zipCode;
    const result = await db.select().from(marketData).where(eq(marketData.zipCode, zipCode));
    res.json(result);
  } catch (error) {
    console.error('Error fetching market data by zip code:', error);
    res.status(500).json({ message: 'Error fetching market data by zip code' });
  }
});

// User endpoints
app.get('/api/users', async (req, res) => {
  try {
    const result = await db.select().from(users);
    res.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await db.select().from(users).where(eq(users.id, id));
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Dashboard data endpoint
app.get('/api/dashboard', async (req, res) => {
  try {
    // In a real implementation, this would aggregate data from multiple tables
    const propertiesCount = await db.select().from(properties);
    const appraisalsData = await db.select().from(appraisals);
    
    // Calculate some stats
    const activeAppraisals = appraisalsData.filter(a => a.status === 'pending' || a.status === 'in_progress').length;
    const completedAppraisals = appraisalsData.filter(a => a.status === 'completed').length;
    
    // Mock some data for demonstration
    const dashboardData = {
      activeAppraisals,
      completedAppraisals,
      totalProperties: propertiesCount.length,
      avgCompletionTime: 3.2, // This would be calculated in a real implementation
      performanceSummary: {
        completedThisMonth: completedAppraisals,
        changeFromLastMonth: 4,
        averageValue: appraisalsData.reduce((sum, a) => sum + (a.marketValue || 0), 0) / (completedAppraisals || 1),
        valueChangePercent: 2.5
      },
      // Additional mock data for the dashboard
      recentActivity: [
        {
          id: 1,
          type: 'appraisal_completed',
          title: 'Appraisal completed',
          description: '456 Oak Drive, Austin, TX 78704',
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          type: 'property_added',
          title: 'New property added',
          description: '789 Pine Street, Austin, TX 78701',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        }
      ],
      upcomingAppraisals: appraisalsData
        .filter(a => a.status === 'pending')
        .slice(0, 3)
        .map(a => ({
          id: a.id,
          propertyId: a.propertyId,
          address: 'Sample Address', // In a real app, we'd join with the property table
          clientName: a.clientName || 'Sample Client',
          dueDate: a.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'scheduled'
        }))
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Serve React app for any other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;