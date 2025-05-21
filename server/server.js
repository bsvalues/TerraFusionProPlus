const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

// API Routes - Using real data from PostgreSQL
app.get('/api/properties', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM properties ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Error fetching property' });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const { 
      address, city, state, zip_code, property_type, 
      year_built, square_feet, bedrooms, bathrooms, 
      lot_size, description, parcel_number, zoning 
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO properties 
       (address, city, state, zip_code, property_type, year_built, square_feet, 
        bedrooms, bathrooms, lot_size, description, parcel_number, zoning, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()) 
       RETURNING *`,
      [address, city, state, zip_code, property_type, year_built, square_feet, 
       bedrooms, bathrooms, lot_size, description, parcel_number, zoning]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Error creating property' });
  }
});

app.put('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      address, city, state, zip_code, property_type, 
      year_built, square_feet, bedrooms, bathrooms, 
      lot_size, description, parcel_number, zoning 
    } = req.body;
    
    const result = await pool.query(
      `UPDATE properties SET 
        address = $1, 
        city = $2, 
        state = $3, 
        zip_code = $4, 
        property_type = $5, 
        year_built = $6, 
        square_feet = $7, 
        bedrooms = $8, 
        bathrooms = $9, 
        lot_size = $10, 
        description = $11, 
        parcel_number = $12, 
        zoning = $13,
        updated_at = NOW()
       WHERE id = $14 
       RETURNING *`,
      [address, city, state, zip_code, property_type, year_built, square_feet, 
       bedrooms, bathrooms, lot_size, description, parcel_number, zoning, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Error updating property' });
  }
});

// Serve static files from the React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist'));
}

// For any other requests, serve the React app
app.get('*', (req, res) => {
  // Exclude API routes from this catch-all handler
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  
  // Serve the React app for frontend routes
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  } else {
    res.status(404).json({ message: 'Route not found' });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;