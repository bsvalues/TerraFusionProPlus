// Monitoring service to track system metrics and logs

interface LogEntry {
  timestamp: string;
  level: "INFO" | "DEBUG" | "WARN" | "ERROR";
  message: string;
}

interface MonitoringMetrics {
  cpu: number;
  memory: number;
  disk: number;
}

class MonitoringService {
  private logs: LogEntry[] = [
    {
      timestamp: "2023-08-21 14:23:15",
      level: "INFO",
      message: "Server started on port 3000"
    },
    {
      timestamp: "2023-08-21 14:23:14",
      level: "INFO",
      message: "Connected to database successfully"
    },
    {
      timestamp: "2023-08-21 14:23:12",
      level: "DEBUG",
      message: "Environment variables loaded from .env.development"
    },
    {
      timestamp: "2023-08-21 14:23:11",
      level: "WARN",
      message: "Deprecated API method called: getFormattedProperty()"
    },
    {
      timestamp: "2023-08-21 14:22:59",
      level: "INFO",
      message: "Auth middleware initialized"
    },
    {
      timestamp: "2023-08-21 14:22:58",
      level: "ERROR",
      message: "Failed to connect to Redis cache: Connection refused"
    },
    {
      timestamp: "2023-08-21 14:22:55",
      level: "INFO",
      message: "Starting TerraFusionProfessional backend service..."
    }
  ];

  private currentMetrics: MonitoringMetrics = {
    cpu: 18,
    memory: 42,
    disk: 31
  };

  // Get current system metrics
  getCurrentMetrics(): MonitoringMetrics {
    // In a real implementation, this would get actual system metrics
    // For now, we'll use our mock data
    return this.currentMetrics;
  }

  // Get logs with optional filtering by level
  getLogs(level?: string, limit: number = 10): LogEntry[] {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level.toUpperCase());
    }
    
    return filteredLogs.slice(0, limit);
  }

  // Add a new log entry
  addLog(level: "INFO" | "DEBUG" | "WARN" | "ERROR", message: string): void {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substr(0, 19);
    
    this.logs.unshift({
      timestamp,
      level,
      message
    });
    
    // Limit the size of logs in memory
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000);
    }
  }

  // Get CPU metrics for a specific timeframe
  getCpuMetrics(timeframe: string = 'day'): number[] {
    // In a real implementation, this would query a time-series database
    // For now, return simulated data for the UI
    
    const dataPoints = timeframe === 'hour' ? 60 : 24;
    return Array(dataPoints).fill(0).map(() => Math.floor(Math.random() * 30) + 10);
  }

  // Get memory metrics for a specific timeframe
  getMemoryMetrics(timeframe: string = 'day'): number[] {
    // In a real implementation, this would query a time-series database
    // For now, return simulated data for the UI
    
    const dataPoints = timeframe === 'hour' ? 60 : 24;
    return Array(dataPoints).fill(0).map(() => Math.floor(Math.random() * 40) + 30);
  }

  // Monitor an event and log it
  monitorEvent(eventName: string, duration: number, success: boolean): void {
    const level = success ? "INFO" : "ERROR";
    const message = `Event ${eventName} completed in ${duration}ms ${success ? 'successfully' : 'with errors'}`;
    
    this.addLog(level, message);
    
    // In a real implementation, this would send metrics to a monitoring system
    // For example, increment a counter in Datadog or similar
  }
}

export const monitoringService = new MonitoringService();
