import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Building, 
  MapPin, 
  Home, 
  Calendar, 
  SquareStack, 
  Ruler, 
  Edit, 
  FileSpreadsheet, 
  Grid3X3, 
  DollarSign, 
  Plus
} from 'lucide-react';
import { apiRequest } from '../lib/query-client';

interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  lotSize: number;
  lastAppraisalDate?: string;
  lastAppraisalValue?: number;
  description?: string;
  parcelNumber?: string;
  ownerName?: string;
  ownerContact?: string;
  createdAt: string;
  updatedAt: string;
}

interface Appraisal {
  id: number;
  propertyId: number;
  appraiserId: number;
  appraiserName: string;
  orderDate: string;
  inspectionDate?: string;
  completedAt?: string;
  marketValue?: number;
  status: string;
  clientName: string;
  loanNumber?: string;
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Fetch property data
  const { data: property, isLoading: isLoadingProperty } = useQuery({
    queryKey: ['/api/properties', id],
    queryFn: () => apiRequest<Property>(`/api/properties/${id}`),
    // In a real app, we'd connect to the actual API
    enabled: false,
  });
  
  // Fetch property appraisals
  const { data: appraisals, isLoading: isLoadingAppraisals } = useQuery({
    queryKey: ['/api/properties', id, 'appraisals'],
    queryFn: () => apiRequest<Appraisal[]>(`/api/properties/${id}/appraisals`),
    // In a real app, we'd connect to the actual API
    enabled: false,
  });
  
  // Mock data for demo
  const mockProperty: Property = {
    id: parseInt(id || '1'),
    address: '123 Main Street',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    propertyType: 'Single Family',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1850,
    yearBuilt: 2005,
    lotSize: 0.25,
    lastAppraisalDate: '2025-03-15',
    lastAppraisalValue: 450000,
    description: 'Beautiful single-family home in desirable neighborhood. Well-maintained with recent updates to kitchen and bathrooms. Fenced backyard with mature trees and covered patio.',
    parcelNumber: '12345-67890',
    ownerName: 'John Smith',
    ownerContact: 'john.smith@example.com',
    createdAt: '2025-01-10T14:30:00Z',
    updatedAt: '2025-05-15T09:45:00Z',
  };
  
  const mockAppraisals: Appraisal[] = [
    {
      id: 101,
      propertyId: parseInt(id || '1'),
      appraiserId: 1,
      appraiserName: 'Jane Appraiser',
      orderDate: '2025-03-10',
      inspectionDate: '2025-03-12',
      completedAt: '2025-03-15',
      marketValue: 450000,
      status: 'completed',
      clientName: 'ABC Mortgage',
      loanNumber: 'L12345',
    },
    {
      id: 102,
      propertyId: parseInt(id || '1'),
      appraiserId: 2,
      appraiserName: 'Bob Valuator',
      orderDate: '2024-08-05',
      inspectionDate: '2024-08-07',
      completedAt: '2024-08-10',
      marketValue: 425000,
      status: 'completed',
      clientName: 'First Bank',
      loanNumber: 'L98765',
    },
    {
      id: 103,
      propertyId: parseInt(id || '1'),
      appraiserId: 1,
      appraiserName: 'Jane Appraiser',
      orderDate: '2025-05-18',
      status: 'pending',
      clientName: 'XYZ Loans',
      loanNumber: 'L54321',
    },
  ];
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Get status class for styling
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'draft': return 'status-draft';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with property address and actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-1 text-muted-foreground mb-1">
            <Link to="/properties" className="hover:underline flex items-center gap-1">
              <Home className="h-4 w-4" />
              Properties
            </Link>
            <span>/</span>
            <span>Property Details</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{mockProperty.address}</h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {mockProperty.city}, {mockProperty.state} {mockProperty.zipCode}
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link 
            to={`/properties/${id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit Property
          </Link>
          <Link 
            to={`/appraisals/new?propertyId=${id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            New Appraisal
          </Link>
        </div>
      </div>
      
      {/* Property details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - basic info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Property Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Property Type</h3>
                  <p className="flex items-center text-md">
                    <Building className="h-4 w-4 mr-2 text-primary" />
                    {mockProperty.propertyType}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Year Built</h3>
                  <p className="flex items-center text-md">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    {mockProperty.yearBuilt}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Square Feet</h3>
                  <p className="flex items-center text-md">
                    <SquareStack className="h-4 w-4 mr-2 text-primary" />
                    {mockProperty.squareFeet.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Lot Size</h3>
                  <p className="flex items-center text-md">
                    <Ruler className="h-4 w-4 mr-2 text-primary" />
                    {mockProperty.lotSize} acres
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Bedrooms</h3>
                  <p className="flex items-center text-md">
                    {mockProperty.bedrooms}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Bathrooms</h3>
                  <p className="flex items-center text-md">
                    {mockProperty.bathrooms}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Parcel Number</h3>
                  <p className="flex items-center text-md">
                    <Grid3X3 className="h-4 w-4 mr-2 text-primary" />
                    {mockProperty.parcelNumber}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Appraised Value</h3>
                  <p className="flex items-center text-md">
                    <DollarSign className="h-4 w-4 mr-2 text-primary" />
                    {mockProperty.lastAppraisalValue ? formatCurrency(mockProperty.lastAppraisalValue) : 'N/A'} 
                    <span className="text-sm text-muted-foreground ml-2">
                      {mockProperty.lastAppraisalDate ? `(${formatDate(mockProperty.lastAppraisalDate)})` : ''}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Property Description</h3>
                <p className="text-md">
                  {mockProperty.description || 'No description available.'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - owner info */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Owner Information</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Owner Name</h3>
                  <p className="text-md">{mockProperty.ownerName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact</h3>
                  <p className="text-md">{mockProperty.ownerContact}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Property Timeline</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Added to System</h3>
                  <p className="text-md">{formatDate(mockProperty.createdAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                  <p className="text-md">{formatDate(mockProperty.updatedAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Appraisal</h3>
                  <p className="text-md">{formatDate(mockProperty.lastAppraisalDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Appraisal history */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Appraisal History</h2>
          <Link 
            to={`/appraisals/new?propertyId=${id}`}
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <Plus className="h-4 w-4" />
            New Appraisal
          </Link>
        </div>
        <div className="p-0">
          {mockAppraisals.length > 0 ? (
            <table className="w-full data-grid">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Appraiser</th>
                  <th>Status</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockAppraisals.map((appraisal) => (
                  <tr key={appraisal.id}>
                    <td>{formatDate(appraisal.orderDate)}</td>
                    <td>{appraisal.clientName}</td>
                    <td>{appraisal.appraiserName}</td>
                    <td>
                      <span className={`status-indicator ${getStatusClass(appraisal.status)}`}>
                        {appraisal.status.charAt(0).toUpperCase() + appraisal.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {appraisal.marketValue ? formatCurrency(appraisal.marketValue) : 'Pending'}
                    </td>
                    <td>
                      <Link 
                        to={`/appraisals/${appraisal.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">No appraisals found for this property.</p>
              <Link 
                to={`/appraisals/new?propertyId=${id}`} 
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create First Appraisal
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;