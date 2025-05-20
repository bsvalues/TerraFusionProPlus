import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app-container">
          <Navbar />
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/deployments" element={<div className="p-4">Deployments page coming soon...</div>} />
              <Route path="/pipelines" element={<div className="p-4">Pipelines page coming soon...</div>} />
              <Route path="/monitoring" element={<div className="p-4">Monitoring page coming soon...</div>} />
              <Route path="/analytics" element={<div className="p-4">Analytics page coming soon...</div>} />
              <Route path="/settings" element={<div className="p-4">Settings page coming soon...</div>} />
              <Route path="*" element={<div className="p-4">Page not found</div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;