import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, User, X, LogOut, Search } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button 
              id="toggleSidebarMobile" 
              aria-expanded="true" 
              aria-controls="sidebar" 
              className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
              onClick={toggleSidebar}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center">
              <span className="self-center text-xl font-semibold whitespace-nowrap text-primary-700">TerraFusionPro</span>
            </Link>
            <div className="hidden lg:flex ml-10">
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50">
                <Search className="h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent ml-2 outline-none text-sm flex-grow"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <button
                className="p-2 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 focus:ring-2 focus:ring-gray-100"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="absolute top-0 right-0 inline-block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                <Bell className="w-5 h-5" />
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <button 
                      className="text-gray-500 hover:text-gray-900"
                      onClick={() => setShowNotifications(false)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="px-2 py-1 max-h-64 overflow-y-auto">
                    <div className="px-2 py-2 hover:bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-800 font-medium">New appraisal assignment</p>
                      <p className="text-xs text-gray-500 mt-1">You have been assigned a new property at 123 Main St.</p>
                      <p className="text-xs text-gray-400 mt-1">30 minutes ago</p>
                    </div>
                    <div className="px-2 py-2 hover:bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-800 font-medium">Appraisal review requested</p>
                      <p className="text-xs text-gray-500 mt-1">John Smith has requested a review for 456 Oak Ave.</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                    <div className="px-2 py-2 hover:bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-800 font-medium">Market data update</p>
                      <p className="text-xs text-gray-500 mt-1">New market data is available for Houston area.</p>
                      <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-2 pb-1 px-4">
                    <Link to="/notifications" className="text-sm text-primary-600 hover:text-primary-700">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative ml-3">
              <button
                className="flex text-sm bg-gray-100 rounded-full focus:ring-2 focus:ring-primary-600"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary-100 text-primary-700">
                  <User className="w-4 h-4" />
                </div>
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">John Appraiser</p>
                    <p className="text-xs text-gray-500 truncate">john@example.com</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Your Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Settings
                  </Link>
                  <div className="border-t border-gray-200 mt-1"></div>
                  <button 
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;