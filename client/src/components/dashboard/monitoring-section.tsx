import { Card } from "@/components/ui/card";
import { BarChart3, ActivitySquare } from "lucide-react";
import { LogEntry } from "@/types";

interface MonitoringSectionProps {
  logs: LogEntry[];
}

export default function MonitoringSection({ logs }: MonitoringSectionProps) {
  const logLevelClasses = {
    INFO: "text-green-400",
    DEBUG: "text-blue-400",
    WARN: "text-yellow-400",
    ERROR: "text-red-400",
  };

  return (
    <div className="mt-8 bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Monitoring & Logging</h2>
        <p className="mt-1 text-sm text-gray-500">System health, errors, and performance metrics</p>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Error Rate Chart */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Error Rate (Last 24h)</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-64 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto" />
                  <p className="mt-2 text-sm text-gray-500">Error rate visualization</p>
                  <p className="text-lg font-medium text-gray-700 mt-2">0.03% Error Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Request Volume Chart */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Request Volume (Last 24h)</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-64 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <ActivitySquare className="h-16 w-16 text-gray-300 mx-auto" />
                  <p className="mt-2 text-sm text-gray-500">Request volume visualization</p>
                  <p className="text-lg font-medium text-gray-700 mt-2">24.5k Requests</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Logs */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Logs</h3>
          <div className="bg-gray-800 text-gray-200 rounded-lg p-3 font-mono text-xs h-64 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="grid grid-cols-12 gap-x-2 mt-1">
                <div className="col-span-2 text-gray-400">{log.timestamp}</div>
                <div className={`col-span-1 ${logLevelClasses[log.level]}`}>{log.level}</div>
                <div className="col-span-9">{log.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
