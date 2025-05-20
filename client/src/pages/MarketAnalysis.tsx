import { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  usePriceTrends, 
  useDaysOnMarketTrends, 
  useSalesVolumeTrends,
  usePropertyTypeDistribution,
  useNeighborhoodPrices
} from '../hooks/useMarketData';

// Available locations for market data
const LOCATIONS = [
  'San Francisco',
  'Oakland',
  'San Jose',
  'All Bay Area'
];

// Color schemes for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const MarketAnalysis = () => {
  // State for filters
  const [selectedLocation, setSelectedLocation] = useState('San Francisco');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  
  // Fetch market data from hooks
  const { data: priceTrends = [], isLoading: priceTrendsLoading } = usePriceTrends(selectedLocation);
  const { data: domTrends = [], isLoading: domTrendsLoading } = useDaysOnMarketTrends(selectedLocation);
  const { data: salesTrends = [], isLoading: salesTrendsLoading } = useSalesVolumeTrends(selectedLocation);
  const { data: propertyTypeDistribution = [], isLoading: propertyTypeLoading } = usePropertyTypeDistribution();
  const { data: neighborhoodPrices = [], isLoading: neighborhoodLoading } = useNeighborhoodPrices();
  
  // Get available years from price trends for filtering
  const availableYears = [...new Set(priceTrends.map(item => item.year))].sort();
  
  // Filter data by selected year if not 'all'
  const filteredPriceTrends = selectedYear === 'all' 
    ? priceTrends 
    : priceTrends.filter(item => item.year === selectedYear);
    
  const filteredDomTrends = selectedYear === 'all' 
    ? domTrends 
    : domTrends.filter(item => item.year === selectedYear);
    
  const filteredSalesTrends = selectedYear === 'all' 
    ? salesTrends 
    : salesTrends.filter(item => item.year === selectedYear);
  
  // Calculate custom metrics
  const averagePrice = priceTrends.length
    ? Math.round(priceTrends.reduce((sum, item) => sum + item.value, 0) / priceTrends.length)
    : 0;
    
  const averageDaysOnMarket = domTrends.length
    ? Math.round(domTrends.reduce((sum, item) => sum + item.days, 0) / domTrends.length)
    : 0;
    
  const totalSales = salesTrends.length
    ? salesTrends.reduce((sum, item) => sum + item.sales, 0)
    : 0;
    
  // Calculate price per square foot for property types
  const pricePerSqFt = 850; // Example value, would be calculated from actual data
  
  // Custom tooltip formatter functions
  const formatPriceTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm text-sm">
          <p className="font-medium">{`${label} ${payload[0].payload.year}`}</p>
          <p className="text-primary">{`Price: $${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };
  
  const formatDomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm text-sm">
          <p className="font-medium">{`${label} ${payload[0].payload.year}`}</p>
          <p className="text-primary">{`Days on Market: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  const formatSalesTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm text-sm">
          <p className="font-medium">{`${label} ${payload[0].payload.year}`}</p>
          <p className="text-primary">{`Sales: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Loading states
  const isLoading = priceTrendsLoading || domTrendsLoading || salesTrendsLoading || 
                    propertyTypeLoading || neighborhoodLoading;
                    
  if (isLoading) {
    return <div className="p-8">Loading market data...</div>;
  }
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">Real Estate Market Analysis</h1>
      
      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {LOCATIONS.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Year</label>
          <select
            value={selectedYear.toString()}
            onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year.toString()}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Median Price</h3>
          <p className="text-3xl font-bold text-primary">${averagePrice.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">Average for selected period</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Days on Market</h3>
          <p className="text-3xl font-bold text-primary">{averageDaysOnMarket}</p>
          <p className="text-sm text-gray-500 mt-2">Average for selected period</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Sales</h3>
          <p className="text-3xl font-bold text-primary">{totalSales.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">Sum for selected period</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Price per Sq Ft</h3>
          <p className="text-3xl font-bold text-primary">${pricePerSqFt}</p>
          <p className="text-sm text-gray-500 mt-2">Average for selected location</p>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Price Trends Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Median Price Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredPriceTrends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${(value/1000)}k`}
                />
                <Tooltip content={formatPriceTooltip} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Median Price" 
                  stroke="#0088FE" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Days on Market Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Days on Market Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredDomTrends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={formatDomTooltip} />
                <Line 
                  type="monotone" 
                  dataKey="days" 
                  name="Days on Market" 
                  stroke="#00C49F" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Sales Volume Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Sales Volume Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredSalesTrends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={formatSalesTooltip} />
                <Bar 
                  dataKey="sales" 
                  name="Sales Volume" 
                  fill="#FFBB28" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Property Type Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Property Type Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {propertyTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Neighborhood Price Comparison */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Neighborhood Price Comparison</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Neighborhood
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Median Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price per Sq Ft
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comparison
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {neighborhoodPrices.map((neighborhood, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {neighborhood.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${neighborhood.medianPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${neighborhood.pricePerSqft}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <div 
                        className={`h-2.5 w-full rounded-full ${
                          neighborhood.medianPrice > averagePrice ? 'bg-green-200' : 'bg-red-200'
                        }`}
                      >
                        <div 
                          className={`h-2.5 rounded-full ${
                            neighborhood.medianPrice > averagePrice ? 'bg-green-500' : 'bg-red-500'
                          }`} 
                          style={{ 
                            width: `${Math.min(
                              Math.abs((neighborhood.medianPrice / averagePrice) * 100 - 100), 
                              100
                            )}%` 
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs font-medium">
                        {neighborhood.medianPrice > averagePrice ? '+' : '-'}
                        {Math.abs(Math.round((neighborhood.medianPrice / averagePrice) * 100 - 100))}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Market Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Market Insights</h2>
        <div className="prose max-w-none">
          <p>
            The real estate market in {selectedLocation} shows 
            {priceTrends.length > 1 && priceTrends[priceTrends.length - 1].value > priceTrends[0].value 
              ? ' an upward trend in prices' 
              : ' a stable or slightly declining price trend'} 
            over the analyzed period. 
            {domTrends.length > 1 && domTrends[domTrends.length - 1].days < domTrends[0].days 
              ? ' Properties are selling faster than in previous periods,' 
              : ' The average time to sell properties has increased,'} 
            which indicates 
            {domTrends.length > 1 && domTrends[domTrends.length - 1].days < domTrends[0].days 
              ? ' strong demand in the market.' 
              : ' some softening in market demand.'}
          </p>
          
          <p className="mt-4">
            {propertyTypeDistribution.length > 0 &&
              `${propertyTypeDistribution[0].name} properties represent the largest segment of the market at approximately ${propertyTypeDistribution[0].value}% of all sales.`}
            {neighborhoodPrices.length > 0 &&
              ` The ${neighborhoodPrices.reduce((prev, current) => (prev.medianPrice > current.medianPrice) ? prev : current).name} area commands the highest median price at $${neighborhoodPrices.reduce((prev, current) => (prev.medianPrice > current.medianPrice) ? prev : current).medianPrice.toLocaleString()}.`}
          </p>
          
          <p className="mt-4">
            Based on these market indicators, appraisers should consider 
            {priceTrends.length > 1 && priceTrends[priceTrends.length - 1].value > priceTrends[0].value 
              ? ' recent comparable sales more heavily than older ones due to the rising price trend.' 
              : ' a wider range of comparable sales to account for market stability or slight declines.'}
            {" Neighborhood-specific adjustments are crucial, given the significant price variations between areas."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis;