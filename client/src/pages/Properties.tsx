import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Building, Search, Plus, Filter, MapPin } from 'lucide-react';
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
  lotSize: number;
  lastAppraisalDate?: string;
  lastAppraisalValue?: number;
}

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('');
  
  // Fetch properties data
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: () => apiRequest<Property[]>('/api/properties'),
    // In real app, we'd connect to the API
    // For now, we'll use mock data
    enabled: false,
  });
  
  // Mock data for demo purposes
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
      lotSize: 0.25,
      lastAppraisalDate: '2025-03-15',
      lastAppraisalValue: 450000,
    },
    {
      id: 2,
      address: '456 Oak Avenue',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      propertyType: 'Condominium',
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      yearBuilt: 2015,
      lotSize: 0,
      lastAppraisalDate: '2025-04-10',
      lastAppraisalValue: 320000,
    },
    {
      id: 3,
      address: '789 Pine Road',
      city: 'Houston',
      state: 'TX',
      zipCode: '77002',
      propertyType: 'Multi-Family',
      bedrooms: 6,
      bathrooms: 4,
      squareFeet: 3500,
      yearBuilt: 1995,
      lotSize: 0.5,
      lastAppraisalDate: '2025-02-20',
      lastAppraisalValue: 750000,
    },
    {
      id: 4,
      address: '234 Elm Street',
      city: 'San Antonio',
      state: 'TX',
      zipCode: '78205',
      propertyType: 'Commercial',
      bedrooms: 0,
      bathrooms: 2,
      squareFeet: 4200,
      yearBuilt: 2000,
      lotSize: 0.75,
      lastAppraisalDate: '2025-01-05',
      lastAppraisalValue: 925000,
    },
    {
      id: 5,
      address: '567 Cedar Lane',
      city: 'Fort Worth',
      state: 'TX',
      zipCode: '76102',
      propertyType: 'Land',
      bedrooms: 0,
      bathrooms: 0,
      squareFeet: 0,
      yearBuilt: 0,
      lotSize: 2.5,
    },
  ];
  
  // Property type options
  const propertyTypes = [
    'All Types',
    'Single Family',
    'Condominium',
    'Multi-Family',
    'Commercial',
    'Land',
  ];
  
  // Filter properties based on search term and property type
  const filteredProperties = mockProperties.filter(property => {
    const matchesSearch = 
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.zipCode.includes(searchTerm);
    
    const matchesType = 
      propertyTypeFilter === '' || 
      propertyTypeFilter === 'All Types' || 
      property.propertyType === propertyTypeFilter;
    
    return matchesSearch && matchesType;
  });
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
        <Link 
          to="/properties/new" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Link>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search properties by address, city, or ZIP code..."
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full sm:w-auto">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-auto appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
            >
              <option value="">All Property Types</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Property grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Link 
            key={property.id} 
            to={`/properties/${property.id}`}
            className="property-card block border rounded-lg overflow-hidden bg-card hover:border-primary"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-1 line-clamp-1">{property.address}</h2>
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
                    {property.city}, {property.state} {property.zipCode}
                  </div>
                </div>
                <div className="bg-primary/10 p-2 rounded">
                  <Building className="h-5 w-5 text-primary" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Property Type</p>
                  <p className="font-medium">{property.propertyType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Square Feet</p>
                  <p className="font-medium">
                    {property.squareFeet === 0 ? 'N/A' : property.squareFeet.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Year Built</p>
                  <p className="font-medium">
                    {property.yearBuilt === 0 ? 'N/A' : property.yearBuilt}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Lot Size</p>
                  <p className="font-medium">
                    {property.lotSize === 0 ? 'N/A' : `${property.lotSize} acres`}
                  </p>
                </div>
              </div>
              
              {property.lastAppraisalValue ? (
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground">Last Appraised Value</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-primary">
                      {formatCurrency(property.lastAppraisalValue)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {property.lastAppraisalDate ? 
                        new Date(property.lastAppraisalDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-t pt-4">
                  <p className="text-muted-foreground text-sm">No appraisals yet</p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredProperties.length === 0 && (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No properties found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || propertyTypeFilter ? 
              'Try adjusting your search filters.' : 
              'Get started by adding your first property.'}
          </p>
          <Link 
            to="/properties/new" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Link>
        </div>
      )}
    </div>
  );
};

export default Properties;