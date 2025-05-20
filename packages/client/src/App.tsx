import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import queryClient from './lib/queryClient';

// Import pages
import Dashboard from './pages/Dashboard';
import Deployments from './pages/Deployments';
import DeploymentDetail from './pages/DeploymentDetail';
import Pipelines from './pages/Pipelines';
import PipelineDetail from './pages/PipelineDetail';
import Monitoring from './pages/Monitoring';
import Settings from './pages/Settings';

// App Layout Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app-container bg-gray-100 min-h-screen">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/deployments" element={<Deployments />} />
                <Route path="/deployments/:id" element={<DeploymentDetail />} />
                <Route path="/pipelines" element={<Pipelines />} />
                <Route path="/pipelines/:id" element={<PipelineDetail />} />
                <Route path="/monitoring" element={<Monitoring />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;