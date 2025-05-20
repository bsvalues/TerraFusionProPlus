import { 
  Property, Appraisal, Comparable, Adjustment, User, MarketData, Attachment,
  InsertProperty, InsertAppraisal, InsertComparable, InsertAdjustment, 
  InsertUser, InsertMarketData, InsertAttachment
} from '../types';
import { z } from 'zod';

// These types are now imported from '../types'

// Base API fetch function
const apiFetch = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`/api/${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

// Property API endpoints
export const propertyApi = {
  getProperties: async (): Promise<Property[]> => {
    return apiFetch<Property[]>('properties');
  },

  getProperty: async (id: number): Promise<Property> => {
    return apiFetch<Property>(`properties/${id}`);
  },

  createProperty: async (property: InsertProperty): Promise<Property> => {
    return apiFetch<Property>('properties', 'POST', property);
  },

  updateProperty: async (id: number, property: Partial<InsertProperty>): Promise<Property> => {
    return apiFetch<Property>(`properties/${id}`, 'PUT', property);
  },

  deleteProperty: async (id: number): Promise<void> => {
    return apiFetch<void>(`properties/${id}`, 'DELETE');
  },
};

// Appraisal API endpoints
export const appraisalApi = {
  getAppraisals: async (filters?: { property_id?: number; appraiser_id?: number; status?: string }): Promise<Appraisal[]> => {
    const queryParams = new URLSearchParams();

    if (filters?.property_id) queryParams.append('property_id', filters.property_id.toString());
    if (filters?.appraiser_id) queryParams.append('appraiser_id', filters.appraiser_id.toString());
    if (filters?.status) queryParams.append('status', filters.status);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `appraisals?${queryString}` : 'appraisals';

    return apiFetch<Appraisal[]>(endpoint);
  },

  getAppraisal: async (id: number): Promise<Appraisal> => {
    return apiFetch<Appraisal>(`appraisals/${id}`);
  },

  createAppraisal: async (appraisal: InsertAppraisal): Promise<Appraisal> => {
    return apiFetch<Appraisal>('appraisals', 'POST', appraisal);
  },

  updateAppraisal: async (id: number, appraisal: Partial<InsertAppraisal>): Promise<Appraisal> => {
    return apiFetch<Appraisal>(`appraisals/${id}`, 'PUT', appraisal);
  },
};

// Comparable API endpoints
export const comparableApi = {
  getComparables: async (appraisal_id: number): Promise<Comparable[]> => {
    return apiFetch<Comparable[]>(`comparables?appraisal_id=${appraisal_id}`);
  },

  getComparable: async (id: number): Promise<Comparable> => {
    return apiFetch<Comparable>(`comparables/${id}`);
  },

  createComparable: async (comparable: InsertComparable): Promise<Comparable> => {
    return apiFetch<Comparable>('comparables', 'POST', comparable);
  },

  updateComparable: async (id: number, comparable: Partial<InsertComparable>): Promise<Comparable> => {
    return apiFetch<Comparable>(`comparables/${id}`, 'PUT', comparable);
  },
};

// Adjustment API endpoints
export const adjustmentApi = {
  getAdjustments: async (comparable_id: number): Promise<Adjustment[]> => {
    return apiFetch<Adjustment[]>(`adjustments?comparable_id=${comparable_id}`);
  },

  getAdjustment: async (id: number): Promise<Adjustment> => {
    return apiFetch<Adjustment>(`adjustments/${id}`);
  },

  createAdjustment: async (adjustment: InsertAdjustment): Promise<Adjustment> => {
    return apiFetch<Adjustment>('adjustments', 'POST', adjustment);
  },

  updateAdjustment: async (id: number, adjustment: Partial<InsertAdjustment>): Promise<Adjustment> => {
    return apiFetch<Adjustment>(`adjustments/${id}`, 'PUT', adjustment);
  },

  deleteAdjustment: async (id: number): Promise<void> => {
    return apiFetch<void>(`adjustments/${id}`, 'DELETE');
  },
};

// User API endpoints
export const userApi = {
  getUsers: async (): Promise<User[]> => {
    return apiFetch<User[]>('users');
  },

  getUser: async (id: number): Promise<User> => {
    return apiFetch<User>(`users/${id}`);
  },

  createUser: async (user: InsertUser): Promise<User> => {
    return apiFetch<User>('users', 'POST', user);
  },

  updateUser: async (id: number, user: Partial<InsertUser>): Promise<User> => {
    return apiFetch<User>(`users/${id}`, 'PUT', user);
  },
};

// Market data API endpoints
export const marketDataApi = {
  getMarketData: async (filters?: { location?: string; data_type?: string }): Promise<MarketData[]> => {
    const queryParams = new URLSearchParams();

    if (filters?.location) queryParams.append('location', filters.location);
    if (filters?.data_type) queryParams.append('data_type', filters.data_type);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `market-data?${queryString}` : 'market-data';

    return apiFetch<MarketData[]>(endpoint);
  },

  createMarketData: async (marketData: InsertMarketData): Promise<MarketData> => {
    return apiFetch<MarketData>('market-data', 'POST', marketData);
  },
};

// Attachment API endpoints
export const attachmentApi = {
  getAttachments: async (filters: { property_id?: number; appraisal_id?: number }): Promise<Attachment[]> => {
    const queryParams = new URLSearchParams();

    if (filters.property_id) queryParams.append('property_id', filters.property_id.toString());
    if (filters.appraisal_id) queryParams.append('appraisal_id', filters.appraisal_id.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `attachments?${queryString}` : 'attachments';

    return apiFetch<Attachment[]>(endpoint);
  },

  getAttachment: async (id: number): Promise<Attachment> => {
    return apiFetch<Attachment>(`attachments/${id}`);
  },

  uploadAttachment: async (
    data: { 
      property_id?: number;
      appraisal_id?: number;
      category?: string;
      description?: string;
    },
    file: File
  ): Promise<Attachment> => {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const response = await fetch('/api/attachments', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  },

  deleteAttachment: async (id: number): Promise<void> => {
    return apiFetch<void>(`attachments/${id}`, 'DELETE');
  },
};