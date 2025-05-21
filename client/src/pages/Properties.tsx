import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Plus, Search, MapPin } from 'lucide-react';
import { Property } from '../types/schema';

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/properties');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch properties: ${response.status}`);
        }
        
        const data = await response.json();
        setProperties(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err instanceof Error ? err.message : 'Failed to load properties.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on search term
  const filteredProperties = properties.filter(property => {
    const searchFields = [
      property.address,
      property.city,
      property.state,
      property.zip_code,
      property.property_type,
      property.parcel_number
    ].filter(Boolean).join(' ').toLowerCase();
    
    return searchTerm === '' || searchFields.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Home className="mr-2 h-6 w-6 text-blue-600" />
          Properties
        </h1>
        <Link
          to="/properties/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Property
        </Link>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search properties by address, city, state, or property type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-8 rounded flex flex-col items-center">
          <div className="bg-yellow-100 p-3 rounded-full mb-4">
            <Home className="h-6 w-6 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Properties Found</h2>
          {searchTerm ? (
            <p>No properties match your search criteria. Try adjusting your search.</p>
          ) : (
            <p>No properties have been added yet. Click "Add Property" to create one.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Link
              key={property.id}
              to={`/properties/${property.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{property.address}</h2>
                <div className="flex items-start text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                  <span>
                    {property.city}, {property.state} {property.zip_code}
                  </span>
                </div>
                
                <div className="flex flex-wrap text-sm mt-3">
                  {property.property_type && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                      {property.property_type}
                    </span>
                  )}
                  {property.bedrooms && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                      {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
                    </span>
                  )}
                  {property.bathrooms && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                      {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
                    </span>
                  )}
                  {property.square_feet && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                      {property.square_feet.toLocaleString()} sq ft
                    </span>
                  )}
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <span className="text-blue-600 font-medium hover:underline">View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;