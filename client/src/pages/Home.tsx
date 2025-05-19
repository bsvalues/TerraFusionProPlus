import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, FileText, BarChart4, LineChart } from 'lucide-react';

export const Home = () => {
  const [stats, setStats] = useState({
    properties: 0,
    appraisals: 0,
    comparables: 0,
    averageValue: 0
  });

  useEffect(() => {
    // For demo purposes, we'll use static data
    setStats({
      properties: 32,
      appraisals: 18,
      comparables: 124,
      averageValue: 875000
    });
  }, []);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold gradient-heading">TerraFusion Professional Dashboard</h1>
        <p className="text-gray-600 mt-2">Real Estate Appraisal & Valuation Platform</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Properties</h3>
              <p className="text-3xl font-bold text-blue-700">{stats.properties}</p>
            </div>
            <Building2 size={40} className="text-blue-500 opacity-70" />
          </div>
          <div className="mt-4">
            <Link to="/properties" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All Properties →</Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Appraisals</h3>
              <p className="text-3xl font-bold text-green-700">{stats.appraisals}</p>
            </div>
            <FileText size={40} className="text-green-500 opacity-70" />
          </div>
          <div className="mt-4">
            <Link to="/appraisals" className="text-green-600 hover:text-green-800 text-sm font-medium">View All Appraisals →</Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Comparables</h3>
              <p className="text-3xl font-bold text-amber-700">{stats.comparables}</p>
            </div>
            <BarChart4 size={40} className="text-amber-500 opacity-70" />
          </div>
          <div className="mt-4">
            <Link to="/comparables" className="text-amber-600 hover:text-amber-800 text-sm font-medium">View All Comparables →</Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Avg. Property Value</h3>
              <p className="text-3xl font-bold text-purple-700">${stats.averageValue.toLocaleString()}</p>
            </div>
            <LineChart size={40} className="text-purple-500 opacity-70" />
          </div>
          <div className="mt-4">
            <Link to="/market-analysis" className="text-purple-600 hover:text-purple-800 text-sm font-medium">View Market Analysis →</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="dashboard-card">
          <h2 className="text-xl font-semibold mb-4">Recent Properties</h2>
          <div className="space-y-4">
            {[
              { id: 1, address: "123 Main St", city: "San Francisco", state: "CA", value: 950000 },
              { id: 2, address: "456 Oak Ave", city: "San Francisco", state: "CA", value: 750000 },
              { id: 3, address: "789 Pine Rd", city: "San Francisco", state: "CA", value: 1650000 }
            ].map(property => (
              <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-medium">{property.address}</h3>
                  <p className="text-sm text-gray-500">{property.city}, {property.state}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${property.value.toLocaleString()}</p>
                  <Link to={`/properties/${property.id}`} className="text-sm text-blue-600 hover:text-blue-800">View</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dashboard-card">
          <h2 className="text-xl font-semibold mb-4">Recent Appraisals</h2>
          <div className="space-y-4">
            {[
              { id: 1, property: "123 Main St", date: "May 10, 2024", status: "Completed", value: 945000 },
              { id: 2, property: "456 Oak Ave", date: "May 8, 2024", status: "In Progress", value: null },
              { id: 3, property: "789 Pine Rd", date: "May 5, 2024", status: "Completed", value: 1620000 }
            ].map(appraisal => (
              <div key={appraisal.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-medium">{appraisal.property}</h3>
                  <p className="text-sm text-gray-500">{appraisal.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {appraisal.status === "Completed" 
                      ? `$${appraisal.value?.toLocaleString()}` 
                      : <span className="text-amber-600">{appraisal.status}</span>}
                  </p>
                  <Link to={`/appraisals/${appraisal.id}`} className="text-sm text-blue-600 hover:text-blue-800">View</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};