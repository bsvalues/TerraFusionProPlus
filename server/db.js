const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const schema = require('../shared/schema');

// Set up PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Drizzle instance with schema
const db = drizzle(pool, { schema });

async function initDatabase() {
  try {
    console.log('Initializing database connection...');
    
    // Test database connection
    const client = await pool.connect();
    console.log('Database connection successful');
    client.release();
    
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

module.exports = {
  db,
  pool,
  initDatabase
};