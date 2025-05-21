import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/market-data" element={<MarketData />} />
        <Route path="/appraisals" element={<Appraisals />} />
        <Route path="/appraisal/:id" element={<AppraisalDetail />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

// Placeholder components to be implemented
const Dashboard = () => <div className="container mx-auto p-6">Dashboard Coming Soon</div>;
const Properties = () => <div className="container mx-auto p-6">Properties Coming Soon</div>;
const PropertyDetail = () => <div className="container mx-auto p-6">Property Detail Coming Soon</div>;
const MarketData = () => <div className="container mx-auto p-6">Market Data Coming Soon</div>;
const Appraisals = () => <div className="container mx-auto p-6">Appraisals Coming Soon</div>;
const AppraisalDetail = () => <div className="container mx-auto p-6">Appraisal Detail Coming Soon</div>;
const Settings = () => <div className="container mx-auto p-6">Settings Coming Soon</div>;

export default App;