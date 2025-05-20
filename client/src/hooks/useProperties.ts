import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '../lib/queryClient';
import { Property, InsertProperty } from '../types';

const PROPERTIES_ENDPOINT = '/api/properties';

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: () => apiRequest<Property[]>({ url: PROPERTIES_ENDPOINT }),
  });
}

export function useProperty(id: number) {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: () => apiRequest<Property>({ url: `${PROPERTIES_ENDPOINT}/${id}` }),
    enabled: !!id,
  });
}

export function useCreateProperty() {
  return useMutation({
    mutationFn: (data: InsertProperty) => {
      return apiRequest<Property>({
        url: PROPERTIES_ENDPOINT,
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdateProperty() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertProperty> }) => {
      return apiRequest<Property>({
        url: `${PROPERTIES_ENDPOINT}/${id}`,
        method: 'PUT',
        body: data,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties', variables.id] });
    },
  });
}

export function useDeleteProperty() {
  return useMutation({
    mutationFn: (id: number) => {
      return apiRequest<void>({
        url: `${PROPERTIES_ENDPOINT}/${id}`,
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}