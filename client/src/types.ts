// Property types
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
  created_by?: number;
};

export type InsertProperty = Omit<Property, 'id' | 'created_at' | 'updated_at'>;

// Appraisal types
export type Appraisal = {
  id: number;
  property_id: number;
  appraiser_id: number;
  status: string;
  purpose: string;
  market_value: number | null;
  created_at: string;
  completed_at: string | null;
  inspection_date: string | null;
  effective_date: string | null;
  report_type: string | null;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  lender_name: string | null;
  loan_number: string | null;
  intended_use: string | null;
  valuation_method: string | null;
  scope_of_work: string | null;
  notes: string | null;
};

export type InsertAppraisal = Omit<Appraisal, 'id' | 'created_at' | 'completed_at'>;

// Comparable types
export type Comparable = {
  id: number;
  appraisal_id: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  sale_price: number;
  sale_date: string;
  square_feet: number;
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
  created_at: string;
};

export type InsertComparable = Omit<Comparable, 'id' | 'created_at'>;

// Adjustment types
export type Adjustment = {
  id: number;
  comparable_id: number;
  category: string;
  description: string;
  amount: number;
  is_percentage: boolean;
  notes?: string;
  created_at: string;
};

export type InsertAdjustment = Omit<Adjustment, 'id' | 'created_at'>;

// User types
export type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type InsertUser = Omit<User, 'id' | 'created_at' | 'updated_at'>;

// Attachment types
export type Attachment = {
  id: number;
  property_id?: number;
  appraisal_id?: number;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  uploaded_by: number;
  category?: string;
  description?: string;
  upload_date: string;
};

export type InsertAttachment = Omit<Attachment, 'id' | 'upload_date'>;

// Market data types
export type MarketData = {
  id: number;
  location: string;
  data_type: string;
  time: string; 
  value: number;
  comparison_value?: number;
  percent_change?: number;
  source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type InsertMarketData = Omit<MarketData, 'id' | 'created_at' | 'updated_at'>;

// UI-specific types for visualization data
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