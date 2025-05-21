import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Building2, 
  Users, 
  Calendar, 
  BarChart4,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});

  // Sample data for the dashboard
  const stats = {
    totalAppraisals: 124,
    pendingAppraisals: 18,
    completedThisMonth: 21,
    overdue: 3,
    avgCompletionTime: '4.2 days',
    propertiesManaged: 236,
    activeClients: 42,
    revenue: {
      current: 36500,
      previous: 29800
    }
  };

  // Recent appraisals data
  const recentAppraisals = [
    {
      id: 1,
      address: '123 Main St, Austin, TX 78701',
      client: 'Cornerstone Bank',
      dueDate: '2025-05-25',
      status: 'In Progress',
      type: 'Residential',
      appraiser: 'Michael Rodriguez'
    },
    {
      id: 2,
      address: '456 Market Ave, Dallas, TX 75201',
      client: 'Evergreen Mortgage',
      dueDate: '2025-05-23',
      status: 'Scheduled',
      type: 'Commercial',
      appraiser: 'Sarah Johnson'
    },
    {
      id: 3,
      address: '789 Oak Blvd, Houston, TX 77002',
      client: 'First Capital',
      dueDate: '2025-05-20',
      status: 'Completed',
      type: 'Multi-Family',
      appraiser: 'David Thompson'
    },
    {
      id: 4,
      address: '101 Pine Lane, San Antonio, TX 78205',
      client: 'Summit Financial',
      dueDate: '2025-05-18',
      status: 'Completed',
      type: 'Residential',
      appraiser: 'Jennifer Lee'
    }
  ];

  // Team activity data
  const teamActivity = [
    {
      id: 1,
      user: 'Sarah Johnson',
      action: 'Completed appraisal',
      property: '456 Market Ave, Dallas, TX',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      user: 'Michael Rodriguez',
      action: 'Started new appraisal',
      property: '123 Main St, Austin, TX',
      timestamp: '3 hours ago'
    },
    {
      id: 3,
      user: 'David Thompson',
      action: 'Added comparable property',
      property: '789 Oak Blvd, Houston, TX',
      timestamp: '5 hours ago'
    },
    {
      id: 4,
      user: 'Jennifer Lee',
      action: 'Updated market data',
      property: '101 Pine Lane, San Antonio, TX',
      timestamp: 'Yesterday'
    }
  ];

  // Status badge style helper
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate revenue growth percentage
  const revenueGrowth = ((stats.revenue.current - stats.revenue.previous) / stats.revenue.previous) * 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center">
            <div className="icon-circle bg-primary-50 text-primary-600">
              <FileText className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="stat-title">Total Appraisals</h3>
              <div className="stat-value">{stats.totalAppraisals}</div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span className="text-green-600 font-medium flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  12% 
                </span>
                <span className="ml-1">vs. last month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="icon-circle bg-amber-50 text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="stat-title">Pending Appraisals</h3>
              <div className="stat-value">{stats.pendingAppraisals}</div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span>{stats.completedThisMonth} completed this month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="icon-circle bg-red-50 text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="stat-title">Overdue</h3>
              <div className="stat-value">{stats.overdue}</div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span>Avg. completion time: {stats.avgCompletionTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="icon-circle bg-green-50 text-green-600">
              <BarChart4 className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="stat-title">Monthly Revenue</h3>
              <div className="stat-value">${stats.revenue.current.toLocaleString()}</div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span className="text-green-600 font-medium flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {revenueGrowth.toFixed(1)}% 
                </span>
                <span className="ml-1">vs. last month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appraisals */}
        <div className="lg:col-span-2 card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Recent Appraisals</h2>
            <Link to="/appraisals" className="text-primary-600 hover:text-primary-800 text-sm">
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-500 border-b">
                  <th className="pb-2">Property</th>
                  <th className="pb-2">Client</th>
                  <th className="pb-2">Due Date</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentAppraisals.map(appraisal => (
                  <tr key={appraisal.id} className="text-sm">
                    <td className="py-3">
                      <div>
                        <div className="font-medium">{appraisal.address.split(',')[0]}</div>
                        <div className="text-xs text-gray-500">{appraisal.type}</div>
                      </div>
                    </td>
                    <td className="py-3">{appraisal.client}</td>
                    <td className="py-3">
                      {new Date(appraisal.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeClass(appraisal.status)}`}>
                        {appraisal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Secondary Stats and Team Activity */}
        <div className="space-y-6">
          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card-sm">
              <div className="flex items-center">
                <Building2 className="w-5 h-5 text-primary-500 mr-3" />
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Properties</h3>
                  <div className="text-xl font-semibold">{stats.propertiesManaged}</div>
                </div>
              </div>
            </div>
            
            <div className="stat-card-sm">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-primary-500 mr-3" />
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Active Clients</h3>
                  <div className="text-xl font-semibold">{stats.activeClients}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Team Activity */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Team Activity</h2>
            <div className="space-y-4">
              {teamActivity.map(activity => (
                <div key={activity.id} className="flex items-start">
                  <div className="p-2 rounded-full bg-gray-100 text-gray-700 mr-3">
                    {activity.action.includes('Completed') ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      <span className="text-primary-600">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.property}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;