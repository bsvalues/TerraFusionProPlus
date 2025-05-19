import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Edit, BarChart4, LineChart } from 'lucide-react';

interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  yearBuilt: number;
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
  lotSize: number;
  lastSalePrice: number;
  lastSaleDate: string;
}

interface MarketData {
  pricePerSqftTrend: { month: string; value: number }[];
  salesVolume: { month: string; sales: number }[];
  daysOnMarket: { month: string; days: number }[];
  medianPrices: {
    currentYear: number;
    previousYear: number;
    percentChange: number;
  };
}

export const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMarketData, setLoadingMarketData] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/properties/${id}`)
        .then(response => response.json())
        .then(data => {
          setProperty(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching property details:', error);
          setLoading(false);
        });

      fetch('/api/market-analysis')
        .then(response => response.json())
        .then(data => {
          setMarketData(data);
          setLoadingMarketData(false);
        })
        .catch(error => {
          console.error('Error fetching market data:', error);
          setLoadingMarketData(false);
        });
    }
  }, [id]);

  // Calculate the estimated property value range based on market data and property details
  const calculateValueRange = () => {
    if (!property || !marketData) return null;
    
    const pricePerSqFt = property.lastSalePrice / property.squareFeet;
    const currentMarketPriceSqFt = marketData.pricePerSqftTrend[marketData.pricePerSqftTrend.length - 1].value;
    
    // Adjust based on months since last sale
    const lastSaleDate = new Date(property.lastSaleDate);
    const currentDate = new Date();
    const monthsSinceLastSale = 
      (currentDate.getFullYear() - lastSaleDate.getFullYear()) * 12 + 
      (currentDate.getMonth() - lastSaleDate.getMonth());
    
    const adjustedPriceSqFt = 
      monthsSinceLastSale > 0 
        ? pricePerSqFt * (1 + (currentMarketPriceSqFt / pricePerSqFt - 1) * Math.min(monthsSinceLastSale / 12, 1))
        : pricePerSqFt;
    
    const estimatedValue = adjustedPriceSqFt * property.squareFeet;
    
    // Create a range with +/- 5%
    return {
      low: Math.round(estimatedValue * 0.95),
      estimated: Math.round(estimatedValue),
      high: Math.round(estimatedValue * 1.05)
    };
  };

  const valueRange = (!loading && !loadingMarketData) ? calculateValueRange() : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-800">Property not found</h3>
        <p className="text-gray-600 mt-1">The property you're looking for doesn't exist or you don't have access.</p>
        <Link 
          to="/properties" 
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/properties" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Properties</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{property.address}</h1>
          <p className="text-gray-600 mt-1">{property.city}, {property.state} {property.zipCode}</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Link 
            to={`/properties/${id}/edit`} 
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Edit size={18} className="mr-2 text-gray-600" />
            Edit Property
          </Link>
          <Link 
            to={`/appraisals/new?propertyId=${id}`} 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FileText size={18} className="mr-2" />
            New Appraisal
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-200 h-64 flex items-center justify-center">
            {/* Property image placeholder */}
            <div className="text-gray-400 text-center">
              <svg 
                className="w-16 h-16 mx-auto mb-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 22V12h6v10" 
                />
              </svg>
              <span className="text-sm">Property Image</span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Bedrooms</div>
                <div className="text-xl font-semibold text-gray-800">{property.bedrooms}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Bathrooms</div>
                <div className="text-xl font-semibold text-gray-800">{property.bathrooms}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Square Feet</div>
                <div className="text-xl font-semibold text-gray-800">{property.squareFeet.toLocaleString()}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Year Built</div>
                <div className="text-xl font-semibold text-gray-800">{property.yearBuilt}</div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-gray-500 text-sm">Property Type</h3>
                  <p className="font-medium">{property.propertyType}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Lot Size</h3>
                  <p className="font-medium">{property.lotSize > 0 ? `${property.lotSize.toLocaleString()} sq.ft.` : 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Last Sale Price</h3>
                  <p className="font-medium">${property.lastSalePrice.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Last Sale Date</h3>
                  <p className="font-medium">{new Date(property.lastSaleDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Price per Sq.Ft. (Last Sale)</h3>
                  <p className="font-medium">${Math.round(property.lastSalePrice / property.squareFeet).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart4 size={20} className="mr-2 text-blue-500" />
              Estimated Value
            </h2>
            
            {valueRange ? (
              <div>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">Current Estimated Value</p>
                  <p className="text-3xl font-bold gradient-heading">${valueRange.estimated.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">
                    Range: ${valueRange.low.toLocaleString()} - ${valueRange.high.toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Market Insights:</span> Based on recent comparable sales and market trends in this area.
                  </p>
                </div>
                
                <div className="mt-4">
                  <Link 
                    to={`/appraisals/new?propertyId=${id}`} 
                    className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Start Full Appraisal
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Calculating value...</p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <LineChart size={20} className="mr-2 text-green-500" />
              Market Insights
            </h2>
            
            {!loadingMarketData && marketData ? (
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Price Per Sq.Ft. Trend</h3>
                  <div className="mt-2 h-24 bg-gray-100 rounded relative">
                    <div className="absolute inset-0 flex items-end px-2">
                      {marketData.pricePerSqftTrend.map((item, index) => (
                        <div 
                          key={index}
                          className="flex-1 flex flex-col items-center justify-end"
                        >
                          <div 
                            className="w-full bg-blue-500 mx-px" 
                            style={{ 
                              height: `${(item.value / Math.max(...marketData.pricePerSqftTrend.map(i => i.value))) * 85}%`,
                              opacity: 0.7 + (index / marketData.pricePerSqftTrend.length * 0.3)
                            }}
                          ></div>
                          <span className="text-xs mt-1">{item.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Median Price (Current):</span>
                    <span className="font-medium">${marketData.medianPrices.currentYear.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Year-Over-Year Change:</span>
                    <span className={`font-medium ${marketData.medianPrices.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {marketData.medianPrices.percentChange >= 0 ? '+' : ''}{marketData.medianPrices.percentChange.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg. Days on Market:</span>
                    <span className="font-medium">{marketData.daysOnMarket[marketData.daysOnMarket.length - 1].days} days</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link 
                    to="/market-analysis" 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Full Market Analysis →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading market data...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Appraisals</h2>
        
        <div className="text-center py-8">
          <FileText size={40} className="text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-700">No appraisals yet</h3>
          <p className="text-gray-500 mt-1">Start a new appraisal for this property</p>
          <Link 
            to={`/appraisals/new?propertyId=${id}`} 
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FileText size={18} className="mr-2" />
            New Appraisal
          </Link>
        </div>
      </div>
    </div>
  );
};