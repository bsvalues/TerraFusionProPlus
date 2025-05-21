import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the database URL from the environment variable
const connectionString = process.env.DATABASE_URL || '';

// Create a PostgreSQL connection
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10
});

// Create a drizzle database instance with our schema
export const db = drizzle(client, { schema });

// Initialize the database
export async function initDatabase() {
  try {
    // Test connection
    console.log('Testing database connection...');
    await db.select().from(schema.properties).limit(1);
    console.log('Database connection successful!');
    
    // If you want to check if tables exist and are properly set up
    console.log('Checking database tables...');
    const propertyCount = await db.select().from(schema.properties);
    console.log(`Found ${propertyCount.length} properties in the database.`);
    
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}