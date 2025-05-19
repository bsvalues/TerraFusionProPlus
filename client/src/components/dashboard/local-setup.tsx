import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, FileDown, ExternalLink, Globe, Server, Database } from "lucide-react";
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

export default function LocalSetupGuide() {
  return (
    <div className="mt-8 bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Local Development Setup</h2>
        <p className="mt-1 text-sm text-gray-500">Quick start guide for developers</p>
      </div>

      <div className="px-6 py-5">
        <div className="prose max-w-none">
          <h3>Getting Started</h3>
          <div className="flex items-center space-x-3 mb-4">
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-1" /> Copy All
            </Button>
            <Button variant="link" size="sm" className="text-primary-600 hover:text-primary-900">
              <FileDown className="h-4 w-4 mr-1" /> Download Guide
            </Button>
          </div>

          <CodeBlock
            description="1. Clone the repository"
            code="git clone https://github.com/bsvalues/TerraFusionProfessional.git"
          />

          <CodeBlock
            description="2. Install dependencies"
            code="cd TerraFusionProfessional && npm install"
          />

          <CodeBlock
            description="3. Set up environment variables"
            code="cp .env.example .env"
            note="Edit the .env file to include your local configuration"
          />

          <CodeBlock
            description="4. Start development servers"
            code="npm run dev"
            note="This will start the frontend, backend, and database services"
          />

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">5. Verify setup</h4>
            <div className="rounded p-3 text-xs">
              <div className="mb-2 flex items-center">
                <Globe className="text-primary-500 mr-2 h-4 w-4" />
                <span>Frontend: <a href="#" className="text-primary-600">http://localhost:3000</a></span>
              </div>
              <div className="mb-2 flex items-center">
                <Server className="text-primary-500 mr-2 h-4 w-4" />
                <span>API: <a href="#" className="text-primary-600">http://localhost:4000</a></span>
              </div>
              <div className="flex items-center">
                <Database className="text-primary-500 mr-2 h-4 w-4" />
                <span>Database: <code>postgres://localhost/terra_dev</code></span>
              </div>
            </div>
          </div>

          <h3 className="mt-6 mb-2">Bootstrap Checklist</h3>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Make sure you complete all these steps before pushing code to the repository. CI checks will fail if your environment is not set up correctly.
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
          </div>
        </div>
      </div>
    </div>
  );
}
