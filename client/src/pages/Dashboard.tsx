import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDistance } from 'date-fns';
import { 
  BarChart, 
  LineChart, 
  ResponsiveContainer, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Bar, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  getDeploymentStatus, 
  getPipelineStatus, 
  getEnvironments, 
  getMonitoring 
} from '../api';

// Status colors
const COLORS = {
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#0ea5e9',
  neutral: '#6b7280',
};

// Status indicators
const StatusIndicator = ({ status }: { status: 'success' | 'warning' | 'error' | 'in-progress' | 'idle' }) => {
  const getColor = () => {
    switch (status) {
      case 'success': return COLORS.success;
      case 'warning': return COLORS.warning;
      case 'error': return COLORS.danger;
      case 'in-progress': return COLORS.info;
      default: return COLORS.neutral;
    }
  };

  return (
    <div className="flex items-center">
      <div 
        className="w-2.5 h-2.5 rounded-full mr-2" 
        style={{ backgroundColor: getColor() }}
      ></div>
      <span className="capitalize">{status}</span>
    </div>
  );
};

// Sample data for charts
const generateDeploymentData = () => {
  return [
    { name: 'Mon', success: 4, failed: 1, pending: 0 },
    { name: 'Tue', success: 5, failed: 0, pending: 1 },
    { name: 'Wed', success: 3, failed: 2, pending: 0 },
    { name: 'Thu', success: 6, failed: 0, pending: 0 },
    { name: 'Fri', success: 2, failed: 1, pending: 2 },
    { name: 'Sat', success: 1, failed: 0, pending: 0 },
    { name: 'Sun', success: 2, failed: 0, pending: 1 },
  ];
};

const generateResourceUsageData = () => {
  return [
    { name: '00:00', cpu: 45, memory: 30, network: 20 },
    { name: '04:00', cpu: 30, memory: 25, network: 15 },
    { name: '08:00', cpu: 60, memory: 40, network: 35 },
    { name: '12:00', cpu: 85, memory: 65, network: 50 },
    { name: '16:00', cpu: 90, memory: 70, network: 65 },
    { name: '20:00', cpu: 75, memory: 55, network: 40 },
    { name: '23:59', cpu: 50, memory: 35, network: 25 },
  ];
};

