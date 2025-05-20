import { QueryClient } from '@tanstack/react-query';

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

// Base fetch function for API requests
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Parse error response if possible
    try {
      const errorData = await response.json();
      throw new Error(errorData.error || `API Error: ${response.status}`);
    } catch (e) {
      // If error response isn't valid JSON
      throw new Error(`API Error: ${response.status}`);
    }
  }

  // For 204 No Content responses, return empty object
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}