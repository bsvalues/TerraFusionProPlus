import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';

// Lazy loaded pages
const Properties = lazy(() => import('./pages/Properties'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const MarketData = lazy(() => import('./pages/MarketData'));
const Appraisals = lazy(() => import('./pages/Appraisals'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 overflow-auto">
          <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/market-data" element={<MarketData />} />
              <Route path="/appraisals" element={<Appraisals />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default App;