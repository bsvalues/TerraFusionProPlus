import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Building2, 
  Home as HomeIcon, 
  DollarSign,
  ArrowRight,
  PlusSquare,
  MinusSquare,
  Save,
  RefreshCw,
  FileText,
  MapPin
} from 'lucide-react';

// Interface for adjustment factors
interface AdjustmentFactor {
  name: string;
  description: string;
  adjustmentType: 'percentage' | 'fixed';
  defaultValue: number;
  rangeMin?: number;
  rangeMax?: number;
  step?: number;
  enabled: boolean;
  value: number;
}

// Interface for subject property
interface SubjectProperty {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  lotSize: number;
  condition: string;
  basePricePerSqFt: number;
}

export const ValuationCalculator = () => {
  // State for the subject property
  const [subjectProperty, setSubjectProperty] = useState<SubjectProperty>({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: 'Single Family',
    squareFeet: 0,
    bedrooms: 0,
    bathrooms: 0,
    yearBuilt: 0,
    lotSize: 0,
    condition: 'Average',
    basePricePerSqFt: 350
  });

  // State for adjustment factors
  const [adjustmentFactors, setAdjustmentFactors] = useState<AdjustmentFactor[]>([
    {
      name: 'Location Quality',
      description: 'Adjustment based on the quality of the neighborhood and location',
      adjustmentType: 'percentage',
      defaultValue: 5,
      rangeMin: -20,
      rangeMax: 20,
      step: 1,
      enabled: true,
      value: 5
    },
    {
      name: 'Property Condition',
      description: 'Adjustment based on the condition of the property',
      adjustmentType: 'percentage',
      defaultValue: 0,
      rangeMin: -15,
      rangeMax: 15,
      step: 1,
      enabled: true,
      value: 0
    },
    {
      name: 'Age Adjustment',
      description: 'Adjustment based on the age of the property',
      adjustmentType: 'percentage',
      defaultValue: 0,
      rangeMin: -10,
      rangeMax: 5,
      step: 0.5,
      enabled: true,
      value: 0
    },
    {
      name: 'Lot Size Premium',
      description: 'Adjustment for lot size differences',
      adjustmentType: 'percentage',
      defaultValue: 0,
      rangeMin: -5,
      rangeMax: 15,
      step: 0.5,
      enabled: true,
      value: 0
    },
    {
      name: 'Room Count Adjustment',
      description: 'Adjustment for bedroom/bathroom differences',
      adjustmentType: 'fixed',
      defaultValue: 0,
      rangeMin: -30000,
      rangeMax: 50000,
      step: 5000,
      enabled: true,
      value: 0
    },
    {
      name: 'Quality of Construction',
      description: 'Adjustment for construction quality differences',
      adjustmentType: 'percentage',
      defaultValue: 0,
      rangeMin: -10,
      rangeMax: 10,
      step: 1,
      enabled: false,
      value: 0
    },
    {
      name: 'Amenities Adjustment',
      description: 'Adjustment for special amenities (pool, garage, etc.)',
      adjustmentType: 'fixed',
      defaultValue: 0,
      rangeMin: -20000,
      rangeMax: 50000,
      step: 5000,
      enabled: false,
      value: 0
    },
    {
      name: 'Market Trend Adjustment',
      description: 'Adjustment for market trends over time',
      adjustmentType: 'percentage',
      defaultValue: 3,
      rangeMin: -5,
      rangeMax: 10,
      step: 0.5,
      enabled: true,
      value: 3
    }
  ]);

  // State for calculated values
  const [baseValue, setBaseValue] = useState(0);
  const [totalAdjustments, setTotalAdjustments] = useState(0);
  const [finalValue, setFinalValue] = useState(0);
  const [valuesHistory, setValuesHistory] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // Sample properties for dropdown
  const [availableProperties, setAvailableProperties] = useState([
    { id: 1, address: '123 Main Street', city: 'Austin', state: 'TX', propertyType: 'Single Family', squareFeet: 2450 },
    { id: 2, address: '456 Oak Avenue', city: 'Austin', state: 'TX', propertyType: 'Condo', squareFeet: 1200 },
    { id: 3, address: '789 Elm Drive', city: 'Austin', state: 'TX', propertyType: 'Multi-Family', squareFeet: 3600 },
    { id: 4, address: '101 Pine Road', city: 'Austin', state: 'TX', propertyType: 'Single Family', squareFeet: 3200 }
  ]);
  
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

  // Load property details when selected from dropdown
  useEffect(() => {
    if (selectedPropertyId) {
      setLoading(true);
      
      // In a real app, fetch property details from API
      // For now, use the sample data
      const selectedProperty = availableProperties.find(p => p.id === selectedPropertyId);
      
      if (selectedProperty) {
        // Simulate a delay for API call
        setTimeout(() => {
          setSubjectProperty({
            ...subjectProperty,
            address: selectedProperty.address,
            city: selectedProperty.city,
            state: selectedProperty.state,
            propertyType: selectedProperty.propertyType,
            squareFeet: selectedProperty.squareFeet,
            // Add random data for the rest
            bedrooms: Math.floor(Math.random() * 3) + 2, // 2-4 bedrooms
            bathrooms: Math.floor(Math.random() * 2) + 1.5, // 1.5-3.5 bathrooms
            yearBuilt: Math.floor(Math.random() * 30) + 1990, // 1990-2020
            lotSize: Math.floor(Math.random() * 10000) + 5000, // 5000-15000 sq.ft.
            condition: ['Poor', 'Fair', 'Average', 'Good', 'Excellent'][Math.floor(Math.random() * 5)],
            basePricePerSqFt: Math.floor(Math.random() * 100) + 300 // $300-$400 per sq.ft.
          });
          
          setLoading(false);
        }, 500);
      }
    }
  }, [selectedPropertyId]);

  // Calculate valuation whenever inputs change
  useEffect(() => {
    calculateValuation();
  }, [subjectProperty, adjustmentFactors]);

  // Update the specific adjustment factor
  const updateAdjustmentFactor = (index: number, updates: Partial<AdjustmentFactor>) => {
    const newFactors = [...adjustmentFactors];
    newFactors[index] = { ...newFactors[index], ...updates };
    setAdjustmentFactors(newFactors);
  };

  // Handle property input changes
  const handlePropertyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (['squareFeet', 'bedrooms', 'bathrooms', 'yearBuilt', 'lotSize', 'basePricePerSqFt'].includes(name)) {
      setSubjectProperty({
        ...subjectProperty,
        [name]: parseFloat(value) || 0
      });
    } else {
      setSubjectProperty({
        ...subjectProperty,
        [name]: value
      });
    }
  };

  // Calculate the property valuation
  const calculateValuation = () => {
    // Calculate base value from square footage and base price per sq ft
    const base = subjectProperty.squareFeet * subjectProperty.basePricePerSqFt;
    setBaseValue(base);
    
    // Calculate adjustments
    let adjustmentAmount = 0;
    
    // Apply percentage adjustments first
    let percentageAdjustment = 0;
    adjustmentFactors.forEach(factor => {
      if (factor.enabled) {
        if (factor.adjustmentType === 'percentage') {
          percentageAdjustment += factor.value;
        }
      }
    });
    
    // Apply percentage to base
    adjustmentAmount += base * (percentageAdjustment / 100);
    
    // Apply fixed adjustments
    adjustmentFactors.forEach(factor => {
      if (factor.enabled) {
        if (factor.adjustmentType === 'fixed') {
          adjustmentAmount += factor.value;
        }
      }
    });
    
    setTotalAdjustments(adjustmentAmount);
    
    // Calculate final value
    const final = base + adjustmentAmount;
    setFinalValue(final);
    
    // Add to history
    setValuesHistory(prev => {
      const newHistory = [...prev, final];
      // Keep only last 5 values
      if (newHistory.length > 5) {
        return newHistory.slice(newHistory.length - 5);
      }
      return newHistory;
    });
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Reset all values to defaults
  const resetAdjustments = () => {
    setAdjustmentFactors(adjustmentFactors.map(factor => ({
      ...factor,
      value: factor.defaultValue
    })));
  };

  // Toggle an adjustment factor on/off
  const toggleAdjustmentFactor = (index: number) => {
    const newFactors = [...adjustmentFactors];
    newFactors[index].enabled = !newFactors[index].enabled;
    setAdjustmentFactors(newFactors);
  };

  // Save valuation (in a real app, would save to database)
  const saveValuation = () => {
    alert('Valuation saved successfully!');
    // In a real app, would save to database and redirect to valuation report
  };

  // Get property icon based on type
  const getPropertyIcon = (propertyType: string) => {
    switch(propertyType.toLowerCase()) {
      case 'single family':
        return <HomeIcon size={20} className="text-blue-500" />;
      case 'condo':
        return <Building2 size={20} className="text-green-500" />;
      case 'multi-family':
        return <Building2 size={20} className="text-purple-500" />;
      default:
        return <Building2 size={20} className="text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Valuation Calculator</h1>
          <p className="text-gray-600 mt-1">Calculate and adjust property valuations</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={resetAdjustments}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={18} className="mr-2 text-gray-600" />
            Reset Adjustments
          </button>
          <button
            onClick={saveValuation}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Save size={18} className="mr-2" />
            Save Valuation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Property Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Selector */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Select Property</h2>
            <div className="mb-4">
              <label htmlFor="propertySelect" className="block text-sm font-medium text-gray-700 mb-1">
                Choose an existing property
              </label>
              <select
                id="propertySelect"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedPropertyId || ''}
                onChange={(e) => setSelectedPropertyId(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">-- Select a property --</option>
                {availableProperties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.address}, {property.city} - {property.propertyType}
                  </option>
                ))}
              </select>
              <div className="mt-2 text-sm text-gray-500">
                Select a property to auto-fill information or enter details manually below.
              </div>
            </div>
          </div>

          {/* Property Information Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              {getPropertyIcon(subjectProperty.propertyType)}
              <span className="ml-2">Subject Property Information</span>
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={subjectProperty.address}
                      onChange={handlePropertyChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter property address"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={subjectProperty.city}
                      onChange={handlePropertyChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={subjectProperty.propertyType}
                      onChange={handlePropertyChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Single Family">Single Family</option>
                      <option value="Condo">Condo</option>
                      <option value="Multi-Family">Multi-Family</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Land">Land</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      value={subjectProperty.condition}
                      onChange={handlePropertyChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Poor">Poor</option>
                      <option value="Fair">Fair</option>
                      <option value="Average">Average</option>
                      <option value="Good">Good</option>
                      <option value="Excellent">Excellent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700 mb-1">
                      Square Feet
                    </label>
                    <input
                      type="number"
                      id="squareFeet"
                      name="squareFeet"
                      value={subjectProperty.squareFeet || ''}
                      onChange={handlePropertyChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      id="bedrooms"
                      name="bedrooms"
                      value={subjectProperty.bedrooms || ''}
                      onChange={handlePropertyChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      id="bathrooms"
                      name="bathrooms"
                      value={subjectProperty.bathrooms || ''}
                      onChange={handlePropertyChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-1">
                      Year Built
                    </label>
                    <input
                      type="number"
                      id="yearBuilt"
                      name="yearBuilt"
                      value={subjectProperty.yearBuilt || ''}
                      onChange={handlePropertyChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="lotSize" className="block text-sm font-medium text-gray-700 mb-1">
                      Lot Size (sq.ft.)
                    </label>
                    <input
                      type="number"
                      id="lotSize"
                      name="lotSize"
                      value={subjectProperty.lotSize || ''}
                      onChange={handlePropertyChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="basePricePerSqFt" className="block text-sm font-medium text-gray-700 mb-1">
                      Base Price Per Sq.Ft.
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="basePricePerSqFt"
                        name="basePricePerSqFt"
                        value={subjectProperty.basePricePerSqFt || ''}
                        onChange={handlePropertyChange}
                        className="w-full pl-7 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Adjustment Factors */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Adjustment Factors</h2>
            <div className="space-y-6">
              {adjustmentFactors.map((factor, index) => (
                <div key={index} className={`p-4 rounded-lg border ${factor.enabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <button 
                        onClick={() => toggleAdjustmentFactor(index)}
                        className={`mr-2 ${factor.enabled ? 'text-blue-500 hover:text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        {factor.enabled ? <MinusSquare size={20} /> : <PlusSquare size={20} />}
                      </button>
                      <h3 className={`font-medium ${factor.enabled ? 'text-gray-800' : 'text-gray-500'}`}>{factor.name}</h3>
                    </div>
                    {factor.adjustmentType === 'percentage' ? (
                      <span className={`text-sm font-medium px-2 py-1 rounded ${factor.enabled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                        Percentage
                      </span>
                    ) : (
                      <span className={`text-sm font-medium px-2 py-1 rounded ${factor.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        Fixed Amount
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-sm mb-3 ${factor.enabled ? 'text-gray-600' : 'text-gray-400'}`}>
                    {factor.description}
                  </p>
                  
                  {factor.enabled && (
                    <div className="flex items-center">
                      <input
                        type="range"
                        min={factor.rangeMin}
                        max={factor.rangeMax}
                        step={factor.step}
                        value={factor.value}
                        onChange={(e) => updateAdjustmentFactor(index, { value: parseFloat(e.target.value) })}
                        className="flex-1 mr-3"
                      />
                      <div className="relative">
                        {factor.adjustmentType === 'percentage' ? (
                          <div className="flex items-center">
                            <input
                              type="number"
                              min={factor.rangeMin}
                              max={factor.rangeMax}
                              step={factor.step}
                              value={factor.value}
                              onChange={(e) => updateAdjustmentFactor(index, { value: parseFloat(e.target.value) || 0 })}
                              className="w-20 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-7"
                            />
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                              %
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              min={factor.rangeMin}
                              max={factor.rangeMax}
                              step={factor.step}
                              value={factor.value}
                              onChange={(e) => updateAdjustmentFactor(index, { value: parseFloat(e.target.value) || 0 })}
                              className="w-28 pl-7 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Results and Summary */}
        <div className="space-y-6">
          {/* Valuation Summary */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-blue-50">
              <h2 className="text-xl font-semibold flex items-center text-blue-800">
                <Calculator size={20} className="mr-2 text-blue-600" />
                Valuation Summary
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Base Value:</span>
                  <span className="text-lg font-semibold">{formatCurrency(baseValue)}</span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Adjustments:</span>
                  <span className={`text-lg font-semibold ${totalAdjustments >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalAdjustments >= 0 ? '+' : ''}{formatCurrency(totalAdjustments)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-2">
                  <span className="text-gray-700 font-medium">Estimated Value:</span>
                  <span className="text-2xl font-bold text-blue-700">{formatCurrency(finalValue)}</span>
                </div>
                
                <div className="text-sm text-gray-500 text-right">
                  {subjectProperty.squareFeet > 0 && (
                    <div>
                      {formatCurrency(finalValue / subjectProperty.squareFeet)} per sq.ft.
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Value History</h3>
                  <button 
                    onClick={calculateValuation}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <RefreshCw size={14} className="mr-1" />
                    Recalculate
                  </button>
                </div>
                
                {valuesHistory.length > 0 ? (
                  <div className="space-y-2">
                    {valuesHistory.map((value, index) => (
                      <div key={index} className={`text-sm p-2 rounded ${index === valuesHistory.length - 1 ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600'}`}>
                        {formatCurrency(value)}
                        {index === valuesHistory.length - 1 && <span className="ml-2">(Current)</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 p-2">
                    No previous calculations
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={saveValuation}
                  className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Save size={18} className="mr-2" />
                  Save Valuation
                </button>
                
                <Link
                  to="/appraisals/new"
                  className="w-full flex justify-center items-center px-4 py-2 mt-3 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <FileText size={18} className="mr-2" />
                  Create New Appraisal
                </Link>
              </div>
            </div>
          </div>
          
          {/* Property Information */}
          {subjectProperty.address && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Property Summary</h2>
              <div className="flex items-start mb-4">
                <MapPin className="flex-shrink-0 text-red-500 mr-2 mt-1" size={16} />
                <div>
                  <h3 className="font-medium">{subjectProperty.address}</h3>
                  <p className="text-sm text-gray-600">{subjectProperty.city}, {subjectProperty.state}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Property Type:</span>
                  <span className="font-medium">{subjectProperty.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Square Feet:</span>
                  <span className="font-medium">{subjectProperty.squareFeet?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bedrooms:</span>
                  <span className="font-medium">{subjectProperty.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bathrooms:</span>
                  <span className="font-medium">{subjectProperty.bathrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Year Built:</span>
                  <span className="font-medium">{subjectProperty.yearBuilt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Condition:</span>
                  <span className="font-medium">{subjectProperty.condition}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link 
                  to={`/properties/${selectedPropertyId}`} 
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ArrowRight size={16} className="mr-1" />
                  View Full Property Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};