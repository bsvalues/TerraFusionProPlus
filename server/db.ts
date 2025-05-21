import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from '../shared/schema';

// Use environment variable for database connection
const DATABASE_URL = process.env.DATABASE_URL || '';

// Configure Neon to work in serverless environment
neonConfig.fetchConnectionCache = true;

// Create a Neon client
const sql = neon(DATABASE_URL);

// Create a Drizzle ORM instance with the schema
export const db = drizzle(sql, { schema });

// Initialize database by establishing a connection
export async function initDatabase() {
  try {
    // Test the connection
    const result = await sql`SELECT NOW()`;
    console.log('Database connection successful');
    console.log('Database connected successfully at:', new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}