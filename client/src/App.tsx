import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Properties } from './pages/Properties';
import { PropertyDetail } from './pages/PropertyDetail';
import { AppraisalForm } from './pages/AppraisalForm';
import { AppraisalDetails } from './pages/AppraisalDetails';
import { Comparables } from './pages/Comparables';
import { MarketAnalysis } from './pages/MarketAnalysis';
import { 
  Building2, 
  LineChart, 
  FileText, 
  BarChart4, 
  Home as HomeIcon,
  Menu
} from 'lucide-react';
import { useState } from 'react';

const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-1">TerraFusion</h1>
          <h2 className="text-lg font-semibold text-blue-200">Professional</h2>
        </div>
        <nav className="mt-6">
          <ul>
            <li className="mb-2">
              <Link to="/" className="flex items-center px-6 py-3 text-white hover:bg-blue-700">
                <HomeIcon className="mr-3" size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/properties" className="flex items-center px-6 py-3 text-white hover:bg-blue-700">
                <Building2 className="mr-3" size={20} />
                <span>Properties</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/appraisals" className="flex items-center px-6 py-3 text-white hover:bg-blue-700">
                <FileText className="mr-3" size={20} />
                <span>Appraisals</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/comparables" className="flex items-center px-6 py-3 text-white hover:bg-blue-700">
                <BarChart4 className="mr-3" size={20} />
                <span>Comparables</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/market-analysis" className="flex items-center px-6 py-3 text-white hover:bg-blue-700">
                <LineChart className="mr-3" size={20} />
                <span>Market Analysis</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 md:hidden z-50">
        <button 
          onClick={toggleMenu} 
          className="p-2 bg-blue-800 rounded-md text-white"
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
            <Route path="/appraisals/new" element={<AppraisalForm />} />
            <Route path="/appraisals/:id" element={<AppraisalDetails />} />
            <Route path="/comparables" element={<Comparables />} />
            <Route path="/market-analysis" element={<MarketAnalysis />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;