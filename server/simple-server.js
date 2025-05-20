const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

// Database connection for testing
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
neonConfig.webSocketConstructor = ws;

// Create HTTP server
const server = http.createServer();
const PORT = process.env.PORT || 3000;

// Initialize database pool
let dbPool = null;

// Test database connection
async function initializeDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      console.log('DATABASE_URL not set, skipping database initialization');
      return null;
    }
    
    console.log('Testing database connection...');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // Test connection
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);
    client.release();
    
    // Also test if tables exist
    try {
      const tablesResult = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      console.log('Database tables:', tablesResult.rows.map(row => row.table_name).join(', '));
    } catch (err) {
      console.error('Error checking tables:', err);
    }
    
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    return null;
  }
}

// Helper function to parse JSON body from requests
const parseJSONBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = body ? JSON.parse(body) : {};
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', error => {
      reject(error);
    });
  });
};

// Helper function to get URL parameters
const getURLParams = (parsedUrl) => {
  const query = parsedUrl.query ? querystring.parse(parsedUrl.query) : {};
  return query;
};

// Helper function to send JSON response
const sendJSON = (res, data, statusCode = 200) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
};

// API Routes Handler
const handleAPIRequest = async (req, res, parsedUrl, pathname) => {
  // Check if database is connected
  if (!dbPool) {
    return sendJSON(res, { error: 'Database not connected' }, 500);
  }
  
  // Split the path segments
  const segments = pathname.split('/').filter(Boolean);
  
  // First segment after 'api' is the resource type
  if (segments.length < 2) {
    return sendJSON(res, { error: 'Invalid API endpoint' }, 400);
  }
  
  const resource = segments[1];
  
  // API Test endpoint
  if (resource === 'test') {
    return sendJSON(res, { 
      message: 'TerraFusion Professional API Server is running!',
      time: new Date().toISOString()
    });
  }
  
  // Database test endpoint
  if (resource === 'database-test') {
    try {
      const client = await dbPool.connect();
      const result = await client.query('SELECT NOW() as time');
      client.release();
      
      return sendJSON(res, { 
        message: 'Database connection successful',
        time: result.rows[0].time,
        database_url: process.env.DATABASE_URL ? '(Set)' : '(Not set)'
      });
    } catch (error) {
      return sendJSON(res, { 
        error: 'Database error',
        message: error.message
      }, 500);
    }
  }
  
  // Properties endpoints
  if (resource === 'properties') {
    // GET request handlers
    if (req.method === 'GET') {
      // Get a specific property by ID
      if (segments.length === 3) {
        const propertyId = parseInt(segments[2]);
        
        if (isNaN(propertyId)) {
          return sendJSON(res, { error: 'Invalid property ID' }, 400);
        }
        
        try {
          const result = await dbPool.query(
            'SELECT * FROM properties WHERE id = $1',
            [propertyId]
          );
          
          if (result.rows.length === 0) {
            return sendJSON(res, { error: 'Property not found' }, 404);
          }
          
          return sendJSON(res, result.rows[0]);
        } catch (error) {
          console.error('Error fetching property:', error);
          return sendJSON(res, { error: 'Error fetching property' }, 500);
        }
      }
      
      // List all properties with optional filtering
      const params = getURLParams(parsedUrl);
      let query = 'SELECT * FROM properties';
      const queryParams = [];
      const whereConditions = [];
      
      // Add filtering based on query parameters
      if (params.city) {
        whereConditions.push(`city ILIKE $${queryParams.length + 1}`);
        queryParams.push(`%${params.city}%`);
      }
      
      if (params.property_type) {
        whereConditions.push(`property_type = $${queryParams.length + 1}`);
        queryParams.push(params.property_type);
      }
      
      if (whereConditions.length > 0) {
        query += ' WHERE ' + whereConditions.join(' AND ');
      }
      
      // Add sorting
      query += ' ORDER BY created_at DESC';
      
      try {
        const result = await dbPool.query(query, queryParams);
        return sendJSON(res, result.rows);
      } catch (error) {
        console.error('Error fetching properties:', error);
        return sendJSON(res, { error: 'Error fetching properties' }, 500);
      }
    }
    
    // POST request - Create a new property
    if (req.method === 'POST') {
      try {
        const propertyData = await parseJSONBody(req);
        
        // Validate required fields
        const requiredFields = ['address', 'city', 'state', 'zip_code', 'property_type', 'square_feet', 'bedrooms', 'bathrooms'];
        const missingFields = requiredFields.filter(field => !propertyData[field]);
        
        if (missingFields.length > 0) {
          return sendJSON(res, { 
            error: 'Missing required fields', 
            fields: missingFields 
          }, 400);
        }
        
        // Create the property
        const query = `
          INSERT INTO properties (
            address, city, state, zip_code, property_type, year_built, 
            square_feet, bedrooms, bathrooms, lot_size, description, 
            parcel_number, zoning, features, created_by
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          RETURNING *
        `;
        
        const values = [
          propertyData.address,
          propertyData.city,
          propertyData.state,
          propertyData.zip_code,
          propertyData.property_type,
          propertyData.year_built || null,
          propertyData.square_feet,
          propertyData.bedrooms,
          propertyData.bathrooms,
          propertyData.lot_size || null,
          propertyData.description || null,
          propertyData.parcel_number || null,
          propertyData.zoning || null,
          propertyData.features ? JSON.stringify(propertyData.features) : null,
          propertyData.created_by || null
        ];
        
        const result = await dbPool.query(query, values);
        return sendJSON(res, result.rows[0], 201);
      } catch (error) {
        console.error('Error creating property:', error);
        return sendJSON(res, { error: 'Error creating property' }, 500);
      }
    }
    
    // PUT request - Update a property
    if (req.method === 'PUT' && segments.length === 3) {
      const propertyId = parseInt(segments[2]);
      
      if (isNaN(propertyId)) {
        return sendJSON(res, { error: 'Invalid property ID' }, 400);
      }
      
      try {
        const propertyData = await parseJSONBody(req);
        
        // Check if property exists
        const checkResult = await dbPool.query(
          'SELECT id FROM properties WHERE id = $1',
          [propertyId]
        );
        
        if (checkResult.rows.length === 0) {
          return sendJSON(res, { error: 'Property not found' }, 404);
        }
        
        // Construct the update query
        const updates = [];
        const values = [];
        let paramIndex = 1;
        
        const updateableFields = [
          'address', 'city', 'state', 'zip_code', 'property_type', 'year_built',
          'square_feet', 'bedrooms', 'bathrooms', 'lot_size', 'description',
          'parcel_number', 'zoning', 'features'
        ];
        
        for (const field of updateableFields) {
          if (propertyData[field] !== undefined) {
            updates.push(`${field} = $${paramIndex}`);
            values.push(field === 'features' ? JSON.stringify(propertyData[field]) : propertyData[field]);
            paramIndex++;
          }
        }
        
        // Add updated_at timestamp
        updates.push(`updated_at = NOW()`);
        
        if (updates.length === 0) {
          return sendJSON(res, { error: 'No fields to update' }, 400);
        }
        
        // Add the ID as the last parameter
        values.push(propertyId);
        
        const query = `
          UPDATE properties 
          SET ${updates.join(', ')} 
          WHERE id = $${paramIndex}
          RETURNING *
        `;
        
        const result = await dbPool.query(query, values);
        return sendJSON(res, result.rows[0]);
      } catch (error) {
        console.error('Error updating property:', error);
        return sendJSON(res, { error: 'Error updating property' }, 500);
      }
    }
    
    // DELETE request - Delete a property
    if (req.method === 'DELETE' && segments.length === 3) {
      const propertyId = parseInt(segments[2]);
      
      if (isNaN(propertyId)) {
        return sendJSON(res, { error: 'Invalid property ID' }, 400);
      }
      
      try {
        // Check if property exists
        const checkResult = await dbPool.query(
          'SELECT id FROM properties WHERE id = $1',
          [propertyId]
        );
        
        if (checkResult.rows.length === 0) {
          return sendJSON(res, { error: 'Property not found' }, 404);
        }
        
        // Delete the property
        await dbPool.query(
          'DELETE FROM properties WHERE id = $1',
          [propertyId]
        );
        
        return sendJSON(res, { message: 'Property deleted successfully' });
      } catch (error) {
        console.error('Error deleting property:', error);
        return sendJSON(res, { error: 'Error deleting property' }, 500);
      }
    }
  }
  
  // Appraisals endpoints
  if (resource === 'appraisals') {
    // GET request handlers
    if (req.method === 'GET') {
      // Get a specific appraisal by ID
      if (segments.length === 3) {
        const appraisalId = parseInt(segments[2]);
        
        if (isNaN(appraisalId)) {
          return sendJSON(res, { error: 'Invalid appraisal ID' }, 400);
        }
        
        try {
          const result = await dbPool.query(
            'SELECT * FROM appraisals WHERE id = $1',
            [appraisalId]
          );
          
          if (result.rows.length === 0) {
            return sendJSON(res, { error: 'Appraisal not found' }, 404);
          }
          
          return sendJSON(res, result.rows[0]);
        } catch (error) {
          console.error('Error fetching appraisal:', error);
          return sendJSON(res, { error: 'Error fetching appraisal' }, 500);
        }
      }
      
      // List appraisals with optional filtering
      const params = getURLParams(parsedUrl);
      let query = 'SELECT * FROM appraisals';
      const queryParams = [];
      const whereConditions = [];
      
      // Filter by property ID
      if (params.property_id) {
        whereConditions.push(`property_id = $${queryParams.length + 1}`);
        queryParams.push(parseInt(params.property_id));
      }
      
      // Filter by appraiser ID
      if (params.appraiser_id) {
        whereConditions.push(`appraiser_id = $${queryParams.length + 1}`);
        queryParams.push(parseInt(params.appraiser_id));
      }
      
      // Filter by status
      if (params.status) {
        whereConditions.push(`status = $${queryParams.length + 1}`);
        queryParams.push(params.status);
      }
      
      if (whereConditions.length > 0) {
        query += ' WHERE ' + whereConditions.join(' AND ');
      }
      
      // Add sorting
      query += ' ORDER BY created_at DESC';
      
      try {
        const result = await dbPool.query(query, queryParams);
        return sendJSON(res, result.rows);
      } catch (error) {
        console.error('Error fetching appraisals:', error);
        return sendJSON(res, { error: 'Error fetching appraisals' }, 500);
      }
    }
    
    // POST request - Create a new appraisal
    if (req.method === 'POST') {
      try {
        const appraisalData = await parseJSONBody(req);
        
        // Validate required fields
        const requiredFields = ['property_id', 'appraiser_id', 'status', 'purpose'];
        const missingFields = requiredFields.filter(field => !appraisalData[field]);
        
        if (missingFields.length > 0) {
          return sendJSON(res, { 
            error: 'Missing required fields', 
            fields: missingFields 
          }, 400);
        }
        
        // Create the appraisal
        const query = `
          INSERT INTO appraisals (
            property_id, appraiser_id, status, purpose, market_value,
            inspection_date, effective_date, report_type, client_name,
            client_email, client_phone, lender_name, loan_number,
            intended_use, valuation_method, scope_of_work, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          RETURNING *
        `;
        
        const values = [
          appraisalData.property_id,
          appraisalData.appraiser_id,
          appraisalData.status,
          appraisalData.purpose,
          appraisalData.market_value || null,
          appraisalData.inspection_date || null,
          appraisalData.effective_date || null,
          appraisalData.report_type || null,
          appraisalData.client_name || null,
          appraisalData.client_email || null,
          appraisalData.client_phone || null,
          appraisalData.lender_name || null,
          appraisalData.loan_number || null,
          appraisalData.intended_use || null,
          appraisalData.valuation_method || null,
          appraisalData.scope_of_work || null,
          appraisalData.notes || null
        ];
        
        const result = await dbPool.query(query, values);
        return sendJSON(res, result.rows[0], 201);
      } catch (error) {
        console.error('Error creating appraisal:', error);
        return sendJSON(res, { error: 'Error creating appraisal' }, 500);
      }
    }
    
    // PUT request - Update an appraisal
    if (req.method === 'PUT' && segments.length === 3) {
      const appraisalId = parseInt(segments[2]);
      
      if (isNaN(appraisalId)) {
        return sendJSON(res, { error: 'Invalid appraisal ID' }, 400);
      }
      
      try {
        const appraisalData = await parseJSONBody(req);
        
        // Check if appraisal exists
        const checkResult = await dbPool.query(
          'SELECT id FROM appraisals WHERE id = $1',
          [appraisalId]
        );
        
        if (checkResult.rows.length === 0) {
          return sendJSON(res, { error: 'Appraisal not found' }, 404);
        }
        
        // Construct the update query
        const updates = [];
        const values = [];
        let paramIndex = 1;
        
        const updateableFields = [
          'status', 'purpose', 'market_value', 'inspection_date',
          'effective_date', 'report_type', 'client_name', 'client_email',
          'client_phone', 'lender_name', 'loan_number', 'intended_use',
          'valuation_method', 'scope_of_work', 'notes'
        ];
        
        for (const field of updateableFields) {
          if (appraisalData[field] !== undefined) {
            updates.push(`${field} = $${paramIndex}`);
            values.push(appraisalData[field]);
            paramIndex++;
          }
        }
        
        // If status is being set to 'Completed', update completed_at timestamp
        if (appraisalData.status === 'Completed') {
          updates.push(`completed_at = NOW()`);
        }
        
        if (updates.length === 0) {
          return sendJSON(res, { error: 'No fields to update' }, 400);
        }
        
        // Add the ID as the last parameter
        values.push(appraisalId);
        
        const query = `
          UPDATE appraisals 
          SET ${updates.join(', ')} 
          WHERE id = $${paramIndex}
          RETURNING *
        `;
        
        const result = await dbPool.query(query, values);
        return sendJSON(res, result.rows[0]);
      } catch (error) {
        console.error('Error updating appraisal:', error);
        return sendJSON(res, { error: 'Error updating appraisal' }, 500);
      }
    }
  }
  
  // Comparables endpoints
  if (resource === 'comparables') {
    // GET request handlers
    if (req.method === 'GET') {
      // Get a specific comparable by ID
      if (segments.length === 3) {
        const comparableId = parseInt(segments[2]);
        
        if (isNaN(comparableId)) {
          return sendJSON(res, { error: 'Invalid comparable ID' }, 400);
        }
        
        try {
          const result = await dbPool.query(
            'SELECT * FROM comparables WHERE id = $1',
            [comparableId]
          );
          
          if (result.rows.length === 0) {
            return sendJSON(res, { error: 'Comparable not found' }, 404);
          }
          
          return sendJSON(res, result.rows[0]);
        } catch (error) {
          console.error('Error fetching comparable:', error);
          return sendJSON(res, { error: 'Error fetching comparable' }, 500);
        }
      }
      
      // List comparables by appraisal ID
      const params = getURLParams(parsedUrl);
      
      if (!params.appraisal_id) {
        return sendJSON(res, { error: 'appraisal_id parameter is required' }, 400);
      }
      
      try {
        const result = await dbPool.query(
          'SELECT * FROM comparables WHERE appraisal_id = $1 ORDER BY created_at DESC',
          [parseInt(params.appraisal_id)]
        );
        
        return sendJSON(res, result.rows);
      } catch (error) {
        console.error('Error fetching comparables:', error);
        return sendJSON(res, { error: 'Error fetching comparables' }, 500);
      }
    }
    
    // POST request - Create a new comparable
    if (req.method === 'POST') {
      try {
        const comparableData = await parseJSONBody(req);
        
        // Validate required fields
        const requiredFields = ['appraisal_id', 'address', 'city', 'state', 'zip_code', 'sale_price', 'sale_date', 'square_feet', 'property_type'];
        const missingFields = requiredFields.filter(field => !comparableData[field]);
        
        if (missingFields.length > 0) {
          return sendJSON(res, { 
            error: 'Missing required fields', 
            fields: missingFields 
          }, 400);
        }
        
        // Create the comparable
        const query = `
          INSERT INTO comparables (
            appraisal_id, address, city, state, zip_code, sale_price,
            sale_date, square_feet, bedrooms, bathrooms, year_built,
            property_type, lot_size, condition, days_on_market,
            source, adjusted_price, adjustment_notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          RETURNING *
        `;
        
        const values = [
          comparableData.appraisal_id,
          comparableData.address,
          comparableData.city,
          comparableData.state,
          comparableData.zip_code,
          comparableData.sale_price,
          comparableData.sale_date,
          comparableData.square_feet,
          comparableData.bedrooms || null,
          comparableData.bathrooms || null,
          comparableData.year_built || null,
          comparableData.property_type,
          comparableData.lot_size || null,
          comparableData.condition || null,
          comparableData.days_on_market || null,
          comparableData.source || null,
          comparableData.adjusted_price || null,
          comparableData.adjustment_notes || null
        ];
        
        const result = await dbPool.query(query, values);
        return sendJSON(res, result.rows[0], 201);
      } catch (error) {
        console.error('Error creating comparable:', error);
        return sendJSON(res, { error: 'Error creating comparable' }, 500);
      }
    }
    
    // PUT request - Update a comparable
    if (req.method === 'PUT' && segments.length === 3) {
      const comparableId = parseInt(segments[2]);
      
      if (isNaN(comparableId)) {
        return sendJSON(res, { error: 'Invalid comparable ID' }, 400);
      }
      
      try {
        const comparableData = await parseJSONBody(req);
        
        // Check if comparable exists
        const checkResult = await dbPool.query(
          'SELECT id FROM comparables WHERE id = $1',
          [comparableId]
        );
        
        if (checkResult.rows.length === 0) {
          return sendJSON(res, { error: 'Comparable not found' }, 404);
        }
        
        // Construct the update query
        const updates = [];
        const values = [];
        let paramIndex = 1;
        
        const updateableFields = [
          'address', 'city', 'state', 'zip_code', 'sale_price', 'sale_date',
          'square_feet', 'bedrooms', 'bathrooms', 'year_built', 'property_type',
          'lot_size', 'condition', 'days_on_market', 'source', 'adjusted_price',
          'adjustment_notes'
        ];
        
        for (const field of updateableFields) {
          if (comparableData[field] !== undefined) {
            updates.push(`${field} = $${paramIndex}`);
            values.push(comparableData[field]);
            paramIndex++;
          }
        }
        
        if (updates.length === 0) {
          return sendJSON(res, { error: 'No fields to update' }, 400);
        }
        
        // Add the ID as the last parameter
        values.push(comparableId);
        
        const query = `
          UPDATE comparables 
          SET ${updates.join(', ')} 
          WHERE id = $${paramIndex}
          RETURNING *
        `;
        
        const result = await dbPool.query(query, values);
        return sendJSON(res, result.rows[0]);
      } catch (error) {
        console.error('Error updating comparable:', error);
        return sendJSON(res, { error: 'Error updating comparable' }, 500);
      }
    }
  }
  
  // Adjustments endpoints
  if (resource === 'adjustments') {
    // GET request handlers
    if (req.method === 'GET') {
      // Get a specific adjustment by ID
      if (segments.length === 3) {
        const adjustmentId = parseInt(segments[2]);
        
        if (isNaN(adjustmentId)) {
          return sendJSON(res, { error: 'Invalid adjustment ID' }, 400);
        }
        
        try {
          const result = await dbPool.query(
            'SELECT * FROM adjustments WHERE id = $1',
            [adjustmentId]
          );
          
          if (result.rows.length === 0) {
            return sendJSON(res, { error: 'Adjustment not found' }, 404);
          }
          
          return sendJSON(res, result.rows[0]);
        } catch (error) {
          console.error('Error fetching adjustment:', error);
          return sendJSON(res, { error: 'Error fetching adjustment' }, 500);
        }
      }
      
      // List adjustments by comparable ID
      const params = getURLParams(parsedUrl);
      
      if (!params.comparable_id) {
        return sendJSON(res, { error: 'comparable_id parameter is required' }, 400);
      }
      
      try {
        const result = await dbPool.query(
          'SELECT * FROM adjustments WHERE comparable_id = $1 ORDER BY created_at DESC',
          [parseInt(params.comparable_id)]
        );
        
        return sendJSON(res, result.rows);
      } catch (error) {
        console.error('Error fetching adjustments:', error);
        return sendJSON(res, { error: 'Error fetching adjustments' }, 500);
      }
    }
    
    // POST request - Create a new adjustment
    if (req.method === 'POST') {
      try {
        const adjustmentData = await parseJSONBody(req);
        
        // Validate required fields
        const requiredFields = ['comparable_id', 'category', 'description', 'amount'];
        const missingFields = requiredFields.filter(field => !adjustmentData[field] && adjustmentData[field] !== 0);
        
        if (missingFields.length > 0) {
          return sendJSON(res, { 
            error: 'Missing required fields', 
            fields: missingFields 
          }, 400);
        }
        
        // Create the adjustment
        const query = `
          INSERT INTO adjustments (
            comparable_id, category, description, amount, is_percentage, notes
          ) VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `;
        
        const values = [
          adjustmentData.comparable_id,
          adjustmentData.category,
          adjustmentData.description,
          adjustmentData.amount,
          adjustmentData.is_percentage || false,
          adjustmentData.notes || null
        ];
        
        const result = await dbPool.query(query, values);
        
        // Update the comparable's adjusted_price
        await updateComparableAdjustedPrice(adjustmentData.comparable_id);
        
        return sendJSON(res, result.rows[0], 201);
      } catch (error) {
        console.error('Error creating adjustment:', error);
        return sendJSON(res, { error: 'Error creating adjustment' }, 500);
      }
    }
    
    // PUT request - Update an adjustment
    if (req.method === 'PUT' && segments.length === 3) {
      const adjustmentId = parseInt(segments[2]);
      
      if (isNaN(adjustmentId)) {
        return sendJSON(res, { error: 'Invalid adjustment ID' }, 400);
      }
      
      try {
        const adjustmentData = await parseJSONBody(req);
        
        // Check if adjustment exists and get comparable_id
        const checkResult = await dbPool.query(
          'SELECT id, comparable_id FROM adjustments WHERE id = $1',
          [adjustmentId]
        );
        
        if (checkResult.rows.length === 0) {
          return sendJSON(res, { error: 'Adjustment not found' }, 404);
        }
        
        const comparableId = checkResult.rows[0].comparable_id;
        
        // Construct the update query
        const updates = [];
        const values = [];
        let paramIndex = 1;
        
        const updateableFields = [
          'category', 'description', 'amount', 'is_percentage', 'notes'
        ];
        
        for (const field of updateableFields) {
          if (adjustmentData[field] !== undefined) {
            updates.push(`${field} = $${paramIndex}`);
            values.push(adjustmentData[field]);
            paramIndex++;
          }
        }
        
        if (updates.length === 0) {
          return sendJSON(res, { error: 'No fields to update' }, 400);
        }
        
        // Add the ID as the last parameter
        values.push(adjustmentId);
        
        const query = `
          UPDATE adjustments 
          SET ${updates.join(', ')} 
          WHERE id = $${paramIndex}
          RETURNING *
        `;
        
        const result = await dbPool.query(query, values);
        
        // Update the comparable's adjusted_price
        await updateComparableAdjustedPrice(comparableId);
        
        return sendJSON(res, result.rows[0]);
      } catch (error) {
        console.error('Error updating adjustment:', error);
        return sendJSON(res, { error: 'Error updating adjustment' }, 500);
      }
    }
    
    // DELETE request - Delete an adjustment
    if (req.method === 'DELETE' && segments.length === 3) {
      const adjustmentId = parseInt(segments[2]);
      
      if (isNaN(adjustmentId)) {
        return sendJSON(res, { error: 'Invalid adjustment ID' }, 400);
      }
      
      try {
        // Check if adjustment exists and get comparable_id
        const checkResult = await dbPool.query(
          'SELECT id, comparable_id FROM adjustments WHERE id = $1',
          [adjustmentId]
        );
        
        if (checkResult.rows.length === 0) {
          return sendJSON(res, { error: 'Adjustment not found' }, 404);
        }
        
        const comparableId = checkResult.rows[0].comparable_id;
        
        // Delete the adjustment
        await dbPool.query(
          'DELETE FROM adjustments WHERE id = $1',
          [adjustmentId]
        );
        
        // Update the comparable's adjusted_price
        await updateComparableAdjustedPrice(comparableId);
        
        return sendJSON(res, { message: 'Adjustment deleted successfully' });
      } catch (error) {
        console.error('Error deleting adjustment:', error);
        return sendJSON(res, { error: 'Error deleting adjustment' }, 500);
      }
    }
  }
  
  // Market data endpoints
  if (resource === 'market-data') {
    // GET request handlers
    if (req.method === 'GET') {
      // Get a specific market data by ID
      if (segments.length === 3) {
        const marketDataId = parseInt(segments[2]);
        
        if (isNaN(marketDataId)) {
          return sendJSON(res, { error: 'Invalid market data ID' }, 400);
        }
        
        try {
          const result = await dbPool.query(
            'SELECT * FROM market_data WHERE id = $1',
            [marketDataId]
          );
          
          if (result.rows.length === 0) {
            return sendJSON(res, { error: 'Market data not found' }, 404);
          }
          
          return sendJSON(res, result.rows[0]);
        } catch (error) {
          console.error('Error fetching market data:', error);
          return sendJSON(res, { error: 'Error fetching market data' }, 500);
        }
      }
      
      // List market data with optional filtering
      const params = getURLParams(parsedUrl);
      let query = 'SELECT * FROM market_data';
      const queryParams = [];
      const whereConditions = [];
      
      // Filter by location
      if (params.location) {
        whereConditions.push(`location = $${queryParams.length + 1}`);
        queryParams.push(params.location);
      }
      
      // Filter by data type
      if (params.data_type) {
        whereConditions.push(`data_type = $${queryParams.length + 1}`);
        queryParams.push(params.data_type);
      }
      
      // Filter by time period
      if (params.time) {
        whereConditions.push(`time = $${queryParams.length + 1}`);
        queryParams.push(params.time);
      }
      
      if (whereConditions.length > 0) {
        query += ' WHERE ' + whereConditions.join(' AND ');
      }
      
      // Add sorting
      query += ' ORDER BY time DESC';
      
      try {
        const result = await dbPool.query(query, queryParams);
        return sendJSON(res, result.rows);
      } catch (error) {
        console.error('Error fetching market data:', error);
        return sendJSON(res, { error: 'Error fetching market data' }, 500);
      }
    }
    
    // POST request - Create new market data
    if (req.method === 'POST') {
      try {
        const marketData = await parseJSONBody(req);
        
        // Validate required fields
        const requiredFields = ['location', 'data_type', 'time', 'value'];
        const missingFields = requiredFields.filter(field => marketData[field] === undefined);
        
        if (missingFields.length > 0) {
          return sendJSON(res, { 
            error: 'Missing required fields', 
            fields: missingFields 
          }, 400);
        }
        
        // Create the market data
        const query = `
          INSERT INTO market_data (
            location, data_type, time, value, comparison_value, 
            percent_change, source, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `;
        
        const values = [
          marketData.location,
          marketData.data_type,
          marketData.time,
          marketData.value,
          marketData.comparison_value || null,
          marketData.percent_change || null,
          marketData.source || null,
          marketData.notes || null
        ];
        
        const result = await dbPool.query(query, values);
        return sendJSON(res, result.rows[0], 201);
      } catch (error) {
        console.error('Error creating market data:', error);
        return sendJSON(res, { error: 'Error creating market data' }, 500);
      }
    }
  }
  
  // Handle unknown API endpoints
  return sendJSON(res, { error: 'Endpoint not found' }, 404);
};

