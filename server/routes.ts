import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as devopsController from "./controllers/devops";
import { 
  insertUserSchema, 
  insertPropertySchema, 
  insertAppraisalSchema, 
  insertComparableSchema, 
  insertAttachmentSchema 
} from "@shared/schema";
import { z } from "zod";

// Helper function to parse ID from request parameters
const parseId = (id: string): number => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    throw new Error("Invalid ID format");
  }
  return parsedId;
};

// Helper function to validate request body against schema
const validateBody = <T extends z.ZodType>(schema: T, body: any): z.infer<T> => {
  try {
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(error.format()));
    }
    throw error;
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Legacy DevOps routes - keeping for backward compatibility
  app.get("/api/devops/dashboard", devopsController.getDashboard);
  app.get("/api/devops/pipelines", devopsController.getPipelines);
  app.post("/api/devops/pipelines/:id/trigger", devopsController.triggerPipeline);
  app.get("/api/devops/environment-config", devopsController.getEnvironmentConfig);
  app.put("/api/devops/environment-config", devopsController.updateEnvironmentConfig);
  app.get("/api/devops/logs", devopsController.getLogs);
  app.get("/api/devops/security/scans", devopsController.getSecurityScans);
  app.get("/api/devops/monitoring/metrics", devopsController.getMonitoringMetrics);

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get("/api/users/by-username/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = validateBody(insertUserSchema, req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      // Partial validation for update
      const validatedData = validateBody(insertUserSchema.partial(), req.body);
      const updatedUser = await storage.updateUser(id, validatedData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Property routes
  app.get("/api/properties", async (req, res) => {
    try {
      const userId = req.query.userId ? parseId(req.query.userId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      
      const properties = await storage.getProperties(userId, limit);
      res.json(properties);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const property = await storage.getProperty(id);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const validatedData = validateBody(insertPropertySchema, req.body);
      const property = await storage.createProperty(validatedData);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.put("/api/properties/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const validatedData = validateBody(insertPropertySchema.partial(), req.body);
      const updatedProperty = await storage.updateProperty(id, validatedData);
      
      if (!updatedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(updatedProperty);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteProperty(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Appraisal routes
  app.get("/api/appraisals", async (req, res) => {
    try {
      const propertyId = req.query.propertyId ? parseId(req.query.propertyId as string) : undefined;
      const assignedTo = req.query.assignedTo ? parseId(req.query.assignedTo as string) : undefined;
      const status = req.query.status as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      
      const appraisals = await storage.getAppraisals(propertyId, assignedTo, status, limit);
      res.json(appraisals);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get("/api/appraisals/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const appraisal = await storage.getAppraisal(id);
      
      if (!appraisal) {
        return res.status(404).json({ message: "Appraisal not found" });
      }
      
      res.json(appraisal);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.post("/api/appraisals", async (req, res) => {
    try {
      const validatedData = validateBody(insertAppraisalSchema, req.body);
      const appraisal = await storage.createAppraisal(validatedData);
      res.status(201).json(appraisal);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.put("/api/appraisals/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const validatedData = validateBody(insertAppraisalSchema.partial(), req.body);
      const updatedAppraisal = await storage.updateAppraisal(id, validatedData);
      
      if (!updatedAppraisal) {
        return res.status(404).json({ message: "Appraisal not found" });
      }
      
      res.json(updatedAppraisal);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.delete("/api/appraisals/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteAppraisal(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Comparable routes
  app.get("/api/comparables", async (req, res) => {
    try {
      if (!req.query.appraisalId) {
        return res.status(400).json({ message: "appraisalId is required" });
      }
      
      const appraisalId = parseId(req.query.appraisalId as string);
      const comparables = await storage.getComparables(appraisalId);
      res.json(comparables);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  app.get("/api/appraisals/:appraisalId/comparables", async (req, res) => {
    try {
      const appraisalId = parseId(req.params.appraisalId);
      const comparables = await storage.getComparables(appraisalId);
      res.json(comparables);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get("/api/comparables/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const comparable = await storage.getComparable(id);
      
      if (!comparable) {
        return res.status(404).json({ message: "Comparable not found" });
      }
      
      res.json(comparable);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.post("/api/comparables", async (req, res) => {
    try {
      const validatedData = validateBody(insertComparableSchema, req.body);
      const comparable = await storage.createComparable(validatedData);
      res.status(201).json(comparable);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.put("/api/comparables/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const validatedData = validateBody(insertComparableSchema.partial(), req.body);
      const updatedComparable = await storage.updateComparable(id, validatedData);
      
      if (!updatedComparable) {
        return res.status(404).json({ message: "Comparable not found" });
      }
      
      res.json(updatedComparable);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.delete("/api/comparables/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteComparable(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Attachment routes
  app.get("/api/attachments", async (req, res) => {
    try {
      const propertyId = req.query.propertyId ? parseId(req.query.propertyId as string) : undefined;
      const appraisalId = req.query.appraisalId ? parseId(req.query.appraisalId as string) : undefined;
      const type = req.query.type as string | undefined;
      
      const attachments = await storage.getAttachments(propertyId, appraisalId, type);
      res.json(attachments);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.get("/api/attachments/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const attachment = await storage.getAttachment(id);
      
      if (!attachment) {
        return res.status(404).json({ message: "Attachment not found" });
      }
      
      res.json(attachment);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.post("/api/attachments", async (req, res) => {
    try {
      const validatedData = validateBody(insertAttachmentSchema, req.body);
      const attachment = await storage.createAttachment(validatedData);
      res.status(201).json(attachment);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.delete("/api/attachments/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteAttachment(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Market Analysis API endpoints
  app.get("/api/market-analysis", async (req, res) => {
    try {
      const zipCode = req.query.zipCode as string || '90210';
      const timeframe = req.query.timeframe as string || '12m';
      
      // In a real implementation, we would fetch data from a real estate API
      // or database based on these parameters
      
      // Sample market data for MVP implementation
      const marketData = {
        averagePrice: 352000,
        medianPrice: 348000,
        salesVolume: 383,
        averageDaysOnMarket: 35,
        priceChange: 4.2,
        inventoryChange: -2.8,
        pricePerSqFt: 192,
        lastUpdated: new Date().toISOString()
      };
      
      res.json(marketData);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  app.get("/api/market-analysis/trends", async (req, res) => {
    try {
      const zipCode = req.query.zipCode as string || '90210';
      const timeframe = req.query.timeframe as string || '12m';
      
      // Sample trends data
      const marketTrends = [
        { month: 'Jan', value: 320000, sales: 24, daysOnMarket: 45 },
        { month: 'Feb', value: 325000, sales: 28, daysOnMarket: 42 },
        { month: 'Mar', value: 330000, sales: 32, daysOnMarket: 38 },
        { month: 'Apr', value: 335000, sales: 35, daysOnMarket: 35 },
        { month: 'May', value: 338000, sales: 30, daysOnMarket: 32 },
        { month: 'Jun', value: 342000, sales: 36, daysOnMarket: 30 },
        { month: 'Jul', value: 350000, sales: 40, daysOnMarket: 28 },
        { month: 'Aug', value: 355000, sales: 38, daysOnMarket: 30 },
        { month: 'Sep', value: 360000, sales: 35, daysOnMarket: 32 },
        { month: 'Oct', value: 358000, sales: 32, daysOnMarket: 34 },
        { month: 'Nov', value: 355000, sales: 28, daysOnMarket: 36 },
        { month: 'Dec', value: 352000, sales: 25, daysOnMarket: 40 },
      ];
      
      res.json(marketTrends);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  app.get("/api/market-analysis/recent-sales", async (req, res) => {
    try {
      const zipCode = req.query.zipCode as string || '90210';
      
      // Sample recent sales data
      const recentSales = [
        { 
          address: "125 Oak Drive", 
          city: "Westwood", 
          state: "CA", 
          saleDate: "2023-11-15", 
          salePrice: 375000, 
          beds: 3, 
          baths: 2, 
          sqft: 1850, 
          pricePerSqft: 203
        },
        { 
          address: "47 Maple Ave", 
          city: "Westwood", 
          state: "CA", 
          saleDate: "2023-11-02", 
          salePrice: 410000, 
          beds: 4, 
          baths: 2.5, 
          sqft: 2200, 
          pricePerSqft: 186
        },
        { 
          address: "892 Pine St", 
          city: "Westwood", 
          state: "CA", 
          saleDate: "2023-10-28", 
          salePrice: 342000, 
          beds: 3, 
          baths: 2, 
          sqft: 1750, 
          pricePerSqft: 195
        },
        { 
          address: "1432 Cedar Ln", 
          city: "Westwood", 
          state: "CA", 
          saleDate: "2023-10-15", 
          salePrice: 398000, 
          beds: 3, 
          baths: 2.5, 
          sqft: 2100, 
          pricePerSqft: 190
        },
        { 
          address: "542 Redwood Ct", 
          city: "Westwood", 
          state: "CA", 
          saleDate: "2023-10-05", 
          salePrice: 425000, 
          beds: 4, 
          baths: 3, 
          sqft: 2350, 
          pricePerSqft: 181
        },
      ];
      
      res.json(recentSales);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
