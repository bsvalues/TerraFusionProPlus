import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '../lib/queryClient';
import { Appraisal, InsertAppraisal } from '../types';

const APPRAISALS_ENDPOINT = '/api/appraisals';

export function useAppraisals(filters?: { property_id?: number; appraiser_id?: number; status?: string }) {
  const queryParams = new URLSearchParams();
  
  if (filters?.property_id) queryParams.append('property_id', filters.property_id.toString());
  if (filters?.appraiser_id) queryParams.append('appraiser_id', filters.appraiser_id.toString());
  if (filters?.status) queryParams.append('status', filters.status);
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `${APPRAISALS_ENDPOINT}?${queryString}` : APPRAISALS_ENDPOINT;
  
  return useQuery({
    queryKey: ['appraisals', filters],
    queryFn: () => apiRequest<Appraisal[]>({ url: endpoint }),
  });
}

export function useAppraisal(id: number) {
  return useQuery({
    queryKey: ['appraisals', id],
    queryFn: () => apiRequest<Appraisal>({ url: `${APPRAISALS_ENDPOINT}/${id}` }),
    enabled: !!id,
  });
}

export function useCreateAppraisal() {
  return useMutation({
    mutationFn: (data: InsertAppraisal) => {
      return apiRequest<Appraisal>({
        url: APPRAISALS_ENDPOINT,
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appraisals'] });
      if (data.property_id) {
        queryClient.invalidateQueries({ queryKey: ['appraisals', { property_id: data.property_id }] });
      }
    },
  });
}

export function useUpdateAppraisal() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertAppraisal> }) => {
      return apiRequest<Appraisal>({
        url: `${APPRAISALS_ENDPOINT}/${id}`,
        method: 'PUT',
        body: data,
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appraisals'] });
      queryClient.invalidateQueries({ queryKey: ['appraisals', variables.id] });
      if (data.property_id) {
        queryClient.invalidateQueries({ queryKey: ['appraisals', { property_id: data.property_id }] });
      }
    },
  });
}