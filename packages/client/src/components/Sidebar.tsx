import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  CloudUpload, 
  GitBranch, 
  Activity, 
  Settings,
  BarChart
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Deployments', path: '/deployments', icon: CloudUpload },
    { name: 'Pipelines', path: '/pipelines', icon: GitBranch },
    { name: 'Monitoring', path: '/monitoring', icon: Activity },
    { name: 'Analytics', path: '/analytics', icon: BarChart },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];
  
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen overflow-y-auto fixed left-0 top-16 bottom-0 hidden md:block">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-700 ${
                  active ? 'bg-gray-700 text-white' : 'text-gray-300'
                }`}
              >
                <Icon
                  className={`mr-4 flex-shrink-0 h-6 w-6 ${
                    active ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Environment selector */}
      <div className="px-4 mt-8">
        <label htmlFor="environment" className="block text-sm font-medium text-gray-400">
          Environment
        </label>
        <select
          id="environment"
          name="environment"
          className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option>Production</option>
          <option>Staging</option>
          <option>Development</option>
          <option>Testing</option>
        </select>
      </div>
      
      {/* Status indicator */}
      <div className="px-4 mt-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="h-2 w-2 rounded-full bg-green-400 inline-block"></span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-300">All systems operational</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;