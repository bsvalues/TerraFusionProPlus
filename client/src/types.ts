// Define types for the core entities in our application

// User-related types
export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// Property-related types
export type Property = {
  id: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  year_built: number;
  square_feet: number;
  bedrooms: number;
  bathrooms: number;
  lot_size: number;
  description?: string;
  created_at: string;
  updated_at: string;
  parcel_number?: string;
  zoning?: string;
  latitude?: number;
  longitude?: number;
  features?: Record<string, any>;
};

// Appraisal-related types
export type Appraisal = {
  id: number;
  propertyId: number;
  appraiserId: number;
  status: string;
  purpose: string;
  marketValue: number | null;
  createdAt: string;
  completedAt: string | null;
  inspectionDate: string | null;
  effectiveDate: string | null;
  reportType: string | null;
  clientName: string | null;
  clientEmail: string | null;
  clientPhone: string | null;
  lenderName: string | null;
  loanNumber: string | null;
  intendedUse: string | null;
  valuationMethod: string | null;
  scopeOfWork: string | null;
  notes: string | null;
};

// Comparable-related types
export type Comparable = {
  id: number;
  appraisalId: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  salePrice: number;
  saleDate: string;
  squareFeet: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  propertyType: string;
  lotSize?: number;
  condition?: string;
  daysOnMarket?: number;
  source?: string;
  adjustedPrice?: number;
  adjustmentNotes?: string;
  createdAt: string;
};

// Adjustment-related types
export type Adjustment = {
  id: number;
  comparableId: number;
  category: string;
  description: string;
  amount: number;
  isPercentage: boolean;
  notes?: string;
  createdAt: string;
};

// Attachment-related types
export type Attachment = {
  id: number;
  propertyId?: number;
  appraisalId?: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: number;
  category?: string;
  description?: string;
  uploadDate: string;
};

// Market data-related types
export type MarketData = {
  id: number;
  location: string;
  dataType: string;
  time: string;
  value: number;
  comparisonValue?: number;
  percentChange?: number;
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

// Special types for market analysis
export type PriceTrendDataPoint = {
  month: string;
  value: number;
  year: number;
};

export type DomTrendDataPoint = {
  month: string;
  days: number;
  year: number;
};

export type SalesTrendDataPoint = {
  month: string;
  sales: number;
  year: number;
};

export type PropertyTypeDataPoint = {
  name: string;
  value: number;
};

export type NeighborhoodPriceDataPoint = {
  name: string;
  medianPrice: number;
  pricePerSqft: number;
};

// Types for report generation
export type Report = {
  id: number;
  name: string;
  property: {
    address: string;
    type: string;
  };
  createdBy: string;
  date: string;
  status: 'Final' | 'Draft' | 'In Review' | 'Archived';
  type: string;
};

export type ReportTemplate = {
  id: number;
  name: string;
  description: string;
  isSelected: boolean;
};

export type ReportOption = {
  id: string;
  name: string;
  description?: string;
  type: 'select' | 'toggle';
  options?: string[];
  value: string | boolean;
};