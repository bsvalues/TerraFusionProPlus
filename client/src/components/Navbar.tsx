import React from 'react';
import { Link } from 'react-router-dom';
import { User, Bell, Settings, Search } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-semibold text-blue-600">
            TerraFusionPro
          </Link>
          <div className="ml-10 hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/properties" className="text-gray-700 hover:text-blue-600">
              Properties
            </Link>
            <Link to="/appraisals" className="text-gray-700 hover:text-blue-600">
              Appraisals
            </Link>
            <Link to="/market-data" className="text-gray-700 hover:text-blue-600">
              Market Data
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 lg:w-64"
            />
          </div>
          <button className="p-2 text-gray-500 hover:text-blue-600">
            <Bell size={20} />
          </button>
          <Link to="/settings" className="p-2 text-gray-500 hover:text-blue-600">
            <Settings size={20} />
          </Link>
          <button className="p-2 text-gray-500 hover:text-blue-600">
            <User size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;