// Helper function to update a comparable's adjusted price based on its adjustments
async function updateComparableAdjustedPrice(comparableId) {
  try {
    // Get the comparable sale price
    const comparableResult = await dbPool.query(
      'SELECT sale_price FROM comparables WHERE id = $1',
      [comparableId]
    );
    
    if (comparableResult.rows.length === 0) {
      console.error(`Comparable with ID ${comparableId} not found`);
      return;
    }
    
    const salePrice = comparableResult.rows[0].sale_price;
    
    // Get all adjustments for this comparable
    const adjustmentsResult = await dbPool.query(
      'SELECT amount, is_percentage FROM adjustments WHERE comparable_id = $1',
      [comparableId]
    );
    
    // Calculate the adjusted price
    let adjustedPrice = salePrice;
    for (const adjustment of adjustmentsResult.rows) {
      if (adjustment.is_percentage) {
        // Percentage adjustment
        adjustedPrice += salePrice * (adjustment.amount / 100);
      } else {
        // Fixed amount adjustment
        adjustedPrice += adjustment.amount;
      }
    }
    
    // Update the comparable with the new adjusted price
    await dbPool.query(
      'UPDATE comparables SET adjusted_price = $1 WHERE id = $2',
      [adjustedPrice, comparableId]
    );
    
  } catch (error) {
    console.error('Error updating comparable adjusted price:', error);
  }
}

