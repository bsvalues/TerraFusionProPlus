import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  Pencil, 
  ClipboardList,
  MapPin,
  Calendar,
  Home,
  Ruler,
  Bed,
  Bath,
  SquareAsterisk,
  DollarSign
} from 'lucide-react';

interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  lotSize?: number;
  lotSizeUnit?: string;
  lastAppraisalValue: number;
  lastAppraisalDate: string;
  description?: string;
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would be replaced with an API call in a real application
    const fetchProperty = () => {
      setLoading(true);
      
      // Mock data - in a real app, this would be an API call
      const mockProperties = [
        { 
          id: 1, 
          address: '123 Main St', 
          city: 'Austin',
          state: 'TX',
          zipCode: '78701',
          propertyType: 'Single Family',
          squareFeet: 2350,
          bedrooms: 4,
          bathrooms: 2.5,
          yearBuilt: 2008,
          lotSize: 0.25,
          lotSizeUnit: 'acres',
          lastAppraisalValue: 425000,
          lastAppraisalDate: '2024-12-10',
          description: 'Beautiful single-family home in a quiet neighborhood with updated kitchen and bathrooms. Features a spacious backyard with mature trees and a covered patio.'
        },
        { 
          id: 2, 
          address: '456 Oak Ave', 
          city: 'Dallas',
          state: 'TX',
          zipCode: '75201',
          propertyType: 'Condominium',
          squareFeet: 1850,
          bedrooms: 3,
          bathrooms: 2,
          yearBuilt: 2015,
          lastAppraisalValue: 512000,
          lastAppraisalDate: '2024-11-22',
          description: 'Modern condo in the heart of downtown with high-end finishes and appliances. Building amenities include a pool, fitness center, and 24-hour concierge.'
        },
        { 
          id: 3, 
          address: '789 Pine Blvd', 
          city: 'Houston',
          state: 'TX',
          zipCode: '77002',
          propertyType: 'Multi-Family',
          squareFeet: 3200,
          bedrooms: 5,
          bathrooms: 3,
          yearBuilt: 2002,
          lotSize: 0.15,
          lotSizeUnit: 'acres',
          lastAppraisalValue: 680000,
          lastAppraisalDate: '2024-12-05',
          description: 'Investment opportunity with two separate units. Main house features 3BR/2BA and the attached unit has 2BR/1BA. Both units recently renovated with separate utilities.'
        },
      ];
      
      const foundProperty = mockProperties.find(p => p.id.toString() === id);
      
      setTimeout(() => {
        setProperty(foundProperty || null);
        setLoading(false);
      }, 500); // Simulate network delay
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-3"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Property Not Found</h3>
        <p className="text-gray-500 mb-4">The property you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/properties"
          className="btn btn-outline inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/properties" className="text-primary-600 hover:text-primary-700 flex items-center mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Properties</span>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.address}</h1>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{property.city}, {property.state} {property.zipCode}</span>
            </div>
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-3">
            <Link
              to={`/properties/${id}/edit`}
              className="btn btn-outline flex items-center"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Property
            </Link>
            <Link
              to={`/appraisals/new?propertyId=${id}`}
              className="btn btn-primary flex items-center"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              New Appraisal
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <div className="bg-gray-100 h-60 rounded-t-lg flex items-center justify-center">
              <Building2 className="w-24 h-24 text-gray-400" />
            </div>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Property Details</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <Home className="w-4 h-4 mr-1" /> Type
                  </div>
                  <div className="font-medium">{property.propertyType}</div>
                </div>
                
                <div className="flex flex-col">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> Year Built
                  </div>
                  <div className="font-medium">{property.yearBuilt}</div>
                </div>
                
                <div className="flex flex-col">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <Ruler className="w-4 h-4 mr-1" /> Square Feet
                  </div>
                  <div className="font-medium">{property.squareFeet.toLocaleString()}</div>
                </div>
                
                <div className="flex flex-col">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <SquareAsterisk className="w-4 h-4 mr-1" /> Lot Size
                  </div>
                  <div className="font-medium">
                    {property.lotSize ? `${property.lotSize} ${property.lotSizeUnit}` : 'N/A'}
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <Bed className="w-4 h-4 mr-1" /> Bedrooms
                  </div>
                  <div className="font-medium">{property.bedrooms}</div>
                </div>
                
                <div className="flex flex-col">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <Bath className="w-4 h-4 mr-1" /> Bathrooms
                  </div>
                  <div className="font-medium">{property.bathrooms}</div>
                </div>
                
                <div className="flex flex-col">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" /> Last Appraised
                  </div>
                  <div className="font-medium">${property.lastAppraisalValue.toLocaleString()}</div>
                </div>
                
                <div className="flex flex-col">
                  <div className="text-sm text-gray-500 mb-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> Appraisal Date
                  </div>
                  <div className="font-medium">{property.lastAppraisalDate}</div>
                </div>
              </div>
              
              {property.description && (
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-700">{property.description}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="card">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Appraisal History</h2>
                <Link to={`/properties/${id}/appraisals`} className="text-primary-600 hover:text-primary-700 text-sm">
                  View All
                </Link>
              </div>
              
              <div className="text-center py-8 text-gray-500">
                <ClipboardList className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No appraisal history available</p>
                <Link
                  to={`/appraisals/new?propertyId=${id}`}
                  className="btn btn-outline mt-4 inline-flex items-center"
                >
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Start New Appraisal
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="card mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Market Data</h2>
              <div className="text-center py-8 text-gray-500">
                <p>Market data for this area will appear here</p>
                <Link
                  to={`/market-data?zipCode=${property.zipCode}`}
                  className="btn btn-outline mt-4 inline-flex items-center"
                >
                  View Market Data
                </Link>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Nearby Comparables</h2>
              <div className="text-center py-8 text-gray-500">
                <p>Comparable properties will appear here</p>
                <Link
                  to={`/comparables?propertyId=${id}`}
                  className="btn btn-outline mt-4 inline-flex items-center"
                >
                  Find Comparables
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;