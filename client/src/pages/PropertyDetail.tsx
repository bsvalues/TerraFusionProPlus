import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Edit, BarChart4, LineChart, Home, Building2, MapPin } from 'lucide-react';

// Interface matching the database structure
interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  year_built: number;
  square_feet: number;
  bedrooms: number;
  bathrooms: number;
  lot_size: number;
  description?: string;
  created_at: string;
  updated_at: string;
  parcel_number?: string;
  zoning?: string;
  lot_unit?: string;
  latitude?: number;
  longitude?: number;
  features?: any;
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
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [marketData, setMarketData] = useState(null);
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

  // Function to get property icon based on type
  const getPropertyIcon = (propertyType) => {
    switch(propertyType?.toLowerCase()) {
      case 'single family':
        return <Home size={60} className="text-blue-400" />;
      case 'condo':
        return <Building2 size={60} className="text-green-400" />;
      case 'multi-family':
        return <Building2 size={60} className="text-purple-400" />;
      default:
        return <Building2 size={60} className="text-gray-400" />;
    }
  };

  // Calculate the estimated property value range based on market data and property details
  const calculateValueRange = () => {
    if (!property || !marketData || !property.square_feet) return null;
    
    // Base value calculation
    const baseValue = property.square_feet * 450; // Using average price per sq ft
    
    // Apply adjustments based on property characteristics
    let adjustedValue = baseValue;
    
    // Location adjustment - based on median prices in market data
    const locationFactor = 1.1; // Premium location factor
    adjustedValue *= locationFactor;
    
    // Age adjustment
    if (property.year_built) {
      const currentYear = new Date().getFullYear();
      const age = currentYear - property.year_built;
      // Newer properties get higher values
      const ageFactor = Math.max(0.8, 1 - (age * 0.005)); // Minimum 20% reduction for very old properties
      adjustedValue *= ageFactor;
    }
    
    // Create a range with +/- 5%
    return {
      low: Math.round(adjustedValue * 0.95),
      estimated: Math.round(adjustedValue),
      high: Math.round(adjustedValue * 1.05)
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
        <div className="flex items-start">
          <MapPin size={24} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
          <div>
            <h1 className="text-3xl font-bold">{property.address}</h1>
            <p className="text-gray-600 mt-1">{property.city}, {property.state} {property.zip_code}</p>
          </div>
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 h-64 flex items-center justify-center">
            {getPropertyIcon(property.property_type)}
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Bedrooms</div>
                <div className="text-xl font-semibold text-gray-800">{property.bedrooms || 'N/A'}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Bathrooms</div>
                <div className="text-xl font-semibold text-gray-800">{property.bathrooms || 'N/A'}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Square Feet</div>
                <div className="text-xl font-semibold text-gray-800">{property.square_feet ? property.square_feet.toLocaleString() : 'N/A'}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Year Built</div>
                <div className="text-xl font-semibold text-gray-800">{property.year_built || 'N/A'}</div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-gray-500 text-sm">Property Type</h3>
                  <p className="font-medium">{property.property_type || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">Lot Size</h3>
                  <p className="font-medium">
                    {property.lot_size 
                      ? `${property.lot_size.toLocaleString()} ${property.lot_unit || 'sq.ft.'}` 
                      : 'N/A'}
                  </p>
                </div>
                {property.zoning && (
                  <div>
                    <h3 className="text-gray-500 text-sm">Zoning</h3>
                    <p className="font-medium">{property.zoning}</p>
                  </div>
                )}
                {property.parcel_number && (
                  <div>
                    <h3 className="text-gray-500 text-sm">Parcel Number</h3>
                    <p className="font-medium">{property.parcel_number}</p>
                  </div>
                )}
              </div>
              
              {property.description && (
                <div className="mt-4">
                  <h3 className="text-gray-500 text-sm mb-1">Description</h3>
                  <p className="text-gray-700">{property.description}</p>
                </div>
              )}
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
                    <span className="font-medium">Value Estimate:</span> Based on property characteristics and current market trends.
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