import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, Search, Home as HomeIcon, MapPin } from 'lucide-react';

// Updated property interface to match our database structure
interface Property {
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
}

export const Properties = () => {
  const [properties, setProperties] = useState([]);
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
    property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.property_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get property image or icon
  const getPropertyIcon = (propertyType) => {
    switch(propertyType?.toLowerCase()) {
      case 'single family':
        return <HomeIcon size={60} className="text-blue-400" />;
      case 'condo':
        return <Building2 size={60} className="text-green-400" />;
      case 'multi-family':
        return <Building2 size={60} className="text-purple-400" />;
      default:
        return <Building2 size={60} className="text-gray-400" />;
    }
  };

  // Format price display
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `$${parseInt(price).toLocaleString()}`;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Properties</h1>
          <p className="text-gray-600 mt-1">Manage your real estate portfolio</p>
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
            placeholder="Search by address, city, state, or property type..."
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
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 h-40 flex items-center justify-center">
                  {getPropertyIcon(property.property_type)}
                </div>
                <div className="p-4">
                  <div className="flex items-start">
                    <MapPin size={16} className="text-red-500 mt-1 mr-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{property.address}</h3>
                      <p className="text-gray-600">{property.city}, {property.state} {property.zip_code}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-between">
                    <div>
                      <span className="text-sm font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                        {property.property_type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-gray-600">
                    <div className="text-center p-1 bg-gray-50 rounded">
                      <span className="font-medium block text-gray-800">{property.bedrooms || 'N/A'}</span>
                      <span className="text-xs">Beds</span>
                    </div>
                    <div className="text-center p-1 bg-gray-50 rounded">
                      <span className="font-medium block text-gray-800">{property.bathrooms || 'N/A'}</span>
                      <span className="text-xs">Baths</span>
                    </div>
                    <div className="text-center p-1 bg-gray-50 rounded">
                      <span className="font-medium block text-gray-800">{property.square_feet ? property.square_feet.toLocaleString() : 'N/A'}</span>
                      <span className="text-xs">Sq.Ft</span>
                    </div>
                  </div>
                  
                  {property.year_built && (
                    <div className="mt-2 text-xs text-gray-500">
                      Year Built: {property.year_built}
                    </div>
                  )}
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