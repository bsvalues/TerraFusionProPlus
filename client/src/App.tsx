import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Appraisals from './pages/Appraisals';
import PropertyDetail from './pages/PropertyDetail';
import AppraisalDetail from './pages/AppraisalDetail';
import Comparables from './pages/Comparables';
import MarketData from './pages/MarketData';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="app-container">
      <Sidebar collapsed={sidebarCollapsed} />
      
      <main className={`main-content ${sidebarCollapsed ? 'main-content-expanded' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/appraisals" element={<Appraisals />} />
            <Route path="/appraisals/:id" element={<AppraisalDetail />} />
            <Route path="/comparables" element={<Comparables />} />
            <Route path="/market-data" element={<MarketData />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;