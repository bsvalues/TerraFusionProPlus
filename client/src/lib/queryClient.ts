import { QueryClient } from '@tanstack/react-query';

// Base API URL - using environment variable or default to relative path
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Generic fetch function for making API requests
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // Add leading slash if not present
  if (!url.startsWith('/')) {
    url = `/${url}`;
  }
  
  // Create the full URL
  const fullUrl = `${API_BASE_URL}${url}`;
  
  // Set default headers if not provided
  if (!options.headers) {
    options.headers = {
      'Content-Type': 'application/json',
    };
  }

  try {
    const response = await fetch(fullUrl, options);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    // Parse JSON if the response has content
    if (response.status !== 204) {
      return await response.json();
    }
    
    // Return empty object for 204 No Content
    return {} as T;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Default query client setup with common configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      queryFn: async ({ queryKey }) => {
        // Convert query key to URL path if it's a string or array
        const url = Array.isArray(queryKey[0]) 
          ? queryKey[0].join('/') 
          : queryKey[0].toString();
          
        return apiRequest(url);
      },
    },
  },
});

// Helper functions for creating mutation functions

// Create a new resource
export function createResource<T, D>(endpoint: string) {
  return async (data: D): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };
}

// Update an existing resource
export function updateResource<T, D>(endpoint: string, id: number) {
  return async (data: D): Promise<T> => {
    return apiRequest<T>(`${endpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };
}

// Delete a resource
export function deleteResource(endpoint: string, id: number) {
  return async (): Promise<void> => {
    return apiRequest(`${endpoint}/${id}`, {
      method: 'DELETE',
    });
  };
}