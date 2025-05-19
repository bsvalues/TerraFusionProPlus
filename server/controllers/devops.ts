import { Request, Response } from "express";
import { monitoringService } from "../services/monitoring";

// Get DevOps dashboard summary with overall status of environments, pipelines, security, and monitoring
export const getDashboard = (req: Request, res: Response) => {
  try {
    const dashboardData = {
      environments: {
        healthy: 3,
        total: 3,
        items: [
          { name: "Production", status: "healthy", url: "https://api.terrafusion.com" },
          { name: "Staging", status: "healthy", url: "https://staging-api.terrafusion.com" },
          { name: "Development", status: "healthy", url: "https://dev-api.terrafusion.com" }
        ]
      },
      pipelines: {
        passing: 5,
        total: 6,
        successRate: 83,
        lastBuild: "15m ago"
      },
      security: {
        warningsCount: 3,
        scans: [
          { type: "Dependency Scan", count: 2, severity: "warning" },
          { type: "SAST Check", count: 1, severity: "warning" }
        ]
      },
      monitoring: {
        status: "All Systems Go",
        metrics: monitoringService.getCurrentMetrics()
      }
    };
    
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get list of CI/CD pipelines
export const getPipelines = (req: Request, res: Response) => {
  try {
    const pipelines = [
      {
        id: "1",
        name: "Build & Test",
        description: "Web application",
        status: "passed",
        branch: "main",
        lastRun: "5 mins ago",
        duration: "3m 42s"
      },
      {
        id: "2",
        name: "Deploy to Staging",
        description: "Web application",
        status: "passed",
        branch: "develop",
        lastRun: "10 mins ago",
        duration: "4m 15s"
      },
      {
        id: "3",
        name: "Deploy to Production",
        description: "Web application",
        status: "passed",
        branch: "main",
        lastRun: "1 hour ago",
        duration: "5m 03s"
      },
      {
        id: "4",
        name: "Build Desktop App",
        description: "Electron application",
        status: "passed",
        branch: "main",
        lastRun: "2 hours ago",
        duration: "12m 47s"
      },
      {
        id: "5",
        name: "Security Scan",
        description: "Web application",
        status: "warning",
        branch: "develop",
        lastRun: "3 hours ago",
        duration: "2m 18s"
      },
      {
        id: "6",
        name: "Infrastructure Tests",
        description: "Terraform modules",
        status: "passed",
        branch: "main",
        lastRun: "5 hours ago",
        duration: "1m 55s"
      }
    ];
    
    res.json(pipelines);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Trigger a pipeline run
export const triggerPipeline = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // In a real implementation, this would trigger the pipeline through GitHub Actions API or similar
    
    res.json({ 
      success: true, 
      message: `Pipeline ${id} triggered successfully`,
      runId: Math.floor(Math.random() * 1000) + 1
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get environment configuration for a specific environment
export const getEnvironmentConfig = (req: Request, res: Response) => {
  try {
    const environment = req.query.environment || "development";
    
    const configs = {
      development: {
        apiUrl: "http://localhost:3000/api",
        dbUrl: "postgres://localhost/terra_dev",
        nodeVersion: "20.x",
        logLevel: "info",
        enableDebug: true,
        enableMetrics: true,
        secrets: {
          sentryDsn: "https://exampleDSN@sentry.io/1234567",
          datadogApiKey: "abcdef123456"
        }
      },
      staging: {
        apiUrl: "https://staging-api.terrafusion.com",
        dbUrl: "postgres://staging-db/terra_staging",
        nodeVersion: "20.x",
        logLevel: "info",
        enableDebug: false,
        enableMetrics: true,
        secrets: {
          sentryDsn: "https://exampleDSN@sentry.io/1234567",
          datadogApiKey: "abcdef123456"
        }
      },
      production: {
        apiUrl: "https://api.terrafusion.com",
        dbUrl: "postgres://prod-db/terra_prod",
        nodeVersion: "20.x",
        logLevel: "warn",
        enableDebug: false,
        enableMetrics: true,
        secrets: {
          sentryDsn: "https://exampleDSN@sentry.io/1234567",
          datadogApiKey: "abcdef123456"
        }
      }
    };
    
    // In a production system, sensitive info would be masked
    res.json(configs[environment as keyof typeof configs]);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Update environment configuration
export const updateEnvironmentConfig = (req: Request, res: Response) => {
  try {
    const { environment, config } = req.body;
    
    // In a real implementation, this would update the environment configuration in a database or configuration store
    
    res.json({ 
      success: true, 
      message: `Environment ${environment} configuration updated successfully` 
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get application logs with optional filtering
export const getLogs = (req: Request, res: Response) => {
  try {
    const level = req.query.level;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const logs = monitoringService.getLogs(level as string, limit);
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get security scan results
export const getSecurityScans = (req: Request, res: Response) => {
  try {
    const securityScans = {
      lastScanTime: "2023-08-21T14:23:15Z",
      dependencyVulnerabilities: [
        {
          name: "lodash",
          version: "4.17.15",
          severity: "medium",
          description: "Prototype pollution in Object",
          recommendation: "Update to v4.17.21"
        },
        {
          name: "axios",
          version: "0.21.1",
          severity: "low",
          description: "Server-side request forgery",
          recommendation: "Update to v0.21.4"
        }
      ],
      codeAnalysisFindings: [
        {
          file: "server/auth.js",
          line: 42,
          severity: "warning",
          description: "Insecure random token generation"
        }
      ],
      secretsScanning: {
        exposedSecrets: 0,
        lastScanned: "2023-08-21T12:00:00Z"
      }
    };
    
    res.json(securityScans);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get monitoring metrics
export const getMonitoringMetrics = (req: Request, res: Response) => {
  try {
    const timeframe = req.query.timeframe || "day";
    
    const metrics = {
      cpu: monitoringService.getCpuMetrics(timeframe as string),
      memory: monitoringService.getMemoryMetrics(timeframe as string),
      requests: {
        total: 24500,
        successful: 24350,
        failed: 150,
        avgResponseTime: 120
      },
      database: {
        queries: 78293,
        avgQueryTime: 45,
        slowQueries: 12
      }
    };
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
