import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Search, Menu } from 'lucide-react';

interface NavbarProps {
  // Add any props here if needed
}

const Navbar: React.FC<NavbarProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Logo and Menu Toggle (Mobile) */}
        <div className="flex items-center">
          <button 
            className="mr-4 p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary-600">TerraFusionPro</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 px-6 max-w-xl">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search properties, appraisals, reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* User Nav */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              className="p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
                <div className="px-4 py-2 font-medium border-b border-gray-200">Notifications</div>
                <div className="max-h-60 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium">New appraisal request</p>
                    <p className="text-xs text-gray-500">123 Main St, Austin, TX</p>
                    <p className="text-xs text-gray-500">30 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium">Market data update</p>
                    <p className="text-xs text-gray-500">Houston, TX area (77002)</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50">
                    <p className="text-sm font-medium">Report ready for review</p>
                    <p className="text-xs text-gray-500">456 Oak Ave, Dallas, TX</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
                <div className="px-4 py-2 text-center text-sm text-primary-600 hover:underline border-t border-gray-200">
                  <a href="#">View all notifications</a>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              className="flex items-center text-gray-500 hover:text-gray-900"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="User account"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5" />
              </div>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
                <div className="px-4 py-2 font-medium text-sm border-b border-gray-200">Michael Rodriguez</div>
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                <div className="border-t border-gray-100"></div>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search (visible on small screens) */}
      <div className="mt-2 md:hidden">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
    </header>
  );
};

export default Navbar;