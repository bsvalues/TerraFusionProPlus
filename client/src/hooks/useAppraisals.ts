import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '../lib/queryClient';
import { Appraisal, InsertAppraisal } from '../types';

const APPRAISALS_ENDPOINT = '/api/appraisals';

export function useAppraisals() {
  return useQuery({
    queryKey: ['appraisals'],
    queryFn: () => apiRequest<Appraisal[]>({ url: APPRAISALS_ENDPOINT }),
  });
}

export function useAppraisal(id: number) {
  return useQuery({
    queryKey: ['appraisals', id],
    queryFn: () => apiRequest<Appraisal>({ url: `${APPRAISALS_ENDPOINT}/${id}` }),
    enabled: !!id,
  });
}

export function useAppraisalsByProperty(propertyId: number) {
  return useQuery({
    queryKey: ['appraisals', { property_id: propertyId }],
    queryFn: () => 
      apiRequest<Appraisal[]>({ 
        url: `${APPRAISALS_ENDPOINT}?property_id=${propertyId}` 
      }),
    enabled: !!propertyId,
  });
}

export function useAppraisalsByAppraiser(appraiserId: number) {
  return useQuery({
    queryKey: ['appraisals', { appraiser_id: appraiserId }],
    queryFn: () => 
      apiRequest<Appraisal[]>({ 
        url: `${APPRAISALS_ENDPOINT}?appraiser_id=${appraiserId}` 
      }),
    enabled: !!appraiserId,
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
      queryClient.invalidateQueries({ 
        queryKey: ['appraisals', { property_id: data.property_id }] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['appraisals', { appraiser_id: data.appraiser_id }] 
      });
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
      queryClient.invalidateQueries({ 
        queryKey: ['appraisals', { property_id: data.property_id }] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['appraisals', { appraiser_id: data.appraiser_id }] 
      });
    },
  });
}