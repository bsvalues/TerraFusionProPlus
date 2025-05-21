import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  Building2, 
  ClipboardList, 
  BarChart4, 
  FileText, 
  Settings, 
  Briefcase,
  LineChart 
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: <HomeIcon size={20} />, label: 'Dashboard' },
    { path: '/properties', icon: <Building2 size={20} />, label: 'Properties' },
    { path: '/appraisals', icon: <ClipboardList size={20} />, label: 'Appraisals' },
    { path: '/comparables', icon: <Briefcase size={20} />, label: 'Comparables' },
    { path: '/market-data', icon: <BarChart4 size={20} />, label: 'Market Data' },
    { path: '/reports', icon: <FileText size={20} />, label: 'Reports' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="flex items-center justify-center w-full">
          {collapsed ? (
            <div className="h-8 w-8 bg-primary-600 rounded-md flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-600 rounded-md flex items-center justify-center text-white font-bold text-lg">
                T
              </div>
              <span className="text-lg font-bold text-gray-900">TerraFusion</span>
            </div>
          )}
        </div>
      </div>

      <nav className="mt-6">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2.5 rounded-md transition-colors duration-200 group ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3 text-current">{item.icon}</span>
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;