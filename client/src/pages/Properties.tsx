import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, Search, Filter, MapPin } from 'lucide-react';

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [properties] = useState([
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
      lastAppraisalValue: 425000,
      lastAppraisalDate: '2024-12-10'
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
      lastAppraisalDate: '2024-11-22'
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
      lastAppraisalValue: 680000,
      lastAppraisalDate: '2024-12-05'
    },
  ]);

  const filteredProperties = properties.filter(property => 
    property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.zipCode.includes(searchQuery)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Properties</h1>
        <Link
          to="/properties/new"
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Link>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search properties by address, city, or zip code..."
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-outline flex items-center justify-center md:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Link to={`/properties/${property.id}`} key={property.id} className="card hover:shadow-md transition-shadow">
            <div className="bg-gray-100 h-40 rounded-t-lg flex items-center justify-center">
              <Building2 className="w-16 h-16 text-gray-400" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.address}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.city}, {property.state} {property.zipCode}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Type:</span> {property.propertyType}
                </div>
                <div>
                  <span className="font-medium">Built:</span> {property.yearBuilt}
                </div>
                <div>
                  <span className="font-medium">Area:</span> {property.squareFeet} sqft
                </div>
                <div>
                  <span className="font-medium">Beds/Baths:</span> {property.bedrooms}/{property.bathrooms}
                </div>
              </div>
              <div className="border-t pt-3 mt-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">Last Appraisal</div>
                  <div className="text-primary-600 font-semibold">${property.lastAppraisalValue.toLocaleString()}</div>
                </div>
                <div className="text-xs text-gray-500">{property.lastAppraisalDate}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No properties found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
          <button
            onClick={() => setSearchQuery('')}
            className="btn btn-outline"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default Properties;