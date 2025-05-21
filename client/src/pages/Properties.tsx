import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  Plus, 
  SlidersHorizontal,
  Home,
  MapPin,
  Building,
  Calendar,
  Filter,
  CheckSquare,
  X,
  DownloadCloud
} from 'lucide-react';
import { apiRequest } from '../lib/query-client';

interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  lastAppraisalDate?: string;
  lastAppraisalValue?: number;
  createdAt: string;
}

interface FilterOptions {
  propertyType: string[];
  yearBuiltRange: [number | null, number | null];
  squareFeetRange: [number | null, number | null];
  appraisalDateRange: [string | null, string | null];
}

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    propertyType: [],
    yearBuiltRange: [null, null],
    squareFeetRange: [null, null],
    appraisalDateRange: [null, null],
  });
  
  // In a real app, this would fetch from the API
  const { data: properties, isLoading } = useQuery({
    queryKey: ['/api/properties', searchTerm, filters],
    queryFn: () => apiRequest<Property[]>(`/api/properties?search=${searchTerm}`),
    // For demo purposes, disable this query and use mock data instead
    enabled: false,
  });
  
  // Mock data
  const mockProperties: Property[] = [
    {
      id: 1,
      address: '123 Main Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      propertyType: 'Single Family',
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1850,
      yearBuilt: 2005,
      lastAppraisalDate: '2025-03-15',
      lastAppraisalValue: 450000,
      createdAt: '2025-01-10T14:30:00Z',
    },
    {
      id: 2,
      address: '456 Oak Drive',
      city: 'Austin',
      state: 'TX',
      zipCode: '78704',
      propertyType: 'Townhouse',
      bedrooms: 2,
      bathrooms: 2.5,
      squareFeet: 1650,
      yearBuilt: 2010,
      lastAppraisalDate: '2025-02-20',
      lastAppraisalValue: 425000,
      createdAt: '2025-01-15T09:45:00Z',
    },
    {
      id: 3,
      address: '789 Pine Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      propertyType: 'Condominium',
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 950,
      yearBuilt: 2018,
      lastAppraisalDate: '2025-01-05',
      lastAppraisalValue: 320000,
      createdAt: '2025-01-20T11:20:00Z',
    },
    {
      id: 4,
      address: '321 Cedar Lane',
      city: 'Austin',
      state: 'TX',
      zipCode: '78702',
      propertyType: 'Multi-Family',
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 2400,
      yearBuilt: 2000,
      lastAppraisalDate: '2025-04-10',
      lastAppraisalValue: 550000,
      createdAt: '2025-02-05T16:15:00Z',
    },
    {
      id: 5,
      address: '555 Maple Avenue',
      city: 'Austin',
      state: 'TX',
      zipCode: '78705',
      propertyType: 'Single Family',
      bedrooms: 4,
      bathrooms: 3.5,
      squareFeet: 2800,
      yearBuilt: 1995,
      lastAppraisalDate: '2025-04-25',
      lastAppraisalValue: 675000,
      createdAt: '2025-02-12T10:30:00Z',
    },
    {
      id: 6,
      address: '777 Walnut Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '78703',
      propertyType: 'Duplex',
      bedrooms: 6,
      bathrooms: 4,
      squareFeet: 3200,
      yearBuilt: 1998,
      lastAppraisalDate: '2025-05-01',
      lastAppraisalValue: 780000,
      createdAt: '2025-02-18T13:45:00Z',
    },
    {
      id: 7,
      address: '888 Birch Boulevard',
      city: 'Austin',
      state: 'TX',
      zipCode: '78704',
      propertyType: 'Townhouse',
      bedrooms: 3,
      bathrooms: 2.5,
      squareFeet: 1750,
      yearBuilt: 2012,
      lastAppraisalDate: '2025-03-28',
      lastAppraisalValue: 495000,
      createdAt: '2025-03-01T09:15:00Z',
    },
    {
      id: 8,
      address: '999 Elm Court',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      propertyType: 'Condominium',
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      yearBuilt: 2015,
      lastAppraisalDate: '2025-02-15',
      lastAppraisalValue: 395000,
      createdAt: '2025-03-10T11:30:00Z',
    },
  ];
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  const togglePropertyTypeFilter = (type: string) => {
    setFilters(prev => {
      if (prev.propertyType.includes(type)) {
        return {
          ...prev,
          propertyType: prev.propertyType.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          propertyType: [...prev.propertyType, type]
        };
      }
    });
  };
  
  const resetFilters = () => {
    setFilters({
      propertyType: [],
      yearBuiltRange: [null, null],
      squareFeetRange: [null, null],
      appraisalDateRange: [null, null],
    });
  };
  
  // Filter properties based on search term and filters
  const filteredProperties = mockProperties.filter(property => {
    // Search filter
    if (searchTerm && !property.address.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !property.city.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !property.zipCode.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !property.propertyType.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Property type filter
    if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.propertyType)) {
      return false;
    }
    
    // Year built range filter
    if (filters.yearBuiltRange[0] !== null && property.yearBuilt < filters.yearBuiltRange[0]) {
      return false;
    }
    if (filters.yearBuiltRange[1] !== null && property.yearBuilt > filters.yearBuiltRange[1]) {
      return false;
    }
    
    // Square feet range filter
    if (filters.squareFeetRange[0] !== null && property.squareFeet < filters.squareFeetRange[0]) {
      return false;
    }
    if (filters.squareFeetRange[1] !== null && property.squareFeet > filters.squareFeetRange[1]) {
      return false;
    }
    
    // Appraisal date range filter is more complex since the date could be null
    if (filters.appraisalDateRange[0] !== null && 
        (!property.lastAppraisalDate || new Date(property.lastAppraisalDate) < new Date(filters.appraisalDateRange[0]))) {
      return false;
    }
    if (filters.appraisalDateRange[1] !== null && 
        (!property.lastAppraisalDate || new Date(property.lastAppraisalDate) > new Date(filters.appraisalDateRange[1]))) {
      return false;
    }
    
    return true;
  });
  
  const propertyTypes = Array.from(new Set(mockProperties.map(p => p.propertyType)));
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters {filters.propertyType.length > 0 ? `(${filters.propertyType.length})` : ''}
          </button>
          
          <button 
            className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
          >
            <DownloadCloud className="h-4 w-4" />
            Export
          </button>
          
          <Link
            to="/properties/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Link>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by address, city, zip code, or property type..."
          className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Filter panel */}
      {showFilters && (
        <div className="rounded-lg border bg-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={resetFilters}
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Reset filters
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Property Type</h3>
              <div className="flex flex-wrap gap-2">
                {propertyTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => togglePropertyTypeFilter(type)}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      filters.propertyType.includes(type) 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Year Built</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-1 border rounded-md text-sm"
                    value={filters.yearBuiltRange[0] || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      yearBuiltRange: [e.target.value ? parseInt(e.target.value) : null, prev.yearBuiltRange[1]]
                    }))}
                  />
                  <span className="text-muted-foreground">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-1 border rounded-md text-sm"
                    value={filters.yearBuiltRange[1] || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      yearBuiltRange: [prev.yearBuiltRange[0], e.target.value ? parseInt(e.target.value) : null]
                    }))}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Square Feet</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-1 border rounded-md text-sm"
                    value={filters.squareFeetRange[0] || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      squareFeetRange: [e.target.value ? parseInt(e.target.value) : null, prev.squareFeetRange[1]]
                    }))}
                  />
                  <span className="text-muted-foreground">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-1 border rounded-md text-sm"
                    value={filters.squareFeetRange[1] || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      squareFeetRange: [prev.squareFeetRange[0], e.target.value ? parseInt(e.target.value) : null]
                    }))}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Last Appraisal Date</h3>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="w-full px-3 py-1 border rounded-md text-sm"
                    value={filters.appraisalDateRange[0] || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      appraisalDateRange: [e.target.value || null, prev.appraisalDateRange[1]]
                    }))}
                  />
                  <span className="text-muted-foreground">-</span>
                  <input
                    type="date"
                    className="w-full px-3 py-1 border rounded-md text-sm"
                    value={filters.appraisalDateRange[1] || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      appraisalDateRange: [prev.appraisalDateRange[0], e.target.value || null]
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Property list */}
      {filteredProperties.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <Link
              key={property.id}
              to={`/properties/${property.id}`}
              className="group rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-36 bg-muted relative">
                {/* In a real app, this would be an image of the property */}
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <Home className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-0.5 text-xs font-medium">
                  {property.propertyType}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium truncate group-hover:text-primary transition-colors">{property.address}</h3>
                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{property.city}, {property.state} {property.zipCode}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Beds</span>
                    <p>{property.bedrooms}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Baths</span>
                    <p>{property.bathrooms}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sq Ft</span>
                    <p>{property.squareFeet.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Year</span>
                    <p>{property.yearBuilt}</p>
                  </div>
                </div>
                {property.lastAppraisalValue && (
                  <div className="mt-3 pt-3 border-t flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground">Last Appraised Value</span>
                      <p className="font-medium">{formatCurrency(property.lastAppraisalValue)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Appraisal Date</span>
                      <p className="text-sm">{formatDate(property.lastAppraisalDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Home className="h-8 w-8 text-muted-foreground/70" />
          </div>
          <h3 className="text-lg font-medium">No properties found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filter criteria
          </p>
          {(searchTerm || filters.propertyType.length > 0) && (
            <button
              onClick={() => {
                setSearchTerm('');
                resetFilters();
              }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
            >
              <X className="h-4 w-4" />
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Properties;