import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

// Pages
import Dashboard from './pages/Dashboard';
import Pipelines from './pages/Pipelines';

// Navigation icons
import {
  Layout,
  BarChart2,
  GitBranch,
  Server,
  Activity,
  Settings,
  Menu,
  X
} from 'lucide-react';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Navigation items
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <BarChart2 size={20} /> },
    { path: '/pipelines', label: 'Pipelines', icon: <GitBranch size={20} /> },
    { path: '/environments', label: 'Environments', icon: <Server size={20} /> },
    { path: '/monitoring', label: 'Monitoring', icon: <Activity size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-100">
        {/* Mobile sidebar backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
            onClick={closeSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 md:relative md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center space-x-2">
              <Layout className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">TerraFusion</span>
            </div>
            <button 
              className="rounded p-1 focus:outline-none focus:ring md:hidden"
              onClick={closeSidebar}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={closeSidebar}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top navbar */}
          <header className="bg-white shadow-sm z-10">
            <div className="flex h-16 items-center justify-between px-4">
              <button 
                className="rounded p-1 focus:outline-none focus:ring md:hidden"
                onClick={toggleSidebar}
              >
                <Menu size={20} />
              </button>
              
              <div className="ml-auto flex items-center space-x-4">
                <div className="relative">
                  <button className="h-8 w-8 rounded-full bg-gray-200 text-sm font-medium text-gray-700 flex items-center justify-center">
                    JS
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pipelines" element={<Pipelines />} />
              <Route path="/environments" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Environments</h1>
                  <p>Environment management functionality coming soon.</p>
                </div>
              } />
              <Route path="/monitoring" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Infrastructure Monitoring</h1>
                  <p>Monitoring functionality coming soon.</p>
                </div>
              } />
              <Route path="/settings" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Settings</h1>
                  <p>Settings functionality coming soon.</p>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default App;