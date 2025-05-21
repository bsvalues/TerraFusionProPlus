import express from 'express';
import cors from 'cors';
import path from 'path';
import { db, initDatabase } from './db';
import { storage } from './storage';
import { properties, comparables, appraisals } from '../shared/schema';
import { eq } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDatabase()
  .then(() => console.log('Database initialized'))
  .catch((err) => console.error('Database initialization error:', err));

// API Routes
// Get all properties
app.get('/api/properties', async (req, res) => {
  try {
    const allProperties = await storage.getProperties();
    return res.json(allProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get a single property by ID
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const property = await storage.getProperty(Number(id));
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    return res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Get all comparables
app.get('/api/comparables', async (req, res) => {
  try {
    const { appraisalId } = req.query;
    
    if (appraisalId) {
      const appraisalComparables = await storage.getComparablesByAppraisal(Number(appraisalId));
      return res.json(appraisalComparables);
    } else {
      // This would be a database-heavy operation in a real app
      // Typically you'd want to at least limit and paginate results
      const allComparables = await db.select().from(comparables).limit(100);
      return res.json(allComparables);
    }
  } catch (error) {
    console.error('Error fetching comparables:', error);
    return res.status(500).json({ error: 'Failed to fetch comparables' });
  }
});

// Get all appraisals for a property
app.get('/api/properties/:id/appraisals', async (req, res) => {
  try {
    const { id } = req.params;
    const propertyAppraisals = await storage.getAppraisalsByProperty(Number(id));
    
    return res.json(propertyAppraisals);
  } catch (error) {
    console.error('Error fetching property appraisals:', error);
    return res.status(500).json({ error: 'Failed to fetch appraisals for this property' });
  }
});

// Create a new property
app.post('/api/properties', async (req, res) => {
  try {
    const newProperty = await storage.createProperty(req.body);
    return res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    return res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update a property
app.put('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProperty = await storage.updateProperty(Number(id), req.body);
    
    if (!updatedProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    return res.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    return res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete a property
app.delete('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await storage.deleteProperty(Number(id));
    
    if (!success) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    return res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return res.status(500).json({ error: 'Failed to delete property' });
  }
});

// Create a new appraisal for a property
app.post('/api/properties/:id/appraisals', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Make sure the property exists
    const property = await storage.getProperty(Number(id));
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    const appraisalData = {
      ...req.body,
      propertyId: Number(id),
      createdAt: new Date(),
      status: req.body.status || 'in_progress'
    };
    
    const newAppraisal = await storage.createAppraisal(appraisalData);
    return res.status(201).json(newAppraisal);
  } catch (error) {
    console.error('Error creating appraisal:', error);
    return res.status(500).json({ error: 'Failed to create appraisal' });
  }
});

// Get active appraisals
app.get('/api/appraisals/active', async (req, res) => {
  try {
    const activeAppraisals = await db.select()
      .from(appraisals)
      .where(eq(appraisals.status, 'in_progress'));
    
    // For each appraisal, get the property details
    const activeAppraisalsWithDetails = await Promise.all(
      activeAppraisals.map(async (appraisal) => {
        const property = await storage.getProperty(appraisal.propertyId);
        return {
          ...appraisal,
          property
        };
      })
    );
    
    return res.json(activeAppraisalsWithDetails);
  } catch (error) {
    console.error('Error fetching active appraisals:', error);
    return res.status(500).json({ error: 'Failed to fetch active appraisals' });
  }
});

// Get completed appraisals
app.get('/api/appraisals/completed', async (req, res) => {
  try {
    const completedAppraisals = await db.select()
      .from(appraisals)
      .where(eq(appraisals.status, 'completed'));
    
    // For each appraisal, get the property details
    const completedAppraisalsWithDetails = await Promise.all(
      completedAppraisals.map(async (appraisal) => {
        const property = await storage.getProperty(appraisal.propertyId);
        return {
          ...appraisal,
          property
        };
      })
    );
    
    return res.json(completedAppraisalsWithDetails);
  } catch (error) {
    console.error('Error fetching completed appraisals:', error);
    return res.status(500).json({ error: 'Failed to fetch completed appraisals' });
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});