import React, { useState } from 'react';
import { PlusCircle, Search, Filter, ChevronDown, Building2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Property } from '../types';

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  // Fetch properties from API
  const { data: properties, isLoading, isError } = useQuery({
    queryKey: ['/api/properties'],
    retry: 1,
  });

  // Filter properties based on search term and filters
  const filteredProperties = properties?.filter((property: Property) => {
    const matchesSearch = 
      !searchTerm || 
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.zip_code.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesPropertyType = 
      selectedPropertyTypes.length === 0 || 
      selectedPropertyTypes.includes(property.property_type);
      
    const matchesState = 
      selectedStates.length === 0 || 
      selectedStates.includes(property.state);
      
    return matchesSearch && matchesPropertyType && matchesState;
  });

  // Toggle property type selection
  const togglePropertyType = (type: string) => {
    if (selectedPropertyTypes.includes(type)) {
      setSelectedPropertyTypes(selectedPropertyTypes.filter(t => t !== type));
    } else {
      setSelectedPropertyTypes([...selectedPropertyTypes, type]);
    }
  };

  // Toggle state selection
  const toggleState = (state: string) => {
    if (selectedStates.includes(state)) {
      setSelectedStates(selectedStates.filter(s => s !== state));
    } else {
      setSelectedStates([...selectedStates, state]);
    }
  };

  // Property type options (could be fetched from API in the future)
  const propertyTypes = [
    'Single Family',
    'Condo',
    'Multi-Family',
    'Townhouse',
    'Land',
    'Commercial'
  ];

  // State options (could be fetched from API in the future)
  const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Properties</h1>
          <p className="text-gray-600 mt-1">Manage your property database</p>
        </div>
        <button className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <PlusCircle size={18} className="mr-2" />
          Add New Property
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search properties by address, city, or zip code..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none"
            >
              <Filter size={18} className="mr-2 text-gray-500" />
              Filters
              <ChevronDown size={18} className="ml-2 text-gray-500" />
            </button>
            
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 p-4">
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Property Type</h3>
                  <div className="space-y-2">
                    {propertyTypes.map(type => (
                      <div key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`type-${type}`}
                          checked={selectedPropertyTypes.includes(type)}
                          onChange={() => togglePropertyType(type)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">State</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {states.map(state => (
                      <div key={state} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`state-${state}`}
                          checked={selectedStates.includes(state)}
                          onChange={() => toggleState(state)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`state-${state}`} className="ml-2 text-sm text-gray-700">
                          {state}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Properties grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error loading properties. Please try again later.
        </div>
      ) : filteredProperties?.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedPropertyTypes.length > 0 || selectedStates.length > 0
              ? "No properties match your search criteria. Try adjusting your filters."
              : "There are no properties in the database yet. Add your first property to get started."}
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center">
            <PlusCircle size={18} className="mr-2" />
            Add New Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties?.map((property: Property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Property image (placeholder) */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Building2 size={48} className="text-gray-400" />
              </div>
              
              {/* Property details */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{property.address}</h3>
                <p className="text-gray-600 mb-3">
                  {property.city}, {property.state} {property.zip_code}
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <span className="text-xs text-gray-500">Property Type</span>
                    <p className="font-medium">{property.property_type}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Year Built</span>
                    <p className="font-medium">{property.year_built}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Square Feet</span>
                    <p className="font-medium">{property.square_feet.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Bed/Bath</span>
                    <p className="font-medium">{property.bedrooms} bed / {property.bathrooms} bath</p>
                  </div>
                </div>
                
                <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                  View Property Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;