const generateBuildTimeData = () => {
  return [
    { name: 'Week 1', time: 12 },
    { name: 'Week 2', time: 15 },
    { name: 'Week 3', time: 8 },
    { name: 'Week 4', time: 10 },
  ];
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch data
  const deploymentStatusQuery = useQuery({
    queryKey: ['/api/deployments/status'],
    queryFn: () => getDeploymentStatus(),
    staleTime: 30000 // 30 seconds
  });
  
  const pipelineStatusQuery = useQuery({
    queryKey: ['/api/pipelines/status'],
    queryFn: () => getPipelineStatus(),
    staleTime: 30000
  });
  
  const environmentsQuery = useQuery({
    queryKey: ['/api/environments'],
    queryFn: () => getEnvironments(),
    staleTime: 60000 // 1 minute
  });
  
  const monitoringQuery = useQuery({
    queryKey: ['/api/monitoring/metrics'],
    queryFn: () => getMonitoring(),
    staleTime: 15000 // 15 seconds
  });

  // Sample data for when API is not yet implemented
  const sampleDeployments = [
    { id: 'dep-1', name: 'Production', status: 'success', lastDeployed: new Date(Date.now() - 86400000), version: 'v1.2.3' },
    { id: 'dep-2', name: 'Staging', status: 'in-progress', lastDeployed: new Date(Date.now() - 3600000), version: 'v1.2.4-rc1' },
    { id: 'dep-3', name: 'Development', status: 'success', lastDeployed: new Date(Date.now() - 7200000), version: 'v1.2.4-dev' },
  ];

  const sampleEnvironments = [
    { id: 'env-1', name: 'Production', status: 'success', region: 'us-west-1', type: 'kubernetes' },
    { id: 'env-2', name: 'Staging', status: 'success', region: 'us-west-1', type: 'kubernetes' },
    { id: 'env-3', name: 'Development', status: 'success', region: 'us-east-1', type: 'kubernetes' },
  ];

  const sampleResourceMetrics = {
    cpu: { currentUsage: 65, limit: 100, unit: '%' },
    memory: { currentUsage: 4.2, limit: 8, unit: 'GB' },
    disk: { currentUsage: 32, limit: 100, unit: 'GB' },
    network: { currentUsage: 42, limit: 100, unit: 'Mbps' }
  };

  const deployments = deploymentStatusQuery.data || sampleDeployments;
  const environments = environmentsQuery.data || sampleEnvironments;
  const resourceMetrics = monitoringQuery.data?.resources || sampleResourceMetrics;
  
  const deploymentChartData = generateDeploymentData();
  const resourceUsageData = generateResourceUsageData();
  const buildTimeData = generateBuildTimeData();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">DevOps Dashboard</h1>
        <p className="text-gray-600">
          Monitor infrastructure, deployments, and system health
        </p>
      </div>

      {/* Tab navigation */}
      <div className="mb-6 border-b">
        <div className="flex space-x-6">
          <button
            className={`py-2 px-1 font-medium ${
              activeTab === 'overview'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-2 px-1 font-medium ${
              activeTab === 'deployments'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('deployments')}
          >
            Deployments
          </button>
          <button
            className={`py-2 px-1 font-medium ${
              activeTab === 'environments'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('environments')}
          >
            Environments
          </button>
          <button
            className={`py-2 px-1 font-medium ${
              activeTab === 'resources'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Deployment Success Rate</h3>
              <div className="flex justify-between items-baseline">
                <p className="text-3xl font-bold">92%</p>
                <p className="text-sm text-green-600 flex items-center">
                  <span className="mr-1">↑</span>
                  3.2%
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Average Build Time</h3>
              <div className="flex justify-between items-baseline">
                <p className="text-3xl font-bold">8.4 min</p>
                <p className="text-sm text-green-600 flex items-center">
                  <span className="mr-1">↓</span>
                  1.2 min
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Active Environments</h3>
              <div className="flex justify-between items-baseline">
                <p className="text-3xl font-bold">3</p>
                <p className="text-sm text-gray-500">of 4 total</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">System Health</h3>
              <div className="flex justify-between items-baseline">
                <p className="text-3xl font-bold">98%</p>
                <p className="text-sm text-green-600 flex items-center">
                  <span className="mr-1">↑</span>
                  1.5%
                </p>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Deployment Status</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deploymentChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="success" fill={COLORS.success} />
                    <Bar dataKey="failed" fill={COLORS.danger} />
                    <Bar dataKey="pending" fill={COLORS.info} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Resource Usage</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={resourceUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cpu" stroke="#3b82f6" />
                    <Line type="monotone" dataKey="memory" stroke="#8b5cf6" />
                    <Line type="monotone" dataKey="network" stroke="#10b981" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Recent Deployments */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Recent Deployments</h3>
              <button className="text-sm text-primary hover:text-primary-dark font-medium">
                View All
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Environment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deployed
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deployments.map((deployment) => (
                    <tr key={deployment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{deployment.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusIndicator status={deployment.status as any} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                          {deployment.version}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistance(new Date(deployment.lastDeployed), new Date(), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary hover:text-primary-dark">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Deployments Tab */}
      {activeTab === 'deployments' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-medium">Deployment Management</h2>
            <button className="btn btn-primary">
              New Deployment
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Deployment History</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deploymentChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="success" fill={COLORS.success} />
                      <Bar dataKey="failed" fill={COLORS.danger} />
                      <Bar dataKey="pending" fill={COLORS.info} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium mb-4">Build Time Trends</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={buildTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="time" stroke="#3b82f6" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Environment Status</h3>
                
                <div className="space-y-4">
                  {environments.map((env) => (
                    <div key={env.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div>
                        <h4 className="font-medium">{env.name}</h4>
                        <p className="text-sm text-gray-500">{env.region} | {env.type}</p>
                      </div>
                      <StatusIndicator status={env.status as any} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium mb-4">Deployment Success Rate</h3>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Success', value: 92 },
                          { name: 'Failed', value: 8 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill={COLORS.success} />
                        <Cell fill={COLORS.danger} />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Recent Deployments</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search deployments..."
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>All Environments</option>
                  <option>Production</option>
                  <option>Staging</option>
                  <option>Development</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Environment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deployed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deployed By
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deployments.map((deployment) => (
                    <tr key={deployment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{deployment.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusIndicator status={deployment.status as any} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                          {deployment.version}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistance(new Date(deployment.lastDeployed), new Date(), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">John Smith</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary hover:text-primary-dark mr-3">
                          View Logs
                        </button>
                        <button className="text-primary hover:text-primary-dark">
                          Rollback
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Environments Tab */}
      {activeTab === 'environments' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-medium">Environment Management</h2>
            <button className="btn btn-primary">
              New Environment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {environments.map((env) => (
              <div key={env.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{env.name}</h3>
                    <StatusIndicator status={env.status as any} />
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Region:</span>
                    <span>{env.region}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Type:</span>
                    <span>{env.type}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Last Deployed:</span>
                    <span>3 hours ago</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Current Version:</span>
                    <span className="px-2 py-0.5 text-xs bg-gray-100 rounded-full">v1.2.3</span>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 flex justify-between">
                  <button className="text-sm text-primary hover:text-primary-dark font-medium">
                    View Details
                  </button>
                  <button className="text-sm text-primary hover:text-primary-dark font-medium">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-medium mb-4">Infrastructure Configuration</h3>
            
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 font-medium">
                Terraform Configuration
              </div>
              <div className="px-6 py-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center">
                    <span className="w-40 text-gray-600">State File:</span>
                    <span className="text-green-600">Up to date</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-40 text-gray-600">Last Applied:</span>
                    <span>2 days ago</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-40 text-gray-600">Modules:</span>
                    <span>4 active modules</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-40 text-gray-600">Resources:</span>
                    <span>24 resources managed</span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button className="btn btn-primary">
                    Run Plan
                  </button>
                  <button className="btn btn-outline">
                    View State
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Environment Variables</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Environment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">DATABASE_URL</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        All
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                        Secret
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      3 weeks ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary hover:text-primary-dark">
                        Edit
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">API_KEY</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        All
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                        Secret
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      1 month ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary hover:text-primary-dark">
                        Edit
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">NODE_ENV</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Production
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        Regular
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2 months ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary hover:text-primary-dark">
                        Edit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-medium">System Resources</h2>
            <p className="text-gray-600">Monitor and manage resource usage across environments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">CPU Usage</h3>
              <div className="flex justify-between items-baseline mb-2">
                <p className="text-3xl font-bold">{resourceMetrics.cpu.currentUsage}%</p>
                <p className="text-sm text-gray-500">of {resourceMetrics.cpu.limit}{resourceMetrics.cpu.unit}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(resourceMetrics.cpu.currentUsage / resourceMetrics.cpu.limit) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Memory Usage</h3>
              <div className="flex justify-between items-baseline mb-2">
                <p className="text-3xl font-bold">{resourceMetrics.memory.currentUsage}{resourceMetrics.memory.unit}</p>
                <p className="text-sm text-gray-500">of {resourceMetrics.memory.limit}{resourceMetrics.memory.unit}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${(resourceMetrics.memory.currentUsage / resourceMetrics.memory.limit) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Disk Usage</h3>
              <div className="flex justify-between items-baseline mb-2">
                <p className="text-3xl font-bold">{resourceMetrics.disk.currentUsage}{resourceMetrics.disk.unit}</p>
                <p className="text-sm text-gray-500">of {resourceMetrics.disk.limit}{resourceMetrics.disk.unit}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${(resourceMetrics.disk.currentUsage / resourceMetrics.disk.limit) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Network Usage</h3>
              <div className="flex justify-between items-baseline mb-2">
                <p className="text-3xl font-bold">{resourceMetrics.network.currentUsage}{resourceMetrics.network.unit}</p>
                <p className="text-sm text-gray-500">of {resourceMetrics.network.limit}{resourceMetrics.network.unit}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-yellow-500 h-2.5 rounded-full" 
                  style={{ width: `${(resourceMetrics.network.currentUsage / resourceMetrics.network.limit) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-medium mb-4">Resource Usage History</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={resourceUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cpu" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="memory" stroke="#8b5cf6" />
                  <Line type="monotone" dataKey="network" stroke="#f59e0b" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Kubernetes Pods</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CPU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Memory
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">api-server-7d8f7d4b7b-2xvjl</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusIndicator status="success" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">120m / 500m</td>
                      <td className="px-6 py-4 whitespace-nowrap">256Mi / 512Mi</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">web-app-5b9b4b4b4b-x7z9m</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusIndicator status="success" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">85m / 250m</td>
                      <td className="px-6 py-4 whitespace-nowrap">128Mi / 256Mi</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">db-0</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusIndicator status="success" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">300m / 1000m</td>
                      <td className="px-6 py-4 whitespace-nowrap">1Gi / 2Gi</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Auto Scaling Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">API Server</h4>
                    <div className="flex items-center">
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" name="toggle" id="apiServerToggle" className="sr-only" checked />
                        <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                      </div>
                      <label htmlFor="apiServerToggle" className="text-xs text-gray-700">Enabled</label>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Min Replicas</label>
                      <input type="number" className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm" value="2" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Max Replicas</label>
                      <input type="number" className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm" value="5" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">CPU Target</label>
                      <div className="flex items-center">
                        <input type="number" className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm" value="70" />
                        <span className="ml-1 text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Web App</h4>
                    <div className="flex items-center">
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" name="toggle" id="webAppToggle" className="sr-only" checked />
                        <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                      </div>
                      <label htmlFor="webAppToggle" className="text-xs text-gray-700">Enabled</label>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Min Replicas</label>
                      <input type="number" className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm" value="3" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Max Replicas</label>
                      <input type="number" className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm" value="10" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">CPU Target</label>
                      <div className="flex items-center">
                        <input type="number" className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm" value="80" />
                        <span className="ml-1 text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Resource Optimization Recommendations</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">Memory Optimization</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Database pods are using only 50% of allocated memory. Consider reducing request/limit to 1.5Gi to save costs.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-green-800">Auto-scaling Performance</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Auto-scaling configuration for web-app is working efficiently, maintaining 75% CPU utilization during peak hours.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">Resource Bottleneck</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      API servers occasionally reaching CPU limits during high traffic periods. Consider increasing CPU limits or adding more replicas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;