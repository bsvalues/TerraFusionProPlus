import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, Database, Cloud, HardDrive, Shield } from "lucide-react";

export default function Infrastructure() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Infrastructure Management</h1>
        <p className="mt-2 text-gray-600">Manage and monitor cloud resources and infrastructure</p>
      </header>

      <Tabs defaultValue="resources" className="mb-8">
        <TabsList>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="terraform">Terraform</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compute Resources</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8 Instances</div>
                <p className="text-xs text-muted-foreground">Across 3 environments</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Production</span>
                    <Badge variant="outline">4 Instances</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Staging</span>
                    <Badge variant="outline">2 Instances</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Development</span>
                    <Badge variant="outline">2 Instances</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database Resources</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3 Databases</div>
                <p className="text-xs text-muted-foreground">PostgreSQL clusters</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Production</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Staging</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Development</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Healthy</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Resources</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">256 GB</div>
                <p className="text-xs text-muted-foreground">Total allocated storage</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Object Storage</span>
                    <Badge variant="outline">128 GB</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Block Storage</span>
                    <Badge variant="outline">64 GB</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Storage</span>
                    <Badge variant="outline">64 GB</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Infrastructure Cost Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-500">Current Month</div>
                    <div className="text-2xl font-bold">$1,245.32</div>
                    <div className="text-xs text-green-600">-8% from last month</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-500">Forecast</div>
                    <div className="text-2xl font-bold">$1,320.00</div>
                    <div className="text-xs text-red-600">+6% from current</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-500">YTD Total</div>
                    <div className="text-2xl font-bold">$9,876.44</div>
                    <div className="text-xs text-gray-500">Since January 1st</div>
                  </div>
                </div>

                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <Cloud className="h-16 w-16 text-gray-300 mx-auto" />
                    <p className="mt-2 text-gray-500">Cost trend visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="terraform" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Terraform Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">networking</h3>
                    <p className="text-sm text-gray-500">VPC, subnets, and security groups</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">v0.3.2</Badge>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">compute</h3>
                    <p className="text-sm text-gray-500">EC2 instances and auto-scaling groups</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">v0.2.1</Badge>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">database</h3>
                    <p className="text-sm text-gray-500">PostgreSQL RDS instances</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">v0.1.5</Badge>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">storage</h3>
                    <p className="text-sm text-gray-500">S3 buckets and EBS volumes</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">v0.2.0-beta</Badge>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="outline" className="mr-2">View State</Button>
                <Button>Apply Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="network" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Network Topology</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <Shield className="h-16 w-16 text-gray-300 mx-auto" />
                  <p className="mt-2 text-gray-500">Network diagram visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>VPC Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">VPC ID:</span>
                    <span className="text-sm">vpc-0a1b2c3d4e5f6g7h8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">CIDR Block:</span>
                    <span className="text-sm">10.0.0.0/16</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Region:</span>
                    <span className="text-sm">us-west-2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Subnets:</span>
                    <span className="text-sm">6 (3 public, 3 private)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Web Tier SG</span>
                    <Badge variant="outline">sg-01234abcd</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">App Tier SG</span>
                    <Badge variant="outline">sg-56789efgh</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Database SG</span>
                    <Badge variant="outline">sg-abcdef123</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Monitoring SG</span>
                    <Badge variant="outline">sg-456xyz789</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Last Security Scan</div>
                  <div className="text-2xl font-bold">3 hours ago</div>
                  <div className="text-xs text-green-600">All checks passed</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">IAM Roles</div>
                  <div className="text-2xl font-bold">12 Active</div>
                  <div className="text-xs text-yellow-600">2 require review</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-500">Encryption</div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-xs text-green-600">All resources encrypted</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security Recommendations</h3>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Review IAM Policies</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Two IAM roles have overly permissive policies. Consider applying least privilege principle.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Network Security</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>All security groups follow best practices with minimal required ports open.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Resource Provisioning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-6">
            <Button>
              <span className="-ml-1 mr-2">+</span>
              Provision New Resource
            </Button>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Resource Name</th>
                  <th scope="col" className="px-6 py-3">Type</th>
                  <th scope="col" className="px-6 py-3">Environment</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Created</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900">web-server-prod-1</td>
                  <td className="px-6 py-4">EC2 Instance</td>
                  <td className="px-6 py-4">Production</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-green-100 text-green-800">Running</Badge>
                  </td>
                  <td className="px-6 py-4">2023-07-15</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <Button variant="outline" size="sm">Manage</Button>
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900">db-cluster-prod</td>
                  <td className="px-6 py-4">RDS Instance</td>
                  <td className="px-6 py-4">Production</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                  </td>
                  <td className="px-6 py-4">2023-07-10</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <Button variant="outline" size="sm">Manage</Button>
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900">storage-bucket-assets</td>
                  <td className="px-6 py-4">S3 Bucket</td>
                  <td className="px-6 py-4">Production</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </td>
                  <td className="px-6 py-4">2023-06-22</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <Button variant="outline" size="sm">Manage</Button>
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900">api-server-staging</td>
                  <td className="px-6 py-4">EC2 Instance</td>
                  <td className="px-6 py-4">Staging</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-green-100 text-green-800">Running</Badge>
                  </td>
                  <td className="px-6 py-4">2023-08-05</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <Button variant="outline" size="sm">Manage</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
