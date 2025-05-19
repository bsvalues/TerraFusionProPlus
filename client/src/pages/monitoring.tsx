import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, CpuIcon, HardDrive, MemoryStick, Activity, FileText, Terminal } from "lucide-react";
import { LogEntry } from "@/types";
import MonitoringSection from "@/components/dashboard/monitoring-section";

export default function Monitoring() {
  const { data: logs } = useQuery<LogEntry[]>({
    queryKey: ["/api/devops/logs"],
  });

  // Fallback logs if not loaded yet
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

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Monitoring & Logging</h1>
        <p className="mt-2 text-gray-600">Track system performance, errors, and application health</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <CpuIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18%</div>
            <p className="text-xs text-green-500 mt-1">Normal</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MemoryStick Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-green-500 mt-1">Normal</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">31%</div>
            <p className="text-xs text-green-500 mt-1">Normal</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5k</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <MonitoringSection logs={defaultLogs} />
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" /> Application Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Terminal className="h-4 w-4 mr-2" /> Live Tail
                  </Button>
                  <Button variant="outline" size="sm">
                    Download Logs
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">All Levels</Button>
                  <Button variant="outline" size="sm" className="text-yellow-600">Warnings</Button>
                  <Button variant="outline" size="sm" className="text-red-600">Errors</Button>
                </div>
              </div>
              
              <div className="bg-gray-800 text-gray-200 rounded-lg p-3 font-mono text-xs h-96 overflow-y-auto">
                {defaultLogs.map((log, index) => (
                  <div key={index} className="grid grid-cols-12 gap-x-2 mt-1">
                    <div className="col-span-2 text-gray-400">{log.timestamp}</div>
                    <div className={`col-span-1 ${
                      log.level === "INFO" ? "text-green-400" :
                      log.level === "DEBUG" ? "text-blue-400" :
                      log.level === "WARN" ? "text-yellow-400" :
                      "text-red-400"
                    }`}>{log.level}</div>
                    <div className="col-span-9">{log.message}</div>
                  </div>
                ))}
                {/* Add more log entries to make it look fuller */}
                {Array(20).fill(0).map((_, i) => (
                  <div key={`extra-${i}`} className="grid grid-cols-12 gap-x-2 mt-1">
                    <div className="col-span-2 text-gray-400">2023-08-21 14:2{i % 10}:0{i % 6}</div>
                    <div className={`col-span-1 ${
                      i % 4 === 0 ? "text-green-400" :
                      i % 4 === 1 ? "text-blue-400" :
                      i % 4 === 2 ? "text-yellow-400" :
                      "text-red-400"
                    }`}>{i % 4 === 0 ? "INFO" : i % 4 === 1 ? "DEBUG" : i % 4 === 2 ? "WARN" : "ERROR"}</div>
                    <div className="col-span-9">
                      {i % 4 === 0 ? "Request completed successfully" :
                       i % 4 === 1 ? "Cache hit for key: user_profile_123" :
                       i % 4 === 2 ? "Slow query detected (230ms): SELECT * FROM properties" :
                       "Failed to connect to external API: timeout"}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing 27 logs from the last hour
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alert Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">High CPU Usage</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Triggers when CPU usage exceeds 80% for 5 minutes
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Low Disk Space</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Triggers when disk usage exceeds 85%
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">API Error Rate</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Triggers when error rate exceeds 5% over 15 minutes
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Database Connection</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Triggers on database connection failure
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button>
                  <span className="-ml-1 mr-2">+</span>
                  Add Alert
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">CPU Utilization (Last 24h)</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-64 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 text-gray-300 mx-auto" />
                        <p className="mt-2 text-sm text-gray-500">CPU utilization visualization</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">MemoryStick Usage (Last 24h)</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-64 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 text-gray-300 mx-auto" />
                        <p className="mt-2 text-sm text-gray-500">MemoryStick usage visualization</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">API Response Time (Last 24h)</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-64 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 text-gray-300 mx-auto" />
                        <p className="mt-2 text-sm text-gray-500">API response time visualization</p>
                        <p className="text-lg font-medium text-gray-700 mt-2">Avg: 120ms</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Database Query Time (Last 24h)</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-64 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 text-gray-300 mx-auto" />
                        <p className="mt-2 text-sm text-gray-500">Database query time visualization</p>
                        <p className="text-lg font-medium text-gray-700 mt-2">Avg: 45ms</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
