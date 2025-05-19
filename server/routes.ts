import express from 'express';
import { storage } from './storage';
import { 
  insertUserSchema, 
  insertPropertySchema, 
  insertAppraisalSchema, 
  insertComparableSchema 
} from '../shared/schema';
import { z } from 'zod';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TerraFusionProfessional API is running' });
});

// User routes
router.post('/users', async (req, res) => {
  try {
    const userData = insertUserSchema.parse(req.body);
    const user = await storage.createUser(userData);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Property routes
router.get('/properties', async (req, res) => {
  try {
    const properties = await storage.getProperties();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get properties' });
  }
});

router.post('/properties', async (req, res) => {
  try {
    const propertyData = insertPropertySchema.parse(req.body);
    const property = await storage.createProperty(propertyData);
    res.status(201).json(property);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create property' });
    }
  }
});

router.get('/properties/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const property = await storage.getProperty(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get property' });
  }
});

// Appraisal routes
router.get('/appraisals/property/:propertyId', async (req, res) => {
  try {
    const propertyId = parseInt(req.params.propertyId);
    const appraisals = await storage.getAppraisalsByProperty(propertyId);
    res.json(appraisals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get appraisals' });
  }
});

router.post('/appraisals', async (req, res) => {
  try {
    const appraisalData = insertAppraisalSchema.parse(req.body);
    const appraisal = await storage.createAppraisal(appraisalData);
    res.status(201).json(appraisal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create appraisal' });
    }
  }
});

router.get('/appraisals/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const appraisal = await storage.getAppraisal(id);
    if (!appraisal) {
      return res.status(404).json({ error: 'Appraisal not found' });
    }
    res.json(appraisal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get appraisal' });
  }
});

// Comparable routes
router.get('/comparables/appraisal/:appraisalId', async (req, res) => {
  try {
    const appraisalId = parseInt(req.params.appraisalId);
    const comparables = await storage.getComparablesByAppraisal(appraisalId);
    res.json(comparables);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get comparables' });
  }
});

router.post('/comparables', async (req, res) => {
  try {
    const comparableData = insertComparableSchema.parse(req.body);
    const comparable = await storage.createComparable(comparableData);
    res.status(201).json(comparable);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create comparable' });
    }
  }
});

router.get('/comparables/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const comparable = await storage.getComparable(id);
    if (!comparable) {
      return res.status(404).json({ error: 'Comparable not found' });
    }
    res.json(comparable);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get comparable' });
  }
});

export default router;