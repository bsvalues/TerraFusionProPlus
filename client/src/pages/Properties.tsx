import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, Search } from 'lucide-react';

interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  yearBuilt: number;
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
  lotSize: number;
  lastSalePrice: number;
  lastSaleDate: string;
}

export const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/properties')
      .then(response => response.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching properties:', error);
        setLoading(false);
      });
  }, []);

  const filteredProperties = properties.filter(property => 
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.propertyType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Properties</h1>
          <p className="text-gray-600 mt-1">Manage your property portfolio</p>
        </div>
        <Link 
          to="/properties/new" 
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Property
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search properties..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <Link to={`/properties/${property.id}`} key={property.id} className="property-card block">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-200 h-40 flex items-center justify-center">
                  <Building2 size={60} className="text-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{property.address}</h3>
                  <p className="text-gray-600">{property.city}, {property.state} {property.zipCode}</p>
                  <div className="mt-3 flex justify-between">
                    <div>
                      <span className="text-sm text-gray-500">{property.propertyType}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-blue-600">${property.lastSalePrice.toLocaleString()}</span>
                      <div className="text-xs text-gray-500">Last Sale: {new Date(property.lastSaleDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">{property.bedrooms}</span> bed
                    </div>
                    <div>
                      <span className="font-medium">{property.bathrooms}</span> bath
                    </div>
                    <div>
                      <span className="font-medium">{property.squareFeet.toLocaleString()}</span> sqft
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building2 size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-800">No properties found</h3>
          <p className="text-gray-600 mt-1">Try adjusting your search or add a new property.</p>
          <Link 
            to="/properties/new" 
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Add Property
          </Link>
        </div>
      )}
    </div>
  );
};