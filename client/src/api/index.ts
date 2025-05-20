import { apiRequest } from '../lib/queryClient';
import {
  Property, InsertProperty,
  Appraisal, InsertAppraisal,
  Comparable, InsertComparable,
  Adjustment, InsertAdjustment,
  User, InsertUser,
  MarketData, InsertMarketData,
  Attachment, InsertAttachment
} from '../../shared/schema';

// Property endpoints
export const getProperties = async (): Promise<Property[]> => {
  return apiRequest<Property[]>('/api/properties');
};

export const getProperty = async (id: number): Promise<Property> => {
  return apiRequest<Property>(`/api/properties/${id}`);
};

export const createProperty = async (property: InsertProperty): Promise<Property> => {
  return apiRequest<Property>('/api/properties', 'POST', property);
};

export const updateProperty = async (id: number, property: Partial<InsertProperty>): Promise<Property> => {
  return apiRequest<Property>(`/api/properties/${id}`, 'PATCH', property);
};

// Appraisal endpoints
export const getAppraisals = async (): Promise<Appraisal[]> => {
  return apiRequest<Appraisal[]>('/api/appraisals');
};

export const getAppraisal = async (id: number): Promise<Appraisal> => {
  return apiRequest<Appraisal>(`/api/appraisals/${id}`);
};

export const getAppraisalsByProperty = async (propertyId: number): Promise<Appraisal[]> => {
  return apiRequest<Appraisal[]>(`/api/appraisals?propertyId=${propertyId}`);
};

export const getAppraisalsByAppraiser = async (appraiserId: number): Promise<Appraisal[]> => {
  return apiRequest<Appraisal[]>(`/api/appraisals?appraiserId=${appraiserId}`);
};

export const createAppraisal = async (appraisal: InsertAppraisal): Promise<Appraisal> => {
  return apiRequest<Appraisal>('/api/appraisals', 'POST', appraisal);
};

export const updateAppraisal = async (id: number, appraisal: Partial<InsertAppraisal>): Promise<Appraisal> => {
  return apiRequest<Appraisal>(`/api/appraisals/${id}`, 'PATCH', appraisal);
};

// Comparable endpoints
export const getComparables = async (appraisalId?: number): Promise<Comparable[]> => {
  const url = appraisalId ? `/api/comparables?appraisalId=${appraisalId}` : '/api/comparables';
  return apiRequest<Comparable[]>(url);
};

export const getComparable = async (id: number): Promise<Comparable> => {
  return apiRequest<Comparable>(`/api/comparables/${id}`);
};

export const createComparable = async (comparable: InsertComparable): Promise<Comparable> => {
  return apiRequest<Comparable>('/api/comparables', 'POST', comparable);
};

export const updateComparable = async (id: number, comparable: Partial<InsertComparable>): Promise<Comparable> => {
  return apiRequest<Comparable>(`/api/comparables/${id}`, 'PATCH', comparable);
};

// Adjustment endpoints
export const getAdjustments = async (comparableId: number): Promise<Adjustment[]> => {
  return apiRequest<Adjustment[]>(`/api/adjustments?comparableId=${comparableId}`);
};

export const getAdjustment = async (id: number): Promise<Adjustment> => {
  return apiRequest<Adjustment>(`/api/adjustments/${id}`);
};

export const createAdjustment = async (adjustment: InsertAdjustment): Promise<Adjustment> => {
  return apiRequest<Adjustment>('/api/adjustments', 'POST', adjustment);
};

export const updateAdjustment = async (id: number, adjustment: Partial<InsertAdjustment>): Promise<Adjustment> => {
  return apiRequest<Adjustment>(`/api/adjustments/${id}`, 'PATCH', adjustment);
};

// Market data endpoints
export const getMarketData = async (
  location?: string,
  startDate?: string,
  endDate?: string
): Promise<MarketData[]> => {
  let url = '/api/market-data';
  const params = [];
  
  if (location) params.push(`location=${encodeURIComponent(location)}`);
  if (startDate) params.push(`startDate=${encodeURIComponent(startDate)}`);
  if (endDate) params.push(`endDate=${encodeURIComponent(endDate)}`);
  
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  
  return apiRequest<MarketData[]>(url);
};

export const createMarketData = async (marketData: InsertMarketData): Promise<MarketData> => {
  return apiRequest<MarketData>('/api/market-data', 'POST', marketData);
};

// User endpoints
export const getUser = async (id: number): Promise<User> => {
  return apiRequest<User>(`/api/users/${id}`);
};

export const getUserByUsername = async (username: string): Promise<User> => {
  return apiRequest<User>(`/api/users/username/${username}`);
};

export const createUser = async (user: InsertUser): Promise<User> => {
  return apiRequest<User>('/api/users', 'POST', user);
};

// Attachment endpoints
export const getAttachments = async (
  entityType: 'property' | 'appraisal' | 'comparable',
  entityId: number
): Promise<Attachment[]> => {
  return apiRequest<Attachment[]>(`/api/attachments?entityType=${entityType}&entityId=${entityId}`);
};

export const createAttachment = async (attachment: InsertAttachment): Promise<Attachment> => {
  return apiRequest<Attachment>('/api/attachments', 'POST', attachment);
};

// DevOps specific API endpoints
export const getDeploymentStatus = async () => {
  return apiRequest('/api/deployments/status');
};

export const createDeployment = async (deploymentData: any) => {
  return apiRequest('/api/deployments', 'POST', deploymentData);
};

export const getDeploymentLogs = async (deploymentId: string) => {
  return apiRequest(`/api/deployments/${deploymentId}/logs`);
};

export const getEnvironments = async () => {
  return apiRequest('/api/environments');
};

export const getInfrastructure = async () => {
  return apiRequest('/api/infrastructure');
};

export const getMonitoring = async () => {
  return apiRequest('/api/monitoring/metrics');
};

export const getTerraformState = async () => {
  return apiRequest('/api/terraform/state');
};

export const runTerraformPlan = async (planData: any) => {
  return apiRequest('/api/terraform/plan', 'POST', planData);
};

export const applyTerraformChanges = async (terraformId: string) => {
  return apiRequest(`/api/terraform/${terraformId}/apply`, 'POST');
};

export const getPipelineStatus = async () => {
  return apiRequest('/api/pipelines/status');
};

export const triggerPipeline = async (pipelineData: any) => {
  return apiRequest('/api/pipelines/trigger', 'POST', pipelineData);
};

export const getAuditLogs = async (params?: { startDate?: string, endDate?: string }) => {
  let url = '/api/audit-logs';
  if (params) {
    const queryParams = [];
    if (params.startDate) queryParams.push(`startDate=${encodeURIComponent(params.startDate)}`);
    if (params.endDate) queryParams.push(`endDate=${encodeURIComponent(params.endDate)}`);
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
  }
  return apiRequest(url);
};