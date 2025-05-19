import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './lib/queryClient';
import { 
  Building2, 
  LineChart, 
  FileText, 
  BarChart4, 
  Home as HomeIcon,
  Users,
  Settings,
  Menu,
  Calculator
} from 'lucide-react';

// Import page components
import { Home } from './pages/Home';
import { Properties } from './pages/Properties';
import { PropertyDetail } from './pages/PropertyDetail';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out shadow-xl`}>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-1">TerraFusion</h1>
            <h2 className="text-lg font-semibold text-blue-200">Professional</h2>
          </div>
          <nav className="mt-6">
            <ul>
              <li className="mb-1">
                <Link 
                  to="/" 
                  className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${isActive('/') ? 'bg-blue-700' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <HomeIcon className="mr-3" size={20} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link 
                  to="/properties" 
                  className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${isActive('/properties') ? 'bg-blue-700' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Building2 className="mr-3" size={20} />
                  <span>Properties</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link 
                  to="/appraisals" 
                  className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${isActive('/appraisals') ? 'bg-blue-700' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <FileText className="mr-3" size={20} />
                  <span>Appraisals</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link 
                  to="/comparables" 
                  className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${isActive('/comparables') ? 'bg-blue-700' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <BarChart4 className="mr-3" size={20} />
                  <span>Comparables</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link 
                  to="/valuation-calculator" 
                  className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${isActive('/valuation-calculator') ? 'bg-blue-700' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Calculator className="mr-3" size={20} />
                  <span>Valuation Calculator</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link 
                  to="/market-analysis" 
                  className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${isActive('/market-analysis') ? 'bg-blue-700' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <LineChart className="mr-3" size={20} />
                  <span>Market Analysis</span>
                </Link>
              </li>
            </ul>
            
            <div className="pt-4 mt-6 border-t border-blue-700">
              <ul>
                <li className="mb-1">
                  <Link 
                    to="/users" 
                    className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${isActive('/users') ? 'bg-blue-700' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Users className="mr-3" size={20} />
                    <span>Team Members</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link 
                    to="/settings" 
                    className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 ${isActive('/settings') ? 'bg-blue-700' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings className="mr-3" size={20} />
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-blue-300 text-xs">
            TerraFusionProfessional v1.0.0
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="fixed top-4 left-4 md:hidden z-50">
          <button 
            onClick={toggleMenu} 
            className="p-2 bg-blue-800 rounded-md text-white shadow-md"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 md:ml-64 overflow-y-auto">
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center h-64">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
                  <p className="text-gray-600 mb-4">Sorry, the page you are looking for doesn't exist.</p>
                  <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Return to Dashboard
                  </Link>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default App;