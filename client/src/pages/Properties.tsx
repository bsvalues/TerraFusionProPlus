import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Plus, 
  Filter,
  Home,
  MapPin,
  ArrowUpDown,
  Calendar
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

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('address');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching properties:', error);
        setError(error.message || 'An error occurred while fetching properties');
        setIsLoading(false);
        
        // For demo purposes, set sample properties data
        setProperties([
          {
            id: 1,
            address: '123 Main St',
            city: 'Austin',
            state: 'TX',
            zipCode: '78701',
            propertyType: 'Residential',
            squareFeet: 2450,
            bedrooms: 3,
            bathrooms: 2.5,
            yearBuilt: 2005,
            lotSize: 0.25,
            lotSizeUnit: 'acres',
            lastAppraisalValue: 425000,
            lastAppraisalDate: '2025-01-15',
            description: 'Beautiful single-family home in downtown Austin.'
          },
          {
            id: 2,
            address: '456 Market Ave',
            city: 'Dallas',
            state: 'TX',
            zipCode: '75201',
            propertyType: 'Commercial',
            squareFeet: 12000,
            bedrooms: null,
            bathrooms: 4,
            yearBuilt: 2001,
            lotSize: 0.5,
            lotSizeUnit: 'acres',
            lastAppraisalValue: 1250000,
            lastAppraisalDate: '2025-02-20',
            description: 'Prime commercial space in Dallas business district.'
          },
          {
            id: 3,
            address: '789 Oak Blvd',
            city: 'Houston',
            state: 'TX',
            zipCode: '77002',
            propertyType: 'Multi-Family',
            squareFeet: 7500,
            bedrooms: 8,
            bathrooms: 6,
            yearBuilt: 2010,
            lotSize: 0.75,
            lotSizeUnit: 'acres',
            lastAppraisalValue: 875000,
            lastAppraisalDate: '2025-03-05',
            description: 'Eight-unit apartment building near downtown Houston.'
          },
          {
            id: 4,
            address: '101 Pine Lane',
            city: 'San Antonio',
            state: 'TX',
            zipCode: '78205',
            propertyType: 'Residential',
            squareFeet: 1850,
            bedrooms: 2,
            bathrooms: 2,
            yearBuilt: 1995,
            lotSize: 0.2,
            lotSizeUnit: 'acres',
            lastAppraisalValue: 325000,
            lastAppraisalDate: '2025-02-28',
            description: 'Charming ranch-style home with modern updates.'
          },
          {
            id: 5,
            address: '222 Willow St',
            city: 'Austin',
            state: 'TX',
            zipCode: '78704',
            propertyType: 'Residential',
            squareFeet: 3200,
            bedrooms: 4,
            bathrooms: 3.5,
            yearBuilt: 2018,
            lotSize: 0.3,
            lotSizeUnit: 'acres',
            lastAppraisalValue: 550000,
            lastAppraisalDate: '2025-03-15',
            description: 'Modern home in desirable South Austin neighborhood.'
          },
          {
            id: 6,
            address: '333 Tower Plaza',
            city: 'Dallas',
            state: 'TX',
            zipCode: '75202',
            propertyType: 'Commercial',
            squareFeet: 22000,
            bedrooms: null,
            bathrooms: 8,
            yearBuilt: 2015,
            lotSize: 1.2,
            lotSizeUnit: 'acres',
            lastAppraisalValue: 3750000,
            lastAppraisalDate: '2025-01-30',
            description: 'Class A office building with premium amenities.'
          }
        ]);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties by search query and property type
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.zipCode.includes(searchQuery);
    
    const matchesType = 
      filterType === 'all' || 
      property.propertyType === filterType;
    
    return matchesSearch && matchesType;
  });

  // Sort properties by selected field and direction
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'address':
        comparison = a.address.localeCompare(b.address);
        break;
      case 'city':
        comparison = a.city.localeCompare(b.city);
        break;
      case 'propertyType':
        comparison = a.propertyType.localeCompare(b.propertyType);
        break;
      case 'squareFeet':
        comparison = a.squareFeet - b.squareFeet;
        break;
      case 'lastAppraisalValue':
        const valueA = a.lastAppraisalValue || 0;
        const valueB = b.lastAppraisalValue || 0;
        comparison = valueA - valueB;
        break;
      case 'lastAppraisalDate':
        const dateA = a.lastAppraisalDate ? new Date(a.lastAppraisalDate).getTime() : 0;
        const dateB = b.lastAppraisalDate ? new Date(b.lastAppraisalDate).getTime() : 0;
        comparison = dateA - dateB;
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Handle sort change
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // If already sorting by this column, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Render sort indicator
  const renderSortIndicator = (column: string) => {
    if (sortBy !== column) return null;
    
    return (
      <span className="ml-1 text-primary-500">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  // Get property type icon
  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'Residential':
        return <Home className="w-4 h-4 text-primary-500" />;
      case 'Commercial':
        return <Building2 className="w-4 h-4 text-blue-500" />;
      case 'Multi-Family':
        return <Building2 className="w-4 h-4 text-purple-500" />;
      case 'Land':
        return <MapPin className="w-4 h-4 text-green-500" />;
      default:
        return <Building2 className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Link to="/properties/new" className="btn btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Link>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search properties by address, city, or ZIP..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <select
                className="block w-full border-gray-300 rounded-md"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Property Types</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Multi-Family">Multi-Family</option>
                <option value="Land">Land</option>
              </select>
            </div>
            
            <button
              type="button"
              className="btn btn-outline flex items-center"
              aria-label="More filters"
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Properties grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProperties.map(property => (
          <Link 
            to={`/properties/${property.id}`} 
            key={property.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
            <div className="p-4">
              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-full bg-gray-100 flex-shrink-0">
                  {getPropertyTypeIcon(property.propertyType)}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{property.address}</h3>
                  <p className="text-gray-600 text-sm">
                    {property.city}, {property.state} {property.zipCode}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                <div>
                  <p className="text-xs text-gray-500">Property Type</p>
                  <p className="font-medium">{property.propertyType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Square Feet</p>
                  <p className="font-medium">{property.squareFeet.toLocaleString()}</p>
                </div>
                
                {property.bedrooms !== null && (
                  <div>
                    <p className="text-xs text-gray-500">Bedrooms</p>
                    <p className="font-medium">{property.bedrooms}</p>
                  </div>
                )}
                
                {property.bathrooms !== null && (
                  <div>
                    <p className="text-xs text-gray-500">Bathrooms</p>
                    <p className="font-medium">{property.bathrooms}</p>
                  </div>
                )}
              </div>
              
              {property.lastAppraisalValue && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Last Appraised Value</p>
                      <p className="font-bold text-green-600">${property.lastAppraisalValue.toLocaleString()}</p>
                    </div>
                    {property.lastAppraisalDate && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(property.lastAppraisalDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Show when no properties match filters */}
      {sortedProperties.length === 0 && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700">No properties found</h3>
          <p className="text-gray-500 mt-2">
            No properties match your search criteria. Try adjusting your filters or add a new property.
          </p>
          <Link to="/properties/new" className="btn btn-primary mt-4 inline-flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Link>
        </div>
      )}
    </div>
  );
};

export default Properties;