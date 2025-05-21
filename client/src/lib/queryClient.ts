import { QueryClient } from '@tanstack/react-query';

// Default fetcher for GET requests
const defaultFetcher = async <T>({ queryKey }: { queryKey: string | string[] }): Promise<T> => {
  const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

// API request function for mutations (POST, PUT, DELETE)
export const apiRequest = async <T>({
  url,
  method,
  data,
}: {
  url: string;
  method: 'POST' | 'PUT' | 'DELETE';
  data?: any;
}): Promise<T> => {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

// Create the client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultFetcher,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

export default queryClient;