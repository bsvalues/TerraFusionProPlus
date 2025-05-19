import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import StatusCard from "@/components/dashboard/status-card";
import TabNavigation from "@/components/dashboard/tab-navigation";
import PipelineTable from "@/components/dashboard/pipeline-table";
import EnvironmentConfigForm from "@/components/dashboard/environment-config";
import MonitoringSection from "@/components/dashboard/monitoring-section";
import LocalSetupGuide from "@/components/dashboard/local-setup";
import { DashboardSummary, EnvironmentConfig, Pipeline, LogEntry } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Server, Rocket, Shield, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("pipelines");

  const { data: dashboardData, isLoading, error } = useQuery<DashboardSummary>({
    queryKey: ["/api/devops/dashboard"],
  });

  const { data: pipelines } = useQuery<Pipeline[]>({
    queryKey: ["/api/devops/pipelines"],
  });

  const { data: envConfig } = useQuery<EnvironmentConfig>({
    queryKey: ["/api/devops/environment-config"],
  });

  const { data: logs } = useQuery<LogEntry[]>({
    queryKey: ["/api/devops/logs"],
  });

  const handleConfigSave = (config: EnvironmentConfig) => {
    // Handle saving configuration to the server
    console.log("Saving config:", config);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading dashboard data</div>;
  }

  // Fallback data if not loaded yet
  const summary = dashboardData || {
    environments: {
      healthy: 3,
      total: 3,
      items: [],
    },
    pipelines: {
      passing: 5,
      total: 6,
      successRate: 83,
      lastBuild: "15m ago",
    },
    security: {
      warningsCount: 3,
      scans: [
        { type: "Dependency Scan", count: 2, severity: "warning" },
        { type: "SAST Check", count: 1, severity: "warning" },
      ],
    },
    monitoring: {
      status: "All Systems Go",
      metrics: {
        cpu: 18,
        memory: 42,
        disk: 31,
      },
    },
  };

  const defaultPipelines: Pipeline[] = pipelines || [
    {
      id: "1",
      name: "Build & Test",
      description: "Web application",
      status: "passed",
      branch: "main",
      lastRun: "5 mins ago",
      duration: "3m 42s",
    },
    {
      id: "2",
      name: "Deploy to Staging",
      description: "Web application",
      status: "passed",
      branch: "develop",
      lastRun: "10 mins ago",
      duration: "4m 15s",
    },
    {
      id: "3",
      name: "Deploy to Production",
      description: "Web application",
      status: "passed",
      branch: "main",
      lastRun: "1 hour ago",
      duration: "5m 03s",
    },
    {
      id: "4",
      name: "Build Desktop App",
      description: "Electron application",
      status: "passed",
      branch: "main",
      lastRun: "2 hours ago",
      duration: "12m 47s",
    },
    {
      id: "5",
      name: "Security Scan",
      description: "Web application",
      status: "warning",
      branch: "develop",
      lastRun: "3 hours ago",
      duration: "2m 18s",
    },
    {
      id: "6",
      name: "Infrastructure Tests",
      description: "Terraform modules",
      status: "passed",
      branch: "main",
      lastRun: "5 hours ago",
      duration: "1m 55s",
    },
  ];

  const defaultEnvConfig: EnvironmentConfig = envConfig || {
    apiUrl: "http://localhost:3000/api",
    dbUrl: "postgres://localhost/terra_dev",
    nodeVersion: "20.x",
    logLevel: "info",
    enableDebug: true,
    enableMetrics: true,
    secrets: {
      sentryDsn: "•••••••••••••••••••••",
      datadogApiKey: "•••••••••••••••••••••",
    },
  };

  const defaultLogs: LogEntry[] = logs || [
    {
      timestamp: "2023-08-21 14:23:15",
      level: "INFO",
      message: "Server started on port 3000",
    },
    {
      timestamp: "2023-08-21 14:23:14",
      level: "INFO",
      message: "Connected to database successfully",
    },
    {
      timestamp: "2023-08-21 14:23:12",
      level: "DEBUG",
      message: "Environment variables loaded from .env.development",
    },
    {
      timestamp: "2023-08-21 14:23:11",
      level: "WARN",
      message: "Deprecated API method called: getFormattedProperty()",
    },
    {
      timestamp: "2023-08-21 14:22:59",
      level: "INFO",
      message: "Auth middleware initialized",
    },
    {
      timestamp: "2023-08-21 14:22:58",
      level: "ERROR",
      message: "Failed to connect to Redis cache: Connection refused",
    },
    {
      timestamp: "2023-08-21 14:22:55",
      level: "INFO",
      message: "Starting TerraFusionProfessional backend service...",
    },
  ];

  const tabs = [
    { id: "pipelines", label: "CI/CD Pipelines" },
    { id: "environments", label: "Environments" },
    { id: "monitoring", label: "Monitoring" },
    { id: "local-setup", label: "Local Setup" },
  ];

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">TerraFusionProfessional DevOps</h1>
        <p className="mt-2 text-gray-600">Manage infrastructure, pipelines, monitoring, and security</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Environment Status Card */}
        <StatusCard
          title="Environments"
          value={`${summary.environments.healthy}/${summary.environments.total} Healthy`}
          icon={<Server />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          footerLink={{ text: "View details", href: "#" }}
        >
          <div className="flex space-x-2">
            <span className="px-2 py-1 text-xs rounded-full text-green-800 bg-green-100">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" /> Production
            </span>
            <span className="px-2 py-1 text-xs rounded-full text-green-800 bg-green-100">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" /> Staging
            </span>
            <span className="px-2 py-1 text-xs rounded-full text-green-800 bg-green-100">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" /> Development
            </span>
          </div>
        </StatusCard>

        {/* CI/CD Pipelines Card */}
        <StatusCard
          title="CI/CD Pipelines"
          value={`${summary.pipelines.passing}/${summary.pipelines.total} Passing`}
          icon={<Rocket />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          footerLink={{ text: "View pipelines", href: "#" }}
        >
          <div className="flex flex-col space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${summary.pipelines.successRate}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 flex justify-between">
              <span>Last build: {summary.pipelines.lastBuild}</span>
              <span>{summary.pipelines.successRate}% success rate</span>
            </div>
          </div>
        </StatusCard>

        {/* Security Card */}
        <StatusCard
          title="Security Status"
          value={`${summary.security.warningsCount} Warnings`}
          icon={<Shield />}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          footerLink={{ text: "View security issues", href: "#" }}
        >
          <div className="mt-4">
            {summary.security.scans.map((scan, i) => (
              <div key={i} className="flex items-center mb-1">
                <span className="text-xs text-gray-500">{scan.type}:</span>
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full text-yellow-800 bg-yellow-100">
                  {scan.count} warnings
                </span>
              </div>
            ))}
          </div>
        </StatusCard>

        {/* Monitoring Card */}
        <StatusCard
          title="Monitoring"
          value={summary.monitoring.status}
          icon={<BarChart3 />}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          footerLink={{ text: "View monitoring", href: "#" }}
        >
          <div className="mt-4 flex justify-between text-xs">
            <span className="text-gray-500">
              CPU: <span className="text-green-500 font-medium">{summary.monitoring.metrics.cpu}%</span>
            </span>
            <span className="text-gray-500">
              Memory: <span className="text-green-500 font-medium">{summary.monitoring.metrics.memory}%</span>
            </span>
            <span className="text-gray-500">
              Disk: <span className="text-green-500 font-medium">{summary.monitoring.metrics.disk}%</span>
            </span>
          </div>
        </StatusCard>
      </div>

      {/* Tab Navigation */}
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === "pipelines" && <PipelineTable pipelines={defaultPipelines} />}
      
      {activeTab === "environments" && (
        <EnvironmentConfigForm config={defaultEnvConfig} onSave={handleConfigSave} />
      )}
      
      {activeTab === "monitoring" && <MonitoringSection logs={defaultLogs} />}
      
      {activeTab === "local-setup" && <LocalSetupGuide />}
    </>
  );
}
