import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Building, 
  BarChart4, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar
} from 'lucide-react';
import { apiRequest } from '../lib/query-client';

// Temporary mock user - in a real app, this would come from an auth context
const USER_ID = 1;

interface DashboardCounts {
  activeAppraisals: number;
  completedAppraisals: number;
  totalProperties: number;
}

interface RecentAppraisal {
  id: number;
  propertyAddress: string;
  status: string;
  orderDate: string;
  clientName: string;
}

const Dashboard = () => {
  // Fetch dashboard data
  const { data: counts, isLoading: isLoadingCounts } = useQuery({
    queryKey: ['/api/dashboard/counts', USER_ID],
    queryFn: () => apiRequest<DashboardCounts>(`/api/dashboard/counts?userId=${USER_ID}`),
    // In real app we'd implement this endpoint to return counts
    // For now, just mock the data
    enabled: false,
  });

  // Fetch recent appraisals
  const { data: recentAppraisals, isLoading: isLoadingRecent } = useQuery({
    queryKey: ['/api/appraisals', USER_ID],
    queryFn: () => apiRequest<RecentAppraisal[]>(`/api/appraisals?appraiserId=${USER_ID}&limit=5`),
    // In real app we'd fetch from the API
    // For now, just mock the data
    enabled: false,
  });

  // Mock data for demo purposes
  const mockCounts = {
    activeAppraisals: 12,
    completedAppraisals: 48,
    totalProperties: 125
  };

  const mockRecentAppraisals = [
    { id: 101, propertyAddress: '123 Main St, Austin, TX', status: 'pending', orderDate: '2025-05-15', clientName: 'ABC Mortgage' },
    { id: 102, propertyAddress: '456 Oak Ave, Dallas, TX', status: 'completed', orderDate: '2025-05-10', clientName: 'First National Bank' },
    { id: 103, propertyAddress: '789 Pine Rd, Houston, TX', status: 'draft', orderDate: '2025-05-18', clientName: 'Texas Lending' },
    { id: 104, propertyAddress: '234 Elm St, San Antonio, TX', status: 'pending', orderDate: '2025-05-14', clientName: 'HomeFirst Mortgage' },
    { id: 105, propertyAddress: '567 Cedar Ln, Fort Worth, TX', status: 'completed', orderDate: '2025-05-08', clientName: 'Liberty Loans' },
  ];

  // Mock performance data for the chart
  const mockPerformanceData = [
    { month: 'Jan', completed: 8 },
    { month: 'Feb', completed: 10 },
    { month: 'Mar', completed: 7 },
    { month: 'Apr', completed: 12 },
    { month: 'May', completed: 11 },
  ];

  // Get status class for styling
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'draft': return 'status-draft';
      default: return '';
    }
  };

  // Calculate month-over-month change
  const currentMonth = mockPerformanceData[mockPerformanceData.length - 1].completed;
  const prevMonth = mockPerformanceData[mockPerformanceData.length - 2].completed;
  const changePercent = Math.round(((currentMonth - prevMonth) / prevMonth) * 100);
  const isPositiveChange = changePercent >= 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Today is</span>
          <span className="flex items-center gap-1 text-sm font-medium">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active Appraisals</p>
              <p className="text-3xl font-bold">{mockCounts.activeAppraisals}</p>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div className="mt-4">
            <Link 
              to="/appraisals?status=pending" 
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              View active appraisals
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Completed Appraisals</p>
              <p className="text-3xl font-bold">{mockCounts.completedAppraisals}</p>
            </div>
            <BarChart4 className="h-8 w-8 text-primary" />
          </div>
          <div className="mt-4 flex items-center">
            <span className={`inline-flex items-center text-sm ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveChange ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {Math.abs(changePercent)}% from last month
            </span>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Properties in Database</p>
              <p className="text-3xl font-bold">{mockCounts.totalProperties}</p>
            </div>
            <Building className="h-8 w-8 text-primary" />
          </div>
          <div className="mt-4">
            <Link 
              to="/properties" 
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              View all properties
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Appraisals */}
      <div className="rounded-lg border bg-card">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Appraisals</h2>
        </div>
        <div className="p-0">
          <table className="w-full data-grid">
            <thead>
              <tr>
                <th>Property</th>
                <th>Client</th>
                <th>Status</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockRecentAppraisals.map((appraisal) => (
                <tr key={appraisal.id}>
                  <td className="font-medium">{appraisal.propertyAddress}</td>
                  <td>{appraisal.clientName}</td>
                  <td>
                    <span className={`status-indicator ${getStatusClass(appraisal.status)}`}>
                      {appraisal.status.charAt(0).toUpperCase() + appraisal.status.slice(1)}
                    </span>
                  </td>
                  <td>{new Date(appraisal.orderDate).toLocaleDateString()}</td>
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
        </div>
        <div className="p-4 border-t text-center">
          <Link 
            to="/appraisals"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1 justify-center"
          >
            View all appraisals
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/appraisals/new"
            className="flex items-center p-4 border rounded-md hover:bg-accent transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">New Appraisal</h3>
              <p className="text-sm text-muted-foreground">Create a new appraisal order</p>
            </div>
          </Link>
          
          <Link 
            to="/properties/new"
            className="flex items-center p-4 border rounded-md hover:bg-accent transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Add Property</h3>
              <p className="text-sm text-muted-foreground">Add a new property to the database</p>
            </div>
          </Link>
          
          <Link 
            to="/market-data"
            className="flex items-center p-4 border rounded-md hover:bg-accent transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <BarChart4 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Market Analysis</h3>
              <p className="text-sm text-muted-foreground">View current market trends</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;