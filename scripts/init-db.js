const { Pool } = require('pg');
require('dotenv').config();

async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable not set');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Connect to database
    console.log('Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');

    // Create tables
    console.log('Creating tables...');
    await createTables(pool);
    console.log('Tables created successfully');

    // Insert sample data
    console.log('Inserting sample data...');
    await insertSampleData(pool);
    console.log('Sample data inserted successfully');

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

async function createTables(pool) {
  // Drop existing tables if they exist (for clean initialization)
  await pool.query(`
    DROP TABLE IF EXISTS adjustments CASCADE;
    DROP TABLE IF EXISTS comparables CASCADE;
    DROP TABLE IF EXISTS attachments CASCADE;
    DROP TABLE IF EXISTS appraisals CASCADE;
    DROP TABLE IF EXISTS market_data CASCADE;
    DROP TABLE IF EXISTS properties CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
  `);

  // Create Users table
  await pool.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(100) NOT NULL,
      role VARCHAR(20) NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Properties table
  await pool.query(`
    CREATE TABLE properties (
      id SERIAL PRIMARY KEY,
      address VARCHAR(255) NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(50) NOT NULL,
      zip_code VARCHAR(20) NOT NULL,
      property_type VARCHAR(50) NOT NULL,
      year_built INTEGER,
      square_feet DECIMAL NOT NULL,
      bedrooms INTEGER NOT NULL,
      bathrooms DECIMAL NOT NULL,
      lot_size DECIMAL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      parcel_number VARCHAR(50),
      zoning VARCHAR(50),
      latitude DECIMAL,
      longitude DECIMAL,
      features JSONB,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Create Appraisals table
  await pool.query(`
    CREATE TABLE appraisals (
      id SERIAL PRIMARY KEY,
      property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      appraiser_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(20) NOT NULL,
      purpose VARCHAR(100) NOT NULL,
      market_value DECIMAL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP,
      inspection_date DATE,
      effective_date DATE,
      report_type VARCHAR(50),
      client_name VARCHAR(100),
      client_email VARCHAR(100),
      client_phone VARCHAR(20),
      lender_name VARCHAR(100),
      loan_number VARCHAR(50),
      intended_use TEXT,
      valuation_method VARCHAR(50),
      scope_of_work TEXT,
      notes TEXT
    )
  `);

  // Create Comparables table
  await pool.query(`
    CREATE TABLE comparables (
      id SERIAL PRIMARY KEY,
      appraisal_id INTEGER NOT NULL REFERENCES appraisals(id) ON DELETE CASCADE,
      address VARCHAR(255) NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(50) NOT NULL,
      zip_code VARCHAR(20) NOT NULL,
      sale_price DECIMAL NOT NULL,
      sale_date DATE NOT NULL,
      square_feet DECIMAL NOT NULL,
      bedrooms INTEGER,
      bathrooms DECIMAL,
      year_built INTEGER,
      property_type VARCHAR(50) NOT NULL,
      lot_size DECIMAL,
      condition VARCHAR(50),
      days_on_market INTEGER,
      source VARCHAR(100),
      adjusted_price DECIMAL,
      adjustment_notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Adjustments table
  await pool.query(`
    CREATE TABLE adjustments (
      id SERIAL PRIMARY KEY,
      comparable_id INTEGER NOT NULL REFERENCES comparables(id) ON DELETE CASCADE,
      category VARCHAR(50) NOT NULL,
      description VARCHAR(255) NOT NULL,
      amount DECIMAL NOT NULL,
      is_percentage BOOLEAN DEFAULT FALSE,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Attachments table
  await pool.query(`
    CREATE TABLE attachments (
      id SERIAL PRIMARY KEY,
      property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
      appraisal_id INTEGER REFERENCES appraisals(id) ON DELETE CASCADE,
      file_name VARCHAR(255) NOT NULL,
      file_type VARCHAR(50) NOT NULL,
      file_size INTEGER NOT NULL,
      file_url VARCHAR(255) NOT NULL,
      uploaded_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      category VARCHAR(50),
      description TEXT,
      upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CHECK (property_id IS NOT NULL OR appraisal_id IS NOT NULL)
    )
  `);

  // Create Market Data table
  await pool.query(`
    CREATE TABLE market_data (
      id SERIAL PRIMARY KEY,
      location VARCHAR(100) NOT NULL,
      data_type VARCHAR(50) NOT NULL,
      time VARCHAR(50) NOT NULL,
      value DECIMAL NOT NULL,
      comparison_value DECIMAL,
      percent_change DECIMAL,
      source VARCHAR(100),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function insertSampleData(pool) {
  // Insert sample users
  const usersResult = await pool.query(`
    INSERT INTO users (username, first_name, last_name, email, password_hash, role) 
    VALUES 
      ('jsmith', 'John', 'Smith', 'jsmith@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'appraiser'),
      ('mjohnson', 'Mary', 'Johnson', 'mjohnson@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'appraiser'),
      ('rwilliams', 'Robert', 'Williams', 'rwilliams@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'admin'),
      ('lbrown', 'Linda', 'Brown', 'lbrown@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', 'user')
    RETURNING id
  `);
  
  const userIds = usersResult.rows.map(row => row.id);
  
  // Insert sample properties
  const propertiesResult = await pool.query(`
    INSERT INTO properties (
      address, city, state, zip_code, property_type, year_built, 
      square_feet, bedrooms, bathrooms, lot_size, description,
      parcel_number, zoning, created_by
    ) 
    VALUES 
      ('123 Main St', 'San Francisco', 'CA', '94105', 'Single Family', 1985, 
       2100, 3, 2.5, 5000, 'Beautiful single family home in prime location',
       'APN-12345-678', 'R-1', $1),
      ('456 Oak Ave', 'San Francisco', 'CA', '94109', 'Condo', 2005, 
       1200, 2, 2, NULL, 'Modern condo with city views',
       'APN-23456-789', 'R-3', $1),
      ('789 Pine Rd', 'Oakland', 'CA', '94612', 'Multi-Family', 1972, 
       3200, 4, 3, 7500, 'Duplex with great rental history',
       'APN-34567-890', 'R-2', $2),
      ('101 Market St', 'San Francisco', 'CA', '94103', 'Commercial', 1998, 
       5000, 0, 2, 2500, 'Commercial property in busy district',
       'APN-45678-901', 'C-1', $2),
      ('202 Mission Blvd', 'San Jose', 'CA', '95110', 'Single Family', 2015, 
       2800, 4, 3, 8000, 'Modern single family home with smart features',
       'APN-56789-012', 'R-1', $1)
    RETURNING id
  `, [userIds[0], userIds[1]]);
  
  const propertyIds = propertiesResult.rows.map(row => row.id);
  
  // Insert sample appraisals
  const appraisalsResult = await pool.query(`
    INSERT INTO appraisals (
      property_id, appraiser_id, status, purpose, market_value,
      inspection_date, effective_date, report_type, client_name,
      client_email, client_phone, lender_name, loan_number,
      intended_use, valuation_method, scope_of_work
    ) 
    VALUES 
      ($1, $6, 'Completed', 'Purchase', 950000, 
       '2023-01-15', '2023-01-20', 'URAR', 'James Wilson',
       'jwilson@example.com', '555-123-4567', 'First National Bank', 'LN-12345',
       'Mortgage financing', 'Sales Comparison', 'Interior and exterior inspection'),
      ($2, $6, 'In Progress', 'Refinance', NULL, 
       '2023-02-10', '2023-02-15', 'URAR', 'Sarah Miller',
       'smiller@example.com', '555-234-5678', 'First National Bank', 'LN-23456',
       'Refinance', 'Sales Comparison', 'Interior and exterior inspection'),
      ($3, $7, 'Draft', 'Purchase', NULL, 
       NULL, NULL, 'URAR', 'Michael Davis',
       'mdavis@example.com', '555-345-6789', 'Heritage Credit Union', 'LN-34567',
       'Mortgage financing', 'Income Approach', 'Exterior inspection only'),
      ($4, $7, 'Completed', 'Tax Assessment', 1650000, 
       '2023-01-05', '2023-01-05', 'Commercial', 'TechStart Inc',
       'info@techstart.com', '555-456-7890', NULL, NULL,
       'Tax appeal', 'Income Approach', 'Complete commercial inspection'),
      ($5, $6, 'Pending Review', 'Purchase', 1250000, 
       '2023-03-01', '2023-03-05', 'URAR', 'Jennifer Thompson',
       'jthompson@example.com', '555-567-8901', 'Pacific Mortgage', 'LN-45678',
       'Mortgage financing', 'Sales Comparison', 'Interior and exterior inspection')
    RETURNING id
  `, [propertyIds[0], propertyIds[1], propertyIds[2], propertyIds[3], propertyIds[4], userIds[0], userIds[1]]);
  
  const appraisalIds = appraisalsResult.rows.map(row => row.id);
  
  // Insert sample comparables for the first appraisal
  const comparablesResult = await pool.query(`
    INSERT INTO comparables (
      appraisal_id, address, city, state, zip_code, 
      sale_price, sale_date, square_feet, bedrooms, bathrooms, 
      year_built, property_type, lot_size, condition, 
      days_on_market, source, adjusted_price
    ) 
    VALUES 
      ($1, '125 Main St', 'San Francisco', 'CA', '94105', 
       925000, '2022-12-10', 2050, 3, 2.5, 
       1982, 'Single Family', 4800, 'Good', 
       45, 'MLS', 935000),
      ($1, '130 Main St', 'San Francisco', 'CA', '94105', 
       975000, '2022-11-15', 2200, 3, 2.5, 
       1990, 'Single Family', 5200, 'Excellent', 
       30, 'MLS', 955000),
      ($1, '140 Main St', 'San Francisco', 'CA', '94105', 
       900000, '2023-01-05', 1950, 3, 2, 
       1980, 'Single Family', 4900, 'Good', 
       60, 'MLS', 915000),
      ($2, '460 Oak Ave', 'San Francisco', 'CA', '94109', 
       750000, '2022-12-20', 1250, 2, 2, 
       2003, 'Condo', NULL, 'Good', 
       40, 'MLS', 740000)
    RETURNING id
  `, [appraisalIds[0], appraisalIds[1]]);
  
  const comparableIds = comparablesResult.rows.map(row => row.id);
  
  // Insert sample adjustments
  await pool.query(`
    INSERT INTO adjustments (
      comparable_id, category, description, amount, is_percentage, notes
    ) 
    VALUES 
      ($1, 'Size', 'Square Footage', 10000, false, 'Adjustment for smaller size'),
      ($1, 'Age', 'Year Built', 5000, false, 'Adjustment for older construction'),
      ($1, 'Condition', 'Interior Condition', -5000, false, 'Better condition than subject'),
      ($2, 'Size', 'Square Footage', -20000, false, 'Adjustment for larger size'),
      ($2, 'Age', 'Year Built', -10000, false, 'Adjustment for newer construction'),
      ($2, 'Lot Size', 'Lot Size', 10000, false, 'Adjustment for larger lot'),
      ($3, 'Size', 'Square Footage', 15000, false, 'Adjustment for smaller size'),
      ($3, 'Bathrooms', 'Half Bath', 10000, false, 'Adjustment for fewer bathrooms'),
      ($3, 'Location', 'Location Quality', -10000, false, 'Better location than subject')
  `, [comparableIds[0], comparableIds[1], comparableIds[2]]);
  
  // Insert sample market data
  await pool.query(`
    INSERT INTO market_data (
      location, data_type, time, value, 
      comparison_value, percent_change, source
    ) 
    VALUES 
      ('San Francisco', 'Median Price', '2023-Q1', 975000, 950000, 2.63, 'MLS'),
      ('San Francisco', 'Median Price', '2022-Q4', 950000, 940000, 1.06, 'MLS'),
      ('San Francisco', 'Median Price', '2022-Q3', 940000, 925000, 1.62, 'MLS'),
      ('San Francisco', 'Median Price', '2022-Q2', 925000, 900000, 2.78, 'MLS'),
      ('San Francisco', 'Median Price', '2022-Q1', 900000, 890000, 1.12, 'MLS'),
      ('San Francisco', 'Days on Market', '2023-Q1', 45, 50, -10.00, 'MLS'),
      ('San Francisco', 'Days on Market', '2022-Q4', 50, 42, 19.05, 'MLS'),
      ('San Francisco', 'Days on Market', '2022-Q3', 42, 38, 10.53, 'MLS'),
      ('San Francisco', 'Days on Market', '2022-Q2', 38, 35, 8.57, 'MLS'),
      ('San Francisco', 'Days on Market', '2022-Q1', 35, 40, -12.50, 'MLS'),
      ('San Francisco', 'Sales Volume', '2023-Q1', 450, 520, -13.46, 'MLS'),
      ('San Francisco', 'Sales Volume', '2022-Q4', 520, 480, 8.33, 'MLS'),
      ('San Francisco', 'Sales Volume', '2022-Q3', 480, 510, -5.88, 'MLS'),
      ('San Francisco', 'Sales Volume', '2022-Q2', 510, 475, 7.37, 'MLS'),
      ('San Francisco', 'Sales Volume', '2022-Q1', 475, 460, 3.26, 'MLS'),
      ('Oakland', 'Median Price', '2023-Q1', 850000, 825000, 3.03, 'MLS'),
      ('Oakland', 'Median Price', '2022-Q4', 825000, 810000, 1.85, 'MLS'),
      ('Oakland', 'Median Price', '2022-Q3', 810000, 790000, 2.53, 'MLS'),
      ('San Jose', 'Median Price', '2023-Q1', 1050000, 1020000, 2.94, 'MLS'),
      ('San Jose', 'Median Price', '2022-Q4', 1020000, 995000, 2.51, 'MLS')
  `);
}

// Run the initialization if executed directly
if (require.main === module) {
  initializeDatabase().catch(console.error);
}

module.exports = { initializeDatabase };