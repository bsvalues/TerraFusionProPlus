import { Link } from 'react-router-dom';
import { Menu, Bell, User } from 'lucide-react';

interface NavbarProps {
  onMenuButtonClick: () => void;
}

const Navbar = ({ onMenuButtonClick }: NavbarProps) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuButtonClick}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 md:ml-0">
            <Link to="/" className="flex items-center">
              <img
                src="/assets/logo.svg"
                alt="TerraFusion Professional"
                className="h-8 w-auto mr-2"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/32?text=TFP';
                }}
              />
              <span className="hidden md:block text-xl font-semibold text-gray-900">
                TerraFusion Professional
              </span>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Bell className="h-5 w-5" />
          </button>
          <div className="relative">
            <button className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5" />
              </span>
              <span className="ml-2 hidden md:block font-medium">John Appraiser</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;