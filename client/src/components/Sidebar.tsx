import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  FileText, 
  TrendingUp, 
  Calendar, 
  Users, 
  Settings,
  PieChart
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/properties', label: 'Properties', icon: <Building2 size={20} /> },
    { path: '/appraisals', label: 'Appraisals', icon: <FileText size={20} /> },
    { path: '/market-data', label: 'Market Data', icon: <TrendingUp size={20} /> },
    { path: '/calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { path: '/team', label: 'Team', icon: <Users size={20} /> },
    { path: '/reports', label: 'Reports', icon: <PieChart size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="bg-white border-r border-gray-200 w-64 min-h-screen hidden md:block">
      <div className="p-6">
        <h2 className="text-xl font-bold text-blue-600">TerraFusionPro</h2>
        <p className="text-sm text-gray-500 mt-1">Real Estate Appraisal</p>
      </div>
      <nav className="mt-2">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  location.pathname === item.path ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;