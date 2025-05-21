import { useState } from 'react';
import { 
  Building2, 
  ClipboardList, 
  LineChart, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const Dashboard = () => {
  const [recentAppraisals] = useState([
    { id: 1, address: '123 Main St, Austin, TX', status: 'In Progress', date: '2025-04-25', value: '$425,000' },
    { id: 2, address: '456 Oak Ave, Dallas, TX', status: 'Completed', date: '2025-04-22', value: '$512,000' },
    { id: 3, address: '789 Pine Blvd, Houston, TX', status: 'Pending', date: '2025-04-28', value: 'TBD' },
  ]);

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card flex items-center">
          <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Properties</p>
            <h3 className="text-2xl font-bold">124</h3>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="p-3 rounded-full bg-secondary-100 text-secondary-600 mr-4">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Appraisals</p>
            <h3 className="text-2xl font-bold">16</h3>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="p-3 rounded-full bg-accent-100 text-accent-600 mr-4">
            <LineChart size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Market Reports</p>
            <h3 className="text-2xl font-bold">8</h3>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Completed This Month</p>
            <h3 className="text-2xl font-bold">22</h3>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Recent Appraisals</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAppraisals.map((appraisal) => (
                  <tr key={appraisal.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {appraisal.address}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appraisal.status === 'Completed' 
                          ? 'bg-green-100 text-green-800'
                          : appraisal.status === 'In Progress' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appraisal.status === 'Completed' && <CheckCircle2 size={12} className="mr-1" />}
                        {appraisal.status === 'In Progress' && <Clock size={12} className="mr-1" />}
                        {appraisal.status === 'Pending' && <AlertCircle size={12} className="mr-1" />}
                        {appraisal.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {appraisal.date}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {appraisal.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Activity Timeline</h2>
          </div>
          <div className="space-y-4">
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle2 size={20} />
                </div>
                <div className="w-px h-full bg-gray-200 mt-2"></div>
              </div>
              <div className="pb-6">
                <p className="text-sm font-medium">Appraisal Completed</p>
                <p className="text-xs text-gray-500 mt-1">456 Oak Ave appraisal was finalized at $512,000</p>
                <p className="text-xs text-gray-400 mt-1">Today, 10:30 AM</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <ClipboardList size={20} />
                </div>
                <div className="w-px h-full bg-gray-200 mt-2"></div>
              </div>
              <div className="pb-6">
                <p className="text-sm font-medium">New Appraisal Assigned</p>
                <p className="text-xs text-gray-500 mt-1">789 Pine Blvd was added to your appraisal queue</p>
                <p className="text-xs text-gray-400 mt-1">Today, 9:15 AM</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <Building2 size={20} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Property Added</p>
                <p className="text-xs text-gray-500 mt-1">123 Main St was added to the property database</p>
                <p className="text-xs text-gray-400 mt-1">Yesterday, 2:45 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;