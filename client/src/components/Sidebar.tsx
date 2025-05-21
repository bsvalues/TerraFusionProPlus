import { Link } from 'react-router-dom';
import { Dispatch, SetStateAction } from 'react';
import { 
  X, 
  Home,
  Building2, 
  Scale, 
  FileText, 
  BarChart4, 
  Users, 
  Settings 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Properties', path: '/properties', icon: Building2 },
    { name: 'Appraisals', path: '/appraisals', icon: Scale },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Market Data', path: '/market-data', icon: BarChart4 },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed md:sticky top-0 left-0 bottom-0 flex flex-col w-64 bg-white border-r border-gray-200 z-30 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <img
              src="/assets/logo.svg"
              alt="TerraFusion Professional"
              className="h-8 w-auto mr-2"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/32?text=TFP';
              }}
            />
            <span className="text-xl font-semibold text-gray-900">TFP</span>
          </Link>
          <button
            className="text-gray-500 hover:text-gray-700 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
              >
                <Icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <a
            href="#"
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <span className="ml-2">Documentation</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;