import { useQuery, useMutation } from '@tanstack/react-query';
import { Property, InsertProperty } from '../types';
import { apiRequest, queryClient } from '../lib/queryClient';

// API endpoints
const PROPERTIES_ENDPOINT = '/api/properties';

// Get all properties
export function useProperties() {
  return useQuery<Property[]>({
    queryKey: [PROPERTIES_ENDPOINT],
    queryFn: () => apiRequest<Property[]>(PROPERTIES_ENDPOINT),
  });
}

// Get a single property by ID
export function useProperty(id: number) {
  return useQuery<Property>({
    queryKey: [`${PROPERTIES_ENDPOINT}/${id}`],
    queryFn: () => apiRequest<Property>(`${PROPERTIES_ENDPOINT}/${id}`),
    enabled: !!id, // Only run if ID is provided
  });
}

// Create a property
export function useCreateProperty() {
  return useMutation({
    mutationFn: (data: InsertProperty) => {
      return apiRequest<Property>(PROPERTIES_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      // Invalidate the properties query to refetch the list
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_ENDPOINT] });
    },
  });
}

// Update a property
export function useUpdateProperty() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Property> }) => {
      return apiRequest<Property>(`${PROPERTIES_ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate both the properties list and the specific property
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_ENDPOINT] });
      queryClient.invalidateQueries({ 
        queryKey: [`${PROPERTIES_ENDPOINT}/${variables.id}`] 
      });
    },
  });
}

// Delete a property
export function useDeleteProperty() {
  return useMutation({
    mutationFn: (property: Property) => {
      return apiRequest<void>(`${PROPERTIES_ENDPOINT}/${property.id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_ENDPOINT] });
    },
  });
}