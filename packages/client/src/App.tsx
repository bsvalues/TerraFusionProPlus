import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/deployments" element={<div className="text-2xl font-bold">Deployments</div>} />
            <Route path="/pipelines" element={<div className="text-2xl font-bold">Pipelines</div>} />
            <Route path="/monitoring" element={<div className="text-2xl font-bold">Monitoring</div>} />
            <Route path="/settings" element={<div className="text-2xl font-bold">Settings</div>} />
            <Route path="*" element={<div className="text-center text-2xl mt-10">Page not found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;