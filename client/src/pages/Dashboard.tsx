import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PieChart, 
  Clock, 
  LineChart, 
  AlertTriangle, 
  ArrowUpRight, 
  Building2, 
  FileText,
  Calendar 
} from 'lucide-react';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    recentProperties: [],
    upcomingAppraisals: [],
    propertyTypes: { 
      'Single Family': 12,
      'Multi-Family': 5,
      'Commercial': 8,
      'Land': 3
    },
    marketTrends: [
      { month: 'Jan', residential: 350, commercial: 420 },
      { month: 'Feb', residential: 355, commercial: 415 },
      { month: 'Mar', residential: 370, commercial: 425 },
      { month: 'Apr', residential: 375, commercial: 430 },
      { month: 'May', residential: 385, commercial: 435 },
      { month: 'Jun', residential: 390, commercial: 440 },
    ]
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Cleanup
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">
      <div className="loading-spinner" />
    </div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Properties</p>
            <p className="text-2xl font-bold">28</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Appraisals</p>
            <p className="text-2xl font-bold">14</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <LineChart size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Market Growth</p>
            <p className="text-2xl font-bold">+3.2%</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
            <p className="text-2xl font-bold">7</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Properties */}
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Recent Properties</h2>
            <Link to="/properties" className="text-primary-600 hover:text-primary-800 text-sm flex items-center">
              View All <ArrowUpRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th>Address</th>
                  <th>Type</th>
                  <th>Added</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3">
                    <Link to="/properties/1" className="text-primary-600 hover:text-primary-800">
                      123 Main St, Austin, TX
                    </Link>
                  </td>
                  <td>Single Family</td>
                  <td>May 18, 2025</td>
                  <td><span className="status-badge status-badge-success">Active</span></td>
                </tr>
                <tr>
                  <td className="py-3">
                    <Link to="/properties/2" className="text-primary-600 hover:text-primary-800">
                      456 Oak Ave, Dallas, TX
                    </Link>
                  </td>
                  <td>Condominium</td>
                  <td>May 15, 2025</td>
                  <td><span className="status-badge status-badge-success">Active</span></td>
                </tr>
                <tr>
                  <td className="py-3">
                    <Link to="/properties/3" className="text-primary-600 hover:text-primary-800">
                      789 Pine Blvd, Houston, TX
                    </Link>
                  </td>
                  <td>Multi-Family</td>
                  <td>May 10, 2025</td>
                  <td><span className="status-badge status-badge-in-progress">In Progress</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Upcoming Appraisals */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Upcoming Appraisals</h2>
            <Link to="/appraisals" className="text-primary-600 hover:text-primary-800 text-sm flex items-center">
              View All <ArrowUpRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-start p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <p className="font-medium">May 24, 2025</p>
                <p className="text-sm text-gray-600">123 Main St, Austin</p>
                <p className="text-xs text-gray-500">Client: First National Bank</p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
              <div>
                <p className="font-medium">May 27, 2025</p>
                <p className="text-sm text-gray-600">456 Oak Ave, Dallas</p>
                <p className="text-xs text-gray-500">Client: Heritage Trust</p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 mr-3" />
              <div>
                <p className="font-medium">May 30, 2025</p>
                <p className="text-sm text-gray-600">789 Pine Blvd, Houston</p>
                <p className="text-xs text-yellow-600">Urgent: Due in 9 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Types */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Property Types</h2>
          <div className="flex items-center justify-center">
            <div className="w-48 h-48 relative">
              <PieChart size={48} className="absolute inset-0 m-auto text-gray-300" />
              <div className="mt-16 text-center">
                <p className="text-lg font-bold">28</p>
                <p className="text-sm text-gray-500">Total Properties</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <p className="text-sm">Single Family (43%)</p>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <p className="text-sm">Multi-Family (18%)</p>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <p className="text-sm">Commercial (29%)</p>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <p className="text-sm">Land (10%)</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Market Trends */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Market Trends (2025)</h2>
          <div className="h-64 flex items-center justify-center">
            <LineChart size={48} className="text-gray-300" />
            <p className="ml-4 text-gray-500">Interactive chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;