import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/query-client';
import { Home, MapPin, Calendar, DollarSign, Search } from 'lucide-react';

type Property = {
  id: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  yearBuilt?: number;
  lastAppraisalDate?: string;
  lastAppraisalValue?: number;
  createdAt: string;
};

function PropertyCard({ property }: { property: Property }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not appraised';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 bg-gray-200 relative">
        {/* Property type badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
            {property.propertyType}
          </span>
        </div>
        
        {/* This would be a property image in a real app */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <Home size={40} />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 truncate">
          <Link to={`/properties/${property.id}`} className="hover:text-blue-600">
            {property.address}
          </Link>
        </h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin size={14} className="mr-1" />
          <span>{property.city}, {property.state} {property.zipCode}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          {property.bedrooms && (
            <div>
              <span className="text-gray-500">Bedrooms</span>
              <p className="font-medium">{property.bedrooms}</p>
            </div>
          )}
          
          {property.bathrooms && (
            <div>
              <span className="text-gray-500">Bathrooms</span>
              <p className="font-medium">{property.bathrooms}</p>
            </div>
          )}
          
          {property.squareFeet && (
            <div>
              <span className="text-gray-500">Square Feet</span>
              <p className="font-medium">{property.squareFeet} sq ft</p>
            </div>
          )}
          
          {property.yearBuilt && (
            <div>
              <span className="text-gray-500">Year Built</span>
              <p className="font-medium">{property.yearBuilt}</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center text-sm">
            <Calendar size={14} className="mr-1 text-gray-400" />
            <span className="text-gray-500">Last appraisal: {formatDate(property.lastAppraisalDate)}</span>
          </div>
          
          {property.lastAppraisalValue && (
            <div className="font-bold text-green-600 flex items-center">
              <DollarSign size={14} className="mr-1" />
              {formatCurrency(property.lastAppraisalValue)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Properties() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/properties', searchTerm],
    queryFn: () => {
      const endpoint = searchTerm 
        ? `/properties?search=${encodeURIComponent(searchTerm)}` 
        : '/properties';
      return apiRequest<Property[]>(endpoint);
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search will be triggered automatically due to the query key change
  };

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-pulse text-gray-500">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    // Fallback data for development
    console.error('Error fetching properties:', error);
  }

  // Fallback for development
  const properties = data || [
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
      lastAppraisalDate: '2023-03-15',
      lastAppraisalValue: 450000,
      createdAt: '2023-01-10',
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
      lastAppraisalDate: '2023-02-20',
      lastAppraisalValue: 425000,
      createdAt: '2023-01-15',
    }
  ];

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        
        <Link to="/properties/new" className="btn btn-primary flex items-center">
          <span className="mr-2">Add Property</span>
          <span>+</span>
        </Link>
      </div>
      
      {/* Search and filter bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
        <form onSubmit={handleSearch} className="flex">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by address, city, or zip code..."
              className="form-control pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary ml-2">
            Search
          </button>
        </form>
      </div>
      
      {/* Property grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      
      {properties.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-500">No properties found</h3>
          <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}

export default Properties;