import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { initDatabase } from './db';
import { storage } from './storage';
import { insertPropertySchema, insertAppraisalSchema, insertComparableSchema } from '../shared/schema';

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

propertiesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const properties = await storage.getProperties();
    return res.status(200).json(properties);
  } catch (error) {
    console.error('Error getting properties:', error);
    return res.status(500).json({ error: 'Failed to get properties' });
  }
});

propertiesRouter.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
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

propertiesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const propertyData = insertPropertySchema.parse(req.body);
    const newProperty = await storage.createProperty(propertyData);
    return res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    return res.status(400).json({ error: 'Invalid property data' });
  }
});

propertiesRouter.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
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

propertiesRouter.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
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

appraisalsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const propertyId = req.query.propertyId ? parseInt(req.query.propertyId as string, 10) : undefined;
    const appraiserId = req.query.appraiserId ? parseInt(req.query.appraiserId as string, 10) : undefined;
    
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

appraisalsRouter.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
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

appraisalsRouter.post('/', async (req: Request, res: Response) => {
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

comparablesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const appraisalId = req.query.appraisalId ? parseInt(req.query.appraisalId as string, 10) : undefined;
    
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

comparablesRouter.post('/', async (req: Request, res: Response) => {
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

marketDataRouter.get('/', async (req: Request, res: Response) => {
  try {
    const zipCode = req.query.zipCode as string;
    const propertyId = req.query.propertyId ? parseInt(req.query.propertyId as string, 10) : undefined;
    
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

// All other requests will be directed to the main index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;