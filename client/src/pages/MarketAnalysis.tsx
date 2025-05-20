import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, TrendingUp, TrendingDown, Calendar, DollarSign, Clock, Home as HomeIcon, Building2, Search, MapPin } from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  TooltipProps
} from 'recharts';

// Define interface for price trend data point
interface PriceTrendDataPoint {
  month: string;
  value: number;
  year: number;
}

// Define interface for days on market data point
interface DomTrendDataPoint {
  month: string;
  days: number;
  year: number;
}

// Define interface for sales trend data point
interface SalesTrendDataPoint {
  month: string;
  sales: number;
  year: number;
}

// Define interface for property type data point
interface PropertyTypeDataPoint {
  name: string;
  value: number;
}

// Define interface for neighborhood price data point
interface NeighborhoodPriceDataPoint {
  name: string;
  medianPrice: number;
  pricePerSqft: number;
}

// Define interface for market data
interface MarketData {
  priceTrends: PriceTrendDataPoint[];
  domTrends: DomTrendDataPoint[];
  salesTrends: SalesTrendDataPoint[];
  propertyTypes: PropertyTypeDataPoint[];
  neighborhoodPrices: NeighborhoodPriceDataPoint[];
  medianPrices: {
    currentYear: number;
    previousYear: number;
    percentChange: number;
  };
}

// Interface for custom legend props
interface CustomLegendProps {
  payload?: {
    value: string;
    color: string;
  }[];
}

// Sample market data for now
const generateMarketData = (): MarketData => {
  // Price trends over last 12 months
  const priceTrends: PriceTrendDataPoint[] = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  let basePrice = 350; // Starting price per sq ft

  for (let i = 11; i >= 0; i--) {
    const month = new Date(currentYear, now.getMonth() - i, 1);
    const monthName = month.toLocaleString('default', { month: 'short' });
    
    // Add some variation to create realistic data
    const randomFactor = 1 + (Math.random() * 0.1 - 0.05); // -5% to +5% 
    basePrice = basePrice * randomFactor;
    
    priceTrends.push({
      month: monthName,
      value: Math.round(basePrice),
      year: month.getFullYear()
    });
  }

  // Days on market trends
  const domTrends: DomTrendDataPoint[] = [];
  let baseDom = 45; // Starting days on market

  for (let i = 11; i >= 0; i--) {
    const month = new Date(currentYear, now.getMonth() - i, 1);
    const monthName = month.toLocaleString('default', { month: 'short' });
    
    // Add some variation 
    const randomFactor = 1 + (Math.random() * 0.2 - 0.1); // -10% to +10%
    baseDom = Math.max(10, Math.round(baseDom * randomFactor)); // Ensure at least 10 days
    
    domTrends.push({
      month: monthName,
      days: baseDom,
      year: month.getFullYear()
    });
  }

  // Sales volume trends
  const salesTrends: SalesTrendDataPoint[] = [];
  let baseSales = 120; // Starting monthly sales

  for (let i = 11; i >= 0; i--) {
    const month = new Date(currentYear, now.getMonth() - i, 1);
    const monthName = month.toLocaleString('default', { month: 'short' });
    
    // Add seasonal variation
    let seasonalFactor = 1;
    const monthNum = month.getMonth();
    
    // Spring/Summer usually have higher sales
    if (monthNum >= 3 && monthNum <= 7) {
      seasonalFactor = 1.2;
    } 
    // Winter usually has lower sales
    else if (monthNum >= 11 || monthNum <= 1) {
      seasonalFactor = 0.8;
    }
    
    // Add some random variation
    const randomFactor = 1 + (Math.random() * 0.2 - 0.1); // -10% to +10%
    const sales = Math.round(baseSales * seasonalFactor * randomFactor);
    
    salesTrends.push({
      month: monthName,
      sales: sales,
      year: month.getFullYear()
    });
  }
  
  // Property types distribution
  const propertyTypes: PropertyTypeDataPoint[] = [
    { name: 'Single Family', value: 65 },
    { name: 'Condo', value: 18 },
    { name: 'Multi-Family', value: 10 },
    { name: 'Townhouse', value: 7 }
  ];
  
  // Median prices by neighborhood
  const neighborhoodPrices: NeighborhoodPriceDataPoint[] = [
    { name: 'Downtown', medianPrice: 625000, pricePerSqft: 450 },
    { name: 'North End', medianPrice: 875000, pricePerSqft: 520 },
    { name: 'South Side', medianPrice: 425000, pricePerSqft: 320 },
    { name: 'Westview', medianPrice: 750000, pricePerSqft: 480 },
    { name: 'Eastside', medianPrice: 580000, pricePerSqft: 410 }
  ];
  
  return {
    priceTrends,
    domTrends,
    salesTrends,
    propertyTypes,
    neighborhoodPrices,
    medianPrices: {
      currentYear: 585000,
      previousYear: 550000,
      percentChange: 6.4
    }
  };
};

