import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, MapPin, Home, Building2, DollarSign } from 'lucide-react';

interface ComparableFormValues {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  salePrice: string;
  saleDate: string;
  squareFeet: string;
  bedrooms: string;
  bathrooms: string;
  yearBuilt: string;
  propertyType: string;
  lotSize: string;
  condition: string;
  daysOnMarket: string;
  source: string;
  adjustmentNotes: string;
}

export const ComparableForm = () => {
  const { id, appraisalId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [appraisal, setAppraisal] = useState<any>(null);
  const [currentAppraisalId, setCurrentAppraisalId] = useState<string | null>(null);
  
  const [formValues, setFormValues] = useState<ComparableFormValues>({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    salePrice: '',
    saleDate: new Date().toISOString().split('T')[0],
    squareFeet: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    propertyType: 'Single Family',
    lotSize: '',
    condition: 'Average',
    daysOnMarket: '',
    source: 'MLS',
    adjustmentNotes: ''
  });

  // Parse appraisal ID from query params if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const appId = params.get('appraisalId') || appraisalId;
    if (appId) {
      setCurrentAppraisalId(appId);
    }
  }, [location, appraisalId]);

  // Fetch appraisal details if we have an appraisal ID
  useEffect(() => {
    if (currentAppraisalId) {
      setLoading(true);
      fetch(`/api/appraisals/${currentAppraisalId}`)
        .then(response => response.json())
        .then(data => {
          setAppraisal(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching appraisal:', error);
          setLoading(false);
        });
    }
  }, [currentAppraisalId]);

  // Fetch comparable data if editing an existing comparable
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/comparables/${id}`)
        .then(response => response.json())
        .then(data => {
          setFormValues({
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zipCode || '',
            salePrice: data.salePrice ? data.salePrice.toString() : '',
            saleDate: data.saleDate ? new Date(data.saleDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            squareFeet: data.squareFeet ? data.squareFeet.toString() : '',
            bedrooms: data.bedrooms ? data.bedrooms.toString() : '',
            bathrooms: data.bathrooms ? data.bathrooms.toString() : '',
            yearBuilt: data.yearBuilt ? data.yearBuilt.toString() : '',
            propertyType: data.propertyType || 'Single Family',
            lotSize: data.lotSize ? data.lotSize.toString() : '',
            condition: data.condition || 'Average',
            daysOnMarket: data.daysOnMarket ? data.daysOnMarket.toString() : '',
            source: data.source || 'MLS',
            adjustmentNotes: data.adjustmentNotes || ''
          });
          
          // Set current appraisal ID if available from the comparable
          if (data.appraisalId) {
            setCurrentAppraisalId(data.appraisalId.toString());
          }
          
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching comparable:', error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAppraisalId) {
      alert('Please select an appraisal for this comparable');
      return;
    }
    
    setSubmitting(true);
    
    // Convert form values to appropriate types
    const comparableData = {
      appraisalId: parseInt(currentAppraisalId),
      address: formValues.address,
      city: formValues.city,
      state: formValues.state,
      zipCode: formValues.zipCode,
      salePrice: formValues.salePrice ? parseFloat(formValues.salePrice) : null,
      saleDate: formValues.saleDate,
      squareFeet: formValues.squareFeet ? parseFloat(formValues.squareFeet) : null,
      bedrooms: formValues.bedrooms ? parseFloat(formValues.bedrooms) : null,
      bathrooms: formValues.bathrooms ? parseFloat(formValues.bathrooms) : null,
      yearBuilt: formValues.yearBuilt ? parseInt(formValues.yearBuilt) : null,
      propertyType: formValues.propertyType,
      lotSize: formValues.lotSize ? parseFloat(formValues.lotSize) : null,
      condition: formValues.condition,
      daysOnMarket: formValues.daysOnMarket ? parseInt(formValues.daysOnMarket) : null,
      source: formValues.source,
      adjustmentNotes: formValues.adjustmentNotes
    };
    
    const url = id ? `/api/comparables/${id}` : '/api/comparables';
    const method = id ? 'PUT' : 'POST';
    
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comparableData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setSubmitting(false);
        // Navigate back to the appraisal detail page
        navigate(`/appraisals/${currentAppraisalId}`);
      })
      .catch(error => {
        console.error('Error saving comparable:', error);
        setSubmitting(false);
        alert('Error saving comparable. Please try again.');
      });
  };

  // Get property icon based on type
  const getPropertyIcon = (propertyType: string) => {
    switch(propertyType.toLowerCase()) {
      case 'single family':
        return <Home size={20} className="text-blue-500" />;
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
      <div className="mb-6">
        <Link 
          to={currentAppraisalId ? `/appraisals/${currentAppraisalId}` : "/appraisals"} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to {currentAppraisalId ? 'Appraisal' : 'Appraisals'}</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{id ? 'Edit Comparable' : 'New Comparable'}</h1>
          <p className="text-gray-600 mt-1">
            {id ? 'Update comparable property information' : 'Add a new comparable property'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Appraisal Information */}
          {appraisal && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h2 className="text-md font-semibold text-blue-800 mb-2">Associated Appraisal</h2>
              <div className="flex items-center">
                <MapPin className="mr-2 text-blue-500" size={16} />
                <div>
                  <span className="font-medium">{appraisal.property?.address}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    {appraisal.property?.city}, {appraisal.property?.state}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Comparable Property Information */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold flex items-center">
                {getPropertyIcon(formValues.propertyType)}
                <span className="ml-2">Comparable Property Information</span>
              </h2>
            </div>
            <div className="p-6">
              {/* Address Information */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3 text-gray-700">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formValues.address}
                      onChange={handleInputChange}
                      required
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter street address"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formValues.city}
                      onChange={handleInputChange}
                      required
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formValues.state}
                      onChange={handleInputChange}
                      required
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formValues.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>
              </div>

              {/* Sale Information */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3 text-gray-700">Sale Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Sale Price *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="salePrice"
                        name="salePrice"
                        value={formValues.salePrice}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-7 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter sale price"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="saleDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Sale Date *
                    </label>
                    <input
                      type="date"
                      id="saleDate"
                      name="saleDate"
                      value={formValues.saleDate}
                      onChange={handleInputChange}
                      required
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="daysOnMarket" className="block text-sm font-medium text-gray-700 mb-1">
                      Days on Market
                    </label>
                    <input
                      type="number"
                      id="daysOnMarket"
                      name="daysOnMarket"
                      value={formValues.daysOnMarket}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter days on market"
                    />
                  </div>
                  <div>
                    <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                      Source
                    </label>
                    <select
                      id="source"
                      name="source"
                      value={formValues.source}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="MLS">MLS</option>
                      <option value="Public Records">Public Records</option>
                      <option value="Direct Knowledge">Direct Knowledge</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3 text-gray-700">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type *
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formValues.propertyType}
                      onChange={handleInputChange}
                      required
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Single Family">Single Family</option>
                      <option value="Condo">Condo</option>
                      <option value="Multi-Family">Multi-Family</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Land">Land</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700 mb-1">
                      Square Feet *
                    </label>
                    <input
                      type="number"
                      id="squareFeet"
                      name="squareFeet"
                      value={formValues.squareFeet}
                      onChange={handleInputChange}
                      required
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter square feet"
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
                      value={formValues.yearBuilt}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter year built"
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
                      value={formValues.bedrooms}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter bedrooms"
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
                      value={formValues.bathrooms}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter bathrooms"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label htmlFor="lotSize" className="block text-sm font-medium text-gray-700 mb-1">
                      Lot Size (sq.ft.)
                    </label>
                    <input
                      type="number"
                      id="lotSize"
                      name="lotSize"
                      value={formValues.lotSize}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter lot size"
                    />
                  </div>
                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      value={formValues.condition}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Adjustment Notes */}
              <div>
                <label htmlFor="adjustmentNotes" className="block text-sm font-medium text-gray-700 mb-1">
                  Adjustment Notes
                </label>
                <textarea
                  id="adjustmentNotes"
                  name="adjustmentNotes"
                  value={formValues.adjustmentNotes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter any notes about adjustments to this comparable"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Link
              to={currentAppraisalId ? `/appraisals/${currentAppraisalId}` : "/appraisals"}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || !currentAppraisalId}
              className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                submitting || !currentAppraisalId
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save size={18} className="mr-2" />
                  {id ? 'Update Comparable' : 'Add Comparable'}
                </span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};