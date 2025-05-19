import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { EnvironmentConfig } from "@/types";
import { Eye } from "lucide-react";

interface EnvironmentConfigProps {
  config: EnvironmentConfig;
  onSave: (config: EnvironmentConfig) => void;
}

export default function EnvironmentConfigForm({ config, onSave }: EnvironmentConfigProps) {
  const [currentEnv, setCurrentEnv] = useState("development");
  const [showSecrets, setShowSecrets] = useState({
    sentryDsn: false,
    datadogApiKey: false,
  });
  
  const [formData, setFormData] = useState<EnvironmentConfig>(config);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSecretChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      secrets: {
        ...formData.secrets,
        [name]: value,
      },
    });
  };

  const handleToggleSecret = (name: string) => {
    setShowSecrets({
      ...showSecrets,
      [name]: !showSecrets[name],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="mt-8 bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Environment Configuration</h2>
        <p className="mt-1 text-sm text-gray-500">Manage environment variables and configuration settings</p>
      </div>

      <div className="px-6 pt-5">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {["development", "staging", "production"].map((env) => (
              <a
                key={env}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentEnv(env);
                }}
                className={`
                  whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                  ${
                    currentEnv === env
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {env.charAt(0).toUpperCase() + env.slice(1)}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="px-6 py-5">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <Label htmlFor="apiUrl">API URL</Label>
              <Input
                id="apiUrl"
                name="apiUrl"
                value={formData.apiUrl}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div className="sm:col-span-3">
              <Label htmlFor="dbUrl">Database URL</Label>
              <Input
                id="dbUrl"
                name="dbUrl"
                value={formData.dbUrl}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="nodeVersion">Node Version</Label>
              <Select
                value={formData.nodeVersion}
                onValueChange={(value) => setFormData({ ...formData, nodeVersion: value })}
              >
                <SelectTrigger id="nodeVersion" className="mt-1">
                  <SelectValue placeholder="Select Node version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20.x">20.x</SelectItem>
                  <SelectItem value="18.x">18.x</SelectItem>
                  <SelectItem value="16.x">16.x</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="logLevel">Log Level</Label>
              <Select
                value={formData.logLevel}
                onValueChange={(value) => setFormData({ ...formData, logLevel: value })}
              >
                <SelectTrigger id="logLevel" className="mt-1">
                  <SelectValue placeholder="Select log level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="error">error</SelectItem>
                  <SelectItem value="warn">warn</SelectItem>
                  <SelectItem value="info">info</SelectItem>
                  <SelectItem value="debug">debug</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-start mt-5">
                <Checkbox
                  id="enableDebug"
                  checked={formData.enableDebug}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("enableDebug", checked as boolean)
                  }
                />
                <Label htmlFor="enableDebug" className="ml-3 font-medium text-gray-700">
                  Enable Debug Mode
                </Label>
              </div>
            </div>

            <div className="sm:col-span-6">
              <div className="flex items-start">
                <Checkbox
                  id="enableMetrics"
                  checked={formData.enableMetrics}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("enableMetrics", checked as boolean)
                  }
                />
                <div className="ml-3">
                  <Label htmlFor="enableMetrics" className="font-medium text-gray-700">
                    Enable Metrics Collection
                  </Label>
                  <p className="text-gray-500 text-sm">Allow anonymous usage data collection to improve the platform</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secret Management */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">Secure Secrets</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="sentryDsn" className="text-sm font-medium text-gray-700">Sentry DSN</Label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <Input
                      type={showSecrets.sentryDsn ? "text" : "password"}
                      name="sentryDsn"
                      id="sentryDsn"
                      value={formData.secrets.sentryDsn}
                      onChange={(e) => handleSecretChange("sentryDsn", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={() => handleToggleSecret("sentryDsn")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="datadogApiKey" className="text-sm font-medium text-gray-700">Datadog API Key</Label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <Input
                      type={showSecrets.datadogApiKey ? "text" : "password"}
                      name="datadogApiKey"
                      id="datadogApiKey"
                      value={formData.secrets.datadogApiKey}
                      onChange={(e) => handleSecretChange("datadogApiKey", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={() => handleToggleSecret("datadogApiKey")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="text-primary-700 bg-primary-100 hover:bg-primary-200"
                >
                  + Add Secret
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="outline" className="mr-3">
              Reset
            </Button>
            <Button type="submit">
              Save Configuration
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
