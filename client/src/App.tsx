import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Comparables from './pages/Comparables';
import MarketData from './pages/MarketData';
import Settings from './pages/Settings';
import EnhancedAppraisalDashboard from './pages/EnhancedAppraisalDashboard';
import { Home, Building2, Map, ClipboardCheck, BarChart4, Settings as SettingsIcon } from 'lucide-react';

// Navigation link component for consistent styling
const NavLink = ({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <Link 
      to={to} 
      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-blue-50 text-blue-700 font-medium' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="ml-3">{children}</span>
    </Link>
  );
};

// Mobile navigation toggle
const MobileNav = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  return (
    <div className="md:hidden">
      <button 
        onClick={toggle} 
        className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg 
          className="h-6 w-6" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
    </div>
  );
};

// Sidebar component
const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:w-64 bg-white border-r border-gray-200 flex-col fixed inset-y-0">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-700">TerraFusion Pro</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Main
          </p>
          <ul className="space-y-1">
            <li>
              <NavLink to="/" icon={<Home className="w-5 h-5" />}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/properties" icon={<Building2 className="w-5 h-5" />}>
                Properties
              </NavLink>
            </li>
            <li>
              <NavLink to="/appraisals" icon={<ClipboardCheck className="w-5 h-5" />}>
                Appraisals
              </NavLink>
            </li>
            <li>
              <NavLink to="/comparables" icon={<Map className="w-5 h-5" />}>
                Comparables
              </NavLink>
            </li>
          </ul>
        </div>
        
        <div>
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Analysis
          </p>
          <ul className="space-y-1">
            <li>
              <NavLink to="/market-data" icon={<BarChart4 className="w-5 h-5" />}>
                Market Data
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" icon={<SettingsIcon className="w-5 h-5" />}>
                Settings
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
            JA
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">John Appraiser</p>
            <p className="text-xs text-gray-500">Appraiser</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

// App Header - Mobile version
const Header = ({ toggleMobileNav }: { toggleMobileNav: () => void }) => {
  return (
    <header className="bg-white border-b border-gray-200 md:hidden">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <MobileNav isOpen={false} toggle={toggleMobileNav} />
          <h1 className="ml-3 text-lg font-bold text-blue-700">TerraFusion Pro</h1>
        </div>
        <div>
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
            JA
          </div>
        </div>
      </div>
    </header>
  );
};

export default function App() {
  // Simple function to toggle mobile navigation
  const toggleMobileNav = () => {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.toggle('hidden');
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header toggleMobileNav={toggleMobileNav} />
        
        {/* Mobile Navigation */}
        <div id="mobile-menu" className="md:hidden fixed inset-0 z-20 bg-gray-900 bg-opacity-50 hidden">
          <div className="bg-white h-full w-64 p-4">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-lg text-blue-700">Menu</h2>
              <button onClick={toggleMobileNav} className="text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-100" onClick={toggleMobileNav}>
                    <Home className="inline-block w-5 h-5 mr-2" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/properties" className="block px-3 py-2 rounded-md hover:bg-gray-100" onClick={toggleMobileNav}>
                    <Building2 className="inline-block w-5 h-5 mr-2" />
                    Properties
                  </Link>
                </li>
                <li>
                  <Link to="/appraisals" className="block px-3 py-2 rounded-md hover:bg-gray-100" onClick={toggleMobileNav}>
                    <ClipboardCheck className="inline-block w-5 h-5 mr-2" />
                    Appraisals
                  </Link>
                </li>
                <li>
                  <Link to="/comparables" className="block px-3 py-2 rounded-md hover:bg-gray-100" onClick={toggleMobileNav}>
                    <Map className="inline-block w-5 h-5 mr-2" />
                    Comparables
                  </Link>
                </li>
                <li>
                  <Link to="/market-data" className="block px-3 py-2 rounded-md hover:bg-gray-100" onClick={toggleMobileNav}>
                    <BarChart4 className="inline-block w-5 h-5 mr-2" />
                    Market Data
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="block px-3 py-2 rounded-md hover:bg-gray-100" onClick={toggleMobileNav}>
                    <SettingsIcon className="inline-block w-5 h-5 mr-2" />
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        <div className="flex">
          <Sidebar />

          {/* Main content */}
          <main className="flex-1 md:ml-64 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/comparables" element={<Comparables />} />
              <Route path="/market-data" element={<MarketData />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Enhanced routes */}
              <Route path="/appraisals/:id" element={<EnhancedAppraisalDashboard />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}