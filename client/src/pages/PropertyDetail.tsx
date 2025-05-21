import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  ChevronLeft, 
  PenSquare, 
  FileText, 
  MapPin, 
  Calendar, 
  CircleDollarSign,
  Ruler,
  Home,
  Bath,
  Bed,
  Clock,
  SquareGantt
} from 'lucide-react';

interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  squareFeet: number;
  bedrooms: number | null;
  bathrooms: number | null;
  yearBuilt: number | null;
  lotSize: number | null;
  lotSizeUnit: string | null;
  lastAppraisalValue: number | null;
  lastAppraisalDate: string | null;
  description: string | null;
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }
        const data = await response.json();
        setProperty(data);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error:', error);
        setError(error.message || 'Failed to load property details');
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">
      <div className="loading-spinner" />
    </div>;
  }

  if (error || !property) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h2 className="text-lg font-bold text-red-800">Error</h2>
        <p className="text-red-700">{error || 'Property not found'}</p>
        <Link to="/properties" className="mt-4 inline-block text-red-700 hover:text-red-800 font-medium">
          &larr; Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/properties" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Properties
          </Link>
          <h1 className="text-2xl font-bold">{property.address}</h1>
          <div className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{property.city}, {property.state} {property.zipCode}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/properties/${id}/edit`} className="btn btn-outline">
            <PenSquare className="w-4 h-4 mr-2" />
            Edit Property
          </Link>
          <Link to={`/properties/${id}/appraisal/new`} className="btn btn-primary">
            <FileText className="w-4 h-4 mr-2" />
            New Appraisal
          </Link>
        </div>
      </div>

      {/* Property Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details Card */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Property Type</p>
                  <p className="font-medium">{property.propertyType}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Square Footage</p>
                  <p className="font-medium">{property.squareFeet.toLocaleString()} sq ft</p>
                </div>
              </div>
              
              {property.bedrooms && (
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bedrooms</p>
                    <p className="font-medium">{property.bedrooms}</p>
                  </div>
                </div>
              )}
              
              {property.bathrooms && (
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-cyan-100 text-cyan-600 mr-3">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bathrooms</p>
                    <p className="font-medium">{property.bathrooms}</p>
                  </div>
                </div>
              )}
              
              {property.yearBuilt && (
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-amber-100 text-amber-600 mr-3">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Year Built</p>
                    <p className="font-medium">{property.yearBuilt}</p>
                  </div>
                </div>
              )}
              
              {property.lotSize && property.lotSizeUnit && (
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-emerald-100 text-emerald-600 mr-3">
                    <SquareGantt className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Lot Size</p>
                    <p className="font-medium">{property.lotSize} {property.lotSizeUnit}</p>
                  </div>
                </div>
              )}
            </div>

            {property.description && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-700">{property.description}</p>
              </div>
            )}
          </div>
          
          {/* Appraisal History */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Appraisal History</h2>
              <Link to={`/properties/${id}/appraisals`} className="text-primary-600 hover:text-primary-800 text-sm">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">December 10, 2024</p>
                    <span className="status-badge status-badge-success">Completed</span>
                  </div>
                  <p className="text-sm text-gray-600">Market Value: <span className="font-medium">${property.lastAppraisalValue?.toLocaleString()}</span></p>
                  <p className="text-xs text-gray-500">Appraiser: Michael Rodriguez</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">June 15, 2024</p>
                    <span className="status-badge status-badge-success">Completed</span>
                  </div>
                  <p className="text-sm text-gray-600">Market Value: <span className="font-medium">$418,000</span></p>
                  <p className="text-xs text-gray-500">Appraiser: Sarah Johnson</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Appraisal Value */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Latest Valuation</h2>
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <CircleDollarSign size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Market Value</p>
                <p className="text-2xl font-bold">${property.lastAppraisalValue?.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>As of {property.lastAppraisalDate}</span>
            </div>
          </div>
          
          {/* Location Map */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Location</h2>
            <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center">
              <MapPin className="w-8 h-8 text-gray-400" />
              <span className="ml-2 text-gray-500">Map will be displayed here</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to={`/properties/${id}/appraisal/new`} className="block w-full py-2 px-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-md">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Start New Appraisal
                </div>
              </Link>
              <Link to={`/market-data?zipCode=${property.zipCode}`} className="block w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md">
                <div className="flex items-center">
                  <SquareGantt className="w-5 h-5 mr-2" />
                  View Market Data
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;