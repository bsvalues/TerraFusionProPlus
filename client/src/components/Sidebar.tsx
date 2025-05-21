import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  ClipboardList, 
  BarChart2, 
  Users, 
  Settings,
  ChevronDown,
  Search
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    appraisals: false,
    marketData: false
  });

  const toggleMenu = (menu: string) => {
    setExpandedMenus({
      ...expandedMenus,
      [menu]: !expandedMenus[menu]
    });
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside 
      id="sidebar" 
      className={`fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 w-64 h-full pt-16 font-normal duration-75 lg:flex transition-width ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
      aria-label="Sidebar"
    >
      <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200">
            <ul className="pb-2 space-y-2">
              <li>
                <form action="#" className="lg:hidden">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-5 h-5 text-gray-500" />
                    </div>
                    <input 
                      type="text" 
                      className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500" 
                      placeholder="Search"
                    />
                  </div>
                </form>
              </li>
              <li>
                <Link 
                  to="/" 
                  className={`flex items-center p-2 text-base rounded-lg hover:bg-gray-100 group ${
                    isActive('/') ? 'text-primary-600 bg-gray-100' : 'text-gray-900'
                  }`}
                >
                  <Home className={`w-6 h-6 ${isActive('/') ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-900'}`} />
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/properties" 
                  className={`flex items-center p-2 text-base rounded-lg hover:bg-gray-100 group ${
                    isActive('/properties') ? 'text-primary-600 bg-gray-100' : 'text-gray-900'
                  }`}
                >
                  <Building2 className={`w-6 h-6 ${isActive('/properties') ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-900'}`} />
                  <span className="ml-3">Properties</span>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className={`flex items-center w-full p-2 text-base rounded-lg group hover:bg-gray-100 ${
                    location.pathname.includes('/appraisals') ? 'text-primary-600 bg-gray-100' : 'text-gray-900'
                  }`}
                  onClick={() => toggleMenu('appraisals')}
                >
                  <ClipboardList className={`w-6 h-6 ${
                    location.pathname.includes('/appraisals') ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-900'
                  }`} />
                  <span className="flex-1 ml-3 text-left whitespace-nowrap">Appraisals</span>
                  <ChevronDown className={`w-5 h-5 ${expandedMenus.appraisals ? 'rotate-180' : ''} transition-transform`} />
                </button>
                <ul className={`${expandedMenus.appraisals ? 'block' : 'hidden'} py-2 space-y-2`}>
                  <li>
                    <Link
                      to="/appraisals"
                      className={`flex items-center p-2 pl-11 w-full text-base rounded-lg transition duration-75 group ${
                        isActive('/appraisals') ? 'text-primary-600 bg-gray-100' : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      All Appraisals
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/appraisals/in-progress"
                      className={`flex items-center p-2 pl-11 w-full text-base rounded-lg transition duration-75 group ${
                        isActive('/appraisals/in-progress') ? 'text-primary-600 bg-gray-100' : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      In Progress
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/appraisals/completed"
                      className={`flex items-center p-2 pl-11 w-full text-base rounded-lg transition duration-75 group ${
                        isActive('/appraisals/completed') ? 'text-primary-600 bg-gray-100' : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Completed
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <button
                  type="button"
                  className={`flex items-center w-full p-2 text-base rounded-lg group hover:bg-gray-100 ${
                    location.pathname.includes('/market-data') ? 'text-primary-600 bg-gray-100' : 'text-gray-900'
                  }`}
                  onClick={() => toggleMenu('marketData')}
                >
                  <BarChart2 className={`w-6 h-6 ${
                    location.pathname.includes('/market-data') ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-900'
                  }`} />
                  <span className="flex-1 ml-3 text-left whitespace-nowrap">Market Analysis</span>
                  <ChevronDown className={`w-5 h-5 ${expandedMenus.marketData ? 'rotate-180' : ''} transition-transform`} />
                </button>
                <ul className={`${expandedMenus.marketData ? 'block' : 'hidden'} py-2 space-y-2`}>
                  <li>
                    <Link
                      to="/market-data/trends"
                      className={`flex items-center p-2 pl-11 w-full text-base rounded-lg transition duration-75 group ${
                        isActive('/market-data/trends') ? 'text-primary-600 bg-gray-100' : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Market Trends
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/market-data/comparables"
                      className={`flex items-center p-2 pl-11 w-full text-base rounded-lg transition duration-75 group ${
                        isActive('/market-data/comparables') ? 'text-primary-600 bg-gray-100' : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Comparables
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/market-data/reports"
                      className={`flex items-center p-2 pl-11 w-full text-base rounded-lg transition duration-75 group ${
                        isActive('/market-data/reports') ? 'text-primary-600 bg-gray-100' : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Reports
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link 
                  to="/team" 
                  className={`flex items-center p-2 text-base rounded-lg hover:bg-gray-100 group ${
                    isActive('/team') ? 'text-primary-600 bg-gray-100' : 'text-gray-900'
                  }`}
                >
                  <Users className={`w-6 h-6 ${isActive('/team') ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-900'}`} />
                  <span className="ml-3">Team</span>
                </Link>
              </li>
            </ul>
            <ul className="pt-4 mt-4 space-y-2">
              <li>
                <Link 
                  to="/settings" 
                  className={`flex items-center p-2 text-base rounded-lg hover:bg-gray-100 group ${
                    isActive('/settings') ? 'text-primary-600 bg-gray-100' : 'text-gray-900'
                  }`}
                >
                  <Settings className={`w-6 h-6 ${isActive('/settings') ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-900'}`} />
                  <span className="ml-3">Settings</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;