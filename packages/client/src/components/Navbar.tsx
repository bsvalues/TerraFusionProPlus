import { Link } from 'react-router-dom';
import { Bell, Settings, Search, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 8L12 12L20 8L12 4Z" fill="currentColor" />
                  <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xl font-bold text-gray-900">TerraFusionPro</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="relative rounded-md shadow-sm md:w-64 xl:w-96 mr-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10"
                placeholder="Search..."
              />
            </div>
            
            <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Bell className="h-6 w-6" />
            </button>
            
            <Link to="/settings" className="ml-3 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Settings className="h-6 w-6" />
            </Link>
            
            <div className="ml-3 relative">
              <div>
                <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;