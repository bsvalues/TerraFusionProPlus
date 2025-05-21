import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, Plus, FilterX, Filter, ArrowUpDown } from 'lucide-react';

const Properties = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    propertyType: '',
    city: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('address');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    // Fetch properties from API
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setFilters({
      propertyType: '',
      city: '',
      status: ''
    });
    setSearchQuery('');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Add sample cities and property types for filters
  const cities = ['Austin', 'Dallas', 'Houston', 'San Antonio', 'Fort Worth'];
  const propertyTypes = ['Single Family', 'Multi-Family', 'Condominium', 'Commercial', 'Land'];
  const statuses = ['Active', 'Pending', 'Inactive'];

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">
      <div className="loading-spinner" />
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Link 
          to="/properties/new" 
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 mb-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search properties..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={toggleFilters}
            className="btn btn-outline sm:w-auto"
          >
            <Filter size={16} className="mr-2" />
            Filters
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Search
          </button>
        </form>

        {/* Filters Section */}
        {showFilters && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-auto">
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  className="w-full rounded-md border-gray-300"
                  value={filters.propertyType}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  className="w-full rounded-md border-gray-300"
                  value={filters.city}
                  onChange={handleFilterChange}
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full rounded-md border-gray-300"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-auto flex items-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center text-gray-600 hover:text-gray-900 px-2 py-2"
                >
                  <FilterX size={16} className="mr-1" />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSortChange('address')}>
                  <div className="flex items-center">
                    Address
                    {sortBy === 'address' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSortChange('propertyType')}>
                  <div className="flex items-center">
                    Property Type
                    {sortBy === 'propertyType' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSortChange('city')}>
                  <div className="flex items-center">
                    Location
                    {sortBy === 'city' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSortChange('lastAppraisalDate')}>
                  <div className="flex items-center">
                    Last Appraisal
                    {sortBy === 'lastAppraisalDate' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSortChange('status')}>
                  <div className="flex items-center">
                    Status
                    {sortBy === 'status' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {properties.length > 0 ? (
                properties.map((property: any) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link to={`/properties/${property.id}`} className="flex items-center text-primary-600 hover:text-primary-800">
                        <Building2 size={18} className="mr-2 text-gray-400" />
                        {property.address}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{property.propertyType}</td>
                    <td className="px-6 py-4">{property.city}, {property.state}</td>
                    <td className="px-6 py-4">{property.lastAppraisalDate}</td>
                    <td className="px-6 py-4">
                      <span className="status-badge status-badge-success">Active</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No properties found. Add a new property to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Properties;