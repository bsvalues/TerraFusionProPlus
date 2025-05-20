import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '../lib/queryClient';
import { Comparable, InsertComparable } from '../types';

const COMPARABLES_ENDPOINT = '/api/comparables';

export function useComparables(appraisalId: number | undefined) {
  return useQuery({
    queryKey: ['comparables', { appraisal_id: appraisalId }],
    queryFn: () => 
      apiRequest<Comparable[]>({ 
        url: `${COMPARABLES_ENDPOINT}?appraisal_id=${appraisalId}` 
      }),
    enabled: !!appraisalId,
  });
}

export function useComparable(id: number) {
  return useQuery({
    queryKey: ['comparables', id],
    queryFn: () => apiRequest<Comparable>({ url: `${COMPARABLES_ENDPOINT}/${id}` }),
    enabled: !!id,
  });
}

export function useCreateComparable() {
  return useMutation({
    mutationFn: (data: InsertComparable) => {
      return apiRequest<Comparable>({
        url: COMPARABLES_ENDPOINT,
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comparables'] });
      queryClient.invalidateQueries({ 
        queryKey: ['comparables', { appraisal_id: data.appraisal_id }] 
      });
    },
  });
}

export function useUpdateComparable() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertComparable> }) => {
      return apiRequest<Comparable>({
        url: `${COMPARABLES_ENDPOINT}/${id}`,
        method: 'PUT',
        body: data,
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comparables'] });
      queryClient.invalidateQueries({ queryKey: ['comparables', variables.id] });
      queryClient.invalidateQueries({ 
        queryKey: ['comparables', { appraisal_id: data.appraisal_id }] 
      });
    },
  });
}