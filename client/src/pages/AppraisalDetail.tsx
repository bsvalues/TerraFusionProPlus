import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppraisal, useUpdateAppraisal } from '../hooks/useAppraisals';
import { useProperty } from '../hooks/useProperties';
import { useComparables, useCreateComparable } from '../hooks/useComparables';
import { Appraisal, InsertComparable } from '../types';
import { format } from 'date-fns';

// Status options for appraisals
const APPRAISAL_STATUSES = [
  'Draft',
  'In Progress',
  'Pending Review',
  'Completed',
  'Canceled'
];

// Property type options for comparables
const PROPERTY_TYPES = [
  'Single Family',
  'Condo',
  'Multi-Family',
  'Commercial',
  'Land',
  'Industrial',
  'Special Purpose'
];

// Condition options for comparables
const CONDITION_OPTIONS = [
  'Excellent',
  'Good',
  'Average',
  'Fair',
  'Poor'
];

const AppraisalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const appraisalId = id ? parseInt(id, 10) : 0;
  
  const { 
    data: appraisal, 
    isLoading: appraisalLoading, 
    error: appraisalError 
  } = useAppraisal(appraisalId);
  
  const { 
    data: property, 
    isLoading: propertyLoading 
  } = useProperty(appraisal?.property_id || 0, {
    enabled: !!appraisal?.property_id
  });
  
  const { 
    data: comparables = [], 
    isLoading: comparablesLoading, 
    error: comparablesError 
  } = useComparables(appraisalId);
  
  const updateAppraisalMutation = useUpdateAppraisal();
  const createComparableMutation = useCreateComparable();
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedAppraisal, setEditedAppraisal] = useState<Partial<Appraisal>>({});
  
  // State for creating a new comparable
  const [showComparableForm, setShowComparableForm] = useState(false);
  const [newComparable, setNewComparable] = useState<Partial<InsertComparable>>({
    appraisal_id: appraisalId,
    property_type: 'Single Family',
    condition: 'Good',
    sale_date: format(new Date(), 'yyyy-MM-dd'),
  });
  
  // Function to start editing
  const handleStartEditing = () => {
    if (appraisal) {
      setEditedAppraisal({
        ...appraisal
      });
      setIsEditing(true);
    }
  };
  
  // Function to cancel editing
  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditedAppraisal({});
  };
  
  // Handle input changes for appraisal editing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'market_value' && value !== '') {
      setEditedAppraisal(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
    } else {
      setEditedAppraisal(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle appraisal update
  const handleUpdateAppraisal = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateAppraisalMutation.mutate(
      { id: appraisalId, data: editedAppraisal },
      {
        onSuccess: () => {
          setIsEditing(false);
          setEditedAppraisal({});
        },
        onError: (error) => {
          console.error('Error updating appraisal:', error);
          alert('Failed to update appraisal. Please try again.');
        }
      }
    );
  };
  
  // Handle input changes for new comparable form
  const handleComparableInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if ([
      'sale_price', 
      'square_feet', 
      'bedrooms', 
      'bathrooms', 
      'year_built', 
      'lot_size',
      'days_on_market',
      'adjusted_price'
    ].includes(name)) {
      setNewComparable(prev => ({
        ...prev,
        [name]: value === '' ? '' : Number(value)
      }));
    } else {
      setNewComparable(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle comparable creation
  const handleCreateComparable = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComparable.address || !newComparable.city || !newComparable.state || 
        !newComparable.zip_code || !newComparable.sale_price || !newComparable.sale_date || 
        !newComparable.square_feet || !newComparable.property_type) {
      alert('Please fill out all required fields');
      return;
    }
    
    createComparableMutation.mutate(
      { ...newComparable, appraisal_id: appraisalId } as InsertComparable,
      {
        onSuccess: () => {
          setShowComparableForm(false);
          setNewComparable({
            appraisal_id: appraisalId,
            property_type: 'Single Family',
            condition: 'Good',
            sale_date: format(new Date(), 'yyyy-MM-dd'),
          });
        },
        onError: (error) => {
          console.error('Error creating comparable:', error);
          alert('Failed to create comparable. Please try again.');
        }
      }
    );
  };
  
  // Navigate to property detail
  const handleViewProperty = () => {
    if (appraisal?.property_id) {
      navigate(`/properties/${appraisal.property_id}`);
    }
  };
  
  // Navigate to comparable detail
  const handleViewComparable = (comparableId: number) => {
    navigate(`/comparables/${comparableId}`);
  };
  
  if (appraisalLoading || propertyLoading || comparablesLoading) {
    return <div className="p-8">Loading appraisal details...</div>;
  }
  
  if (appraisalError) {
    return <div className="p-8 text-red-500">Error loading appraisal: {(appraisalError as Error).message}</div>;
  }
  
  if (!appraisal) {
    return <div className="p-8 text-red-500">Appraisal not found</div>;
  }
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/appraisals" className="text-primary hover:underline">&larr; Back to Appraisals</Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-1">Appraisal #{appraisal.id}</h1>
                <div className="flex items-center mb-4">
                  <span 
                    className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full 
                      ${appraisal.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      appraisal.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                      appraisal.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' : 
                      appraisal.status === 'Canceled' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {appraisal.status}
                  </span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-600">Created on {format(new Date(appraisal.created_at), 'MMM d, yyyy')}</span>
                </div>
              </div>
              
              {!isEditing && (
                <button 
                  onClick={handleStartEditing}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Edit Appraisal
                </button>
              )}
            </div>
            
            {property && (
              <div 
                onClick={handleViewProperty}
                className="bg-gray-50 p-4 rounded-md mb-6 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-medium text-lg mb-1">Subject Property</h3>
                <p className="text-gray-700">{property.address}, {property.city}, {property.state} {property.zip_code}</p>
                <div className="mt-2 text-sm text-gray-600">
                  {property.property_type} • {property.square_feet} sq ft • {property.bedrooms} beds • {property.bathrooms} baths • Built {property.year_built}
                </div>
              </div>
            )}
            
            {isEditing ? (
              <form onSubmit={handleUpdateAppraisal} className="border rounded-md p-4">
                <h3 className="text-xl font-semibold mb-4">Edit Appraisal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      name="status"
                      value={editedAppraisal.status || appraisal.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {APPRAISAL_STATUSES.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Purpose</label>
                    <input
                      type="text"
                      name="purpose"
                      value={editedAppraisal.purpose || appraisal.purpose}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Market Value</label>
                    <input
                      type="number"
                      name="market_value"
                      value={editedAppraisal.market_value ?? appraisal.market_value ?? ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Report Type</label>
                    <input
                      type="text"
                      name="report_type"
                      value={editedAppraisal.report_type || appraisal.report_type || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Client Name</label>
                    <input
                      type="text"
                      name="client_name"
                      value={editedAppraisal.client_name || appraisal.client_name || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Client Email</label>
                    <input
                      type="email"
                      name="client_email"
                      value={editedAppraisal.client_email || appraisal.client_email || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Client Phone</label>
                    <input
                      type="tel"
                      name="client_phone"
                      value={editedAppraisal.client_phone || appraisal.client_phone || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Valuation Method</label>
                    <input
                      type="text"
                      name="valuation_method"
                      value={editedAppraisal.valuation_method || appraisal.valuation_method || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={editedAppraisal.notes || appraisal.notes || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                  <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                    <button
                      type="button"
                      onClick={handleCancelEditing}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                      disabled={updateAppraisalMutation.isPending}
                    >
                      {updateAppraisalMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">Appraisal Details</h3>
                  <dl className="grid grid-cols-2 gap-y-3">
                    <dt className="font-medium">Purpose:</dt>
                    <dd>{appraisal.purpose}</dd>
                    
                    <dt className="font-medium">Market Value:</dt>
                    <dd>{appraisal.market_value 
                      ? `$${appraisal.market_value.toLocaleString()}` 
                      : 'Not determined'}</dd>
                    
                    <dt className="font-medium">Status:</dt>
                    <dd>{appraisal.status}</dd>
                    
                    <dt className="font-medium">Report Type:</dt>
                    <dd>{appraisal.report_type || 'N/A'}</dd>
                    
                    <dt className="font-medium">Valuation Method:</dt>
                    <dd>{appraisal.valuation_method || 'N/A'}</dd>
                    
                    <dt className="font-medium">Created:</dt>
                    <dd>{format(new Date(appraisal.created_at), 'MMM d, yyyy')}</dd>
                    
                    <dt className="font-medium">Completed:</dt>
                    <dd>{appraisal.completed_at 
                      ? format(new Date(appraisal.completed_at), 'MMM d, yyyy') 
                      : 'Not completed'}</dd>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">Client Information</h3>
                  <dl className="grid grid-cols-2 gap-y-3">
                    <dt className="font-medium">Client Name:</dt>
                    <dd>{appraisal.client_name || 'N/A'}</dd>
                    
                    <dt className="font-medium">Client Email:</dt>
                    <dd>{appraisal.client_email || 'N/A'}</dd>
                    
                    <dt className="font-medium">Client Phone:</dt>
                    <dd>{appraisal.client_phone || 'N/A'}</dd>
                    
                    <dt className="font-medium">Lender Name:</dt>
                    <dd>{appraisal.lender_name || 'N/A'}</dd>
                    
                    <dt className="font-medium">Loan Number:</dt>
                    <dd>{appraisal.loan_number || 'N/A'}</dd>
                    
                    <dt className="font-medium">Intended Use:</dt>
                    <dd>{appraisal.intended_use || 'N/A'}</dd>
                  </dl>
                </div>
              </div>
            )}
            
            {!isEditing && appraisal.notes && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 border-b pb-2">Notes</h3>
                <p className="text-gray-700 whitespace-pre-line">{appraisal.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Comparables Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Comparable Properties</h2>
            <button 
              onClick={() => setShowComparableForm(!showComparableForm)} 
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              {showComparableForm ? 'Cancel' : 'Add Comparable'}
            </button>
          </div>
          
          {/* New Comparable Form */}
          {showComparableForm && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Add Comparable Property</h3>
              <form onSubmit={handleCreateComparable} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={newComparable.address || ''}
                    onChange={handleComparableInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={newComparable.city || ''}
                    onChange={handleComparableInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={newComparable.state || ''}
                    onChange={handleComparableInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP Code *</label>
                  <input
                    type="text"
                    name="zip_code"
                    value={newComparable.zip_code || ''}
                    onChange={handleComparableInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sale Price *</label>
                  <input
                    type="number"
                    name="sale_price"
                    value={newComparable.sale_price || ''}
                    onChange={handleComparableInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sale Date *</label>
                  <input
                    type="date"
                    name="sale_date"
                    value={newComparable.sale_date || ''}
                    onChange={handleComparableInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Square Feet *</label>
                  <input
                    type="number"
                    name="square_feet"
                    value={newComparable.square_feet || ''}
                    onChange={handleComparableInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Property Type *</label>
                  <select
                    name="property_type"
                    value={newComparable.property_type || ''}
                    onChange={handleComparableInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {PROPERTY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={newComparable.bedrooms || ''}
                    onChange={handleComparableInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={newComparable.bathrooms || ''}
                    onChange={handleComparableInputChange}
                    step="0.5"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year Built</label>
                  <input
                    type="number"
                    name="year_built"
                    value={newComparable.year_built || ''}
                    onChange={handleComparableInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lot Size</label>
                  <input
                    type="number"
                    name="lot_size"
                    value={newComparable.lot_size || ''}
                    onChange={handleComparableInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Condition</label>
                  <select
                    name="condition"
                    value={newComparable.condition || ''}
                    onChange={handleComparableInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Condition</option>
                    {CONDITION_OPTIONS.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Days on Market</label>
                  <input
                    type="number"
                    name="days_on_market"
                    value={newComparable.days_on_market || ''}
                    onChange={handleComparableInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Source</label>
                  <input
                    type="text"
                    name="source"
                    value={newComparable.source || ''}
                    onChange={handleComparableInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., MLS, Public Records, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Adjusted Price</label>
                  <input
                    type="number"
                    name="adjusted_price"
                    value={newComparable.adjusted_price || ''}
                    onChange={handleComparableInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Adjustment Notes</label>
                  <textarea
                    name="adjustment_notes"
                    value={newComparable.adjustment_notes || ''}
                    onChange={handleComparableInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter notes about price adjustments"
                  ></textarea>
                </div>
                <div className="md:col-span-2 mt-4">
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                    disabled={createComparableMutation.isPending}
                  >
                    {createComparableMutation.isPending ? 'Adding...' : 'Add Comparable'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Comparables List */}
          {comparablesError && (
            <div className="text-red-500 mb-4">
              Error loading comparables: {(comparablesError as Error).message}
            </div>
          )}
          
          {comparables.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No comparable properties added yet. Add comparables to assist with the valuation.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparables.map((comparable) => (
                <div 
                  key={comparable.id}
                  onClick={() => handleViewComparable(comparable.id)}
                  className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="h-32 bg-gray-200 flex items-center justify-center">
                    <div className="text-4xl text-gray-400">{comparable.property_type === 'Commercial' ? '🏢' : '🏠'}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{comparable.address}</h3>
                    <p className="text-gray-600 text-sm mb-2">{comparable.city}, {comparable.state} {comparable.zip_code}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-primary">${comparable.sale_price.toLocaleString()}</span>
                      <span className="text-sm text-gray-600">
                        Sold: {format(new Date(comparable.sale_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Sqft:</span> {comparable.square_feet.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Type:</span> {comparable.property_type}
                      </div>
                      {comparable.bedrooms !== null && (
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Beds:</span> {comparable.bedrooms}
                        </div>
                      )}
                      {comparable.bathrooms !== null && (
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Baths:</span> {comparable.bathrooms}
                        </div>
                      )}
                      {comparable.year_built !== null && (
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Year:</span> {comparable.year_built}
                        </div>
                      )}
                      {comparable.condition && (
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Condition:</span> {comparable.condition}
                        </div>
                      )}
                    </div>
                    
                    {comparable.adjusted_price && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Adjusted Price:</span>
                          <span className="font-bold">${comparable.adjusted_price.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppraisalDetail;