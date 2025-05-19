import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Code, Book, Server, Shield, Workflow, Cog } from "lucide-react";

export default function Documentation() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">TerraFusionProfessional Documentation</h1>
        <p className="mt-2 text-gray-600">Comprehensive documentation for developers and operators</p>
      </header>

      <Tabs defaultValue="devops" className="mb-8">
        <TabsList>
          <TabsTrigger value="devops">DevOps Guide</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devops" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="mr-2 h-5 w-5" /> 
                DevOps Guide Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                This guide covers everything you need to know about the DevOps processes, tools, and best practices
                for the TerraFusionProfessional platform.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 flex items-center">
                    <Workflow className="h-4 w-4 mr-2 text-primary-500" />
                    CI/CD Pipelines
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Automated workflows for build, test, and deployment
                  </p>
                  <Button variant="link" size="sm" className="px-0 text-primary-600 hover:text-primary-900 mt-2">
                    View Documentation →
                  </Button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 flex items-center">
                    <Server className="h-4 w-4 mr-2 text-primary-500" />
                    Environment Management
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Setting up and maintaining dev, staging, and production
                  </p>
                  <Button variant="link" size="sm" className="px-0 text-primary-600 hover:text-primary-900 mt-2">
                    View Documentation →
                  </Button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-primary-500" />
                    Security Practices
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Implementing and maintaining security protocols
                  </p>
                  <Button variant="link" size="sm" className="px-0 text-primary-600 hover:text-primary-900 mt-2">
                    View Documentation →
                  </Button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 flex items-center">
                    <Cog className="h-4 w-4 mr-2 text-primary-500" />
                    Monitoring & Logging
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Tracking performance and troubleshooting issues
                  </p>
                  <Button variant="link" size="sm" className="px-0 text-primary-600 hover:text-primary-900 mt-2">
                    View Documentation →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>CI/CD Pipeline Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium">Overview</h3>
                <p className="text-sm text-gray-600">
                  TerraFusionProfessional uses GitHub Actions for continuous integration and deployment.
                  The pipeline is designed to automate build, test, and deployment processes across development,
                  staging, and production environments.
                </p>
                
                <h3 className="text-lg font-medium mt-6">Pipeline Workflow</h3>
                <div className="mt-4 space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-semibold">1. Continuous Integration</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      All pushes and pull requests trigger the CI workflow:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                      <li>Linting and type checking</li>
                      <li>Unit and integration tests</li>
                      <li>Build verification</li>
                      <li>Security scanning</li>
                    </ul>
                    <div className="mt-3 text-xs font-mono bg-gray-100 p-2 rounded border border-gray-300">
                      <p className="text-gray-700">Trigger: Push or pull request to any branch</p>
                      <p className="text-gray-700">Workflow file: .github/workflows/ci.yml</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-semibold">2. Staging Deployment</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Merges to the develop branch trigger deployment to staging:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                      <li>Automatic deployment to staging environment</li>
                      <li>Database migrations</li>
                      <li>E2E tests on staging</li>
                      <li>Smoke tests</li>
                    </ul>
                    <div className="mt-3 text-xs font-mono bg-gray-100 p-2 rounded border border-gray-300">
                      <p className="text-gray-700">Trigger: Push to develop branch</p>
                      <p className="text-gray-700">Workflow file: .github/workflows/deploy-staging.yml</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-semibold">3. Production Deployment</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Merges to the main branch trigger deployment to production:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                      <li>Approval required before deployment</li>
                      <li>Automatic database backup</li>
                      <li>Blue-green deployment strategy</li>
                      <li>Automated rollback on failure</li>
                    </ul>
                    <div className="mt-3 text-xs font-mono bg-gray-100 p-2 rounded border border-gray-300">
                      <p className="text-gray-700">Trigger: Push to main branch</p>
                      <p className="text-gray-700">Workflow file: .github/workflows/deploy-prod.yml</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6">Environment Configuration</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Environment-specific configurations are managed through GitHub Secrets and environment variables:
                </p>
                
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Environment</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Configuration Location</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Control</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Development</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">.env.development</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">All developers</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Staging</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">GitHub Environment Secrets</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">DevOps team</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Production</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">AWS Secrets Manager</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">DevOps leads only</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="architecture" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium">Architecture Overview</h3>
                <p className="text-sm text-gray-600">
                  TerraFusionProfessional follows a modern microservices architecture with clear separation of 
                  concerns and a focus on scalability and maintainability.
                </p>
                
                <div className="my-6 bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                  <Code className="h-16 w-16 text-gray-300 mx-auto" />
                  <p className="mt-2 text-sm text-gray-600">Architecture diagram visualization</p>
                </div>
                
                <h3 className="text-lg font-medium">Key Components</h3>
                
                <div className="space-y-4 mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Frontend Application</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      React-based SPA with TypeScript and Tailwind CSS
                    </p>
                    <ul className="list-disc list-inside text-xs text-gray-600 mt-2">
                      <li>Component-based architecture</li>
                      <li>React Query for data fetching</li>
                      <li>Responsive design for desktop and mobile</li>
                      <li>Theme support (light/dark mode)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Backend Services</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Node.js with Express, organized by domain
                    </p>
                    <ul className="list-disc list-inside text-xs text-gray-600 mt-2">
                      <li>RESTful API design</li>
                      <li>Authorization middleware</li>
                      <li>Rate limiting</li>
                      <li>Error handling</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Database</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      PostgreSQL with Drizzle ORM
                    </p>
                    <ul className="list-disc list-inside text-xs text-gray-600 mt-2">
                      <li>Schema-based models</li>
                      <li>Migration support</li>
                      <li>Type-safe queries</li>
                      <li>Connection pooling</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Desktop Application</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Electron-based desktop version
                    </p>
                    <ul className="list-disc list-inside text-xs text-gray-600 mt-2">
                      <li>Shares code with web frontend</li>
                      <li>Native file system integration</li>
                      <li>Offline capability</li>
                      <li>Auto-updates</li>
                    </ul>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6">Data Flow</h3>
                <p className="text-sm text-gray-600 mt-2">
                  The application follows a standard client-server architecture with RESTful APIs:
                </p>
                
                <ol className="list-decimal list-inside text-sm text-gray-600 mt-2 space-y-2">
                  <li>Client (web or desktop) makes HTTP requests to backend API</li>
                  <li>API authenticates and authorizes the request</li>
                  <li>Business logic is processed in service layer</li>
                  <li>Data access layer communicates with database</li>
                  <li>Results returned to client as JSON responses</li>
                </ol>
                
                <h3 className="text-lg font-medium mt-6">Infrastructure Components</h3>
                <p className="text-sm text-gray-600 mt-2">
                  The application is deployed on AWS with the following components:
                </p>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <h4 className="text-xs font-medium text-gray-900">Frontend Hosting</h4>
                    <p className="text-xs text-gray-600">AWS S3 + CloudFront</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <h4 className="text-xs font-medium text-gray-900">API Hosting</h4>
                    <p className="text-xs text-gray-600">AWS ECS Fargate</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <h4 className="text-xs font-medium text-gray-900">Database</h4>
                    <p className="text-xs text-gray-600">AWS RDS PostgreSQL</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <h4 className="text-xs font-medium text-gray-900">Caching</h4>
                    <p className="text-xs text-gray-600">AWS ElastiCache Redis</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <h4 className="text-xs font-medium text-gray-900">Load Balancing</h4>
                    <p className="text-xs text-gray-600">AWS Application Load Balancer</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <h4 className="text-xs font-medium text-gray-900">DNS & SSL</h4>
                    <p className="text-xs text-gray-600">AWS Route 53 + ACM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium">API Overview</h3>
                <p className="text-sm text-gray-600">
                  The TerraFusionProfessional API follows RESTful principles and provides endpoints 
                  for all application functionality. This reference documents all available endpoints, 
                  request/response formats, and authentication requirements.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                  <h4 className="text-sm font-medium text-gray-900">Authentication</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    All API requests require authentication using JWT tokens.
                  </p>
                  <div className="mt-2 text-xs font-mono bg-gray-100 p-2 rounded border border-gray-300">
                    <p className="text-gray-700">Authorization: Bearer {'{your_jwt_token}'}</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6">DevOps API Endpoints</h3>
                
                <div className="space-y-4 mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs font-bold rounded-md bg-green-100 text-green-800">GET</span>
                      <span className="ml-2 text-sm font-mono">/api/devops/dashboard</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Returns a summary of environment statuses, pipeline statuses, security warnings, and monitoring metrics.
                    </p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs font-bold rounded-md bg-green-100 text-green-800">GET</span>
                      <span className="ml-2 text-sm font-mono">/api/devops/pipelines</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Returns a list of all CI/CD pipelines with status information.
                    </p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs font-bold rounded-md bg-blue-100 text-blue-800">POST</span>
                      <span className="ml-2 text-sm font-mono">/api/devops/pipelines/{'{pipeline_id}'}/trigger</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Manually triggers a pipeline run.
                    </p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs font-bold rounded-md bg-green-100 text-green-800">GET</span>
                      <span className="ml-2 text-sm font-mono">/api/devops/environment-config</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Returns environment configuration for the specified environment.
                    </p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs font-bold rounded-md bg-yellow-100 text-yellow-800">PUT</span>
                      <span className="ml-2 text-sm font-mono">/api/devops/environment-config</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Updates environment configuration.
                    </p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs font-bold rounded-md bg-green-100 text-green-800">GET</span>
                      <span className="ml-2 text-sm font-mono">/api/devops/logs</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Returns application logs with optional filtering.
                    </p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6">Response Formats</h3>
                <p className="text-sm text-gray-600 mt-2">
                  All API responses follow a standard format:
                </p>
                
                <div className="mt-2 text-xs font-mono bg-gray-100 p-3 rounded border border-gray-300 overflow-x-auto">
                  <pre>{`{
  "success": true,
  "data": { /* Response data */ },
  "meta": {
    "timestamp": "2023-08-21T14:23:15Z",
    "version": "1.0"
  }
}`}</pre>
                </div>
                
                <p className="text-sm text-gray-600 mt-4">
                  Error responses have the following format:
                </p>
                
                <div className="mt-2 text-xs font-mono bg-gray-100 p-3 rounded border border-gray-300 overflow-x-auto">
                  <pre>{`{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { /* Additional error information */ }
  },
  "meta": {
    "timestamp": "2023-08-21T14:23:15Z",
    "version": "1.0"
  }
}`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="infrastructure" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium">Infrastructure as Code</h3>
                <p className="text-sm text-gray-600">
                  All infrastructure for TerraFusionProfessional is managed using Terraform and stored in version control.
                  This ensures consistent, reproducible environments and simplifies disaster recovery.
                </p>
                
                <div className="mt-6 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Terraform Modules</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Reusable Terraform modules are located in the <code>/infra/modules</code> directory:
                    </p>
                    <ul className="list-disc list-inside text-xs text-gray-600 mt-2">
                      <li>networking: VPC, subnets, security groups</li>
                      <li>compute: ECS services, load balancers</li>
                      <li>database: RDS instances</li>
                      <li>storage: S3 buckets, EFS volumes</li>
                      <li>monitoring: CloudWatch dashboards and alarms</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Environment Configuration</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Environment-specific configurations are in <code>/infra/environments</code>:
                    </p>
                    <ul className="list-disc list-inside text-xs text-gray-600 mt-2">
                      <li>dev: Development environment</li>
                      <li>staging: Staging environment</li>
                      <li>prod: Production environment</li>
                    </ul>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6">Deployment Architecture</h3>
                
                <div className="my-6 bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                  <Server className="h-16 w-16 text-gray-300 mx-auto" />
                  <p className="mt-2 text-sm text-gray-600">Deployment architecture diagram</p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Web Application</h4>
                    <ul className="list-disc list-inside text-xs text-gray-600 mt-2">
                      <li>Static assets served from S3 + CloudFront</li>
                      <li>API containers in ECS Fargate</li>
                      <li>Load balancing via ALB</li>
                      <li>Auto-scaling based on CPU and memory</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Database</h4>
                    <ul className="list-disc list-inside text-xs text-gray-600 mt-2">
                      <li>RDS PostgreSQL with Multi-AZ for high availability</li>
                      <li>Automated backups every 6 hours</li>
                      <li>Point-in-time recovery enabled</li>
                      <li>Read replicas for production</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Security</h4>
                    <ul className="list-disc list-inside text-xs text-gray-600 mt-2">
                      <li>VPC with private subnets for database and application</li>
                      <li>Security groups with least privilege</li>
                      <li>WAF for web application firewall</li>
                      <li>Secrets managed in AWS Secrets Manager</li>
                      <li>CloudTrail for audit logging</li>
                    </ul>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6">Disaster Recovery</h3>
                
                <div className="mt-4 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Backup Strategy</h4>
                    <ul className="list-disc list-inside text-xs text-gray-600 mt-2">
                      <li>Database: Automated backups with 7-day retention</li>
                      <li>File storage: S3 with versioning and cross-region replication</li>
                      <li>Application state: Stateless design with persistent storage in database</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Recovery Procedures</h4>
                    <ul className="list-disc list-inside text-xs text-gray-600 mt-2">
                      <li>RTO (Recovery Time Objective): 1 hour</li>
                      <li>RPO (Recovery Point Objective): 15 minutes</li>
                      <li>DB recovery: RDS point-in-time restore</li>
                      <li>Infrastructure recovery: Terraform apply from backup state</li>
                    </ul>
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
