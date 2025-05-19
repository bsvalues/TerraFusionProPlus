import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as devopsController from "./controllers/devops";

export async function registerRoutes(app: Express): Promise<Server> {
  // DevOps routes
  app.get("/api/devops/dashboard", devopsController.getDashboard);
  app.get("/api/devops/pipelines", devopsController.getPipelines);
  app.post("/api/devops/pipelines/:id/trigger", devopsController.triggerPipeline);
  app.get("/api/devops/environment-config", devopsController.getEnvironmentConfig);
  app.put("/api/devops/environment-config", devopsController.updateEnvironmentConfig);
  app.get("/api/devops/logs", devopsController.getLogs);
  app.get("/api/devops/security/scans", devopsController.getSecurityScans);
  app.get("/api/devops/monitoring/metrics", devopsController.getMonitoringMetrics);

  // use storage to perform CRUD operations on the storage interface
  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  app.get("/api/users/by-username/:username", async (req, res) => {
    const { username } = req.params;
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
