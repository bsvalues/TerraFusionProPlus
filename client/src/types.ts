// Environment types
export interface Environment {
  name: string;
  status: "healthy" | "warning" | "error";
  url: string;
}

// Pipeline types
export interface Pipeline {
  id: string;
  name: string;
  description: string;
  status: "passed" | "failed" | "warning" | "running";
  branch: string;
  lastRun: string;
  duration: string;
}

// Security scan types
export interface SecurityScan {
  type: string;
  count: number;
  severity: "info" | "warning" | "error";
}

// Monitoring metrics
export interface MonitoringMetrics {
  cpu: number;
  memory: number;
  disk: number;
}

// Log entry
export interface LogEntry {
  timestamp: string;
  level: "INFO" | "DEBUG" | "WARN" | "ERROR";
  message: string;
}

// Environment Config
export interface EnvironmentConfig {
  apiUrl: string;
  dbUrl: string;
  nodeVersion: string;
  logLevel: string;
  enableDebug: boolean;
  enableMetrics: boolean;
  secrets: {
    sentryDsn: string;
    datadogApiKey: string;
  };
}

// Dashboard summary
export interface DashboardSummary {
  environments: {
    healthy: number;
    total: number;
    items: Environment[];
  };
  pipelines: {
    passing: number;
    total: number;
    successRate: number;
    lastBuild: string;
  };
  security: {
    warningsCount: number;
    scans: SecurityScan[];
  };
  monitoring: {
    status: string;
    metrics: MonitoringMetrics;
  };
}
