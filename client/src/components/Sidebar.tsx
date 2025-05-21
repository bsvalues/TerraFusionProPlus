import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Home, FileText, BarChart3, Settings, Users, ChevronRight 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
    { path: '/properties', icon: <Home size={20} />, text: 'Properties' },
    { path: '/appraisals', icon: <FileText size={20} />, text: 'Appraisals' },
    { path: '/market-data', icon: <BarChart3 size={20} />, text: 'Market Data' },
    { path: '/team', icon: <Users size={20} />, text: 'Team' },
    { path: '/settings', icon: <Settings size={20} />, text: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-blue-800 text-white min-h-screen">
      <div className="p-4">
        <div className="text-xl font-bold mb-8">TerraFusion</div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm rounded-md hover:bg-blue-700 transition-colors ${isActive(item.path)}`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.text}</span>
              <ChevronRight size={16} className="ml-auto" />
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;