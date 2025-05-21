import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Property } from '../types/schema';
import { ArrowLeft, Edit, Home, Building } from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Property not found');
          } else {
            throw new Error(`Failed to fetch property: ${response.status}`);
          }
        }
        
        const data = await response.json();
        setProperty(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err instanceof Error ? err.message : 'Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <Link to="/properties" className="mt-4 inline-block text-blue-600 hover:underline">
            <ArrowLeft className="inline-block mr-1 h-4 w-4" />
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <h2 className="text-xl font-bold mb-2">Property Not Found</h2>
          <p>The property you're looking for could not be found.</p>
          <Link to="/properties" className="mt-4 inline-block text-blue-600 hover:underline">
            <ArrowLeft className="inline-block mr-1 h-4 w-4" />
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Home className="h-6 w-6 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">{property.address}</h1>
            </div>
            <div className="flex space-x-2">
              <Link 
                to="/properties"
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
              <Link 
                to={`/properties/${property.id}/edit`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </div>
          </div>
          <p className="text-gray-600 mt-1">
            {property.city}, {property.state} {property.zip_code}
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">Property Details</h3>
              <div className="flex justify-between border-b border-gray-200 py-2">
                <span className="text-gray-600">Property Type</span>
                <span className="font-medium">{property.property_type}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-2">
                <span className="text-gray-600">Year Built</span>
                <span className="font-medium">{property.year_built || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-2">
                <span className="text-gray-600">Square Feet</span>
                <span className="font-medium">{property.square_feet ? `${property.square_feet.toLocaleString()} sq ft` : 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-2">
                <span className="text-gray-600">Lot Size</span>
                <span className="font-medium">
                  {property.lot_size ? `${property.lot_size.toLocaleString()} sq ft` : 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">Features</h3>
              <div className="flex justify-between border-b border-gray-200 py-2">
                <span className="text-gray-600">Bedrooms</span>
                <span className="font-medium">{property.bedrooms || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-2">
                <span className="text-gray-600">Bathrooms</span>
                <span className="font-medium">{property.bathrooms || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-2">
                <span className="text-gray-600">Zoning</span>
                <span className="font-medium">{property.zoning || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-2">
                <span className="text-gray-600">Parcel Number</span>
                <span className="font-medium">{property.parcel_number || 'N/A'}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">Additional Information</h3>
              <div className="flex justify-between border-b border-gray-200 py-2">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">
                  {new Date(property.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-2">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">
                  {new Date(property.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          {property.description && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Description</h3>
              <p className="text-gray-600">{property.description}</p>
            </div>
          )}
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                Appraisals
              </div>
            </h3>
            <p className="text-gray-600">
              No appraisals found for this property.
              <Link to={`/appraisals/new?propertyId=${property.id}`} className="ml-2 text-blue-600 hover:underline">
                Create New Appraisal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;