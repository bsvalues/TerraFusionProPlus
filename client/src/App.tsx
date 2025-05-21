import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
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
        </main>
      </div>
    </div>
  );
}

// Placeholder components to be implemented
const Dashboard = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="card bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Appraisals</h3>
        <p className="text-3xl font-bold text-blue-600">12</p>
      </div>
      <div className="card bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Properties</h3>
        <p className="text-3xl font-bold text-blue-600">48</p>
      </div>
      <div className="card bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed</h3>
        <p className="text-3xl font-bold text-green-600">24</p>
      </div>
      <div className="card bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Review</h3>
        <p className="text-3xl font-bold text-yellow-600">6</p>
      </div>
    </div>
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Recent Appraisals</h2>
      <div className="bg-white shadow-sm rounded-lg">
        <p className="p-6 text-gray-500 italic">Recent appraisals will be displayed here</p>
      </div>
    </div>
  </div>
);

const Properties = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Properties</h1>
    <div className="bg-white shadow-sm rounded-lg p-6">
      <p className="text-gray-500 italic">Property listings will be displayed here</p>
    </div>
  </div>
);

const PropertyDetail = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Property Details</h1>
    <div className="bg-white shadow-sm rounded-lg p-6">
      <p className="text-gray-500 italic">Property details will be displayed here</p>
    </div>
  </div>
);

const MarketData = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Market Analysis</h1>
    <div className="bg-white shadow-sm rounded-lg p-6">
      <p className="text-gray-500 italic">Market analysis data will be displayed here</p>
    </div>
  </div>
);

const Appraisals = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Appraisals</h1>
    <div className="bg-white shadow-sm rounded-lg p-6">
      <p className="text-gray-500 italic">Appraisal listings will be displayed here</p>
    </div>
  </div>
);

const AppraisalDetail = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Appraisal Details</h1>
    <div className="bg-white shadow-sm rounded-lg p-6">
      <p className="text-gray-500 italic">Appraisal details will be displayed here</p>
    </div>
  </div>
);

const Settings = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Settings</h1>
    <div className="bg-white shadow-sm rounded-lg p-6">
      <p className="text-gray-500 italic">Settings will be displayed here</p>
    </div>
  </div>
);

export default App;