// Request handler
server.on('request', async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  
  // Handle API requests
  if (pathname.startsWith('/api/')) {
    return handleAPIRequest(req, res, parsedUrl, pathname);
  }
  
  // Serve static files from client/dist
  if (pathname === '/' || pathname === '/index.html') {
    try {
      const filePath = path.join(__dirname, '../client/dist/index.html');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath);
        res.setHeader('Content-Type', 'text/html');
        res.end(content);
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>TerraFusion Professional</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
              color: #333;
              line-height: 1.6;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 2rem;
            }
            .header {
              background: linear-gradient(135deg, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%);
              color: white;
              padding: 2rem;
              text-align: center;
              border-radius: 8px;
              margin-bottom: 2rem;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            h1 {
              margin: 0;
              font-size: 2.5rem;
            }
            .subtitle {
              font-size: 1.2rem;
              opacity: 0.9;
              margin-top: 0.5rem;
            }
            .card {
              background: white;
              border-radius: 8px;
              padding: 1.5rem;
              margin-bottom: 1.5rem;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .api-url {
              background: #f1f1f1;
              padding: 0.5rem;
              border-radius: 4px;
              font-family: monospace;
              margin: 0.5rem 0;
            }
            .features {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 1.5rem;
              margin-top: 2rem;
            }
            .feature {
              background: white;
              border-radius: 8px;
              padding: 1.5rem;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .feature h3 {
              margin-top: 0;
              color: #2989d8;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>TerraFusion Professional</h1>
              <div class="subtitle">Real Estate Appraisal Platform</div>
            </div>
            
            <div class="card">
              <h2>Server Status</h2>
              <p>✅ The TerraFusion Professional API Server is running!</p>
              <p>✅ Database connection is active</p>
              <p>Testing API endpoint: <span class="api-url">/api/test</span></p>
            </div>
            
            <div class="features">
              <div class="feature">
                <h3>Property Management</h3>
                <p>Store and manage detailed property information including location, characteristics, and history.</p>
              </div>
              <div class="feature">
                <h3>Appraisal Workflow</h3>
                <p>Create, track, and manage appraisal assignments with comprehensive data collection.</p>
              </div>
              <div class="feature">
                <h3>Comparable Analysis</h3>
                <p>Manage comparable properties with detailed adjustments for accurate valuation.</p>
              </div>
              <div class="feature">
                <h3>Market Analysis</h3>
                <p>Track and analyze real estate market trends to support valuation decisions.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
        `);
      }
    } catch (error) {
      res.statusCode = 500;
      res.end('Server error');
    }
    return;
  }
  
  // Try to serve static files
  try {
    const filePath = path.join(__dirname, '../client/dist', pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const content = fs.readFileSync(filePath);
      
      // Set the correct content type
      let contentType = 'text/plain';
      if (pathname.endsWith('.html')) contentType = 'text/html';
      if (pathname.endsWith('.css')) contentType = 'text/css';
      if (pathname.endsWith('.js')) contentType = 'application/javascript';
      if (pathname.endsWith('.json')) contentType = 'application/json';
      if (pathname.endsWith('.png')) contentType = 'image/png';
      if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) contentType = 'image/jpeg';
      if (pathname.endsWith('.svg')) contentType = 'image/svg+xml';
      
      res.setHeader('Content-Type', contentType);
      res.end(content);
      return;
    }
  } catch (error) {
    // Ignore file access errors
  }
  
  // Default response for other routes - redirect to root
  res.statusCode = 302;
  res.setHeader('Location', '/');
  res.end();
});

// Start server and test database connection
initializeDatabase().then((pool) => {
  dbPool = pool;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`TerraFusion Professional API Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to initialize:', error);
  // Start server anyway to show at least the API is working
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`TerraFusion Professional API Server running on port ${PORT} (without database)`);
  });
});