import { QueryClient } from '@tanstack/react-query';

// Create a query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Helper function for API requests
export async function apiRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(error.message || 'An error occurred while fetching data');
  }

  return response.json();
}

// Commonly used fetch function for queries
export async function defaultQueryFn({ queryKey }: { queryKey: string[] }) {
  const [url] = queryKey;
  return apiRequest(url);
}

export default queryClient;