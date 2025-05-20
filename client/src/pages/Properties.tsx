import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProperties, useCreateProperty } from '../hooks/useProperties';
import { Property, InsertProperty } from '../types';
import { format } from 'date-fns';

// Property type options for dropdown
const PROPERTY_TYPES = [
  'Single Family',
  'Condo',
  'Multi-Family',
  'Commercial',
  'Land',
  'Industrial',
  'Special Purpose'
];

const Properties = () => {
  const { data: properties = [], isLoading, error } = useProperties();
  const createPropertyMutation = useCreateProperty();
  
  // State for new property form
  const [showForm, setShowForm] = useState(false);
  const [newProperty, setNewProperty] = useState<Partial<InsertProperty>>({
    address: '',
    city: '',
    state: '',
    zip_code: '',
    property_type: 'Single Family',
    year_built: new Date().getFullYear() - 10,
    square_feet: 0,
    bedrooms: 0,
    bathrooms: 0,
    lot_size: 0
  });
  
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  
  // Filter properties based on search term and property type
  const filteredProperties = properties.filter(property => {
    const matchesSearch = !searchTerm || 
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.zip_code.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = !filterType || property.property_type === filterType;
    
    return matchesSearch && matchesType;
  });
  
  // Handle input changes for new property form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (['year_built', 'square_feet', 'bedrooms', 'bathrooms', 'lot_size'].includes(name)) {
      setNewProperty(prev => ({
        ...prev,
        [name]: value === '' ? '' : Number(value)
      }));
    } else {
      setNewProperty(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle property creation
  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!newProperty.address || !newProperty.city || !newProperty.state || !newProperty.zip_code) {
      alert('Please fill out all required fields');
      return;
    }
    
    // Create new property
    createPropertyMutation.mutate(newProperty as InsertProperty, {
      onSuccess: () => {
        // Reset form and hide it
        setNewProperty({
          address: '',
          city: '',
          state: '',
          zip_code: '',
          property_type: 'Single Family',
          year_built: new Date().getFullYear() - 10,
          square_feet: 0,
          bedrooms: 0,
          bathrooms: 0,
          lot_size: 0
        });
        setShowForm(false);
      },
      onError: (error) => {
        console.error('Error creating property:', error);
        alert('Failed to create property. Please try again.');
      }
    });
  };
  
  if (isLoading) return <div className="p-8">Loading properties...</div>;
  
  if (error) return <div className="p-8 text-red-500">Error loading properties: {(error as Error).message}</div>;
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Properties</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Property'}
        </button>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Property Types</option>
            {PROPERTY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* New Property Form */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
          <form onSubmit={handleCreateProperty} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Address *</label>
              <input
                type="text"
                name="address"
                value={newProperty.address}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={newProperty.city}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State *</label>
              <input
                type="text"
                name="state"
                value={newProperty.state}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ZIP Code *</label>
              <input
                type="text"
                name="zip_code"
                value={newProperty.zip_code}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Property Type</label>
              <select
                name="property_type"
                value={newProperty.property_type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {PROPERTY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year Built</label>
              <input
                type="number"
                name="year_built"
                value={newProperty.year_built}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Square Feet</label>
              <input
                type="number"
                name="square_feet"
                value={newProperty.square_feet}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={newProperty.bedrooms}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={newProperty.bathrooms}
                onChange={handleInputChange}
                step="0.5"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lot Size (sq ft)</label>
              <input
                type="number"
                name="lot_size"
                value={newProperty.lot_size}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                disabled={createPropertyMutation.isPending}
              >
                {createPropertyMutation.isPending ? 'Creating...' : 'Create Property'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Properties List */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No properties found. Try adjusting your search or create a new property.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Link 
              to={`/properties/${property.id}`}
              key={property.id}
              className="block bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-5xl text-gray-400">{property.property_type === 'Commercial' ? '🏢' : '🏠'}</div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{property.address}</h3>
                <p className="text-gray-600 mb-2">{property.city}, {property.state} {property.zip_code}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Type:</span> {property.property_type}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Year:</span> {property.year_built}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Sqft:</span> {property.square_feet.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Beds:</span> {property.bedrooms}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Baths:</span> {property.bathrooms}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Lot:</span> {property.lot_size ? property.lot_size.toLocaleString() : 'N/A'}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  Added on {format(new Date(property.created_at), 'MMM d, yyyy')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;