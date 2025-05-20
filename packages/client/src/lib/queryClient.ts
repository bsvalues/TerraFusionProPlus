import { QueryClient } from '@tanstack/react-query';

// General fetch wrapper for API requests
export const apiRequest = async (
  url: string | { url: string, method?: string, body?: any },
  options: RequestInit = {}
): Promise<any> => {
  // Handle the case where url is an object with url, method, and body properties
  if (typeof url === 'object') {
    options = {
      method: url.method || 'GET',
      ...(url.body && { body: typeof url.body === 'string' ? url.body : JSON.stringify(url.body) }),
      ...options,
    };
    url = url.url;
  }

  const defaultOptions: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API request failed with status ${response.status}`
      );
    }
    
    // For 204 No Content responses, return null
    if (response.status === 204) {
      return null;
    }
    
    // Parse JSON response
    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Default fetcher function for react-query
const defaultFetcher = async ({ queryKey }: { queryKey: any }): Promise<any> => {
  // If queryKey is an array, the first element is the endpoint, the second is the params
  const [endpoint, params] = Array.isArray(queryKey) ? queryKey : [queryKey, {}];
  
  // Handle params if they exist
  let url = endpoint;
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    url = `${endpoint}?${searchParams.toString()}`;
  }
  
  return apiRequest(url);
};

// Create and export the query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultFetcher,
      staleTime: 30000, // 30 seconds
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});