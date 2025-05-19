require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure database connection
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL must be set. Did you forget to provision a database?");
  process.exit(1);
}

// Create a pool for database connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully. Server time:', res.rows[0].now);
    
    // Initialize the database if needed
    initializeDatabase();
  }
});

// For development, allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create tables if they don't exist
async function initializeDatabase() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        role TEXT NOT NULL DEFAULT 'appraiser',
        license_number TEXT,
        company TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create properties table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip_code TEXT NOT NULL,
        property_type TEXT NOT NULL,
        year_built INTEGER,
        square_feet NUMERIC,
        bedrooms NUMERIC,
        bathrooms NUMERIC,
        lot_size NUMERIC,
        description TEXT,
        last_sale_price NUMERIC,
        last_sale_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )
    `);

    // Create appraisals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appraisals (
        id SERIAL PRIMARY KEY,
        property_id INTEGER NOT NULL REFERENCES properties(id),
        appraiser_id INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP WITH TIME ZONE,
        status TEXT NOT NULL DEFAULT 'draft',
        purpose TEXT,
        market_value NUMERIC,
        valuation_method TEXT
      )
    `);

    // Create comparables table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comparables (
        id SERIAL PRIMARY KEY,
        appraisal_id INTEGER NOT NULL REFERENCES appraisals(id),
        address TEXT NOT NULL,
        sale_price NUMERIC NOT NULL,
        sale_date TIMESTAMP WITH TIME ZONE NOT NULL,
        square_feet NUMERIC NOT NULL,
        bedrooms NUMERIC,
        bathrooms NUMERIC,
        year_built INTEGER,
        adjustments TEXT,
        adjusted_price NUMERIC,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert demo user if none exist
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO users (username, email, password_hash, first_name, last_name, role)
        VALUES ('demo', 'demo@terrafusion.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'Demo', 'User', 'admin')
      `);
      console.log('Demo user created');
    }

    // Insert demo properties if none exist
    const propertyCount = await pool.query('SELECT COUNT(*) FROM properties');
    if (parseInt(propertyCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO properties (address, city, state, zip_code, property_type, year_built, square_feet, bedrooms, bathrooms, lot_size, last_sale_price, last_sale_date)
        VALUES 
          ('123 Main St', 'San Francisco', 'CA', '94105', 'Single Family', 1985, 2100, 3, 2, 5000, 950000, '2022-03-15'),
          ('456 Oak Ave', 'San Francisco', 'CA', '94122', 'Condo', 2005, 1200, 2, 2, 0, 750000, '2021-10-05'),
          ('789 Pine Rd', 'San Francisco', 'CA', '94110', 'Multi-Family', 1940, 3200, 5, 3, 3500, 1650000, '2022-05-20')
      `);
      console.log('Demo properties created');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TerraFusionProfessional API is running' });
});

// User routes
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, first_name, last_name, role, license_number, company, created_at FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const result = await pool.query(
      'SELECT id, username, email, first_name, last_name, role, license_number, company, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Property routes
app.get('/api/properties', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM properties ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const result = await pool.query('SELECT * FROM properties WHERE id = $1', [propertyId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const { 
      address, city, state, zip_code, property_type, year_built,
      square_feet, bedrooms, bathrooms, lot_size, description,
      last_sale_price, last_sale_date, created_by
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO properties 
       (address, city, state, zip_code, property_type, year_built, 
        square_feet, bedrooms, bathrooms, lot_size, description,
        last_sale_price, last_sale_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [address, city, state, zip_code, property_type, year_built,
       square_feet, bedrooms, bathrooms, lot_size, description,
       last_sale_price, last_sale_date, created_by]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Appraisal routes
app.get('/api/appraisals', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, p.address, p.city, p.state, u.username as appraiser_name
      FROM appraisals a
      JOIN properties p ON a.property_id = p.id
      JOIN users u ON a.appraiser_id = u.id
      ORDER BY a.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching appraisals:', error);
    res.status(500).json({ error: 'Failed to fetch appraisals' });
  }
});

app.get('/api/appraisals/:id', async (req, res) => {
  try {
    const appraisalId = parseInt(req.params.id);
    const result = await pool.query(`
      SELECT a.*, p.address, p.city, p.state, u.username as appraiser_name
      FROM appraisals a
      JOIN properties p ON a.property_id = p.id
      JOIN users u ON a.appraiser_id = u.id
      WHERE a.id = $1
    `, [appraisalId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appraisal not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching appraisal:', error);
    res.status(500).json({ error: 'Failed to fetch appraisal' });
  }
});

app.post('/api/appraisals', async (req, res) => {
  try {
    const { property_id, appraiser_id, status, purpose } = req.body;
    
    const result = await pool.query(
      `INSERT INTO appraisals (property_id, appraiser_id, status, purpose)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [property_id, appraiser_id, status || 'draft', purpose]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating appraisal:', error);
    res.status(500).json({ error: 'Failed to create appraisal' });
  }
});

// Comparable routes
app.get('/api/comparables/appraisal/:appraisalId', async (req, res) => {
  try {
    const appraisalId = parseInt(req.params.appraisalId);
    const result = await pool.query(
      'SELECT * FROM comparables WHERE appraisal_id = $1 ORDER BY id ASC',
      [appraisalId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comparables:', error);
    res.status(500).json({ error: 'Failed to fetch comparables' });
  }
});

app.post('/api/comparables', async (req, res) => {
  try {
    const { 
      appraisal_id, address, sale_price, sale_date, square_feet,
      bedrooms, bathrooms, year_built, adjustments, adjusted_price
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO comparables 
       (appraisal_id, address, sale_price, sale_date, square_feet,
        bedrooms, bathrooms, year_built, adjustments, adjusted_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [appraisal_id, address, sale_price, sale_date, square_feet,
       bedrooms, bathrooms, year_built, 
       adjustments ? JSON.stringify(adjustments) : null, 
       adjusted_price]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating comparable:', error);
    res.status(500).json({ error: 'Failed to create comparable' });
  }
});

// Mock Market Analysis Data (since this would typically come from an external API)
app.get('/api/market-analysis', (req, res) => {
  const marketData = {
    pricePerSqftTrend: [
      { month: "Jan", value: 450 },
      { month: "Feb", value: 452 },
      { month: "Mar", value: 458 },
      { month: "Apr", value: 465 },
      { month: "May", value: 472 },
      { month: "Jun", value: 480 }
    ],
    salesVolume: [
      { month: "Jan", sales: 120 },
      { month: "Feb", sales: 105 },
      { month: "Mar", sales: 130 },
      { month: "Apr", sales: 142 },
      { month: "May", sales: 155 },
      { month: "Jun", sales: 162 }
    ],
    daysOnMarket: [
      { month: "Jan", days: 32 },
      { month: "Feb", days: 30 },
      { month: "Mar", days: 28 },
      { month: "Apr", days: 25 },
      { month: "May", days: 22 },
      { month: "Jun", days: 20 }
    ],
    medianPrices: {
      currentYear: 950000,
      previousYear: 880000,
      percentChange: 7.95
    }
  };
  
  res.json(marketData);
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TerraFusionProfessional server is running on port ${PORT}`);
});

module.exports = app;