require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test database connection
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully! Server time:', result.rows[0].now);
  }
});

// API Routes
// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'TerraFusionProfessional API is running',
    version: '1.0.0'
  });
});

// Get all properties
app.get('/api/properties', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM properties ORDER BY id ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get property by ID
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT * FROM properties WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create property
app.post('/api/properties', async (req, res) => {
  try {
    const { 
      address, city, state, zip_code, property_type, year_built,
      square_feet, bedrooms, bathrooms, lot_size, description,
      parcel_number, zoning, lot_unit, latitude, longitude, features
    } = req.body;
    
    const result = await pool.query(`
      INSERT INTO properties (
        address, city, state, zip_code, property_type, year_built,
        square_feet, bedrooms, bathrooms, lot_size, description,
        parcel_number, zoning, lot_unit, latitude, longitude, features
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      address, city, state, zip_code, property_type, year_built,
      square_feet, bedrooms, bathrooms, lot_size, description,
      parcel_number, zoning, lot_unit, latitude, longitude, features
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Get all appraisals
app.get('/api/appraisals', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, p.address, u.first_name || ' ' || u.last_name as appraiser_name
      FROM appraisals a
      JOIN properties p ON a.property_id = p.id
      JOIN users u ON a.appraiser_id = u.id
      ORDER BY a.id ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching appraisals:', error);
    res.status(500).json({ error: 'Failed to fetch appraisals' });
  }
});

// Get appraisal by ID
app.get('/api/appraisals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT a.*, p.address, u.first_name || ' ' || u.last_name as appraiser_name
      FROM appraisals a
      JOIN properties p ON a.property_id = p.id
      JOIN users u ON a.appraiser_id = u.id
      WHERE a.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appraisal not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching appraisal:', error);
    res.status(500).json({ error: 'Failed to fetch appraisal' });
  }
});

// Create appraisal
app.post('/api/appraisals', async (req, res) => {
  try {
    const {
      property_id, appraiser_id, status, purpose, market_value,
      inspection_date, effective_date, report_type, client_name,
      client_email, client_phone, lender_name, loan_number,
      intended_use, valuation_method, scope_of_work, notes
    } = req.body;
    
    const result = await pool.query(`
      INSERT INTO appraisals (
        property_id, appraiser_id, status, purpose, market_value,
        inspection_date, effective_date, report_type, client_name,
        client_email, client_phone, lender_name, loan_number,
        intended_use, valuation_method, scope_of_work, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      property_id, appraiser_id, status, purpose, market_value,
      inspection_date, effective_date, report_type, client_name,
      client_email, client_phone, lender_name, loan_number,
      intended_use, valuation_method, scope_of_work, notes
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating appraisal:', error);
    res.status(500).json({ error: 'Failed to create appraisal' });
  }
});

// Get comparables for an appraisal
app.get('/api/appraisals/:id/comparables', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT * FROM comparables
      WHERE appraisal_id = $1
      ORDER BY id ASC
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comparables:', error);
    res.status(500).json({ error: 'Failed to fetch comparables' });
  }
});

// Create comparable
app.post('/api/comparables', async (req, res) => {
  try {
    const {
      appraisal_id, address, city, state, zip_code, sale_price,
      sale_date, square_feet, bedrooms, bathrooms, year_built,
      property_type, lot_size, condition, days_on_market,
      source, adjusted_price, adjustment_notes
    } = req.body;
    
    const result = await pool.query(`
      INSERT INTO comparables (
        appraisal_id, address, city, state, zip_code, sale_price,
        sale_date, square_feet, bedrooms, bathrooms, year_built,
        property_type, lot_size, condition, days_on_market,
        source, adjusted_price, adjustment_notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `, [
      appraisal_id, address, city, state, zip_code, sale_price,
      sale_date, square_feet, bedrooms, bathrooms, year_built,
      property_type, lot_size, condition, days_on_market,
      source, adjusted_price, adjustment_notes
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating comparable:', error);
    res.status(500).json({ error: 'Failed to create comparable' });
  }
});

// Market analysis data (mock data for now)
app.get('/api/market-analysis', (req, res) => {
  const data = {
    pricePerSqftTrend: [
      { month: "Jan", value: 450, year: 2024 },
      { month: "Feb", value: 452, year: 2024 },
      { month: "Mar", value: 458, year: 2024 },
      { month: "Apr", value: 465, year: 2024 },
      { month: "May", value: 472, year: 2024 },
      { month: "Jun", value: 480, year: 2024 }
    ],
    salesVolume: [
      { month: "Jan", sales: 120, year: 2024 },
      { month: "Feb", sales: 105, year: 2024 },
      { month: "Mar", sales: 130, year: 2024 },
      { month: "Apr", sales: 142, year: 2024 },
      { month: "May", sales: 155, year: 2024 },
      { month: "Jun", sales: 162, year: 2024 }
    ],
    daysOnMarket: [
      { month: "Jan", days: 32, year: 2024 },
      { month: "Feb", days: 30, year: 2024 },
      { month: "Mar", days: 28, year: 2024 },
      { month: "Apr", days: 25, year: 2024 },
      { month: "May", days: 22, year: 2024 },
      { month: "Jun", days: 20, year: 2024 }
    ],
    propertyTypes: [
      { name: 'Single Family', value: 65 },
      { name: 'Condo', value: 18 },
      { name: 'Multi-Family', value: 10 },
      { name: 'Townhouse', value: 7 }
    ],
    neighborhoodPrices: [
      { name: 'Downtown', medianPrice: 625000, pricePerSqft: 450 },
      { name: 'North End', medianPrice: 875000, pricePerSqft: 520 },
      { name: 'South Side', medianPrice: 425000, pricePerSqft: 320 },
      { name: 'Westview', medianPrice: 750000, pricePerSqft: 480 },
      { name: 'Eastside', medianPrice: 580000, pricePerSqft: 410 }
    ]
  };
  
  res.json(data);
});

// Initialize database tables
async function initializeDatabase() {
  try {
    console.log('Checking and creating database tables if needed...');
    
    // Create users table if not exists
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
    
    // Create properties table if not exists
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
    
    // Create appraisals table if not exists
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
    
    // Create comparables table if not exists
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
    
    // Create adjustments table if not exists
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
    
    // Create attachments table if not exists
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
    
    // Create market_data table if not exists
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
    
    console.log('Database tables created successfully');
    
    // Check if we need to add seed data
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(usersCount.rows[0].count) === 0) {
      console.log('Adding seed data...');
      
      // Add a default user
      const userResult = await pool.query(`
        INSERT INTO users (username, first_name, last_name, email, password, role)
        VALUES ('johndoe', 'John', 'Doe', 'john@example.com', '$2b$10$eLl9.2JTfI9lPbFUWYHSo.aFdaUI3Qb7gfHUv3boC5TQcK81pqv.G', 'appraiser')
        RETURNING id
      `);
      const userId = userResult.rows[0].id;
      console.log(`Created demo user with ID: ${userId}`);
      
      // Add a sample property
      const propertyResult = await pool.query(`
        INSERT INTO properties (
          address, city, state, zip_code, property_type, year_built,
          square_feet, bedrooms, bathrooms, lot_size, description, features
        ) VALUES (
          '123 Main Street', 'Austin', 'TX', '78701', 'Single Family', 2005,
          2450, 3, 2.5, 8500, 'Beautiful family home in a desirable neighborhood',
          '{"pool": true, "garage": "2-Car Attached", "fireplace": true, "stories": 2}'
        ) RETURNING id
      `);
      const propertyId = propertyResult.rows[0].id;
      console.log(`Created sample property with ID: ${propertyId}`);
      
      // Add a sample appraisal
      const appraisalResult = await pool.query(`
        INSERT INTO appraisals (
          property_id, appraiser_id, status, purpose, market_value,
          inspection_date, effective_date, client_name
        ) VALUES (
          $1, $2, 'Completed', 'Refinance', 975000, 
          '2024-05-01', '2024-05-01', 'First National Bank'
        ) RETURNING id
      `, [propertyId, userId]);
      const appraisalId = appraisalResult.rows[0].id;
      console.log(`Created sample appraisal with ID: ${appraisalId}`);
      
      // Add sample comparables
      await pool.query(`
        INSERT INTO comparables (
          appraisal_id, address, city, state, zip_code, sale_price,
          sale_date, square_feet, bedrooms, bathrooms, year_built,
          property_type, lot_size, condition, days_on_market,
          source, adjusted_price
        ) VALUES (
          $1, '456 Oak Street', 'Austin', 'TX', '78701', 950000,
          '2024-01-15', 2300, 3, 2, 2003, 'Single Family', 8000,
          'Good', 35, 'MLS', 950000
        )
      `, [appraisalId]);
      
      await pool.query(`
        INSERT INTO comparables (
          appraisal_id, address, city, state, zip_code, sale_price,
          sale_date, square_feet, bedrooms, bathrooms, year_built,
          property_type, lot_size, condition, days_on_market,
          source, adjusted_price
        ) VALUES (
          $1, '789 Pine Avenue', 'Austin', 'TX', '78701', 1025000,
          '2024-02-10', 2600, 4, 3, 2008, 'Single Family', 9000,
          'Excellent', 21, 'MLS', 975000
        )
      `, [appraisalId]);
      
      console.log('Sample data created successfully');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize database
initializeDatabase();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  if (req.url.startsWith('/api/')) {
    return res.status(404).send('API endpoint not found');
  }
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TerraFusionProfessional server running on port ${PORT}`);
});