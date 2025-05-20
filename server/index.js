require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const routes = require('./routes.js');  // Import routes

const app = express();
const PORT = process.env.PORT || 3000;

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

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Use API routes
app.use('/api', routes);

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully. Server time:', res.rows[0].now);
    
    // Initialize the database if needed
    createInitialTables();
  }
});

// Create initial tables
async function createInitialTables() {
  try {
    console.log('Creating database tables if they do not exist...');
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'appraiser',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create properties table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(50) NOT NULL,
        zip_code VARCHAR(20) NOT NULL,
        property_type VARCHAR(50) NOT NULL,
        year_built INTEGER NOT NULL,
        square_feet INTEGER NOT NULL,
        bedrooms DECIMAL(3,1) NOT NULL,
        bathrooms DECIMAL(3,1) NOT NULL,
        lot_size INTEGER NOT NULL,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        parcel_number VARCHAR(50),
        zoning VARCHAR(50),
        lot_unit VARCHAR(20),
        latitude DECIMAL(10,6),
        longitude DECIMAL(10,6),
        features JSONB
      )
    `);
    
    // Create appraisals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appraisals (
        id SERIAL PRIMARY KEY,
        property_id INTEGER NOT NULL REFERENCES properties(id),
        appraiser_id INTEGER NOT NULL REFERENCES users(id),
        status VARCHAR(50) NOT NULL DEFAULT 'Draft',
        purpose VARCHAR(100) NOT NULL,
        market_value INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMP,
        inspection_date TIMESTAMP,
        effective_date TIMESTAMP,
        report_type VARCHAR(50),
        client_name VARCHAR(100),
        client_email VARCHAR(100),
        client_phone VARCHAR(50),
        lender_name VARCHAR(100),
        loan_number VARCHAR(50),
        intended_use VARCHAR(255),
        valuation_method VARCHAR(50),
        scope_of_work TEXT,
        notes TEXT
      )
    `);
    
    // Create comparables table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comparables (
        id SERIAL PRIMARY KEY,
        appraisal_id INTEGER NOT NULL REFERENCES appraisals(id),
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(50) NOT NULL,
        zip_code VARCHAR(20) NOT NULL,
        sale_price INTEGER NOT NULL,
        sale_date TIMESTAMP NOT NULL,
        square_feet INTEGER NOT NULL,
        bedrooms DECIMAL(3,1),
        bathrooms DECIMAL(3,1),
        year_built INTEGER,
        property_type VARCHAR(50) NOT NULL,
        lot_size INTEGER,
        condition VARCHAR(50),
        days_on_market INTEGER,
        source VARCHAR(100),
        adjusted_price INTEGER,
        adjustment_notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create adjustments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS adjustments (
        id SERIAL PRIMARY KEY,
        comparable_id INTEGER NOT NULL REFERENCES comparables(id),
        category VARCHAR(50) NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount INTEGER NOT NULL,
        is_percentage BOOLEAN NOT NULL DEFAULT FALSE,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create attachments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attachments (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id),
        appraisal_id INTEGER REFERENCES appraisals(id),
        file_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_size INTEGER NOT NULL,
        file_url VARCHAR(255) NOT NULL,
        uploaded_by INTEGER NOT NULL REFERENCES users(id),
        category VARCHAR(50),
        description TEXT,
        upload_date TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create market data table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS market_data (
        id SERIAL PRIMARY KEY,
        location VARCHAR(100) NOT NULL,
        data_type VARCHAR(50) NOT NULL,
        time VARCHAR(50) NOT NULL,
        value DECIMAL(12,2) NOT NULL,
        comparison_value DECIMAL(12,2),
        percent_change DECIMAL(6,2),
        source VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Insert demo user if no users exist
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(usersResult.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO users (username, first_name, last_name, email, password, role)
        VALUES ('johndoe', 'John', 'Doe', 'john@example.com', 'password123', 'appraiser')
      `);
      console.log('Demo user created');
    }
    
    // Insert sample property if no properties exist
    const propertiesResult = await pool.query('SELECT COUNT(*) FROM properties');
    if (parseInt(propertiesResult.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO properties (address, city, state, zip_code, property_type, year_built, square_feet, bedrooms, bathrooms, lot_size, description, features)
        VALUES (
          '123 Main Street', 'Austin', 'TX', '78701', 'Single Family', 2005, 2450, 3, 2.5, 8500, 
          'Beautiful family home in a desirable neighborhood',
          '{"pool": true, "garage": "2-Car Attached", "fireplace": true, "stories": 2}'
        )
      `);
      console.log('Sample property created');
      
      // Get the inserted property ID
      const propertyResult = await pool.query('SELECT id FROM properties LIMIT 1');
      const propertyId = propertyResult.rows[0].id;
      
      // Get the demo user ID
      const userResult = await pool.query('SELECT id FROM users LIMIT 1');
      const userId = userResult.rows[0].id;
      
      // Insert sample appraisal
      await pool.query(`
        INSERT INTO appraisals (property_id, appraiser_id, status, purpose, market_value, inspection_date, effective_date, client_name)
        VALUES ($1, $2, 'Completed', 'Refinance', 975000, NOW(), NOW(), 'First National Bank')
      `, [propertyId, userId]);
      console.log('Sample appraisal created');
    }
    
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
  }
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).send('API endpoint not found');
  }
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TerraFusionProfessional server is running on port ${PORT}`);
});