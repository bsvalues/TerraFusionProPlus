import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar onMenuButtonClick={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <Routes>
              <Route path="/" element={<Properties />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;