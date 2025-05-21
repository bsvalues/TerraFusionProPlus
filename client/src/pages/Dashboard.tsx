import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Home, 
  FileSpreadsheet, 
  Plus, 
  Clock, 
  CheckCircle, 
  ArrowUpRight,
  Calendar,
  DollarSign,
  BarChart4
} from 'lucide-react';
import { apiRequest } from '../lib/query-client';

// Mock data interfaces
interface DashboardStats {
  activeAppraisals: number;
  completedAppraisals: number;
  totalProperties: number;
  avgCompletionTime: number;
  recentActivity: Activity[];
  upcomingAppraisals: UpcomingAppraisal[];
  performanceSummary: PerformanceSummary;
}

interface Activity {
  id: number;
  type: 'property_added' | 'appraisal_submitted' | 'appraisal_completed' | 'market_update';
  title: string;
  description: string;
  timestamp: string;
}

interface UpcomingAppraisal {
  id: number;
  address: string;
  propertyId: number;
  clientName: string;
  dueDate: string;
  status: 'scheduled' | 'in_progress';
}

interface PerformanceSummary {
  completedThisMonth: number;
  changeFromLastMonth: number;
  averageValue: number;
  valueChangePercent: number;
}

const Dashboard = () => {
  // In a real app, this would fetch from the API
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    queryFn: () => apiRequest<DashboardStats>('/api/dashboard'),
    // For demo purposes, disable this query and use mock data instead
    enabled: false,
  });
  
  // Mock data
  const mockData: DashboardStats = {
    activeAppraisals: 24,
    completedAppraisals: 37,
    totalProperties: 418,
    avgCompletionTime: 3.2,
    recentActivity: [
      {
        id: 1,
        type: 'appraisal_completed',
        title: 'Appraisal completed',
        description: '456 Oak Drive, Austin, TX 78704',
        timestamp: '2025-05-20T14:30:00Z',
      },
      {
        id: 2,
        type: 'property_added',
        title: 'New property added',
        description: '789 Pine Street, Austin, TX 78701',
        timestamp: '2025-05-20T12:15:00Z',
      },
      {
        id: 3,
        type: 'appraisal_submitted',
        title: 'Appraisal submitted for review',
        description: '321 Cedar Lane, Austin, TX 78702',
        timestamp: '2025-05-19T16:45:00Z',
      },
      {
        id: 4,
        type: 'market_update',
        title: 'Market data updated',
        description: 'Q2 2025 Austin metropolitan area',
        timestamp: '2025-05-19T09:10:00Z',
      },
      {
        id: 5,
        type: 'appraisal_completed',
        title: 'Appraisal completed',
        description: '123 Main Street, Austin, TX 78701',
        timestamp: '2025-05-18T15:20:00Z',
      },
    ],
    upcomingAppraisals: [
      {
        id: 101,
        propertyId: 201,
        address: '123 Main Street, Austin, TX 78701',
        clientName: 'ABC Mortgage',
        dueDate: '2025-05-23T00:00:00Z',
        status: 'scheduled',
      },
      {
        id: 102,
        propertyId: 202,
        address: '456 Oak Drive, Austin, TX 78704',
        clientName: 'First Credit Union',
        dueDate: '2025-05-25T00:00:00Z',
        status: 'in_progress',
      },
      {
        id: 103,
        propertyId: 203,
        address: '789 Pine Street, Austin, TX 78701',
        clientName: 'XYZ Bank',
        dueDate: '2025-05-28T00:00:00Z',
        status: 'scheduled',
      },
    ],
    performanceSummary: {
      completedThisMonth: 37,
      changeFromLastMonth: 4,
      averageValue: 450000,
      valueChangePercent: 2.5,
    },
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    if (diffInHours < 48) {
      return 'Yesterday';
    }
    
    return formatDate(dateString);
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'property_added':
        return <Home className="h-4 w-4" />;
      case 'appraisal_submitted':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'appraisal_completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'market_update':
        return <BarChart4 className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const data = dashboardData || mockData;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <Link
            to="/properties/new"
            className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Link>
          <Link
            to="/appraisals/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            New Appraisal
          </Link>
        </div>
      </div>
      
      {/* Key metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active Appraisals</p>
              <p className="text-3xl font-bold">{data.activeAppraisals}</p>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {data.activeAppraisals} active appraisals in progress
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Completed This Month</p>
              <p className="text-3xl font-bold">{data.performanceSummary.completedThisMonth}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className={data.performanceSummary.changeFromLastMonth >= 0 ? 'text-green-600' : 'text-red-600'}>
              {data.performanceSummary.changeFromLastMonth > 0 ? '+' : ''}
              {data.performanceSummary.changeFromLastMonth}
            </span>{' '}
            from last month
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Average Completion Time</p>
              <p className="text-3xl font-bold">{data.avgCompletionTime} Days</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Average from last 30 days
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Average Appraised Value</p>
              <p className="text-3xl font-bold">{formatCurrency(data.performanceSummary.averageValue)}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className={data.performanceSummary.valueChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
              {data.performanceSummary.valueChangePercent > 0 ? '+' : ''}
              {data.performanceSummary.valueChangePercent}%
            </span>{' '}
            from last month
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Recent activities */}
        <div className="md:col-span-4 lg:col-span-5 rounded-lg border bg-card overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <div className="divide-y">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-6">
                <div className={`mt-1 p-2 rounded-full ${
                  activity.type === 'appraisal_completed' ? 'bg-green-100' :
                  activity.type === 'property_added' ? 'bg-blue-100' :
                  activity.type === 'appraisal_submitted' ? 'bg-yellow-100' :
                  'bg-primary/10'
                }`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-muted-foreground text-sm truncate">{activity.description}</p>
                </div>
                <div className="text-muted-foreground text-xs">
                  {formatTime(activity.timestamp)}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t text-center">
            <Link to="/activity" className="text-sm text-primary hover:underline">
              View all activity
            </Link>
          </div>
        </div>
        
        {/* Upcoming appraisals */}
        <div className="md:col-span-3 lg:col-span-2 rounded-lg border bg-card overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming Appraisals</h2>
            <Link to="/appraisals" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y">
            {data.upcomingAppraisals.map((appraisal) => (
              <Link 
                key={appraisal.id} 
                to={`/appraisals/${appraisal.id}`}
                className="block p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">{appraisal.address.split(',')[0]}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    appraisal.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {appraisal.status === 'in_progress' ? 'In Progress' : 'Scheduled'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{appraisal.clientName}</span>
                  <span className="font-medium">Due {formatDate(appraisal.dueDate)}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="p-4 border-t">
            <Link 
              to="/appraisals/new"
              className="flex items-center justify-center w-full gap-1 p-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              Schedule New Appraisal
            </Link>
          </div>
        </div>
      </div>
      
      {/* Market data / quick actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-lg border bg-card overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Market Snapshot</h2>
            <Link to="/market-data" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              View detailed analysis
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Austin Metropolitan Area</span>
                <span className="text-sm text-green-600">+5.2% YoY</span>
              </div>
              
              <div className="w-full bg-muted/30 rounded-full h-3">
                <div className="bg-primary h-3 rounded-full" style={{ width: '75%' }}></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-muted-foreground text-xs mb-1">Median Price</div>
                  <div className="font-medium">{formatCurrency(550000)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs mb-1">Days on Market</div>
                  <div className="font-medium">28</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs mb-1">Price per Sq.Ft.</div>
                  <div className="font-medium">$345</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            <Link 
              to="/properties/new"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="p-2 bg-primary/10 rounded-full">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Add Property</div>
                <div className="text-xs text-muted-foreground">Create a new property record</div>
              </div>
            </Link>
            
            <Link 
              to="/appraisals/new"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="p-2 bg-primary/10 rounded-full">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">New Appraisal</div>
                <div className="text-xs text-muted-foreground">Start a new appraisal report</div>
              </div>
            </Link>
            
            <Link 
              to="/market-data"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="p-2 bg-primary/10 rounded-full">
                <BarChart4 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Market Analysis</div>
                <div className="text-xs text-muted-foreground">View latest market trends</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;