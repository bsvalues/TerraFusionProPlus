import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Search, Edit, ArrowRight, Calendar, User, DollarSign, Tag } from 'lucide-react';

interface Appraisal {
  id: number;
  propertyId: number;
  property?: {
    address: string;
    city: string;
    state: string;
  };
  appraiserId: number;
  appraiser?: {
    firstName: string;
    lastName: string;
  };
  status: string;
  purpose: string;
  marketValue: number | null;
  createdAt: string;
  completedAt: string | null;
}

export const Appraisals = () => {
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetch('/api/appraisals')
      .then(response => response.json())
      .then(data => {
        setAppraisals(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching appraisals:', error);
        setLoading(false);
      });
  }, []);

  // Filter appraisals based on search term and status filter
  const filteredAppraisals = appraisals.filter(appraisal => {
    const matchesSearch = 
      (appraisal.property?.address?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      appraisal.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appraisal.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appraisal.appraiser?.firstName + ' ' + appraisal.appraiser?.lastName)?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || appraisal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge styling based on status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'draft':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Draft</span>;
      case 'in_progress':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">In Progress</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Completed</span>;
      case 'reviewed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Reviewed</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gradient-heading">Appraisals</h1>
          <p className="text-gray-600 mt-1">Manage your property appraisals</p>
        </div>
        <Link 
          to="/appraisals/new" 
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          New Appraisal
        </Link>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search appraisals..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        
        <div className="w-full md:w-48">
          <select
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="reviewed">Reviewed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredAppraisals.length > 0 ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purpose
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Appraiser
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAppraisals.map(appraisal => (
                      <tr key={appraisal.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-start">
                            <FileText size={16} className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {appraisal.property?.address || 'Unknown Property'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {appraisal.property?.city}, {appraisal.property?.state}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Tag size={14} className="text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">{appraisal.purpose || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(appraisal.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <DollarSign size={14} className="text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">
                              {appraisal.marketValue ? `$${appraisal.marketValue.toLocaleString()}` : 'Not Set'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar size={14} className="text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">
                              {formatDate(appraisal.createdAt)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User size={14} className="text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">
                              {appraisal.appraiser ? 
                                `${appraisal.appraiser.firstName} ${appraisal.appraiser.lastName}` : 
                                'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center space-x-2">
                            <Link to={`/appraisals/${appraisal.id}/edit`} className="text-blue-600 hover:text-blue-900">
                              <Edit size={16} />
                            </Link>
                            <Link to={`/appraisals/${appraisal.id}`} className="text-green-600 hover:text-green-900">
                              <ArrowRight size={16} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <FileText size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800">No appraisals found</h3>
              <p className="text-gray-600 mt-1 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search criteria or filter.'
                  : 'You have not created any appraisals yet.'}
              </p>
              <Link 
                to="/appraisals/new" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} className="mr-2" />
                Create New Appraisal
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};