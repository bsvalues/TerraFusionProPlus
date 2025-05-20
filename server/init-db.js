const { Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { sql } = require('drizzle-orm');
const ws = require('ws');

// Setup database connection
const setupDatabase = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
  }
  
  // Configure Neon for WebSocket
  const { neonConfig } = require('@neondatabase/serverless');
  neonConfig.webSocketConstructor = ws;
  
  // Create connection
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return pool;
};

// Initialize the database
async function initializeDatabase() {
  console.log('Initializing database...');
  
  try {
    // Create pool and Drizzle instance
    const pool = setupDatabase();
    const db = drizzle(pool);
    
    // Create tables
    await createTables(db);
    
    // Insert sample data if needed
    await insertSampleData(db);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

async function createTables(db) {
  try {
    console.log('Creating tables...');
    
    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'appraiser',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    // Create properties table
    await db.execute(sql`
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
        features JSONB,
        created_by INTEGER REFERENCES users(id)
      );
    `);
    
    // Create appraisals table
    await db.execute(sql`
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
      );
    `);
    
    // Create comparables table
    await db.execute(sql`
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
      );
    `);
    
    // Create adjustments table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS adjustments (
        id SERIAL PRIMARY KEY,
        comparable_id INTEGER NOT NULL REFERENCES comparables(id),
        category VARCHAR(50) NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount INTEGER NOT NULL,
        is_percentage BOOLEAN NOT NULL DEFAULT FALSE,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    // Create attachments table
    await db.execute(sql`
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
      );
    `);
    
    // Create market_data table
    await db.execute(sql`
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
      );
    `);
    
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function insertSampleData(db) {
  try {
    // Check if we already have users
    const result = await db.execute(sql`SELECT COUNT(*) FROM users`);
    const userCount = parseInt(result.rows[0].count);
    
    if (userCount > 0) {
      console.log('Sample data already exists, skipping');
      return;
    }
    
    console.log('Inserting sample data...');
    
    // Insert sample users
    const adminResult = await db.execute(sql`
      INSERT INTO users (username, first_name, last_name, email, password, role)
      VALUES ('admin', 'Admin', 'User', 'admin@terrafusion.com', '$2b$10$JK4Wt9fE3KnuiB1DFXvxQesNQZKxr2KReLuKVb7TqDQsQvAVLBHyW', 'admin')
      RETURNING id
    `);
    const adminId = adminResult.rows[0].id;
    
    const appraiser1Result = await db.execute(sql`
      INSERT INTO users (username, first_name, last_name, email, password, role)
      VALUES ('appraiser1', 'John', 'Smith', 'john.smith@terrafusion.com', '$2b$10$JK4Wt9fE3KnuiB1DFXvxQesNQZKxr2KReLuKVb7TqDQsQvAVLBHyW', 'appraiser')
      RETURNING id
    `);
    const appraiser1Id = appraiser1Result.rows[0].id;
    
    const appraiser2Result = await db.execute(sql`
      INSERT INTO users (username, first_name, last_name, email, password, role)
      VALUES ('appraiser2', 'Emma', 'Johnson', 'emma.johnson@terrafusion.com', '$2b$10$JK4Wt9fE3KnuiB1DFXvxQesNQZKxr2KReLuKVb7TqDQsQvAVLBHyW', 'appraiser')
      RETURNING id
    `);
    const appraiser2Id = appraiser2Result.rows[0].id;
    
    // Insert sample properties
    const property1Result = await db.execute(sql`
      INSERT INTO properties (address, city, state, zip_code, property_type, year_built, square_feet, bedrooms, bathrooms, lot_size, description, created_by)
      VALUES ('123 Main St', 'Austin', 'TX', '78701', 'Single Family', 2005, 2500, 4, 2.5, 8500, 'Beautiful two-story home in central Austin', ${appraiser1Id})
      RETURNING id
    `);
    const property1Id = property1Result.rows[0].id;
    
    const property2Result = await db.execute(sql`
      INSERT INTO properties (address, city, state, zip_code, property_type, year_built, square_feet, bedrooms, bathrooms, lot_size, description, created_by)
      VALUES ('456 Oak Ave', 'Austin', 'TX', '78704', 'Condo', 2015, 1200, 2, 2, 0, 'Modern condo in South Austin', ${appraiser1Id})
      RETURNING id
    `);
    const property2Id = property2Result.rows[0].id;
    
    const property3Result = await db.execute(sql`
      INSERT INTO properties (address, city, state, zip_code, property_type, year_built, square_feet, bedrooms, bathrooms, lot_size, description, created_by)
      VALUES ('789 Pine Rd', 'Round Rock', 'TX', '78664', 'Single Family', 2000, 2200, 3, 2, 7500, 'Ranch-style home with large backyard', ${appraiser2Id})
      RETURNING id
    `);
    
    // Insert sample appraisals
    const appraisal1Result = await db.execute(sql`
      INSERT INTO appraisals (property_id, appraiser_id, status, purpose, market_value, client_name, client_email, client_phone, lender_name, loan_number, valuation_method)
      VALUES (${property1Id}, ${appraiser1Id}, 'In Progress', 'Refinance', 450000, 'Wells Fargo', 'loans@wellsfargo.com', '555-123-4567', 'Wells Fargo', 'WF123456789', 'Sales Comparison')
      RETURNING id
    `);
    const appraisal1Id = appraisal1Result.rows[0].id;
    
    const appraisal2Result = await db.execute(sql`
      INSERT INTO appraisals (property_id, appraiser_id, status, purpose, market_value, completed_at, client_name, client_email, client_phone, lender_name, loan_number, valuation_method)
      VALUES (${property2Id}, ${appraiser2Id}, 'Completed', 'Purchase', 320000, NOW(), 'Bank of America', 'loans@bofa.com', '555-987-6543', 'Bank of America', 'BOA987654321', 'Sales Comparison')
      RETURNING id
    `);
    
    // Insert sample comparables
    const comparable1Result = await db.execute(sql`
      INSERT INTO comparables (appraisal_id, address, city, state, zip_code, sale_price, sale_date, square_feet, bedrooms, bathrooms, year_built, property_type, lot_size, condition, source)
      VALUES (${appraisal1Id}, '125 Main St', 'Austin', 'TX', '78701', 445000, '2023-01-15', 2400, 4, 2.5, 2003, 'Single Family', 8000, 'Good', 'MLS')
      RETURNING id
    `);
    const comparable1Id = comparable1Result.rows[0].id;
    
    await db.execute(sql`
      INSERT INTO comparables (appraisal_id, address, city, state, zip_code, sale_price, sale_date, square_feet, bedrooms, bathrooms, year_built, property_type, lot_size, condition, source)
      VALUES (${appraisal1Id}, '127 Main St', 'Austin', 'TX', '78701', 460000, '2023-02-10', 2600, 4, 3, 2007, 'Single Family', 8200, 'Excellent', 'MLS')
    `);
    
    // Insert sample adjustments
    await db.execute(sql`
      INSERT INTO adjustments (comparable_id, category, description, amount, is_percentage, notes)
      VALUES (${comparable1Id}, 'Size', 'Square Footage Adjustment', -5000, false, 'Subject property is 100 sqft larger')
    `);
    
    await db.execute(sql`
      INSERT INTO adjustments (comparable_id, category, description, amount, is_percentage, notes)
      VALUES (${comparable1Id}, 'Condition', 'Condition Adjustment', 2000, false, 'Subject property has newer appliances')
    `);
    
    // Insert sample market data
    await db.execute(sql`
      INSERT INTO market_data (location, data_type, time, value, comparison_value, percent_change, source)
      VALUES ('Austin, TX', 'Median Home Price', '2023-Q1', 450000, 420000, 7.14, 'MLS')
    `);
    
    await db.execute(sql`
      INSERT INTO market_data (location, data_type, time, value, comparison_value, percent_change, source)
      VALUES ('Austin, TX', 'Median Home Price', '2023-Q2', 455000, 450000, 1.11, 'MLS')
    `);
    
    await db.execute(sql`
      INSERT INTO market_data (location, data_type, time, value, comparison_value, percent_change, source)
      VALUES ('Austin, TX', 'Days on Market', '2023-Q1', 28, 21, 33.33, 'MLS')
    `);
    
    await db.execute(sql`
      INSERT INTO market_data (location, data_type, time, value, comparison_value, percent_change, source)
      VALUES ('Austin, TX', 'Days on Market', '2023-Q2', 32, 28, 14.29, 'MLS')
    `);
    
    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
    throw error;
  }
}

module.exports = { initializeDatabase };