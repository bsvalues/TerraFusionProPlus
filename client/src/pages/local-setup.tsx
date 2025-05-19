import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Copy, FileDown, Github, Terminal, Database, Globe, Server } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CodeBlockProps {
  code: string;
  description: string;
  note?: string;
}

function CodeBlock({ code, description, note }: CodeBlockProps) {
  const { toast } = useToast();
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied to clipboard",
        description: "The command has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
      <h4 className="text-sm font-medium text-gray-700 mb-2">{description}</h4>
      <div className="bg-gray-800 text-gray-200 rounded p-3 font-mono text-xs flex justify-between items-center group">
        <code>{code}</code>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={copyToClipboard}
          className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      {note && <p className="text-xs text-gray-600 mt-2">{note}</p>}
    </div>
  );
}

interface ChecklistItemProps {
  id: string;
  label: string;
}

function ChecklistItem({ id, label }: ChecklistItemProps) {
  const [checked, setChecked] = useState(false);
  
  return (
    <div className="flex items-start">
      <Checkbox 
        id={id} 
        checked={checked} 
        onCheckedChange={(value) => setChecked(!!value)} 
        className="mt-1"
      />
      <label htmlFor={id} className="ml-3 text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
}

export default function LocalSetup() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Local Development Setup</h1>
        <p className="mt-2 text-gray-600">Quick start guide for setting up TerraFusionProfessional locally</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="flex items-center space-x-3 mb-4">
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-1" /> Copy All Commands
              </Button>
              <Button variant="link" size="sm" className="text-primary-600 hover:text-primary-900">
                <FileDown className="h-4 w-4 mr-1" /> Download Guide as PDF
              </Button>
            </div>

            <CodeBlock
              description="1. Clone the repository"
              code="git clone https://github.com/bsvalues/TerraFusionProfessional.git"
            />

            <CodeBlock
              description="2. Navigate to project directory"
              code="cd TerraFusionProfessional"
            />

            <CodeBlock
              description="3. Install dependencies"
              code="npm install"
            />

            <CodeBlock
              description="4. Set up environment variables"
              code="cp .env.example .env"
              note="Edit the .env file to include your local configuration values"
            />

            <CodeBlock
              description="5. Start development servers"
              code="npm run dev"
              note="This will start the frontend, backend, and connect to the database"
            />

            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">6. Verify services are running</h4>
              <div className="rounded p-3 text-xs">
                <div className="mb-2 flex items-center">
                  <Globe className="text-primary-500 mr-2 h-4 w-4" />
                  <span>Frontend: <a href="http://localhost:3000" className="text-primary-600">http://localhost:3000</a></span>
                </div>
                <div className="mb-2 flex items-center">
                  <Server className="text-primary-500 mr-2 h-4 w-4" />
                  <span>API: <a href="http://localhost:8000" className="text-primary-600">http://localhost:8000</a></span>
                </div>
                <div className="flex items-center">
                  <Database className="text-primary-500 mr-2 h-4 w-4" />
                  <span>Database: <code>postgres://localhost/terra_dev</code></span>
                </div>
              </div>
            </div>

            <CodeBlock
              description="7. Run type checks and linting"
              code="npm run check && npm run lint"
              note="Verify code quality before making changes"
            />

            <CodeBlock
              description="8. Run tests"
              code="npm test"
              note="Ensure all tests pass before submitting pull requests"
            />

            <CodeBlock
              description="9. Build production bundle"
              code="npm run build"
              note="Creates optimized production build in the dist/ directory"
            />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Node.js</h4>
                <p className="text-sm text-gray-600">Version 18.x or later</p>
                <a href="https://nodejs.org" className="text-sm text-primary-600 hover:text-primary-900 mt-2 flex items-center">
                  <Terminal className="h-4 w-4 mr-1" /> Download Node.js
                </a>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">PostgreSQL</h4>
                <p className="text-sm text-gray-600">Version 14.x or later</p>
                <a href="https://www.postgresql.org/download/" className="text-sm text-primary-600 hover:text-primary-900 mt-2 flex items-center">
                  <Database className="h-4 w-4 mr-1" /> Download PostgreSQL
                </a>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Git</h4>
                <p className="text-sm text-gray-600">Latest version recommended</p>
                <a href="https://git-scm.com/downloads" className="text-sm text-primary-600 hover:text-primary-900 mt-2 flex items-center">
                  <Github className="h-4 w-4 mr-1" /> Download Git
                </a>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Code Editor</h4>
                <p className="text-sm text-gray-600">VSCode recommended with extensions:</p>
                <ul className="text-xs text-gray-600 list-disc list-inside mt-1">
                  <li>ESLint</li>
                  <li>Prettier</li>
                  <li>TypeScript</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">Developer Bootstrap Checklist</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Complete all these steps before pushing code to the repository. CI checks will fail if your environment is not set up correctly.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <ChecklistItem id="check1" label="Clone repo and install dependencies" />
              <ChecklistItem id="check2" label="Copy .env.example to .env and configure" />
              <ChecklistItem id="check3" label="Run npm run dev to start local servers" />
              <ChecklistItem id="check4" label="Run npm run check and npm run lint to verify code quality" />
              <ChecklistItem id="check5" label="Run npm test to ensure all tests pass" />
              <ChecklistItem id="check6" label="Build project with npm run build" />
              <ChecklistItem id="check7" label="Verify CI/CD pipeline status on PRs" />
              <ChecklistItem id="check8" label="Update documentation for any changes" />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Common Issues & Solutions</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700">Database Connection Errors</h4>
                <p className="text-sm text-gray-600 mt-1">
                  If you encounter database connection issues, ensure PostgreSQL is running and your .env file has the correct DATABASE_URL.
                </p>
                <CodeBlock
                  description="Check if PostgreSQL is running:"
                  code="pg_isready"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700">Node.js Version Mismatch</h4>
                <p className="text-sm text-gray-600 mt-1">
                  This project requires Node.js 18.x+. Consider using nvm to manage Node.js versions.
                </p>
                <CodeBlock
                  description="Install the correct Node.js version with nvm:"
                  code="nvm install 18 && nvm use 18"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700">Port Conflicts</h4>
                <p className="text-sm text-gray-600 mt-1">
                  If ports 3000 or 8000 are already in use, you can modify the ports in your .env file.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
