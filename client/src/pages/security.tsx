import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle, Lock, Key, FileText } from "lucide-react";

export default function Security() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Security Management</h1>
        <p className="mt-2 text-gray-600">Monitor and manage security of your application</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85/100</div>
            <Progress value={85} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">3 issues need attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dependency Vulnerabilities</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Warnings</div>
            <p className="text-xs text-muted-foreground mt-2">Last scan: 3 hours ago</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Compliant</div>
            <p className="text-xs text-muted-foreground mt-2">All security policies met</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Vulnerability Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-start">
                <div className="mr-3 mt-0.5">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">lodash@4.17.15</h3>
                  <p className="text-xs text-yellow-700 mt-1">
                    Medium severity vulnerability found in lodash library. 
                    Prototype pollution in Object.
                  </p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Update to v4.17.21
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-start">
                <div className="mr-3 mt-0.5">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">axios@0.21.1</h3>
                  <p className="text-xs text-yellow-700 mt-1">
                    Low severity vulnerability found in axios library.
                    Server-side request forgery.
                  </p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Update to v0.21.4
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-start">
                <div className="mr-3 mt-0.5">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-green-800">All other dependencies</h3>
                  <p className="text-xs text-green-700 mt-1">
                    No known vulnerabilities found in 128 other packages.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button>
                Run Full Scan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium">Multi-Factor Authentication</h3>
                    <p className="text-xs text-muted-foreground">
                      Required for all admin accounts
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Key className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium">Secrets Rotation</h3>
                    <p className="text-xs text-muted-foreground">
                      Automatic rotation every 90 days
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium">IP Restriction</h3>
                    <p className="text-xs text-muted-foreground">
                      Limited to approved IP ranges
                    </p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium">Audit Logging</h3>
                    <p className="text-xs text-muted-foreground">
                      All actions logged and monitored
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Compliance Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">GDPR</Badge>
                <Badge variant="outline">SOC 2</Badge>
                <Badge variant="outline">HIPAA</Badge>
                <Badge variant="outline">ISO 27001</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Audit Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Timestamp</th>
                  <th scope="col" className="px-6 py-3">User</th>
                  <th scope="col" className="px-6 py-3">Action</th>
                  <th scope="col" className="px-6 py-3">Resource</th>
                  <th scope="col" className="px-6 py-3">IP Address</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4">2023-08-21 14:32:15</td>
                  <td className="px-6 py-4">admin@terrafusion.com</td>
                  <td className="px-6 py-4">Secret Updated</td>
                  <td className="px-6 py-4">API Keys</td>
                  <td className="px-6 py-4">192.168.1.105</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-green-100 text-green-800">Success</Badge>
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4">2023-08-21 13:45:22</td>
                  <td className="px-6 py-4">developer@terrafusion.com</td>
                  <td className="px-6 py-4">User Login</td>
                  <td className="px-6 py-4">Authentication</td>
                  <td className="px-6 py-4">203.0.113.42</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-green-100 text-green-800">Success</Badge>
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4">2023-08-21 12:18:05</td>
                  <td className="px-6 py-4">unknown</td>
                  <td className="px-6 py-4">User Login</td>
                  <td className="px-6 py-4">Authentication</td>
                  <td className="px-6 py-4">198.51.100.73</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-red-100 text-red-800">Failed</Badge>
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4">2023-08-21 10:42:33</td>
                  <td className="px-6 py-4">devops@terrafusion.com</td>
                  <td className="px-6 py-4">Pipeline Started</td>
                  <td className="px-6 py-4">CI/CD</td>
                  <td className="px-6 py-4">192.168.1.108</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-green-100 text-green-800">Success</Badge>
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4">2023-08-20 22:15:41</td>
                  <td className="px-6 py-4">system</td>
                  <td className="px-6 py-4">Automatic Backup</td>
                  <td className="px-6 py-4">Database</td>
                  <td className="px-6 py-4">10.0.0.5</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-green-100 text-green-800">Success</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing 5 of 1,285 logs
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
