import { 
  Property, InsertProperty,
  Appraisal, InsertAppraisal,
  Comparable, InsertComparable,
  Adjustment, InsertAdjustment,
  MarketData, InsertMarketData,
  User, InsertUser,
  Attachment, InsertAttachment
} from '../types';

// Properties API
export const getProperties = async (): Promise<Property[]> => {
  const response = await fetch('/api/properties');
  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }
  return response.json();
};

export const getProperty = async (id: number): Promise<Property> => {
  const response = await fetch(`/api/properties/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch property with id ${id}`);
  }
  return response.json();
};

export const createProperty = async (property: InsertProperty): Promise<Property> => {
  const response = await fetch('/api/properties', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(property),
  });
  if (!response.ok) {
    throw new Error('Failed to create property');
  }
  return response.json();
};

export const updateProperty = async (id: number, property: Partial<InsertProperty>): Promise<Property> => {
  const response = await fetch(`/api/properties/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(property),
  });
  if (!response.ok) {
    throw new Error(`Failed to update property with id ${id}`);
  }
  return response.json();
};

// Appraisals API
export const getAppraisals = async (): Promise<Appraisal[]> => {
  const response = await fetch('/api/appraisals');
  if (!response.ok) {
    throw new Error('Failed to fetch appraisals');
  }
  return response.json();
};

export const getAppraisal = async (id: number): Promise<Appraisal> => {
  const response = await fetch(`/api/appraisals/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch appraisal with id ${id}`);
  }
  return response.json();
};

export const getAppraisalsByProperty = async (propertyId: number): Promise<Appraisal[]> => {
  const response = await fetch(`/api/appraisals?property_id=${propertyId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch appraisals for property with id ${propertyId}`);
  }
  return response.json();
};

export const getAppraisalsByAppraiser = async (appraiserId: number): Promise<Appraisal[]> => {
  const response = await fetch(`/api/appraisals?appraiser_id=${appraiserId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch appraisals for appraiser with id ${appraiserId}`);
  }
  return response.json();
};

export const createAppraisal = async (appraisal: InsertAppraisal): Promise<Appraisal> => {
  const response = await fetch('/api/appraisals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appraisal),
  });
  if (!response.ok) {
    throw new Error('Failed to create appraisal');
  }
  return response.json();
};

export const updateAppraisal = async (id: number, appraisal: Partial<InsertAppraisal>): Promise<Appraisal> => {
  const response = await fetch(`/api/appraisals/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appraisal),
  });
  if (!response.ok) {
    throw new Error(`Failed to update appraisal with id ${id}`);
  }
  return response.json();
};

// Comparables API
export const getComparables = async (appraisalId?: number): Promise<Comparable[]> => {
  let url = '/api/comparables';
  if (appraisalId) {
    url += `?appraisal_id=${appraisalId}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch comparables');
  }
  return response.json();
};

export const getComparable = async (id: number): Promise<Comparable> => {
  const response = await fetch(`/api/comparables/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch comparable with id ${id}`);
  }
  return response.json();
};

export const createComparable = async (comparable: InsertComparable): Promise<Comparable> => {
  const response = await fetch('/api/comparables', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comparable),
  });
  if (!response.ok) {
    throw new Error('Failed to create comparable');
  }
  return response.json();
};

export const updateComparable = async (id: number, comparable: Partial<InsertComparable>): Promise<Comparable> => {
  const response = await fetch(`/api/comparables/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comparable),
  });
  if (!response.ok) {
    throw new Error(`Failed to update comparable with id ${id}`);
  }
  return response.json();
};

// Adjustments API
export const getAdjustments = async (comparableId: number): Promise<Adjustment[]> => {
  const response = await fetch(`/api/adjustments?comparable_id=${comparableId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch adjustments for comparable with id ${comparableId}`);
  }
  return response.json();
};

export const getAdjustment = async (id: number): Promise<Adjustment> => {
  const response = await fetch(`/api/adjustments/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch adjustment with id ${id}`);
  }
  return response.json();
};

export const createAdjustment = async (adjustment: InsertAdjustment): Promise<Adjustment> => {
  const response = await fetch('/api/adjustments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(adjustment),
  });
  if (!response.ok) {
    throw new Error('Failed to create adjustment');
  }
  return response.json();
};

export const updateAdjustment = async (id: number, adjustment: Partial<InsertAdjustment>): Promise<Adjustment> => {
  const response = await fetch(`/api/adjustments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(adjustment),
  });
  if (!response.ok) {
    throw new Error(`Failed to update adjustment with id ${id}`);
  }
  return response.json();
};

// Market Data API
export const getMarketData = async (
  filters?: { location?: string; data_type?: string }
): Promise<MarketData[]> => {
  let url = '/api/market-data';
  const params = new URLSearchParams();
  
  if (filters?.location) {
    params.append('location', filters.location);
  }
  
  if (filters?.data_type) {
    params.append('data_type', filters.data_type);
  }
  
  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch market data');
  }
  return response.json();
};

export const createMarketData = async (marketData: InsertMarketData): Promise<MarketData> => {
  const response = await fetch('/api/market-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(marketData),
  });
  if (!response.ok) {
    throw new Error('Failed to create market data');
  }
  return response.json();
};

// Users API
export const getUser = async (id: number): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user with id ${id}`);
  }
  return response.json();
};

export const getUserByUsername = async (username: string): Promise<User> => {
  const response = await fetch(`/api/users?username=${username}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user with username ${username}`);
  }
  const users = await response.json();
  return users[0];
};

export const createUser = async (user: InsertUser): Promise<User> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  return response.json();
};

// Attachments API
export const getAttachments = async (
  filters?: { property_id?: number; appraisal_id?: number }
): Promise<Attachment[]> => {
  let url = '/api/attachments';
  const params = new URLSearchParams();
  
  if (filters?.property_id) {
    params.append('property_id', filters.property_id.toString());
  }
  
  if (filters?.appraisal_id) {
    params.append('appraisal_id', filters.appraisal_id.toString());
  }
  
  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch attachments');
  }
  return response.json();
};

export const createAttachment = async (attachment: InsertAttachment): Promise<Attachment> => {
  const response = await fetch('/api/attachments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(attachment),
  });
  if (!response.ok) {
    throw new Error('Failed to create attachment');
  }
  return response.json();
};