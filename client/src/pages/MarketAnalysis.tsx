import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Search, MapPin, TrendingUp, TrendingDown, Clock, DollarSign,
  BarChart2, PieChart as PieChartIcon, Calendar 
} from 'lucide-react';

// Utility function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Sample data for testing purposes
// In a real application, this would be fetched from the API
const samplePriceTrends = [
  { month: 'Jan', value: 450000, year: 2023 },
  { month: 'Feb', value: 455000, year: 2023 },
  { month: 'Mar', value: 463000, year: 2023 },
  { month: 'Apr', value: 472000, year: 2023 },
  { month: 'May', value: 490000, year: 2023 },
  { month: 'Jun', value: 505000, year: 2023 },
  { month: 'Jul', value: 510000, year: 2023 },
  { month: 'Aug', value: 515000, year: 2023 },
  { month: 'Sep', value: 518000, year: 2023 },
  { month: 'Oct', value: 520000, year: 2023 },
  { month: 'Nov', value: 525000, year: 2023 },
  { month: 'Dec', value: 528000, year: 2023 },
  { month: 'Jan', value: 530000, year: 2024 },
  { month: 'Feb', value: 545000, year: 2024 },
  { month: 'Mar', value: 552000, year: 2024 },
  { month: 'Apr', value: 560000, year: 2024 }
];

const sampleDomTrends = [
  { month: 'Jan', days: 45, year: 2023 },
  { month: 'Feb', days: 43, year: 2023 },
  { month: 'Mar', days: 40, year: 2023 },
  { month: 'Apr', days: 38, year: 2023 },
  { month: 'May', days: 32, year: 2023 },
  { month: 'Jun', days: 28, year: 2023 },
  { month: 'Jul', days: 25, year: 2023 },
  { month: 'Aug', days: 22, year: 2023 },
  { month: 'Sep', days: 20, year: 2023 },
  { month: 'Oct', days: 23, year: 2023 },
  { month: 'Nov', days: 28, year: 2023 },
  { month: 'Dec', days: 32, year: 2023 },
  { month: 'Jan', days: 35, year: 2024 },
  { month: 'Feb', days: 33, year: 2024 },
  { month: 'Mar', days: 30, year: 2024 },
  { month: 'Apr', days: 28, year: 2024 }
];

const sampleSalesTrends = [
  { month: 'Jan', sales: 120, year: 2023 },
  { month: 'Feb', sales: 135, year: 2023 },
  { month: 'Mar', sales: 145, year: 2023 },
  { month: 'Apr', sales: 160, year: 2023 },
  { month: 'May', sales: 190, year: 2023 },
  { month: 'Jun', sales: 210, year: 2023 },
  { month: 'Jul', sales: 200, year: 2023 },
  { month: 'Aug', sales: 195, year: 2023 },
  { month: 'Sep', sales: 180, year: 2023 },
  { month: 'Oct', sales: 175, year: 2023 },
  { month: 'Nov', sales: 165, year: 2023 },
  { month: 'Dec', sales: 155, year: 2023 },
  { month: 'Jan', sales: 140, year: 2024 },
  { month: 'Feb', sales: 150, year: 2024 },
  { month: 'Mar', sales: 165, year: 2024 },
  { month: 'Apr', sales: 185, year: 2024 }
];

const samplePropertyTypes = [
  { name: 'Single Family', value: 65 },
  { name: 'Condo', value: 15 },
  { name: 'Townhouse', value: 10 },
  { name: 'Multi-Family', value: 5 },
  { name: 'Land', value: 3 },
  { name: 'Commercial', value: 2 }
];

const sampleNeighborhoodPrices = [
  { name: 'Downtown', medianPrice: 750000, pricePerSqft: 625 },
  { name: 'North End', medianPrice: 850000, pricePerSqft: 710 },
  { name: 'West Side', medianPrice: 620000, pricePerSqft: 520 },
  { name: 'South Hills', medianPrice: 530000, pricePerSqft: 445 },
  { name: 'Eastlake', medianPrice: 675000, pricePerSqft: 565 },
  { name: 'Oak Ridge', medianPrice: 590000, pricePerSqft: 495 },
  { name: 'Riverview', medianPrice: 705000, pricePerSqft: 590 }
];

