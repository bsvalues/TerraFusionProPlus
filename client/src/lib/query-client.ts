import { QueryClient } from '@tanstack/react-query';

export const apiRequest = async ({ 
  url, 
  method = 'GET', 
  body, 
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
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred during the API request');
  }
  
  return response.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});