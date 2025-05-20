// Types imported from schema.ts
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: string;
  license_number?: string;
  phone?: string;
  created_at: Date;
  updated_at?: Date;
}

export interface InsertUser {
  username: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: string;
  license_number?: string;
  phone?: string;
}

export interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  year_built?: number;
  square_feet?: number;
  bedrooms?: number;
  bathrooms?: number;
  lot_size?: number;
  description?: string;
  parcel_number?: string;
  zoning?: string;
  latitude?: number;
  longitude?: number;
  features?: string[];
  created_at: Date;
  updated_at?: Date;
  owner_id?: number;
}

export interface InsertProperty {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  year_built?: number;
  square_feet?: number;
  bedrooms?: number;
  bathrooms?: number;
  lot_size?: number;
  description?: string;
  parcel_number?: string;
  zoning?: string;
  latitude?: number;
  longitude?: number;
  features?: string[];
  owner_id?: number;
}

export interface Appraisal {
  id: number;
  property_id: number;
  appraiser_id: number;
  status: string;
  purpose: string;
  market_value?: number;
  inspection_date?: Date;
  effective_date?: Date;
  report_type?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  lender_name?: string;
  loan_number?: string;
  intended_use?: string;
  valuation_method?: string;
  scope_of_work?: string;
  notes?: string;
  created_at: Date;
  updated_at?: Date;
  completed_at?: Date;
  property?: Property;
  appraiser?: User;
}

export interface InsertAppraisal {
  property_id: number;
  appraiser_id: number;
  status: string;
  purpose: string;
  market_value?: number;
  inspection_date?: Date;
  effective_date?: Date;
  report_type?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  lender_name?: string;
  loan_number?: string;
  intended_use?: string;
  valuation_method?: string;
  scope_of_work?: string;
  notes?: string;
}

export interface Comparable {
  id: number;
  appraisal_id: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  sale_price: number;
  sale_date: Date;
  square_feet?: number;
  bedrooms?: number;
  bathrooms?: number;
  year_built?: number;
  property_type: string;
  lot_size?: number;
  condition?: string;
  days_on_market?: number;
  source?: string;
  adjusted_price?: number;
  adjustment_notes?: string;
  created_at: Date;
  appraisal?: Appraisal;
}

export interface InsertComparable {
  appraisal_id: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  sale_price: number;
  sale_date: Date;
  square_feet?: number;
  bedrooms?: number;
  bathrooms?: number;
  year_built?: number;
  property_type: string;
  lot_size?: number;
  condition?: string;
  days_on_market?: number;
  source?: string;
  adjusted_price?: number;
  adjustment_notes?: string;
}

export interface Adjustment {
  id: number;
  comparable_id: number;
  factor: string;
  amount: number;
  description?: string;
  created_at: Date;
  comparable?: Comparable;
}

export interface InsertAdjustment {
  comparable_id: number;
  factor: string;
  amount: number;
  description?: string;
}

export interface Attachment {
  id: number;
  appraisal_id: number;
  file_name: string;
  file_type: string;
  file_path: string;
  description?: string;
  created_at: Date;
  appraisal?: Appraisal;
}

export interface InsertAttachment {
  appraisal_id: number;
  file_name: string;
  file_type: string;
  file_path: string;
  description?: string;
}

export interface MarketData {
  id: number;
  location: string;
  property_type: string;
  date: Date;
  median_price?: number;
  price_per_sqft?: number;
  days_on_market?: number;
  inventory_count?: number;
  sales_count?: number;
  new_listings?: number;
  source?: string;
  created_at: Date;
}

export interface InsertMarketData {
  location: string;
  property_type: string;
  date: Date;
  median_price?: number;
  price_per_sqft?: number;
  days_on_market?: number;
  inventory_count?: number;
  sales_count?: number;
  new_listings?: number;
  source?: string;
}

// Market data chart types
export interface PriceTrendDataPoint {
  month: string;
  value: number;
  year: number;
}

export interface DomTrendDataPoint {
  month: string;
  days: number;
  year: number;
}

export interface SalesTrendDataPoint {
  month: string;
  sales: number;
  year: number;
}

export interface PropertyTypeDataPoint {
  name: string;
  value: number;
}

export interface NeighborhoodPriceDataPoint {
  name: string;
  medianPrice: number;
  pricePerSqft: number;
}

// Valuation specific types
export interface ValuationInput {
  propertyId?: number;
  location: string;
  propertyType: string;
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  lotSize: number;
  condition: string;
  features: string[];
}

export interface ValuationResult {
  estimatedValue: number;
  valuePerSqft: number;
  confidence: number;
  comparables: Comparable[];
  adjustments: {
    locationAdjustment: number;
    conditionAdjustment: number;
    sizeAdjustment: number;
    featuresAdjustment: number;
    marketTrendsAdjustment: number;
  };
}