import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProperty } from '../hooks/useProperties';
import { useAppraisalsByProperty, useCreateAppraisal } from '../hooks/useAppraisals';
import { InsertAppraisal } from '../types';
import { format } from 'date-fns';

// Status options for appraisals
const APPRAISAL_STATUSES = [
  'Draft',
  'In Progress',
  'Pending Review',
  'Completed',
  'Canceled'
];

// Purpose options for appraisals
const APPRAISAL_PURPOSES = [
  'Purchase',
  'Refinance',
  'Tax Assessment',
  'Estate Planning',
  'Insurance',
  'Divorce Settlement',
  'Litigation',
  'Portfolio Valuation'
];

// Report type options
const REPORT_TYPES = [
  'URAR',
  'Limited',
  'Desktop',
  'Commercial',
  'BPO',
  'Narrative'
];

// Valuation method options
const VALUATION_METHODS = [
  'Sales Comparison',
  'Income Approach',
  'Cost Approach',
  'Hybrid'
];

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const propertyId = id ? parseInt(id, 10) : 0;
  
  const { data: property, isLoading: propertyLoading, error: propertyError } = useProperty(propertyId);
  const { 
    data: appraisals = [], 
    isLoading: appraisalsLoading, 
    error: appraisalsError 
  } = useAppraisalsByProperty(propertyId);
  
  const createAppraisalMutation = useCreateAppraisal();
  
  // Form visibility state
  const [showNewAppraisalForm, setShowNewAppraisalForm] = useState(false);
  
  // New appraisal form state
  const [newAppraisal, setNewAppraisal] = useState<Partial<InsertAppraisal>>({
    property_id: propertyId,
    appraiser_id: 1, // Default to first appraiser for now
    status: 'Draft',
    purpose: 'Purchase',
    report_type: 'URAR',
    valuation_method: 'Sales Comparison'
  });
  
  // Handle input changes for new appraisal form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'market_value' && value !== '') {
      setNewAppraisal(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
    } else {
      setNewAppraisal(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle appraisal creation
  const handleCreateAppraisal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAppraisal.property_id || !newAppraisal.appraiser_id || !newAppraisal.status || !newAppraisal.purpose) {
      alert('Please fill out all required fields');
      return;
    }
    
    createAppraisalMutation.mutate(newAppraisal as InsertAppraisal, {
      onSuccess: () => {
        setShowNewAppraisalForm(false);
        setNewAppraisal({
          property_id: propertyId,
          appraiser_id: 1,
          status: 'Draft',
          purpose: 'Purchase',
          report_type: 'URAR',
          valuation_method: 'Sales Comparison'
        });
      },
      onError: (error) => {
        console.error('Error creating appraisal:', error);
        alert('Failed to create appraisal. Please try again.');
      }
    });
  };
  
  // Handle navigation to appraisal detail
  const handleViewAppraisal = (appraisalId: number) => {
    navigate(`/appraisals/${appraisalId}`);
  };
  
  if (propertyLoading || appraisalsLoading) {
    return <div className="p-8">Loading property details...</div>;
  }
  
  if (propertyError) {
    return <div className="p-8 text-red-500">Error loading property: {(propertyError as Error).message}</div>;
  }
  
  if (!property) {
    return <div className="p-8 text-red-500">Property not found</div>;
  }
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/properties" className="text-primary hover:underline">&larr; Back to Properties</Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <div className="text-6xl text-gray-400">{property.property_type === 'Commercial' ? '🏢' : '🏠'}</div>
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{property.address}</h1>
          <p className="text-xl text-gray-600 mb-6">{property.city}, {property.state} {property.zip_code}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">Property Details</h2>
              <dl className="grid grid-cols-2 gap-y-3">
                <dt className="font-medium">Property Type:</dt>
                <dd>{property.property_type}</dd>
                
                <dt className="font-medium">Year Built:</dt>
                <dd>{property.year_built}</dd>
                
                <dt className="font-medium">Square Footage:</dt>
                <dd>{property.square_feet.toLocaleString()} sq ft</dd>
                
                <dt className="font-medium">Bedrooms:</dt>
                <dd>{property.bedrooms}</dd>
                
                <dt className="font-medium">Bathrooms:</dt>
                <dd>{property.bathrooms}</dd>
                
                <dt className="font-medium">Lot Size:</dt>
                <dd>{property.lot_size ? `${property.lot_size.toLocaleString()} sq ft` : 'N/A'}</dd>
                
                <dt className="font-medium">Parcel Number:</dt>
                <dd>{property.parcel_number || 'N/A'}</dd>
                
                <dt className="font-medium">Zoning:</dt>
                <dd>{property.zoning || 'N/A'}</dd>
              </dl>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">Location Information</h2>
              <dl className="grid grid-cols-2 gap-y-3">
                <dt className="font-medium">Address:</dt>
                <dd>{property.address}</dd>
                
                <dt className="font-medium">City:</dt>
                <dd>{property.city}</dd>
                
                <dt className="font-medium">State:</dt>
                <dd>{property.state}</dd>
                
                <dt className="font-medium">ZIP Code:</dt>
                <dd>{property.zip_code}</dd>
                
                <dt className="font-medium">Latitude:</dt>
                <dd>{property.latitude || 'N/A'}</dd>
                
                <dt className="font-medium">Longitude:</dt>
                <dd>{property.longitude || 'N/A'}</dd>
                
                <dt className="font-medium">Date Added:</dt>
                <dd>{format(new Date(property.created_at), 'MMM d, yyyy')}</dd>
              </dl>
            </div>
          </div>
          
          {property.description && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Appraisals Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Appraisals</h2>
            <button 
              onClick={() => setShowNewAppraisalForm(!showNewAppraisalForm)} 
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              {showNewAppraisalForm ? 'Cancel' : 'New Appraisal'}
            </button>
          </div>
          
          {/* New Appraisal Form */}
          {showNewAppraisalForm && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Create New Appraisal</h3>
              <form onSubmit={handleCreateAppraisal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status *</label>
                  <select
                    name="status"
                    value={newAppraisal.status}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {APPRAISAL_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Purpose *</label>
                  <select
                    name="purpose"
                    value={newAppraisal.purpose}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {APPRAISAL_PURPOSES.map(purpose => (
                      <option key={purpose} value={purpose}>{purpose}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Market Value</label>
                  <input
                    type="number"
                    name="market_value"
                    value={newAppraisal.market_value || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Report Type</label>
                  <select
                    name="report_type"
                    value={newAppraisal.report_type || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Report Type</option>
                    {REPORT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Valuation Method</label>
                  <select
                    name="valuation_method"
                    value={newAppraisal.valuation_method || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Valuation Method</option>
                    {VALUATION_METHODS.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Client Name</label>
                  <input
                    type="text"
                    name="client_name"
                    value={newAppraisal.client_name || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Client Email</label>
                  <input
                    type="email"
                    name="client_email"
                    value={newAppraisal.client_email || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Client Phone</label>
                  <input
                    type="tel"
                    name="client_phone"
                    value={newAppraisal.client_phone || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lender Name</label>
                  <input
                    type="text"
                    name="lender_name"
                    value={newAppraisal.lender_name || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Loan Number</label>
                  <input
                    type="text"
                    name="loan_number"
                    value={newAppraisal.loan_number || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Intended Use</label>
                  <textarea
                    name="intended_use"
                    value={newAppraisal.intended_use || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Scope of Work</label>
                  <textarea
                    name="scope_of_work"
                    value={newAppraisal.scope_of_work || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={newAppraisal.notes || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  ></textarea>
                </div>
                <div className="md:col-span-2 mt-4">
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                    disabled={createAppraisalMutation.isPending}
                  >
                    {createAppraisalMutation.isPending ? 'Creating...' : 'Create Appraisal'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Appraisals List */}
          {appraisalsError && (
            <div className="text-red-500 mb-4">
              Error loading appraisals: {(appraisalsError as Error).message}
            </div>
          )}
          
          {appraisals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No appraisals found for this property. Create a new appraisal to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purpose
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Market Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appraisals.map((appraisal) => (
                    <tr key={appraisal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {format(new Date(appraisal.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${appraisal.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            appraisal.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                            appraisal.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' : 
                            appraisal.status === 'Canceled' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {appraisal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {appraisal.purpose}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {appraisal.market_value 
                          ? `$${appraisal.market_value.toLocaleString()}` 
                          : 'Not determined'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {appraisal.client_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <button 
                          onClick={() => handleViewAppraisal(appraisal.id)}
                          className="text-primary hover:text-primary-dark"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;