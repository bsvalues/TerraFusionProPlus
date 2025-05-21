import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Building,
  FileText,
  BarChart2,
  Users,
  Settings,
  Briefcase,
  Scale
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  // Navigation items for the real estate appraisal app
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/properties', label: 'Properties', icon: Building },
    { path: '/appraisals', label: 'Appraisals', icon: FileText },
    { path: '/comparables', label: 'Comparables', icon: Scale },
    { path: '/market-data', label: 'Market Data', icon: BarChart2 },
    { path: '/teams', label: 'Team Management', icon: Users },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 min-h-screen bg-sidebar border-r pt-6 hidden md:block">
      <div className="space-y-4">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold tracking-tight">Navigation</h2>
        </div>
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground/70 hover:bg-accent'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;