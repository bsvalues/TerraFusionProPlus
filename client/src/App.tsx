import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { queryClient } from './lib/query-client';

// Layout components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Appraisals from './pages/Appraisals';
import AppraisalDetail from './pages/AppraisalDetail';
import AppraisalForm from './pages/AppraisalForm';
import MarketData from './pages/MarketData';
import Comparables from './pages/Comparables';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 container mx-auto max-w-7xl">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/appraisals" element={<Appraisals />} />
              <Route path="/appraisals/:id" element={<AppraisalDetail />} />
              <Route path="/appraisals/new" element={<AppraisalForm />} />
              <Route path="/appraisals/:id/edit" element={<AppraisalForm />} />
              <Route path="/market-data" element={<MarketData />} />
              <Route path="/comparables" element={<Comparables />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;