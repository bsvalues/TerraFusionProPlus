import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  FileSpreadsheet, 
  BarChart4, 
  Users, 
  Settings,
  HelpCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
  };
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Properties', path: '/properties', icon: <Home className="h-5 w-5" /> },
    { name: 'Appraisals', path: '/appraisals', icon: <FileSpreadsheet className="h-5 w-5" /> },
    { name: 'Market Data', path: '/market-data', icon: <BarChart4 className="h-5 w-5" /> },
    { name: 'Team', path: '/team', icon: <Users className="h-5 w-5" /> },
  ];
  
  const secondaryMenuItems = [
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
    { name: 'Help & Support', path: '/help', icon: <HelpCircle className="h-5 w-5" /> },
  ];
  
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-sidebar text-white pt-16 z-30 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button - mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-white/10 lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
        
        {/* Navigation */}
        <nav className="mt-4 p-4 space-y-6">
          {/* Main navigation */}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
                {isActive(item.path) && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </Link>
            ))}
          </div>
          
          {/* Secondary navigation */}
          <div className="space-y-1 pt-4 border-t border-white/10">
            {secondaryMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
        
        {/* Stats */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="rounded-md bg-white/5 p-3 space-y-3">
            <div>
              <div className="text-xs text-white/50 mb-1">Current Appraisals</div>
              <div className="text-white font-medium">24 Active</div>
            </div>
            <div>
              <div className="text-xs text-white/50 mb-1">Completed This Month</div>
              <div className="text-white font-medium">37 Appraisals</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;