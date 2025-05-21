import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a Drizzle instance with the schema
export const db = drizzle(pool, { schema });

// Function to initialize the database with initial schema
export async function initDatabase() {
  try {
    console.log('Initializing database connection...');
    
    // Test the connection
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0].now);
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

export default db;