import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../shared/schema';
import { ArrowUpDown, PlusCircle } from 'lucide-react';

// Properties component that fetches real data from the database
const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Link 
          to="/properties/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Property
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-md text-center">
          <p className="text-gray-600 mb-4">No properties found.</p>
          <p className="text-gray-600">
            Click on "Add New Property" to create your first property.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div 
              key={property.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{property.address}</h2>
                <p className="text-gray-600 mb-2">
                  {property.city}, {property.state} {property.zipCode}
                </p>
                <p className="text-gray-600 mb-4">
                  {property.propertyType} • {property.squareFeet} sq ft
                </p>
                <div className="flex space-x-2">
                  <Link
                    to={`/properties/${property.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/properties/${property.id}/edit`}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;