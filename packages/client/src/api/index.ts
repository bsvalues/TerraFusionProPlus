import { apiRequest } from '../lib/queryClient';

// API base URL
const API_BASE_URL = '/api';

// Deployments API
const deployments = {
  getAll: () => 
    apiRequest({ url: `${API_BASE_URL}/deployments` }),
  
  getById: (id: string) => 
    apiRequest({ url: `${API_BASE_URL}/deployments/${id}` }),
  
  create: (data: any) => 
    apiRequest({ 
      url: `${API_BASE_URL}/deployments`, 
      method: 'POST', 
      body: data 
    }),
  
  update: (id: string, data: any) => 
    apiRequest({ 
      url: `${API_BASE_URL}/deployments/${id}`, 
      method: 'PUT', 
      body: data 
    }),
  
  delete: (id: string) => 
    apiRequest({ 
      url: `${API_BASE_URL}/deployments/${id}`, 
      method: 'DELETE' 
    }),
};

// Pipelines API
const pipelines = {
  getAll: () => 
    apiRequest({ url: `${API_BASE_URL}/pipelines` }),
  
  getById: (id: string) => 
    apiRequest({ url: `${API_BASE_URL}/pipelines/${id}` }),
  
  create: (data: any) => 
    apiRequest({ 
      url: `${API_BASE_URL}/pipelines`, 
      method: 'POST', 
      body: data 
    }),
  
  update: (id: string, data: any) => 
    apiRequest({ 
      url: `${API_BASE_URL}/pipelines/${id}`, 
      method: 'PUT', 
      body: data 
    }),
  
  delete: (id: string) => 
    apiRequest({ 
      url: `${API_BASE_URL}/pipelines/${id}`, 
      method: 'DELETE' 
    }),
    
  run: (id: string) => 
    apiRequest({ 
      url: `${API_BASE_URL}/pipelines/${id}/run`, 
      method: 'POST' 
    }),
};

// Monitoring API
const monitoring = {
  getMetrics: () => 
    apiRequest({ url: `${API_BASE_URL}/monitoring/metrics` }),
  
  getAlerts: () => 
    apiRequest({ url: `${API_BASE_URL}/monitoring/alerts` }),
  
  getLogs: (params?: any) => 
    apiRequest({ 
      url: `${API_BASE_URL}/monitoring/logs${params ? `?${new URLSearchParams(params)}` : ''}` 
    }),
  
  acknowledgeAlert: (id: string) => 
    apiRequest({ 
      url: `${API_BASE_URL}/monitoring/alerts/${id}/acknowledge`, 
      method: 'POST' 
    }),
};

// Environments API
const environments = {
  getAll: () => 
    apiRequest({ url: `${API_BASE_URL}/environments` }),
  
  getById: (id: string) => 
    apiRequest({ url: `${API_BASE_URL}/environments/${id}` }),
  
  create: (data: any) => 
    apiRequest({ 
      url: `${API_BASE_URL}/environments`, 
      method: 'POST', 
      body: data 
    }),
  
  update: (id: string, data: any) => 
    apiRequest({ 
      url: `${API_BASE_URL}/environments/${id}`, 
      method: 'PUT', 
      body: data 
    }),
  
  delete: (id: string) => 
    apiRequest({ 
      url: `${API_BASE_URL}/environments/${id}`, 
      method: 'DELETE' 
    }),
};

// Settings API
const settings = {
  get: () => 
    apiRequest({ url: `${API_BASE_URL}/settings` }),
  
  update: (data: any) => 
    apiRequest({ 
      url: `${API_BASE_URL}/settings`, 
      method: 'PUT', 
      body: data 
    }),
};

// Export all API services
const api = {
  deployments,
  pipelines,
  monitoring,
  environments,
  settings
};

export default api;