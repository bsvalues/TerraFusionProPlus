import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

// Import pages
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import AppraisalDetail from './pages/AppraisalDetail';
import MarketAnalysis from './pages/MarketAnalysis';

// Sidebar navigation items
const navItems = [
  { title: 'Properties', path: '/', icon: '🏠' },
  { title: 'Market Analysis', path: '/market-analysis', icon: '📊' },
  { title: 'Appraisals', path: '/appraisals', icon: '📝' },
  { title: 'Reports', path: '/reports', icon: '📊' },
  { title: 'Valuation Tools', path: '/valuation-calculator', icon: '🧮' }
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <div 
            className={`bg-white shadow-md fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 md:static md:inset-auto md:h-screen md:z-auto`}
          >
            <div className="flex items-center justify-between h-16 px-6 border-b">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl">🏢</span>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-500 bg-clip-text text-transparent">
                  TerraFusion<span className="font-extrabold">Pro</span>
                </h1>
              </Link>
              <button 
                className="md:hidden text-gray-500 hover:text-gray-700"
                onClick={toggleSidebar}
              >
                <span className="text-xl">✖</span>
              </button>
            </div>
            
            <nav className="px-4 py-6">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="mr-3 text-xl">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="pt-8 mt-8 border-t">
                <div className="px-4 py-4 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium text-gray-500">Quick Stats</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Active Appraisals</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed This Month</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Turnaround Time</span>
                      <span className="font-medium">3 days</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center px-4 py-4 mt-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                      JS
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">John Smith</p>
                    <p className="text-xs text-gray-500">Appraiser</p>
                  </div>
                </div>
              </div>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white shadow-sm z-10">
              <div className="flex items-center justify-between h-16 px-6">
                <button 
                  className="text-gray-500 hover:text-gray-700 focus:outline-none md:hidden"
                  onClick={toggleSidebar}
                >
                  <span className="text-2xl">☰</span>
                </button>
                
                <div className="flex items-center space-x-4">
                  <button className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none">
                    <span className="text-xl">🔔</span>
                  </button>
                  <button className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none">
                    <span className="text-xl">⚙️</span>
                  </button>
                </div>
              </div>
            </header>
            
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Properties />} />
                <Route path="/properties/:id" element={<PropertyDetail />} />
                <Route path="/appraisals/:id" element={<AppraisalDetail />} />
                <Route path="/market-analysis" element={<MarketAnalysis />} />
                {/* Placeholder routes for future pages */}
                <Route path="/appraisals" element={<div className="p-8">Appraisals List Page (Coming Soon)</div>} />
                <Route path="/reports" element={<div className="p-8">Reports Page (Coming Soon)</div>} />
                <Route path="/valuation-calculator" element={<div className="p-8">Valuation Calculator (Coming Soon)</div>} />
                <Route path="*" element={<div className="p-8">Page Not Found</div>} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;