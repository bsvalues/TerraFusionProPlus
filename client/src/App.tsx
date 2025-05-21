import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Comparables from './pages/Comparables';
import EnhancedAppraisalDashboard from './pages/EnhancedAppraisalDashboard';
import { Home, Building2, Map, ClipboardCheck, BarChart4, Settings } from 'lucide-react';

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
              <NavLink to="/settings" icon={<Settings className="w-5 h-5" />}>
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

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <Sidebar />

          {/* Main content */}
          <main className="flex-1 md:ml-64 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/comparables" element={<Comparables />} />
              
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