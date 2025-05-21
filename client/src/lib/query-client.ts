import { QueryClient } from '@tanstack/react-query';

interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export async function apiRequest<T>(
  endpoint: string,
  { params, ...customConfig }: ApiRequestOptions = {}
): Promise<T> {
  const url = new URL(endpoint, window.location.origin);
  
  // Add query parameters if they exist
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...customConfig,
  };

  // Convert body to JSON string if it exists and is an object
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url.toString(), config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    return Promise.reject(new Error(errorData.message || `API error: ${response.status}`));
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}