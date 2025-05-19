import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PipelineTable from "@/components/dashboard/pipeline-table";
import { Pipeline } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, GitBranch, Clock, CheckCircle, XCircle, Play } from "lucide-react";

export default function Pipelines() {
  const { data: pipelines, isLoading } = useQuery<Pipeline[]>({
    queryKey: ["/api/devops/pipelines"],
  });

  // Fallback data if not loaded yet
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

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">CI/CD Pipelines</h1>
        <p className="mt-2 text-gray-600">Manage build, test, and deployment workflows</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipelines</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Branches</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4m 58s</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Pipelines</TabsTrigger>
          <TabsTrigger value="web">Web App</TabsTrigger>
          <TabsTrigger value="desktop">Desktop App</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <PipelineTable pipelines={defaultPipelines} />
        </TabsContent>
        
        <TabsContent value="web">
          <PipelineTable 
            pipelines={defaultPipelines.filter(p => 
              p.description.toLowerCase().includes('web')
            )} 
          />
        </TabsContent>
        
        <TabsContent value="desktop">
          <PipelineTable 
            pipelines={defaultPipelines.filter(p => 
              p.description.toLowerCase().includes('electron')
            )} 
          />
        </TabsContent>
        
        <TabsContent value="infrastructure">
          <PipelineTable 
            pipelines={defaultPipelines.filter(p => 
              p.description.toLowerCase().includes('terraform')
            )} 
          />
        </TabsContent>
      </Tabs>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Builds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="mr-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-sm font-semibold text-gray-900">Build #387 - main</h3>
                    <span className="ml-2 text-xs text-gray-500">5 mins ago</span>
                  </div>
                  <p className="text-sm text-gray-600">Build & Test - Web application</p>
                  <div className="mt-2 flex items-center space-x-4 text-xs">
                    <span className="text-gray-500">Duration: 3m 42s</span>
                    <span className="text-gray-500">Triggered by: GitHub Push</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="mr-4">
                  <Play className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-sm font-semibold text-gray-900">Build #386 - develop</h3>
                    <span className="ml-2 text-xs text-gray-500">10 mins ago</span>
                  </div>
                  <p className="text-sm text-gray-600">Deploy to Staging - Web application</p>
                  <div className="mt-2 flex items-center space-x-4 text-xs">
                    <span className="text-gray-500">Duration: 4m 15s</span>
                    <span className="text-gray-500">Triggered by: GitHub PR Merge</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="mr-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-sm font-semibold text-gray-900">Build #385 - main</h3>
                    <span className="ml-2 text-xs text-gray-500">1 hour ago</span>
                  </div>
                  <p className="text-sm text-gray-600">Deploy to Production - Web application</p>
                  <div className="mt-2 flex items-center space-x-4 text-xs">
                    <span className="text-gray-500">Duration: 5m 03s</span>
                    <span className="text-gray-500">Triggered by: Manual</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="mr-4">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-sm font-semibold text-gray-900">Build #384 - feature/auth</h3>
                    <span className="ml-2 text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-600">Build & Test - Web application</p>
                  <div className="mt-2 flex items-center space-x-4 text-xs">
                    <span className="text-gray-500">Duration: 2m 38s</span>
                    <span className="text-gray-500">Triggered by: GitHub PR</span>
                  </div>
                  <div className="mt-2 text-xs text-red-600">
                    Tests failed: 3 tests in auth module
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-6">
            <Button>
              <span className="-ml-1 mr-2">+</span>
              Create New Pipeline
            </Button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">GitHub Actions Workflow</h3>
              <p className="text-sm text-gray-600 mt-1">
                Configure CI/CD pipelines directly in your repository with GitHub Actions.
              </p>
              <div className="mt-2">
                <Button variant="outline" size="sm">
                  View Documentation
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Environment Variables</h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage secrets and configuration for your pipeline environments.
              </p>
              <div className="mt-2">
                <Button variant="outline" size="sm">
                  Manage Variables
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Deployment Targets</h3>
              <p className="text-sm text-gray-600 mt-1">
                Configure deployment destinations for your applications.
              </p>
              <div className="mt-2">
                <Button variant="outline" size="sm">
                  Configure Targets
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-600 mt-1">
                Set up alerts for pipeline events and status changes.
              </p>
              <div className="mt-2">
                <Button variant="outline" size="sm">
                  Configure Notifications
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
