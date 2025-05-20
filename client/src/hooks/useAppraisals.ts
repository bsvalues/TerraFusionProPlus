import { useQuery, useMutation } from '@tanstack/react-query';
import { Appraisal, InsertAppraisal } from '../types';
import { queryClient, apiRequest } from '../lib/queryClient';

// API endpoints
const APPRAISALS_ENDPOINT = '/api/appraisals';

// Get all appraisals
export function useAppraisals() {
  return useQuery({
    queryKey: [APPRAISALS_ENDPOINT],
  });
}

// Get a single appraisal by ID
export function useAppraisal(id: number, options = {}) {
  return useQuery({
    queryKey: [`${APPRAISALS_ENDPOINT}/${id}`],
    enabled: id > 0,
    ...options,
  });
}

// Get appraisals by property ID
export function useAppraisalsByProperty(propertyId: number, options = {}) {
  return useQuery({
    queryKey: [`${APPRAISALS_ENDPOINT}/property/${propertyId}`],
    enabled: propertyId > 0,
    ...options,
  });
}

// Get appraisals by appraiser ID
export function useAppraisalsByAppraiser(appraiserId: number, options = {}) {
  return useQuery({
    queryKey: [`${APPRAISALS_ENDPOINT}/appraiser/${appraiserId}`],
    enabled: appraiserId > 0,
    ...options,
  });
}

// Create a new appraisal
export function useCreateAppraisal() {
  return useMutation({
    mutationFn: (data: InsertAppraisal) => {
      return apiRequest<Appraisal>(APPRAISALS_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [APPRAISALS_ENDPOINT] });
      if (data.property_id) {
        queryClient.invalidateQueries({ 
          queryKey: [`${APPRAISALS_ENDPOINT}/property/${data.property_id}`] 
        });
      }
    },
  });
}

// Update an existing appraisal
export function useUpdateAppraisal() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Appraisal> }) => {
      return apiRequest<Appraisal>(`${APPRAISALS_ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: [APPRAISALS_ENDPOINT] });
      queryClient.invalidateQueries({ queryKey: [`${APPRAISALS_ENDPOINT}/${id}`] });
      if (data.property_id) {
        queryClient.invalidateQueries({ 
          queryKey: [`${APPRAISALS_ENDPOINT}/property/${data.property_id}`] 
        });
      }
    },
  });
}

// Delete an appraisal
export function useDeleteAppraisal() {
  return useMutation({
    mutationFn: (id: number) => {
      return apiRequest(`${APPRAISALS_ENDPOINT}/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPRAISALS_ENDPOINT] });
    },
  });
}