import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use PG Client instead of Pool for more reliable connections
const client = new Client({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } 
});

// Connect the client
client.connect();

// Export the drizzle instance
export const db = drizzle(client, { schema });

export async function initDatabase(): Promise<boolean> {
  try {
    // Test database connection with a simple query
    await client.query('SELECT 1');
    console.log('Database connection successful');
    
    console.log('Database connected successfully at:', new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}