import { QueryClient } from '@tanstack/react-query';

// Define query keys for better cache management
export const QUERY_KEYS = {
  DEPLOYMENTS: 'deployments',
  DEPLOYMENT_DETAIL: 'deployment-detail',
  PIPELINES: 'pipelines',
  PIPELINE_DETAIL: 'pipeline-detail',
  ENVIRONMENTS: 'environments',
  MONITORING_METRICS: 'monitoring-metrics',
  MONITORING_ALERTS: 'monitoring-alerts',
  MONITORING_LOGS: 'monitoring-logs',
  SETTINGS: 'settings',
};

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Helper for making API requests with proper error handling
export const apiRequest = async ({ 
  url, 
  method = 'GET', 
  body = undefined, 
  headers = {} 
}: {
  url: string;
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    
    throw new Error(error.message || 'An error occurred');
  }
  
  return response.json();
};