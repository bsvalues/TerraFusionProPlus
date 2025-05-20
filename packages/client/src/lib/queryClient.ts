import { QueryClient } from '@tanstack/react-query';

// Set up default query client options
const defaultQueryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
};

// Create and export the query client instance
export const queryClient = new QueryClient(defaultQueryClientOptions);

// Helper function for making API requests in mutations
export const apiRequest = async ({
  url,
  method,
  data,
}: {
  url: string;
  method: 'POST' | 'PUT' | 'DELETE';
  data?: any;
}) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.error || response.statusText || 'Unknown error';
    throw new Error(errorMessage);
  }
  
  return response.json();
};

// Cache key prefixes for consistent cache management
export const QUERY_KEYS = {
  DEPLOYMENTS: '/api/deployments',
  DEPLOYMENT: (id: number) => ['/api/deployments', id],
  MONITORING_METRICS: '/api/monitoring/metrics',
  MONITORING_ALERTS: '/api/monitoring/alerts',
  MONITORING_LOGS: '/api/monitoring/logs',
  MONITORING_SERVICES: '/api/monitoring/services',
  PIPELINES: '/api/pipelines',
  PIPELINE: (id: number) => ['/api/pipelines', id],
  PIPELINE_RUNS: (id: number) => ['/api/pipelines', id, 'runs'],
};

export default queryClient;