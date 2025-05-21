import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-700">
                TerraFusionProfessional
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
                <Bell className="h-5 w-5" />
              </button>
              <div className="ml-3 relative">
                <div>
                  <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="ml-3 relative">
                <div>
                  <button className="flex text-sm rounded-full focus:outline-none">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;