const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data for the API
const properties = [
  { 
    id: 1, 
    address: '123 Main St', 
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    propertyType: 'Single Family',
    squareFeet: 2350,
    bedrooms: 4,
    bathrooms: 2.5,
    yearBuilt: 2008,
    lotSize: 0.25,
    lotSizeUnit: 'acres',
    lastAppraisalValue: 425000,
    lastAppraisalDate: '2024-12-10',
    description: 'Beautiful single-family home in a quiet neighborhood with updated kitchen and bathrooms. Features a spacious backyard with mature trees and a covered patio.'
  },
  { 
    id: 2, 
    address: '456 Oak Ave', 
    city: 'Dallas',
    state: 'TX',
    zipCode: '75201',
    propertyType: 'Condominium',
    squareFeet: 1850,
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 2015,
    lastAppraisalValue: 512000,
    lastAppraisalDate: '2024-11-22',
    description: 'Modern condo in the heart of downtown with high-end finishes and appliances. Building amenities include a pool, fitness center, and 24-hour concierge.'
  },
  { 
    id: 3, 
    address: '789 Pine Blvd', 
    city: 'Houston',
    state: 'TX',
    zipCode: '77002',
    propertyType: 'Multi-Family',
    squareFeet: 3200,
    bedrooms: 5,
    bathrooms: 3,
    yearBuilt: 2002,
    lotSize: 0.15,
    lotSizeUnit: 'acres',
    lastAppraisalValue: 680000,
    lastAppraisalDate: '2024-12-05',
    description: 'Investment opportunity with two separate units. Main house features 3BR/2BA and the attached unit has 2BR/1BA. Both units recently renovated with separate utilities.'
  },
];

// API Routes
app.get('/api/properties', (req, res) => {
  res.json(properties);
});

app.get('/api/properties/:id', (req, res) => {
  const property = properties.find(p => p.id === parseInt(req.params.id));
  
  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }
  
  res.json(property);
});

// Create a new property
app.post('/api/properties', (req, res) => {
  const newProperty = {
    id: properties.length > 0 ? Math.max(...properties.map(p => p.id)) + 1 : 1,
    ...req.body,
    lastAppraisalValue: req.body.lastAppraisalValue || null,
    lastAppraisalDate: req.body.lastAppraisalDate || null
  };
  
  properties.push(newProperty);
  res.status(201).json(newProperty);
});

// Update an existing property
app.put('/api/properties/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const propertyIndex = properties.findIndex(p => p.id === id);
  
  if (propertyIndex === -1) {
    return res.status(404).json({ message: 'Property not found' });
  }
  
  const updatedProperty = {
    ...properties[propertyIndex],
    ...req.body
  };
  
  properties[propertyIndex] = updatedProperty;
  res.json(updatedProperty);
});

// Serve static assets - enabling this for all environments for development
// Set static folder
app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve the index.html for any other routes (client-side routing)
app.get('*', (req, res) => {
  // Exclude API routes from this catch-all handler
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});