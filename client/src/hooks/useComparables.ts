import { useQuery, useMutation } from '@tanstack/react-query';
import { Comparable, InsertComparable } from '../types';
import { queryClient, apiRequest } from '../lib/queryClient';

// API endpoints
const COMPARABLES_ENDPOINT = '/api/comparables';

// Get all comparables
export function useComparables(appraisalId?: number, options = {}) {
  const endpoint = appraisalId 
    ? `${COMPARABLES_ENDPOINT}/appraisal/${appraisalId}` 
    : COMPARABLES_ENDPOINT;
    
  return useQuery({
    queryKey: [endpoint],
    enabled: !appraisalId || appraisalId > 0,
    ...options,
  });
}

// Get a single comparable by ID
export function useComparable(id: number, options = {}) {
  return useQuery({
    queryKey: [`${COMPARABLES_ENDPOINT}/${id}`],
    enabled: id > 0,
    ...options,
  });
}

// Create a new comparable
export function useCreateComparable() {
  return useMutation({
    mutationFn: (data: InsertComparable) => {
      return apiRequest<Comparable>(COMPARABLES_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      // Invalidate all comparables queries
      queryClient.invalidateQueries({ queryKey: [COMPARABLES_ENDPOINT] });
      
      // Also invalidate the specific appraisal comparables list
      if (data.appraisal_id) {
        queryClient.invalidateQueries({ 
          queryKey: [`${COMPARABLES_ENDPOINT}/appraisal/${data.appraisal_id}`] 
        });
      }
    },
  });
}

// Update an existing comparable
export function useUpdateComparable() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Comparable> }) => {
      return apiRequest<Comparable>(`${COMPARABLES_ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data, { id }) => {
      // Invalidate general comparables list
      queryClient.invalidateQueries({ queryKey: [COMPARABLES_ENDPOINT] });
      
      // Invalidate the specific comparable
      queryClient.invalidateQueries({ queryKey: [`${COMPARABLES_ENDPOINT}/${id}`] });
      
      // Also invalidate the specific appraisal comparables list
      if (data.appraisal_id) {
        queryClient.invalidateQueries({ 
          queryKey: [`${COMPARABLES_ENDPOINT}/appraisal/${data.appraisal_id}`] 
        });
      }
    },
  });
}

// Delete a comparable
export function useDeleteComparable() {
  return useMutation({
    mutationFn: (comparable: Comparable) => {
      return apiRequest(`${COMPARABLES_ENDPOINT}/${comparable.id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (_, comparable) => {
      // Invalidate general comparables list
      queryClient.invalidateQueries({ queryKey: [COMPARABLES_ENDPOINT] });
      
      // Also invalidate the specific appraisal comparables list
      if (comparable.appraisal_id) {
        queryClient.invalidateQueries({ 
          queryKey: [`${COMPARABLES_ENDPOINT}/appraisal/${comparable.appraisal_id}`] 
        });
      }
    },
  });
}