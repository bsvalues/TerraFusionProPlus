import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Appraisals from './pages/Appraisals';
import Comparables from './pages/Comparables';
import Reports from './pages/Reports';
import MarketData from './pages/MarketData';
import Settings from './pages/Settings';
import PropertyForm from './pages/PropertyForm';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 pt-16 lg:pl-20 overflow-auto">
        <main className="p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/properties/new" element={<PropertyForm />} />
            <Route path="/properties/edit/:id" element={<PropertyForm />} />
            <Route path="/appraisals" element={<Appraisals />} />
            <Route path="/comparables" element={<Comparables />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/market-data" element={<MarketData />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}