const MarketAnalysis = () => {
  const [selectedLocation, setSelectedLocation] = useState('Seattle, WA');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1-year');
  
  // Fetch market data
  // In a real application, this would fetch data based on the selected location and timeframe
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['/api/market-data', selectedLocation, selectedTimeframe],
    retry: 1,
    // Mock response for now
    initialData: {
      priceTrends: samplePriceTrends,
      domTrends: sampleDomTrends,
      salesTrends: sampleSalesTrends,
      propertyTypes: samplePropertyTypes,
      neighborhoodPrices: sampleNeighborhoodPrices
    }
  });
  
  // Location options (would be fetched from API in a real application)
  const locationOptions = [
    'Seattle, WA',
    'Portland, OR',
    'San Francisco, CA',
    'Los Angeles, CA',
    'New York, NY',
    'Boston, MA',
    'Chicago, IL',
    'Austin, TX',
    'Miami, FL'
  ];
  
  // Timeframe options
  const timeframeOptions = [
    { value: '6-months', label: '6 Months' },
    { value: '1-year', label: '1 Year' },
    { value: '2-years', label: '2 Years' },
    { value: '5-years', label: '5 Years' }
  ];
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#52BE80'];
  
  // Calculate market metrics
  const calculateMetrics = () => {
    if (!marketData) return null;
    
    const priceTrends = marketData.priceTrends;
    const currentPrice = priceTrends[priceTrends.length - 1].value;
    const previousPrice = priceTrends[priceTrends.length - 2].value;
    const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
    
    const domTrends = marketData.domTrends;
    const currentDom = domTrends[domTrends.length - 1].days;
    const previousDom = domTrends[domTrends.length - 2].days;
    const domChange = ((currentDom - previousDom) / previousDom) * 100;
    
    const salesTrends = marketData.salesTrends;
    const currentSales = salesTrends[salesTrends.length - 1].sales;
    const previousSales = salesTrends[salesTrends.length - 2].sales;
    const salesChange = ((currentSales - previousSales) / previousSales) * 100;
    
    // Calculate average price per sq ft from neighborhood data
    const avgPricePerSqFt = marketData.neighborhoodPrices.reduce((sum, n) => sum + n.pricePerSqft, 0) / 
                            marketData.neighborhoodPrices.length;
    
    return {
      currentPrice,
      priceChange,
      currentDom,
      domChange,
      currentSales,
      salesChange,
      avgPricePerSqFt
    };
  };
  
  const metrics = calculateMetrics();
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-heading">Market Analysis</h1>
        <p className="text-gray-600 mt-1">Explore real estate market trends and analytics</p>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {locationOptions.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            {timeframeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedTimeframe(option.value)}
                className={`px-4 py-2 rounded-md ${selectedTimeframe === option.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Market metrics */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Median Home Price</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(metrics.currentPrice)}</p>
              </div>
              <div className={`flex items-center ${metrics.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.priceChange >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                <span className="ml-1 font-semibold">{Math.abs(metrics.priceChange).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">vs. previous month</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Avg. Days on Market</p>
                <p className="text-2xl font-bold mt-1">{metrics.currentDom} days</p>
              </div>
              <div className={`flex items-center ${metrics.domChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.domChange <= 0 ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
                <span className="ml-1 font-semibold">{Math.abs(metrics.domChange).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">vs. previous month</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Monthly Sales</p>
                <p className="text-2xl font-bold mt-1">{metrics.currentSales}</p>
              </div>
              <div className={`flex items-center ${metrics.salesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.salesChange >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                <span className="ml-1 font-semibold">{Math.abs(metrics.salesChange).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">vs. previous month</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Avg. Price per Sq Ft</p>
                <p className="text-2xl font-bold mt-1">${Math.round(metrics.avgPricePerSqFt)}</p>
              </div>
              <DollarSign size={18} className="text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">across all neighborhoods</p>
          </div>
        </div>
      )}
      
      {/* Price Trends Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-4">
            <TrendingUp size={18} className="text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Median Home Price Trend</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={marketData?.priceTrends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={(value, index) => {
                    // Add year to January months only
                    const item = marketData?.priceTrends[index];
                    return item && item.month === 'Jan' ? `${item.month} ${item.year}` : item?.month;
                  }}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value as number)}
                  labelFormatter={(label, items) => {
                    const item = items[0]?.payload;
                    return item ? `${item.month} ${item.year}` : label;
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Median Price" 
                  stroke="#3B82F6" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Days on Market Chart */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-4">
            <Clock size={18} className="text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Days on Market Trend</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={marketData?.domTrends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={(value, index) => {
                    const item = marketData?.domTrends[index];
                    return item && item.month === 'Jan' ? `${item.month} ${item.year}` : item?.month;
                  }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} days`, 'Days on Market']}
                  labelFormatter={(label, items) => {
                    const item = items[0]?.payload;
                    return item ? `${item.month} ${item.year}` : label;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="days" 
                  name="Days on Market" 
                  stroke="#EC4899" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Sales Trend and Property Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Sales Chart */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-4">
            <BarChart2 size={18} className="text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Monthly Sales Volume</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marketData?.salesTrends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={(value, index) => {
                    const item = marketData?.salesTrends[index];
                    return item && item.month === 'Jan' ? `${item.month} ${item.year}` : item?.month;
                  }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} sales`, 'Sales']}
                  labelFormatter={(label, items) => {
                    const item = items[0]?.payload;
                    return item ? `${item.month} ${item.year}` : label;
                  }}
                />
                <Bar 
                  dataKey="sales" 
                  name="Monthly Sales" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Property Type Distribution */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-4">
            <PieChartIcon size={18} className="text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Property Type Distribution</h2>
          </div>
          <div className="h-80 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketData?.propertyTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {marketData?.propertyTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentage']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Neighborhood Price Comparison */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center mb-4">
          <MapPin size={18} className="text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold">Neighborhood Price Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Neighborhood
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Median Home Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price per Square Foot
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comparison to City Average
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {marketData?.neighborhoodPrices.map((neighborhood, index) => {
                // Calculate percentage vs. average
                const avgMedianPrice = marketData.neighborhoodPrices.reduce((sum, n) => sum + n.medianPrice, 0) / 
                                      marketData.neighborhoodPrices.length;
                const percentDiff = ((neighborhood.medianPrice - avgMedianPrice) / avgMedianPrice) * 100;
                
                return (
                  <tr key={neighborhood.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {neighborhood.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(neighborhood.medianPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${neighborhood.pricePerSqft}/sq.ft
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {percentDiff >= 0 ? (
                          <TrendingUp size={16} className="text-green-600 mr-1" />
                        ) : (
                          <TrendingDown size={16} className="text-red-600 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${percentDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {percentDiff >= 0 ? '+' : ''}{percentDiff.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Market summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Market Summary</h2>
        <p className="text-gray-700 mb-4">
          The {selectedLocation} real estate market is currently {metrics && metrics.priceChange > 0 ? 'trending upward' : 'stabilizing'} with 
          median home prices {metrics && metrics.priceChange > 0 ? 'rising' : 'adjusting'} by {metrics && Math.abs(metrics.priceChange).toFixed(1)}% compared to the previous month. 
          Properties are selling in an average of {metrics?.currentDom} days, which is {metrics && metrics.domChange < 0 ? 'faster' : 'slower'} than the previous period.
        </p>
        <p className="text-gray-700 mb-4">
          Single Family homes continue to dominate the market, representing approximately {marketData?.propertyTypes[0].value}% of all transactions. 
          {metrics && metrics.salesChange > 0 
            ? ` Sales volume has increased by ${metrics.salesChange.toFixed(1)}%, indicating strong buyer demand.` 
            : ` Sales volume has decreased by ${Math.abs(metrics?.salesChange || 0).toFixed(1)}%, suggesting a potential shift in market dynamics.`
          }
        </p>
        <p className="text-gray-700">
          {marketData?.neighborhoodPrices[0].name} remains the most expensive neighborhood with a median price of {formatCurrency(marketData?.neighborhoodPrices[0].medianPrice || 0)}, 
          while more affordable options can be found in {marketData?.neighborhoodPrices.reduce((prev, current) => 
            (prev.medianPrice < current.medianPrice) ? prev : current).name} 
          at {formatCurrency(marketData?.neighborhoodPrices.reduce((prev, current) => 
            (prev.medianPrice < current.medianPrice) ? prev : current).medianPrice || 0)}.
        </p>
      </div>
      
      {/* Market insights */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Market Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <TrendingUp className="text-blue-600 mr-3 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Price Appreciation</h3>
              <p className="text-blue-700">
                {selectedLocation} has seen a {metrics && metrics.priceChange > 3 
                  ? 'significant' 
                  : metrics && metrics.priceChange > 0 
                    ? 'moderate' 
                    : 'slight'} 
                {metrics && metrics.priceChange >= 0 ? ' increase' : ' decrease'} in property values, 
                making it a {metrics && metrics.priceChange > 3 ? 'strong market for sellers' : 'balanced market for buyers and sellers'}.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock className="text-blue-600 mr-3 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Market Speed</h3>
              <p className="text-blue-700">
                Properties are selling {metrics && metrics.currentDom < 30 
                  ? 'quickly' 
                  : metrics && metrics.currentDom < 60 
                    ? 'at a moderate pace' 
                    : 'somewhat slowly'}, 
                with an average of {metrics?.currentDom} days on market, indicating a 
                {metrics && metrics.currentDom < 30 
                  ? ' seller\'s market.' 
                  : metrics && metrics.currentDom < 60 
                    ? ' balanced market.' 
                    : ' buyer\'s market.'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Calendar className="text-blue-600 mr-3 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Seasonal Trends</h3>
              <p className="text-blue-700">
                Based on historical data, the market tends to be most active during spring and early summer months,
                with slightly lower activity during winter. Pricing often follows similar seasonal patterns.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="text-blue-600 mr-3 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Neighborhood Spotlight</h3>
              <p className="text-blue-700">
                {marketData?.neighborhoodPrices.sort((a, b) => (b.medianPrice / b.pricePerSqft) - (a.medianPrice / a.pricePerSqft))[0].name} offers 
                the best value in terms of price per square foot relative to home values, 
                while {marketData?.neighborhoodPrices.sort((a, b) => b.pricePerSqft - a.pricePerSqft)[0].name} commands the 
                highest premium per square foot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis;