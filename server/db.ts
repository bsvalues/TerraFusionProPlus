import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a Neon client
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export async function initDatabase(): Promise<boolean> {
  try {
    // Test database connection by executing a simple query
    await db.execute(sql`SELECT 1`);
    console.log('Database connection successful');
    
    console.log('Database connected successfully at:', new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}