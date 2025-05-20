import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart3, 
  Activity, 
  Server, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { QUERY_KEYS } from '../lib/queryClient';
import api from '../api';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  // Fetch deployments data
  const { data: deployments, isLoading: isLoadingDeployments } = useQuery({
    queryKey: [QUERY_KEYS.DEPLOYMENTS],
    queryFn: () => api.deployments.getAll()
  });
  
  // Fetch monitoring metrics
  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: [QUERY_KEYS.MONITORING_METRICS],
    queryFn: () => api.monitoring.getMetrics()
  });
  
  // Fetch alerts
  const { data: alerts, isLoading: isLoadingAlerts } = useQuery({
    queryKey: [QUERY_KEYS.MONITORING_ALERTS],
    queryFn: () => api.monitoring.getAlerts()
  });
  
  // Fetch pipelines
  const { data: pipelines, isLoading: isLoadingPipelines } = useQuery({
    queryKey: [QUERY_KEYS.PIPELINES],
    queryFn: () => api.pipelines.getAll()
  });
  
  const isLoading = isLoadingDeployments || isLoadingMetrics || isLoadingAlerts || isLoadingPipelines;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Count active deployments
  const activeDeployments = deployments?.filter(d => d.status === 'active').length || 0;
  
  // Count failed pipelines
  const failedPipelines = pipelines?.filter(p => p.lastRunStatus === 'failed').length || 0;
  
  // Count critical alerts
  const criticalAlerts = alerts?.filter(a => a.severity === 'critical' && !a.acknowledged).length || 0;
  
  // Get average response time from metrics
  const avgResponseTime = metrics?.network?.inbound || 0;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="bg-white rounded-md shadow p-1 flex">
          <button 
            className={`px-3 py-1 text-sm rounded-md ${timeRange === '24h' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
            onClick={() => setTimeRange('24h')}
          >
            24h
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${timeRange === '7d' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
            onClick={() => setTimeRange('7d')}
          >
            7d
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${timeRange === '30d' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
            onClick={() => setTimeRange('30d')}
          >
            30d
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${timeRange === 'custom' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
            onClick={() => setTimeRange('custom')}
          >
            Custom
          </button>
        </div>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Deployments</p>
              <p className="text-3xl font-semibold mt-1">{activeDeployments}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Server className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-500 flex items-center text-sm font-medium">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +2
            </span>
            <span className="text-gray-500 text-sm ml-2">from last week</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Failed Pipelines</p>
              <p className="text-3xl font-semibold mt-1">{failedPipelines}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-red-500 flex items-center text-sm font-medium">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +1
            </span>
            <span className="text-gray-500 text-sm ml-2">from yesterday</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Critical Alerts</p>
              <p className="text-3xl font-semibold mt-1">{criticalAlerts}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-500 flex items-center text-sm font-medium">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              -3
            </span>
            <span className="text-gray-500 text-sm ml-2">from yesterday</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Response Time</p>
              <p className="text-3xl font-semibold mt-1">{avgResponseTime}ms</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-500 flex items-center text-sm font-medium">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              -5ms
            </span>
            <span className="text-gray-500 text-sm ml-2">from last week</span>
          </div>
        </div>
      </div>
      
      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium">Recent Deployments</h2>
          </div>
          <div className="p-4">
            <ul className="divide-y divide-gray-200">
              {deployments?.slice(0, 5).map((deployment) => (
                <li key={deployment.id} className="py-3">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${deployment.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{deployment.name}</p>
                      <p className="text-sm text-gray-500 truncate">Environment: {deployment.environment}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <p className="text-sm text-gray-500">
                        {new Date(deployment.lastDeployed).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium">Recent Pipeline Runs</h2>
          </div>
          <div className="p-4">
            <ul className="divide-y divide-gray-200">
              {pipelines?.slice(0, 5).map((pipeline) => (
                <li key={pipeline.id} className="py-3">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      pipeline.lastRunStatus === 'success' ? 'bg-green-500' : 
                      pipeline.lastRunStatus === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{pipeline.name}</p>
                      <p className="text-sm text-gray-500 truncate">Status: {pipeline.lastRunStatus}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <p className="text-sm text-gray-500">
                        {new Date(pipeline.lastRun).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* System health and alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow lg:col-span-2">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium">System Resources</h2>
          </div>
          <div className="p-6">
            {metrics && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                    <span className="text-sm font-medium text-gray-700">{metrics.cpu.usage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        metrics.cpu.usage > 80 ? 'bg-red-500' : 
                        metrics.cpu.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${metrics.cpu.usage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                    <span className="text-sm font-medium text-gray-700">{metrics.memory.usage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        metrics.memory.usage > 80 ? 'bg-red-500' : 
                        metrics.memory.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${metrics.memory.usage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Disk Usage</span>
                    <span className="text-sm font-medium text-gray-700">{metrics.disk.usage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        metrics.disk.usage > 80 ? 'bg-red-500' : 
                        metrics.disk.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${metrics.disk.usage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Network</span>
                    <span className="text-sm font-medium text-gray-700">
                      ↓ {metrics.network.inbound} MB/s ↑ {metrics.network.outbound} MB/s
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">Active Alerts</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {criticalAlerts} Critical
            </span>
          </div>
          <div className="p-4">
            <ul className="divide-y divide-gray-200">
              {alerts?.filter(a => !a.acknowledged).slice(0, 5).map((alert) => (
                <li key={alert.id} className="py-3">
                  <div className="flex items-start">
                    <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 ${
                      alert.severity === 'critical' ? 'bg-red-500' : 
                      alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500">
                        {alert.source} • {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              
              {alerts?.filter(a => !a.acknowledged).length === 0 && (
                <li className="py-8 text-center">
                  <p className="text-sm text-gray-500">No active alerts</p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;