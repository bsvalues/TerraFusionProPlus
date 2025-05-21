import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/query-client';
import { Calendar, Home, CheckCircle, Clock, TrendingUp } from 'lucide-react';

type DashboardData = {
  activeAppraisals: number;
  completedAppraisals: number;
  totalProperties: number;
  avgCompletionTime: number;
  performanceSummary: {
    completedThisMonth: number;
    changeFromLastMonth: number;
    averageValue: number;
    valueChangePercent: number;
  };
  recentActivity: Array<{
    id: number;
    type: string;
    title: string;
    description: string;
    timestamp: string;
  }>;
  upcomingAppraisals: Array<{
    id: number;
    propertyId: number;
    address: string;
    clientName: string;
    dueDate: string;
    status: string;
  }>;
};

function StatCard({ title, value, icon, change }: { title: string; value: string | number; icon: React.ReactNode; change?: { value: number; positive: boolean } }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          
          {change && (
            <div className={`mt-2 text-xs inline-flex items-center rounded-full px-2 py-1 ${change.positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <span className="mr-1">{change.positive ? '↑' : '↓'}</span> 
              {Math.abs(change.value)}%
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-blue-50 text-blue-500">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ item }: { item: DashboardData['recentActivity'][0] }) {
  const iconMap: Record<string, React.ReactNode> = {
    'appraisal_completed': <CheckCircle size={16} className="text-green-500" />,
    'property_added': <Home size={16} className="text-blue-500" />,
    'appraisal_scheduled': <Calendar size={16} className="text-purple-500" />,
  };

  const getTimeString = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
      <div className="p-2 mr-3 rounded-full bg-gray-100">
        {iconMap[item.type] || <Clock size={16} />}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{item.title}</h4>
        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
      </div>
      <div className="text-xs text-gray-400">
        {getTimeString(item.timestamp)}
      </div>
    </div>
  );
}

function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard'],
    queryFn: () => apiRequest<DashboardData>('/dashboard')
  });

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-pulse text-gray-500">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-semibold text-red-600">Error loading dashboard</h3>
        <p className="text-gray-500 mt-2">Please try again later</p>
      </div>
    );
  }

  // Fallback for development - we'll use mock data if the API call fails
  const dashboardData = data || {
    activeAppraisals: 24,
    completedAppraisals: 37,
    totalProperties: 418,
    avgCompletionTime: 3.2,
    performanceSummary: {
      completedThisMonth: 37,
      changeFromLastMonth: 4,
      averageValue: 450000,
      valueChangePercent: 2.5
    },
    recentActivity: [
      {
        id: 1,
        type: 'appraisal_completed',
        title: 'Appraisal completed',
        description: '456 Oak Drive, Austin, TX 78704',
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        type: 'property_added',
        title: 'New property added',
        description: '789 Pine Street, Austin, TX 78701',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      }
    ],
    upcomingAppraisals: [
      {
        id: 101,
        propertyId: 201,
        address: '123 Main Street, Austin, TX 78701',
        clientName: 'ABC Mortgage',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled',
      },
      {
        id: 102,
        propertyId: 202,
        address: '456 Oak Drive, Austin, TX 78704',
        clientName: 'First Credit Union',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
      }
    ]
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Active Appraisals" 
          value={dashboardData.activeAppraisals} 
          icon={<Clock size={24} />} 
        />
        <StatCard 
          title="Completed Appraisals" 
          value={dashboardData.completedAppraisals} 
          icon={<CheckCircle size={24} />}
          change={{ 
            value: dashboardData.performanceSummary.changeFromLastMonth, 
            positive: dashboardData.performanceSummary.changeFromLastMonth > 0 
          }}
        />
        <StatCard 
          title="Properties" 
          value={dashboardData.totalProperties} 
          icon={<Home size={24} />} 
        />
        <StatCard 
          title="Average Value" 
          value={formatCurrency(dashboardData.performanceSummary.averageValue)} 
          icon={<TrendingUp size={24} />}
          change={{ 
            value: dashboardData.performanceSummary.valueChangePercent, 
            positive: dashboardData.performanceSummary.valueChangePercent > 0 
          }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-lg mb-4">Recent Activity</h2>
          <div className="space-y-1">
            {dashboardData.recentActivity.map(activity => (
              <ActivityItem key={activity.id} item={activity} />
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-lg mb-4">Upcoming Appraisals</h2>
          <div className="space-y-4">
            {dashboardData.upcomingAppraisals.map(appraisal => (
              <div key={appraisal.id} className="p-3 border border-gray-100 rounded-md">
                <h4 className="font-medium text-sm">{appraisal.address}</h4>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>{appraisal.clientName}</span>
                  <span className="font-medium">Due: {formatDate(appraisal.dueDate)}</span>
                </div>
                <div className="mt-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    appraisal.status === 'scheduled' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {appraisal.status === 'scheduled' ? 'Scheduled' : 'In Progress'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;