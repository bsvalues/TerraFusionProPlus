import { useQuery, useMutation } from '@tanstack/react-query';
import { Property, InsertProperty } from '../types';
import { queryClient, apiRequest, createResource, updateResource, deleteResource } from '../lib/queryClient';

// API endpoints
const PROPERTIES_ENDPOINT = '/api/properties';

// Get all properties
export function useProperties() {
  return useQuery({
    queryKey: [PROPERTIES_ENDPOINT],
  });
}

// Get a single property by ID
export function useProperty(id: number, options = {}) {
  return useQuery({
    queryKey: [`${PROPERTIES_ENDPOINT}/${id}`],
    enabled: id > 0,
    ...options,
  });
}

// Create a new property
export function useCreateProperty() {
  return useMutation({
    mutationFn: (data: InsertProperty) => {
      return apiRequest<Property>(PROPERTIES_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_ENDPOINT] });
    },
  });
}

// Update an existing property
export function useUpdateProperty() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Property> }) => {
      return apiRequest<Property>(`${PROPERTIES_ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_ENDPOINT] });
      queryClient.invalidateQueries({ queryKey: [`${PROPERTIES_ENDPOINT}/${id}`] });
    },
  });
}

// Delete a property
export function useDeleteProperty() {
  return useMutation({
    mutationFn: (id: number) => {
      return apiRequest(`${PROPERTIES_ENDPOINT}/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_ENDPOINT] });
    },
  });
}