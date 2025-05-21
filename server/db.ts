import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export async function initDatabase(): Promise<boolean> {
  try {
    // Test database connection
    const client = await pool.connect();
    console.log('Database connection successful');
    
    // Release the client
    client.release();
    
    console.log('Database connected successfully at:', new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}