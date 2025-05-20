import { useQuery, useMutation } from '@tanstack/react-query';
import { Appraisal, InsertAppraisal } from '../types';
import { apiRequest, queryClient } from '../lib/queryClient';

// API endpoints
const APPRAISALS_ENDPOINT = '/api/appraisals';

// Get all appraisals
export function useAppraisals() {
  return useQuery<Appraisal[]>({
    queryKey: [APPRAISALS_ENDPOINT],
    queryFn: () => apiRequest<Appraisal[]>(APPRAISALS_ENDPOINT),
  });
}

// Get a single appraisal by ID
export function useAppraisal(id: number, options = {}) {
  return useQuery<Appraisal>({
    queryKey: [`${APPRAISALS_ENDPOINT}/${id}`],
    queryFn: () => apiRequest<Appraisal>(`${APPRAISALS_ENDPOINT}/${id}`),
    enabled: !!id, // Only run if ID is provided
    ...options,
  });
}

// Get appraisals by property ID
export function useAppraisalsByProperty(propertyId: number, options = {}) {
  return useQuery<Appraisal[]>({
    queryKey: [`${APPRAISALS_ENDPOINT}/property/${propertyId}`],
    queryFn: () => apiRequest<Appraisal[]>(`${APPRAISALS_ENDPOINT}/property/${propertyId}`),
    enabled: !!propertyId, // Only run if property ID is provided
    ...options,
  });
}

// Get appraisals by appraiser ID
export function useAppraisalsByAppraiser(appraiserId: number, options = {}) {
  return useQuery<Appraisal[]>({
    queryKey: [`${APPRAISALS_ENDPOINT}/appraiser/${appraiserId}`],
    queryFn: () => apiRequest<Appraisal[]>(`${APPRAISALS_ENDPOINT}/appraiser/${appraiserId}`),
    enabled: !!appraiserId, // Only run if appraiser ID is provided
    ...options,
  });
}

// Create an appraisal
export function useCreateAppraisal() {
  return useMutation({
    mutationFn: (data: InsertAppraisal) => {
      return apiRequest<Appraisal>(APPRAISALS_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      // Invalidate the appraisals query and the specific property's appraisals
      queryClient.invalidateQueries({ queryKey: [APPRAISALS_ENDPOINT] });
      queryClient.invalidateQueries({ 
        queryKey: [`${APPRAISALS_ENDPOINT}/property/${data.property_id}`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`${APPRAISALS_ENDPOINT}/appraiser/${data.appraiser_id}`] 
      });
    },
  });
}

// Update an appraisal
export function useUpdateAppraisal() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Appraisal> }) => {
      return apiRequest<Appraisal>(`${APPRAISALS_ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [APPRAISALS_ENDPOINT] });
      queryClient.invalidateQueries({ 
        queryKey: [`${APPRAISALS_ENDPOINT}/${data.id}`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`${APPRAISALS_ENDPOINT}/property/${data.property_id}`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`${APPRAISALS_ENDPOINT}/appraiser/${data.appraiser_id}`] 
      });
    },
  });
}

// Delete an appraisal
export function useDeleteAppraisal() {
  return useMutation({
    mutationFn: (appraisal: Appraisal) => {
      return apiRequest<void>(`${APPRAISALS_ENDPOINT}/${appraisal.id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [APPRAISALS_ENDPOINT] });
      queryClient.invalidateQueries({ 
        queryKey: [`${APPRAISALS_ENDPOINT}/property/${variables.property_id}`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`${APPRAISALS_ENDPOINT}/appraiser/${variables.appraiser_id}`] 
      });
    },
  });
}