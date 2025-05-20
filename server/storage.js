// Import database pool and utilities
const { Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { eq } = require('drizzle-orm');
const ws = require('ws');

// Configure Neon database
const setupDatabase = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
  }
  
  // Configure Neon for WebSocket
  const { neonConfig } = require('@neondatabase/serverless');
  neonConfig.webSocketConstructor = ws;
  
  // Create connection
  return new Pool({ connectionString: process.env.DATABASE_URL });
};

// Create pool and Drizzle instance
const pool = setupDatabase();
const db = drizzle(pool);

// Define database tables
const tables = {
  users: { id: 'id', username: 'username' },
  properties: { id: 'id', createdBy: 'created_by' },
  appraisals: { id: 'id', propertyId: 'property_id', appraiserId: 'appraiser_id' },
  comparables: { id: 'id', appraisalId: 'appraisal_id' }
};

// Database Storage class
class DatabaseStorage {
  // User operations
  async getUser(id) {
    try {
      const result = await db.execute(`
        SELECT * FROM users WHERE id = $1
      `, [id]);
      
      return result.rows.length > 0 ? result.rows[0] : undefined;
    } catch (error) {
      console.error('Error in getUser:', error);
      throw error;
    }
  }
  
  async getUserByUsername(username) {
    try {
      const result = await db.execute(`
        SELECT * FROM users WHERE username = $1
      `, [username]);
      
      return result.rows.length > 0 ? result.rows[0] : undefined;
    } catch (error) {
      console.error('Error in getUserByUsername:', error);
      throw error;
    }
  }
  
  async createUser(userData) {
    try {
      const { username, firstName, lastName, email, password, role = 'appraiser' } = userData;
      
      const result = await db.execute(`
        INSERT INTO users (username, first_name, last_name, email, password, role)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [username, firstName, lastName, email, password, role]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }
  
  // Property operations
  async getProperty(id) {
    try {
      const result = await db.execute(`
        SELECT * FROM properties WHERE id = $1
      `, [id]);
      
      return result.rows.length > 0 ? result.rows[0] : undefined;
    } catch (error) {
      console.error('Error in getProperty:', error);
      throw error;
    }
  }
  
  async getProperties() {
    try {
      const result = await db.execute(`
        SELECT * FROM properties
      `);
      
      return result.rows;
    } catch (error) {
      console.error('Error in getProperties:', error);
      throw error;
    }
  }
  
  async createProperty(propertyData) {
    try {
      const {
        address, city, state, zip_code, property_type, 
        year_built, square_feet, bedrooms, bathrooms, lot_size, 
        description, parcel_number, zoning, features, created_by
      } = propertyData;
      
      const result = await db.execute(`
        INSERT INTO properties (
          address, city, state, zip_code, property_type, 
          year_built, square_feet, bedrooms, bathrooms, lot_size, 
          description, parcel_number, zoning, features, created_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        )
        RETURNING *
      `, [
        address, city, state, zip_code, property_type, 
        year_built, square_feet, bedrooms, bathrooms, lot_size, 
        description, parcel_number, zoning, features ? JSON.stringify(features) : null, created_by
      ]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in createProperty:', error);
      throw error;
    }
  }
  
  // Appraisal operations
  async getAppraisal(id) {
    try {
      const result = await db.execute(`
        SELECT * FROM appraisals WHERE id = $1
      `, [id]);
      
      return result.rows.length > 0 ? result.rows[0] : undefined;
    } catch (error) {
      console.error('Error in getAppraisal:', error);
      throw error;
    }
  }
  
  async getAppraisalsByProperty(propertyId) {
    try {
      const result = await db.execute(`
        SELECT * FROM appraisals WHERE property_id = $1
      `, [propertyId]);
      
      return result.rows;
    } catch (error) {
      console.error('Error in getAppraisalsByProperty:', error);
      throw error;
    }
  }
  
  async getAppraisalsByAppraiser(appraiserId) {
    try {
      const result = await db.execute(`
        SELECT * FROM appraisals WHERE appraiser_id = $1
      `, [appraiserId]);
      
      return result.rows;
    } catch (error) {
      console.error('Error in getAppraisalsByAppraiser:', error);
      throw error;
    }
  }
  
  async createAppraisal(appraisalData) {
    try {
      const {
        propertyId, appraiserId, status, purpose, marketValue,
        inspectionDate, effectiveDate, reportType, clientName,
        clientEmail, clientPhone, lenderName, loanNumber,
        intendedUse, valuationMethod, scopeOfWork, notes
      } = appraisalData;
      
      const result = await db.execute(`
        INSERT INTO appraisals (
          property_id, appraiser_id, status, purpose, market_value,
          inspection_date, effective_date, report_type, client_name,
          client_email, client_phone, lender_name, loan_number,
          intended_use, valuation_method, scope_of_work, notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
        )
        RETURNING *
      `, [
        propertyId, appraiserId, status, purpose, marketValue,
        inspectionDate, effectiveDate, reportType, clientName,
        clientEmail, clientPhone, lenderName, loanNumber,
        intendedUse, valuationMethod, scopeOfWork, notes
      ]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in createAppraisal:', error);
      throw error;
    }
  }
  
  // Comparable operations
  async getComparable(id) {
    try {
      const result = await db.execute(`
        SELECT * FROM comparables WHERE id = $1
      `, [id]);
      
      return result.rows.length > 0 ? result.rows[0] : undefined;
    } catch (error) {
      console.error('Error in getComparable:', error);
      throw error;
    }
  }
  
  async getComparablesByAppraisal(appraisalId) {
    try {
      const result = await db.execute(`
        SELECT * FROM comparables WHERE appraisal_id = $1
      `, [appraisalId]);
      
      return result.rows;
    } catch (error) {
      console.error('Error in getComparablesByAppraisal:', error);
      throw error;
    }
  }
  
  async createComparable(comparableData) {
    try {
      const {
        appraisalId, address, city, state, zipCode,
        salePrice, saleDate, squareFeet, bedrooms, bathrooms,
        yearBuilt, propertyType, lotSize, condition,
        daysOnMarket, source, adjustedPrice, adjustmentNotes
      } = comparableData;
      
      const result = await db.execute(`
        INSERT INTO comparables (
          appraisal_id, address, city, state, zip_code,
          sale_price, sale_date, square_feet, bedrooms, bathrooms,
          year_built, property_type, lot_size, condition,
          days_on_market, source, adjusted_price, adjustment_notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        )
        RETURNING *
      `, [
        appraisalId, address, city, state, zipCode,
        salePrice, saleDate, squareFeet, bedrooms, bathrooms,
        yearBuilt, propertyType, lotSize, condition,
        daysOnMarket, source, adjustedPrice, adjustmentNotes
      ]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error in createComparable:', error);
      throw error;
    }
  }
}

// Export the storage instance
const storage = new DatabaseStorage();
module.exports = { storage };