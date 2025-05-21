import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  FileText, 
  BarChart4, 
  Settings, 
  Users, 
  ChevronsLeft, 
  ChevronsRight,
  Search
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // Toggle sidebar on mobile devices
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to determine if a nav link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside 
      className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out fixed md:relative h-screen z-20 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isCollapsed ? 'md:w-16' : 'md:w-64'}`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center">
            <span className="text-lg font-bold text-primary-600">TFPro</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 hidden md:block"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="p-2 space-y-1">
        <Link
          to="/"
          className={`flex items-center p-2 rounded-md ${
            isActive('/') 
              ? 'bg-primary-50 text-primary-600' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Home className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Dashboard</span>}
        </Link>

        <Link
          to="/properties"
          className={`flex items-center p-2 rounded-md ${
            isActive('/properties') || location.pathname.startsWith('/properties/') 
              ? 'bg-primary-50 text-primary-600' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Building2 className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Properties</span>}
        </Link>

        <Link
          to="/appraisals"
          className={`flex items-center p-2 rounded-md ${
            isActive('/appraisals') 
              ? 'bg-primary-50 text-primary-600' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <FileText className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Appraisals</span>}
        </Link>

        <Link
          to="/market-data"
          className={`flex items-center p-2 rounded-md ${
            isActive('/market-data') 
              ? 'bg-primary-50 text-primary-600' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <BarChart4 className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Market Data</span>}
        </Link>
        
        <Link
          to="/reports"
          className={`flex items-center p-2 rounded-md ${
            isActive('/reports') 
              ? 'bg-primary-50 text-primary-600' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Search className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Reports</span>}
        </Link>

        <div className="pt-4 mt-4 border-t border-gray-200">
          <Link
            to="/team"
            className={`flex items-center p-2 rounded-md ${
              isActive('/team') 
                ? 'bg-primary-50 text-primary-600' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Team</span>}
          </Link>

          <Link
            to="/settings"
            className={`flex items-center p-2 rounded-md ${
              isActive('/settings') 
                ? 'bg-primary-50 text-primary-600' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Settings</span>}
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;