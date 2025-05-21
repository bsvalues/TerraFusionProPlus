// Type definitions based on the actual database schema

export type Property = {
  id: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  year_built?: number | null;
  square_feet?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  lot_size?: number | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
  parcel_number?: string | null;
  zoning?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  features?: Record<string, any> | null;
  created_by?: number | null;
};

export type Appraisal = {
  id: number;
  property_id: number;
  appraiser_id: number;
  status: string;
  created_at: string;
  completed_at?: string | null;
  purpose?: string | null;
  market_value?: number | null;
  valuation_method?: string | null;
  effective_date?: string | null;
  report_date?: string | null;
  comments?: string | null;
};

export type User = {
  id: number;
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  role: string;
  license_number?: string | null;
  company?: string | null;
  created_at: string;
};