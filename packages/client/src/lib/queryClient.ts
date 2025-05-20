import { QueryClient } from '@tanstack/react-query';
import { apiFetch } from '../api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Helper for making API requests
export const apiRequest = async ({ 
  endpoint, 
  method = 'GET', 
  data = undefined,
}: {
  endpoint: string;
  method?: string;
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

  return apiFetch(endpoint, options);
};