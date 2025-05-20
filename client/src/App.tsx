import React, { useState } from 'react';
import { 
  Building2, 
  LineChart, 
  FileText, 
  BarChart4, 
  Home as HomeIcon,
  Users,
  Settings,
  Menu,
  Calculator,
  Database,
  PlusCircle,
  ChevronDown,
  Search,
  ClipboardList
} from 'lucide-react';

// Import our new React components
import PropertyDetailComponent from './components/PropertyDetailComponent';
import MarketAnalysisComponent from './components/MarketAnalysisComponent';
import ValuationCalculatorComponent from './components/ValuationCalculatorComponent';
import ReportsComponent from './components/ReportsComponent';

// Simple dashboard home component
const Dashboard = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-heading">TerraFusion Professional</h1>
        <p className="text-gray-600 mt-1">Real Estate Appraisal Management Platform</p>
      </div>
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="p-2 bg-blue-50 rounded-lg inline-flex mb-3">
            <Building2 size={24} className="text-blue-500" />
          </div>
          <div className="text-sm text-gray-500">Properties</div>
          <div className="text-2xl font-bold mt-1">243</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="p-2 bg-green-50 rounded-lg inline-flex mb-3">
            <FileText size={24} className="text-green-500" />
          </div>
          <div className="text-sm text-gray-500">Appraisals</div>
          <div className="text-2xl font-bold mt-1">128</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="p-2 bg-purple-50 rounded-lg inline-flex mb-3">
            <BarChart4 size={24} className="text-purple-500" />
          </div>
          <div className="text-sm text-gray-500">Comparables</div>
          <div className="text-2xl font-bold mt-1">572</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="p-2 bg-amber-50 rounded-lg inline-flex mb-3">
            <Users size={24} className="text-amber-500" />
          </div>
          <div className="text-sm text-gray-500">Team Members</div>
          <div className="text-2xl font-bold mt-1">8</div>
        </div>
      </div>
      
      {/* Recent Properties */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Properties</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Sale Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">123 Main St, San Francisco, CA</td>
                <td className="px-6 py-4 whitespace-nowrap">Single Family</td>
                <td className="px-6 py-4 whitespace-nowrap">2,100 sq.ft.</td>
                <td className="px-6 py-4 whitespace-nowrap">$950,000</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">456 Oak Ave, San Francisco, CA</td>
                <td className="px-6 py-4 whitespace-nowrap">Condo</td>
                <td className="px-6 py-4 whitespace-nowrap">1,200 sq.ft.</td>
                <td className="px-6 py-4 whitespace-nowrap">$750,000</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">789 Pine Rd, San Francisco, CA</td>
                <td className="px-6 py-4 whitespace-nowrap">Multi-Family</td>
                <td className="px-6 py-4 whitespace-nowrap">3,200 sq.ft.</td>
                <td className="px-6 py-4 whitespace-nowrap">$1,650,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Appraisals */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Appraisals</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appraiser</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">123 Main St, San Francisco, CA</td>
                <td className="px-6 py-4 whitespace-nowrap">John Smith</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Completed</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">$975,000</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">456 Oak Ave, San Francisco, CA</td>
                <td className="px-6 py-4 whitespace-nowrap">Jane Doe</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">In Progress</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">Pending</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">789 Pine Rd, San Francisco, CA</td>
                <td className="px-6 py-4 whitespace-nowrap">Robert Johnson</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Draft</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState('/');

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path) => {
    return activePath === path || activePath.startsWith(`${path}/`);
  };

  const navigate = (path) => {
    setActivePath(path);
    setMenuOpen(false);
  };

  // Render the appropriate component based on active path
  const renderContent = () => {
    switch (activePath) {
      case '/':
        return <Dashboard />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {activePath.substring(1).charAt(0).toUpperCase() + activePath.substring(1).slice(1)}
            </h2>
            <p className="text-gray-600 mb-4">
              This section is under development. More features coming soon!
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Return to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 sidebar text-white transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out shadow-xl`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-1">TerraFusion</h1>
          <h2 className="text-lg font-semibold text-blue-200">Professional</h2>
        </div>
        <nav className="mt-6">
          <ul>
            <li className="mb-1">
              <button 
                onClick={() => navigate('/')} 
                className={`flex items-center w-full px-6 py-3 text-white hover:bg-blue-700 ${isActive('/') ? 'bg-blue-700' : ''}`}
              >
                <HomeIcon className="mr-3" size={20} />
                <span>Dashboard</span>
              </button>
            </li>
            <li className="mb-1">
              <button 
                onClick={() => navigate('/properties')} 
                className={`flex items-center w-full px-6 py-3 text-white hover:bg-blue-700 ${isActive('/properties') ? 'bg-blue-700' : ''}`}
              >
                <Building2 className="mr-3" size={20} />
                <span>Properties</span>
              </button>
            </li>
            <li className="mb-1">
              <button 
                onClick={() => navigate('/appraisals')} 
                className={`flex items-center w-full px-6 py-3 text-white hover:bg-blue-700 ${isActive('/appraisals') ? 'bg-blue-700' : ''}`}
              >
                <FileText className="mr-3" size={20} />
                <span>Appraisals</span>
              </button>
            </li>
            <li className="mb-1">
              <button 
                onClick={() => navigate('/appraisals/new')} 
                className={`flex items-center w-full px-6 py-3 text-white hover:bg-blue-700 ${isActive('/appraisals/new') ? 'bg-blue-700' : ''}`}
              >
                <PlusCircle className="mr-3" size={20} />
                <span>New Appraisal</span>
              </button>
            </li>
            <li className="mb-1">
              <button 
                onClick={() => navigate('/comparables')} 
                className={`flex items-center w-full px-6 py-3 text-white hover:bg-blue-700 ${isActive('/comparables') ? 'bg-blue-700' : ''}`}
              >
                <BarChart4 className="mr-3" size={20} />
                <span>Comparables</span>
              </button>
            </li>
            <li className="mb-1">
              <button 
                onClick={() => navigate('/valuation-calculator')} 
                className={`flex items-center w-full px-6 py-3 text-white hover:bg-blue-700 ${isActive('/valuation-calculator') ? 'bg-blue-700' : ''}`}
              >
                <Calculator className="mr-3" size={20} />
                <span>Valuation Calculator</span>
              </button>
            </li>
            <li className="mb-1">
              <button 
                onClick={() => navigate('/market-analysis')} 
                className={`flex items-center w-full px-6 py-3 text-white hover:bg-blue-700 ${isActive('/market-analysis') ? 'bg-blue-700' : ''}`}
              >
                <LineChart className="mr-3" size={20} />
                <span>Market Analysis</span>
              </button>
            </li>
          </ul>
          
          <div className="pt-4 mt-6 border-t border-blue-700">
            <ul>
              <li className="mb-1">
                <button 
                  onClick={() => navigate('/users')} 
                  className={`flex items-center w-full px-6 py-3 text-white hover:bg-blue-700 ${isActive('/users') ? 'bg-blue-700' : ''}`}
                >
                  <Users className="mr-3" size={20} />
                  <span>Team Members</span>
                </button>
              </li>
              <li className="mb-1">
                <button 
                  onClick={() => navigate('/settings')} 
                  className={`flex items-center w-full px-6 py-3 text-white hover:bg-blue-700 ${isActive('/settings') ? 'bg-blue-700' : ''}`}
                >
                  <Settings className="mr-3" size={20} />
                  <span>Settings</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-blue-300 text-xs">
          TerraFusionProfessional v1.0.0
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 md:hidden z-50">
        <button 
          onClick={toggleMenu} 
          className="p-2 bg-blue-800 rounded-md text-white shadow-md"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64 overflow-y-auto">
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;