import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Comparables from './pages/Comparables';
import MarketData from './pages/MarketData';
import Settings from './pages/Settings';
import EnhancedAppraisalDashboard from './pages/EnhancedAppraisalDashboard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <header className="mb-4">
            <h1 className="text-xl font-bold mb-4">TerraFusion Professional</h1>
            <nav className="space-x-4">
              <Link to="/" className="text-blue-600 hover:underline">Dashboard</Link>
              <Link to="/properties" className="text-blue-600 hover:underline">Properties</Link>
              <Link to="/comparables" className="text-blue-600 hover:underline">Comparables</Link>
              <Link to="/market-data" className="text-blue-600 hover:underline">Market Data</Link>
              <Link to="/settings" className="text-blue-600 hover:underline">Settings</Link>
            </nav>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/comparables" element={<Comparables />} />
              <Route path="/market-data" element={<MarketData />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/appraisals/:id" element={<EnhancedAppraisalDashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}