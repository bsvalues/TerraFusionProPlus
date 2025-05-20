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

// Default fetch options
const defaultFetchOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
};

// API request function for standardizing all API calls
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const mergedOptions = {
    ...defaultFetchOptions,
    ...options,
  };

  const response = await fetch(endpoint, mergedOptions);

  // Handle API errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || response.statusText || 'API request failed';
    
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).data = errorData;
    
    throw error;
  }

  // For successful responses with no content (204)
  if (response.status === 204) {
    return {} as T;
  }

  // For successful responses with content
  return response.json();
}