// API utility for TerraFusionProfessional client

// Base URL for API requests - will adapt to the environment
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Generic error handling for fetch requests
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.error || response.statusText || 'Unknown error';
    throw new Error(errorMessage);
  }
  return response.json();
};

// HTTP request methods with proper error handling
const httpClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return handleResponse(response);
  },
  
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  put: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Deployments API
export const deploymentsApi = {
  getAll: () => httpClient.get('/deployments'),
  getById: (id: number) => httpClient.get(`/deployments/${id}`),
  create: (data: any) => httpClient.post('/deployments', data),
  update: (id: number, data: any) => httpClient.put(`/deployments/${id}`, data),
  delete: (id: number) => httpClient.delete(`/deployments/${id}`),
};

// Monitoring API
export const monitoringApi = {
  getMetrics: () => httpClient.get('/monitoring/metrics'),
  getAlerts: () => httpClient.get('/monitoring/alerts'),
  getLogs: (params: { limit?: number, level?: string, service?: string } = {}) => {
    const queryString = new URLSearchParams();
    if (params.limit) queryString.append('limit', params.limit.toString());
    if (params.level) queryString.append('level', params.level);
    if (params.service) queryString.append('service', params.service);
    
    const query = queryString.toString() ? `?${queryString.toString()}` : '';
    return httpClient.get(`/monitoring/logs${query}`);
  },
  getServices: () => httpClient.get('/monitoring/services'),
  acknowledgeAlert: (id: number) => httpClient.post(`/monitoring/alerts/${id}/acknowledge`, {}),
};

// Pipelines API
export const pipelinesApi = {
  getAll: () => httpClient.get('/pipelines'),
  getById: (id: number) => httpClient.get(`/pipelines/${id}`),
  create: (data: any) => httpClient.post('/pipelines', data),
  update: (id: number, data: any) => httpClient.put(`/pipelines/${id}`, data),
  delete: (id: number) => httpClient.delete(`/pipelines/${id}`),
  run: (id: number) => httpClient.post(`/pipelines/${id}/run`, {}),
  getRuns: (id: number) => httpClient.get(`/pipelines/${id}/runs`),
};

// Combined API export
const api = {
  deployments: deploymentsApi,
  monitoring: monitoringApi,
  pipelines: pipelinesApi,
};

export default api;