export const MarketAnalysis = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('12m');
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    // In a real app, we would fetch this from the API
    // For now, generate some realistic sample data
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const data = generateMarketData();
      setMarketData(data);
      setLoading(false);
    }, 800);
  }, [selectedTimePeriod]);

  // Function to format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Format price per square foot
  const formatPricePerSqFt = (value: number): string => {
    return `$${value}/sqft`;
  };

  // Interface for custom tooltip props
  interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
  }

  // Get custom tooltip for price trends chart
  const PriceTrendTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{`${label} ${payload[0].payload.year}`}</p>
          <p className="text-sm text-gray-700">{`Price per Sq.Ft: ${formatPricePerSqFt(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Get custom tooltip for DOM trends chart
  const DomTrendTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{`${label} ${payload[0].payload.year}`}</p>
          <p className="text-sm text-gray-700">{`Days on Market: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Get custom tooltip for sales volume chart
  const SalesTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{`${label} ${payload[0].payload.year}`}</p>
          <p className="text-sm text-gray-700">{`Sales: ${payload[0].value} properties`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom Legend for Pie Chart
  const CustomLegend: React.FC<CustomLegendProps> = ({ payload }) => {
    if (!payload || !marketData) return null;
    
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">{entry.value} ({marketData.propertyTypes[index].value}%)</span>
          </li>
        ))}
      </ul>
    );
  };

  if (loading || !marketData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Market Analysis</h1>
          <p className="text-gray-600 mt-1">Analyze real estate market trends and insights</p>
        </div>
        <div className="mt-4 md:mt-0">
          <select
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedTimePeriod}
            onChange={(e) => setSelectedTimePeriod(e.target.value)}
          >
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="12m">Last 12 Months</option>
            <option value="24m">Last 24 Months</option>
          </select>
        </div>
      </div>

      {/* Market Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign size={20} className="text-blue-500" />
            </div>
            <div className={`flex items-center ${marketData.medianPrices.percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {marketData.medianPrices.percentChange >= 0 ? 
                <TrendingUp size={14} className="mr-1" /> : 
                <TrendingDown size={14} className="mr-1" />
              }
              <span className="text-xs font-medium">{marketData.medianPrices.percentChange}%</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">Median Sale Price</div>
          <div className="text-2xl font-bold mt-1 text-gray-800">
            {formatCurrency(marketData.medianPrices.currentYear)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            vs {formatCurrency(marketData.medianPrices.previousYear)} last year
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <LineChart size={20} className="text-green-500" />
            </div>
            <div className="flex items-center text-green-500">
              <TrendingUp size={14} className="mr-1" />
              <span className="text-xs font-medium">4.3%</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">Avg. Price Per Sq.Ft.</div>
          <div className="text-2xl font-bold mt-1 text-gray-800">
            {formatPricePerSqFt(marketData.priceTrends[marketData.priceTrends.length - 1].value)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            vs {formatPricePerSqFt(marketData.priceTrends[0].value)} 12 months ago
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Clock size={20} className="text-purple-500" />
            </div>
            <div className="flex items-center text-red-500">
              <TrendingDown size={14} className="mr-1" />
              <span className="text-xs font-medium">8.2%</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">Avg. Days on Market</div>
          <div className="text-2xl font-bold mt-1 text-gray-800">
            {marketData.domTrends[marketData.domTrends.length - 1].days} days
          </div>
          <div className="text-xs text-gray-500 mt-1">
            vs {marketData.domTrends[0].days} days 12 months ago
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Building2 size={20} className="text-amber-500" />
            </div>
            <div className="flex items-center text-green-500">
              <TrendingUp size={14} className="mr-1" />
              <span className="text-xs font-medium">2.1%</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">Active Listings</div>
          <div className="text-2xl font-bold mt-1 text-gray-800">483</div>
          <div className="text-xs text-gray-500 mt-1">
            vs 473 last month
          </div>
        </div>
      </div>

      {/* Price Trends Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Price Per Square Foot Trends</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={marketData.priceTrends}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
                domain={['dataMin - 20', 'dataMax + 20']}
              />
              <Tooltip content={<PriceTrendTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
                name="Price per Sq.Ft."
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two column charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Days on Market */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Days on Market Trends</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={marketData.domTrends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis 
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tickFormatter={(value) => `${value} days`}
                />
                <Tooltip content={<DomTrendTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="days" 
                  stroke="#8b5cf6" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  name="Days on Market"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Volume */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Monthly Sales Volume</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marketData.salesTrends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<SalesTooltip />} />
                <Bar dataKey="sales" fill="#10b981" name="Sales Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Property Types and Neighborhood Prices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Property Types Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Property Types Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketData.propertyTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {marketData.propertyTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Neighborhood Prices */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Median Prices by Neighborhood</h2>
          <div className="space-y-6">
            {marketData.neighborhoodPrices.map((neighborhood, index) => (
              <div key={index} className="flex items-center">
                <MapPin className="flex-shrink-0 text-red-500 mr-2" size={16} />
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium">{neighborhood.name}</h3>
                    <span className="text-sm font-bold">{formatCurrency(neighborhood.medianPrice)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (neighborhood.medianPrice / 1000000) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{formatPricePerSqFt(neighborhood.pricePerSqft)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Market Insights</h2>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Price Trends Analysis</h3>
            <p className="text-blue-700 text-sm">
              The average price per square foot has shown a steady increase over the past year, reaching {formatPricePerSqFt(marketData.priceTrends[marketData.priceTrends.length - 1].value)} in the most recent month. This represents a 4.3% increase compared to 12 months ago, indicating a healthy appreciation rate in property values.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-green-50 border border-green-100">
            <h3 className="font-medium text-green-800 mb-2">Inventory & Sales Analysis</h3>
            <p className="text-green-700 text-sm">
              The current inventory level of 483 active listings represents a slight increase from the previous month. With an average of {marketData.salesTrends[marketData.salesTrends.length - 1].sales} sales per month, the current absorption rate is approximately 3.5 months, which indicates a balanced market with a slight advantage for sellers.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
            <h3 className="font-medium text-purple-800 mb-2">Market Efficiency</h3>
            <p className="text-purple-700 text-sm">
              Properties are selling in an average of {marketData.domTrends[marketData.domTrends.length - 1].days} days, which is 8.2% faster than the same period last year. This indicates increasing market efficiency and buyer demand, particularly in the North End and Westview neighborhoods which show the strongest price appreciation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};