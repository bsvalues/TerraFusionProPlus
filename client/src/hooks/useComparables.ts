import { useQuery, useMutation } from '@tanstack/react-query';
import { Comparable, InsertComparable } from '../types';
import { apiRequest, queryClient } from '../lib/queryClient';

// API endpoints
const COMPARABLES_ENDPOINT = '/api/comparables';

// Get all comparables or specific to an appraisal if ID provided
export function useComparables(appraisalId?: number) {
  return useQuery<Comparable[]>({
    queryKey: appraisalId 
      ? [`${COMPARABLES_ENDPOINT}/appraisal/${appraisalId}`] 
      : [COMPARABLES_ENDPOINT],
    queryFn: () => appraisalId
      ? apiRequest<Comparable[]>(`${COMPARABLES_ENDPOINT}/appraisal/${appraisalId}`)
      : apiRequest<Comparable[]>(COMPARABLES_ENDPOINT),
    enabled: appraisalId ? !!appraisalId : true, // Only run if appraisal ID is provided when specified
  });
}

// Get a single comparable by ID
export function useComparable(id: number) {
  return useQuery<Comparable>({
    queryKey: [`${COMPARABLES_ENDPOINT}/${id}`],
    queryFn: () => apiRequest<Comparable>(`${COMPARABLES_ENDPOINT}/${id}`),
    enabled: !!id, // Only run if ID is provided
  });
}

// Create a comparable
export function useCreateComparable() {
  return useMutation({
    mutationFn: (data: InsertComparable) => {
      return apiRequest<Comparable>(COMPARABLES_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      // Invalidate all comparables queries and the specific appraisal's comparables
      queryClient.invalidateQueries({ queryKey: [COMPARABLES_ENDPOINT] });
      queryClient.invalidateQueries({ 
        queryKey: [`${COMPARABLES_ENDPOINT}/appraisal/${data.appraisal_id}`] 
      });
      
      // Also invalidate the associated appraisal as its valuation may change
      queryClient.invalidateQueries({ 
        queryKey: [`/api/appraisals/${data.appraisal_id}`] 
      });
    },
  });
}

// Update a comparable
export function useUpdateComparable() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Comparable> }) => {
      return apiRequest<Comparable>(`${COMPARABLES_ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [COMPARABLES_ENDPOINT] });
      queryClient.invalidateQueries({ 
        queryKey: [`${COMPARABLES_ENDPOINT}/${data.id}`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`${COMPARABLES_ENDPOINT}/appraisal/${data.appraisal_id}`] 
      });
      
      // Also invalidate the associated appraisal as its valuation may change
      queryClient.invalidateQueries({ 
        queryKey: [`/api/appraisals/${data.appraisal_id}`] 
      });
    },
  });
}

// Delete a comparable
export function useDeleteComparable() {
  return useMutation({
    mutationFn: (comparable: Comparable) => {
      return apiRequest<void>(`${COMPARABLES_ENDPOINT}/${comparable.id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [COMPARABLES_ENDPOINT] });
      queryClient.invalidateQueries({ 
        queryKey: [`${COMPARABLES_ENDPOINT}/appraisal/${variables.appraisal_id}`] 
      });
      
      // Also invalidate the associated appraisal as its valuation may change
      queryClient.invalidateQueries({ 
        queryKey: [`/api/appraisals/${variables.appraisal_id}`] 
      });
    },
  });
}