import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  ClipboardCheck, 
  TrendingUp, 
  FileText, 
  Settings as SettingsIcon,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/properties', label: 'Properties', icon: <Building2 className="h-5 w-5" /> },
    { path: '/appraisals', label: 'Appraisals', icon: <ClipboardCheck className="h-5 w-5" /> },
    { path: '/market-data', label: 'Market Data', icon: <TrendingUp className="h-5 w-5" /> },
    { path: '/reports', label: 'Reports', icon: <FileText className="h-5 w-5" /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> },
  ];

  const toggleSidebar = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className={`bg-gray-800 text-white w-64 fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out z-10`}>
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <span className="text-xl font-semibold">TerraFusion Pro</span>
        </div>
        <nav className="mt-5">
          <div className="px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-md ${
                  location.pathname === item.path
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;