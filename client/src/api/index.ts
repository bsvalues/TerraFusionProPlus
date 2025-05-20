import { queryClient, apiRequest } from '../lib/queryClient';
import { 
  Property,
  Appraisal,
  Comparable,
  User,
  Attachment,
  MarketData,
  InsertProperty,
  InsertAppraisal,
  InsertComparable,
  InsertUser,
  InsertAttachment
} from '../../shared/schema';

// API endpoints for Properties
export const propertyApi = {
  // Get all properties
  getProperties: async (): Promise<Property[]> => {
    return apiRequest('/api/properties');
  },
  
  // Get a single property by ID
  getProperty: async (id: number): Promise<Property> => {
    return apiRequest(`/api/properties/${id}`);
  },
  
  // Create a new property
  createProperty: async (property: InsertProperty): Promise<Property> => {
    return apiRequest('/api/properties', {
      method: 'POST',
      body: JSON.stringify(property),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  // Update a property
  updateProperty: async (id: number, property: Partial<InsertProperty>): Promise<Property> => {
    return apiRequest(`/api/properties/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(property),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  // Delete a property
  deleteProperty: async (id: number): Promise<void> => {
    await apiRequest(`/api/properties/${id}`, {
      method: 'DELETE'
    });
    
    // Invalidate properties cache
    queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
  },
  
  // Get properties by search term
  searchProperties: async (searchTerm: string): Promise<Property[]> => {
    return apiRequest(`/api/properties/search?q=${encodeURIComponent(searchTerm)}`);
  },
  
  // Get attachments for a property
  getPropertyAttachments: async (propertyId: number): Promise<Attachment[]> => {
    return apiRequest(`/api/properties/${propertyId}/attachments`);
  }
};

// API endpoints for Appraisals
export const appraisalApi = {
  // Get all appraisals
  getAppraisals: async (): Promise<Appraisal[]> => {
    return apiRequest('/api/appraisals');
  },
  
  // Get a single appraisal by ID
  getAppraisal: async (id: number): Promise<Appraisal> => {
    return apiRequest(`/api/appraisals/${id}`);
  },
  
  // Create a new appraisal
  createAppraisal: async (appraisal: InsertAppraisal): Promise<Appraisal> => {
    return apiRequest('/api/appraisals', {
      method: 'POST',
      body: JSON.stringify(appraisal),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  // Update an appraisal
  updateAppraisal: async (id: number, appraisal: Partial<InsertAppraisal>): Promise<Appraisal> => {
    return apiRequest(`/api/appraisals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(appraisal),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  // Delete an appraisal
  deleteAppraisal: async (id: number): Promise<void> => {
    await apiRequest(`/api/appraisals/${id}`, {
      method: 'DELETE'
    });
    
    // Invalidate appraisals cache
    queryClient.invalidateQueries({ queryKey: ['/api/appraisals'] });
  },
  
  // Get appraisals for a specific property
  getAppraisalsByProperty: async (propertyId: number): Promise<Appraisal[]> => {
    return apiRequest(`/api/properties/${propertyId}/appraisals`);
  },
  
  // Get appraisals by appraiser ID
  getAppraisalsByAppraiser: async (appraiserId: number): Promise<Appraisal[]> => {
    return apiRequest(`/api/appraisals?appraiserId=${appraiserId}`);
  },
  
  // Submit an appraisal for review
  submitForReview: async (id: number): Promise<Appraisal> => {
    return apiRequest(`/api/appraisals/${id}/submit`, {
      method: 'POST'
    });
  },
  
  // Approve an appraisal
  approveAppraisal: async (id: number, comments?: string): Promise<Appraisal> => {
    return apiRequest(`/api/appraisals/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ comments }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  // Get attachments for an appraisal
  getAppraisalAttachments: async (appraisalId: number): Promise<Attachment[]> => {
    return apiRequest(`/api/appraisals/${appraisalId}/attachments`);
  }
};

// API endpoints for Comparables
export const comparableApi = {
  // Get all comparables
  getComparables: async (): Promise<Comparable[]> => {
    return apiRequest('/api/comparables');
  },
  
  // Get a single comparable by ID
  getComparable: async (id: number): Promise<Comparable> => {
    return apiRequest(`/api/comparables/${id}`);
  },
  
  // Create a new comparable
  createComparable: async (comparable: InsertComparable): Promise<Comparable> => {
    return apiRequest('/api/comparables', {
      method: 'POST',
      body: JSON.stringify(comparable),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  // Update a comparable
  updateComparable: async (id: number, comparable: Partial<InsertComparable>): Promise<Comparable> => {
    return apiRequest(`/api/comparables/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(comparable),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  // Delete a comparable
  deleteComparable: async (id: number): Promise<void> => {
    await apiRequest(`/api/comparables/${id}`, {
      method: 'DELETE'
    });
    
    // Invalidate comparables cache
    queryClient.invalidateQueries({ queryKey: ['/api/comparables'] });
  },
  
  // Get comparables for a specific appraisal
  getComparablesByAppraisal: async (appraisalId: number): Promise<Comparable[]> => {
    return apiRequest(`/api/appraisals/${appraisalId}/comparables`);
  },
  
  // Search for comparable properties
  searchComparables: async (params: {
    propertyType?: string;
    city?: string;
    zip?: string;
    minPrice?: number;
    maxPrice?: number;
    minSqFt?: number;
    maxSqFt?: number;
    radius?: number;
    lat?: number;
    lng?: number;
  }): Promise<Comparable[]> => {
    const queryParams = new URLSearchParams();
    
    // Add all defined parameters to the query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiRequest(`/api/comparables/search?${queryParams.toString()}`);
  }
};

// API endpoints for Users and Team Management
export const userApi = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    return apiRequest('/api/users');
  },
  
  // Get a single user by ID
  getUser: async (id: number): Promise<User> => {
    return apiRequest(`/api/users/${id}`);
  },
  
  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    return apiRequest('/api/users/me');
  },
  
  // Create a new user
  createUser: async (user: InsertUser): Promise<User> => {
    return apiRequest('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  // Update a user
  updateUser: async (id: number, user: Partial<InsertUser>): Promise<User> => {
    return apiRequest(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  // Delete a user
  deleteUser: async (id: number): Promise<void> => {
    await apiRequest(`/api/users/${id}`, {
      method: 'DELETE'
    });
    
    // Invalidate users cache
    queryClient.invalidateQueries({ queryKey: ['/api/users'] });
  },
  
  // Get appraisals assigned to a user
  getUserAppraisals: async (userId: number): Promise<Appraisal[]> => {
    return apiRequest(`/api/users/${userId}/appraisals`);
  },
  
  // Send an invitation to join the team
  sendInvitation: async (email: string, role: string, message?: string): Promise<void> => {
    return apiRequest('/api/invitations', {
      method: 'POST',
      body: JSON.stringify({ email, role, message }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  // Get all pending invitations
  getInvitations: async (): Promise<any[]> => {
    return apiRequest('/api/invitations');
  },
  
  // Cancel an invitation
  cancelInvitation: async (id: number): Promise<void> => {
    await apiRequest(`/api/invitations/${id}/cancel`, {
      method: 'POST'
    });
    
    // Invalidate invitations cache
    queryClient.invalidateQueries({ queryKey: ['/api/invitations'] });
  }
};

// API endpoints for Market Data
export const marketDataApi = {
  // Get market data for a location
  getMarketData: async (location: string, period?: string): Promise<MarketData[]> => {
    const queryParams = new URLSearchParams({ location });
    if (period) {
      queryParams.append('period', period);
    }
    
    return apiRequest(`/api/market-data?${queryParams.toString()}`);
  },
  
  // Get price trends
  getPriceTrends: async (location: string, startDate?: string, endDate?: string): Promise<any[]> => {
    const queryParams = new URLSearchParams({ location });
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    return apiRequest(`/api/market-data/price-trends?${queryParams.toString()}`);
  },
  
  // Get days on market trends
  getDaysOnMarketTrends: async (location: string, startDate?: string, endDate?: string): Promise<any[]> => {
    const queryParams = new URLSearchParams({ location });
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    return apiRequest(`/api/market-data/dom-trends?${queryParams.toString()}`);
  },
  
  // Get sales volume trends
  getSalesVolumeTrends: async (location: string, startDate?: string, endDate?: string): Promise<any[]> => {
    const queryParams = new URLSearchParams({ location });
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    return apiRequest(`/api/market-data/sales-trends?${queryParams.toString()}`);
  },
  
  // Get property type distribution
  getPropertyTypeDistribution: async (location: string): Promise<any[]> => {
    return apiRequest(`/api/market-data/property-types?location=${encodeURIComponent(location)}`);
  },
  
  // Get neighborhood price comparison
  getNeighborhoodPrices: async (location: string): Promise<any[]> => {
    return apiRequest(`/api/market-data/neighborhood-prices?location=${encodeURIComponent(location)}`);
  }
};

// API endpoints for Reports
export const reportApi = {
  // Generate an appraisal report
  generateReport: async (appraisalId: number, options?: {
    format?: 'pdf' | 'docx';
    sections?: string[];
    includeComparables?: boolean;
    includePhotos?: boolean;
    includeMarketAnalysis?: boolean;
  }): Promise<{ reportUrl: string }> => {
    return apiRequest(`/api/reports/generate/${appraisalId}`, {
      method: 'POST',
      body: JSON.stringify(options || {}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  // Get all generated reports
  getReports: async (): Promise<any[]> => {
    return apiRequest('/api/reports');
  },
  
  // Get report templates
  getReportTemplates: async (): Promise<any[]> => {
    return apiRequest('/api/reports/templates');
  },
  
  // Get a single report by ID
  getReport: async (id: number): Promise<any> => {
    return apiRequest(`/api/reports/${id}`);
  }
};

// API endpoints for Attachments
export const attachmentApi = {
  // Upload an attachment
  uploadAttachment: async (
    file: File, 
    type: 'property' | 'appraisal', 
    id: number,
    category?: string
  ): Promise<Attachment> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('id', id.toString());
    if (category) {
      formData.append('category', category);
    }
    
    return apiRequest('/api/attachments/upload', {
      method: 'POST',
      body: formData
    });
  },
  
  // Get an attachment
  getAttachment: async (id: number): Promise<Attachment> => {
    return apiRequest(`/api/attachments/${id}`);
  },
  
  // Delete an attachment
  deleteAttachment: async (id: number): Promise<void> => {
    await apiRequest(`/api/attachments/${id}`, {
      method: 'DELETE'
    });
    
    // Invalidate attachments cache
    queryClient.invalidateQueries({ queryKey: ['/api/attachments'] });
  }
};

// Export all API endpoints
export default {
  property: propertyApi,
  appraisal: appraisalApi,
  comparable: comparableApi,
  user: userApi,
  marketData: marketDataApi,
  report: reportApi,
  attachment: attachmentApi
};