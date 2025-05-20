const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// Create a pool for database connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TerraFusionProfessional API is running' });
});

// User routes
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, first_name as "firstName", last_name as "lastName", role, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt" FROM users'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const result = await pool.query(
      'SELECT id, username, email, first_name as "firstName", last_name as "lastName", role, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { username, firstName, lastName, email, password, role } = req.body;
    
    const result = await pool.query(
      `INSERT INTO users (username, first_name, last_name, email, password, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, username, email, first_name as "firstName", last_name as "lastName", role, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"`,
      [username, firstName, lastName, email, password, role || 'appraiser']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.constraint === 'users_username_key') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    if (error.constraint === 'users_email_key') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Property routes
router.get('/properties', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, address, city, state, zip_code as "zip_code", property_type, year_built, 
        square_feet, bedrooms, bathrooms, lot_size, description, created_at as "created_at", 
        updated_at as "updated_at", parcel_number, zoning, lot_unit, 
        latitude, longitude, features
      FROM properties
      ORDER BY id ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

router.get('/properties/:id', async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const result = await pool.query(`
      SELECT 
        id, address, city, state, zip_code as "zip_code", property_type, year_built, 
        square_feet, bedrooms, bathrooms, lot_size, description, created_at as "created_at", 
        updated_at as "updated_at", parcel_number, zoning, lot_unit, 
        latitude, longitude, features
      FROM properties 
      WHERE id = $1
    `, [propertyId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

router.post('/properties', async (req, res) => {
  try {
    const { 
      address, city, state, zip_code, property_type, year_built,
      square_feet, bedrooms, bathrooms, lot_size, description,
      parcel_number, zoning, lot_unit, latitude, longitude, features
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO properties 
       (address, city, state, zip_code, property_type, year_built, 
        square_feet, bedrooms, bathrooms, lot_size, description,
        parcel_number, zoning, lot_unit, latitude, longitude, features)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       RETURNING *`,
      [address, city, state, zip_code, property_type, year_built,
       square_feet, bedrooms, bathrooms, lot_size, description,
       parcel_number, zoning, lot_unit, latitude, longitude, features ? JSON.stringify(features) : null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Appraisal routes
router.get('/appraisals', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, p.address, u.username as "appraiserName"
      FROM appraisals a
      JOIN properties p ON a.property_id = p.id
      JOIN users u ON a.appraiser_id = u.id
      ORDER BY a.created_at DESC
    `);
    
    // Transform column names to match frontend expectations
    const appraisals = result.rows.map(row => ({
      id: row.id,
      propertyId: row.property_id,
      appraiserId: row.appraiser_id,
      status: row.status,
      purpose: row.purpose,
      marketValue: row.market_value,
      createdAt: row.created_at,
      completedAt: row.completed_at,
      inspectionDate: row.inspection_date,
      effectiveDate: row.effective_date,
      reportType: row.report_type,
      clientName: row.client_name,
      clientEmail: row.client_email,
      clientPhone: row.client_phone,
      lenderName: row.lender_name,
      loanNumber: row.loan_number,
      intendedUse: row.intended_use,
      valuationMethod: row.valuation_method,
      scopeOfWork: row.scope_of_work,
      notes: row.notes,
      // Additional joined fields
      address: row.address,
      appraiserName: row.appraiserName
    }));
    
    res.json(appraisals);
  } catch (error) {
    console.error('Error fetching appraisals:', error);
    res.status(500).json({ error: 'Failed to fetch appraisals' });
  }
});

router.get('/appraisals/property/:propertyId', async (req, res) => {
  try {
    const propertyId = parseInt(req.params.propertyId);
    const result = await pool.query(`
      SELECT a.*, u.username as "appraiserName"
      FROM appraisals a
      JOIN users u ON a.appraiser_id = u.id
      WHERE a.property_id = $1
      ORDER BY a.created_at DESC
    `, [propertyId]);
    
    const appraisals = result.rows.map(row => ({
      id: row.id,
      propertyId: row.property_id,
      appraiserId: row.appraiser_id,
      status: row.status,
      purpose: row.purpose,
      marketValue: row.market_value,
      createdAt: row.created_at,
      completedAt: row.completed_at,
      inspectionDate: row.inspection_date,
      effectiveDate: row.effective_date,
      reportType: row.report_type,
      clientName: row.client_name,
      clientEmail: row.client_email,
      clientPhone: row.client_phone,
      lenderName: row.lender_name,
      loanNumber: row.loan_number,
      intendedUse: row.intended_use,
      valuationMethod: row.valuation_method,
      scopeOfWork: row.scope_of_work,
      notes: row.notes,
      // Additional joined fields
      appraiserName: row.appraiserName
    }));
    
    res.json(appraisals);
  } catch (error) {
    console.error('Error fetching appraisals:', error);
    res.status(500).json({ error: 'Failed to fetch appraisals' });
  }
});

router.get('/appraisals/:id', async (req, res) => {
  try {
    const appraisalId = parseInt(req.params.id);
    const result = await pool.query(`
      SELECT a.*, p.address, u.username as "appraiserName"
      FROM appraisals a
      JOIN properties p ON a.property_id = p.id
      JOIN users u ON a.appraiser_id = u.id
      WHERE a.id = $1
    `, [appraisalId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appraisal not found' });
    }
    
    const row = result.rows[0];
    const appraisal = {
      id: row.id,
      propertyId: row.property_id,
      appraiserId: row.appraiser_id,
      status: row.status,
      purpose: row.purpose,
      marketValue: row.market_value,
      createdAt: row.created_at,
      completedAt: row.completed_at,
      inspectionDate: row.inspection_date,
      effectiveDate: row.effective_date,
      reportType: row.report_type,
      clientName: row.client_name,
      clientEmail: row.client_email,
      clientPhone: row.client_phone,
      lenderName: row.lender_name,
      loanNumber: row.loan_number,
      intendedUse: row.intended_use,
      valuationMethod: row.valuation_method,
      scopeOfWork: row.scope_of_work,
      notes: row.notes,
      // Additional joined fields
      address: row.address,
      appraiserName: row.appraiserName
    };
    
    res.json(appraisal);
  } catch (error) {
    console.error('Error fetching appraisal:', error);
    res.status(500).json({ error: 'Failed to fetch appraisal' });
  }
});

router.post('/appraisals', async (req, res) => {
  try {
    const { 
      propertyId, appraiserId, status, purpose, marketValue,
      inspectionDate, effectiveDate, reportType, clientName,
      clientEmail, clientPhone, lenderName, loanNumber,
      intendedUse, valuationMethod, scopeOfWork, notes
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO appraisals 
       (property_id, appraiser_id, status, purpose, market_value,
        inspection_date, effective_date, report_type, client_name,
        client_email, client_phone, lender_name, loan_number,
        intended_use, valuation_method, scope_of_work, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       RETURNING *`,
      [propertyId, appraiserId, status || 'Draft', purpose, marketValue,
       inspectionDate, effectiveDate, reportType, clientName,
       clientEmail, clientPhone, lenderName, loanNumber,
       intendedUse, valuationMethod, scopeOfWork, notes]
    );
    
    const row = result.rows[0];
    const appraisal = {
      id: row.id,
      propertyId: row.property_id,
      appraiserId: row.appraiser_id,
      status: row.status,
      purpose: row.purpose,
      marketValue: row.market_value,
      createdAt: row.created_at,
      completedAt: row.completed_at,
      inspectionDate: row.inspection_date,
      effectiveDate: row.effective_date,
      reportType: row.report_type,
      clientName: row.client_name,
      clientEmail: row.client_email,
      clientPhone: row.client_phone,
      lenderName: row.lender_name,
      loanNumber: row.loan_number,
      intendedUse: row.intended_use,
      valuationMethod: row.valuation_method,
      scopeOfWork: row.scope_of_work,
      notes: row.notes
    };
    
    res.status(201).json(appraisal);
  } catch (error) {
    console.error('Error creating appraisal:', error);
    res.status(500).json({ error: 'Failed to create appraisal' });
  }
});

// Comparable routes
router.get('/comparables/appraisal/:appraisalId', async (req, res) => {
  try {
    const appraisalId = parseInt(req.params.appraisalId);
    const result = await pool.query(`
      SELECT * FROM comparables
      WHERE appraisal_id = $1
      ORDER BY sale_date DESC
    `, [appraisalId]);
    
    // Transform column names to match frontend expectations
    const comparables = result.rows.map(row => ({
      id: row.id,
      appraisalId: row.appraisal_id,
      address: row.address,
      city: row.city,
      state: row.state,
      zipCode: row.zip_code,
      salePrice: row.sale_price,
      saleDate: row.sale_date,
      squareFeet: row.square_feet,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      yearBuilt: row.year_built,
      propertyType: row.property_type,
      lotSize: row.lot_size,
      condition: row.condition,
      daysOnMarket: row.days_on_market,
      source: row.source,
      adjustedPrice: row.adjusted_price,
      adjustmentNotes: row.adjustment_notes,
      createdAt: row.created_at
    }));
    
    res.json(comparables);
  } catch (error) {
    console.error('Error fetching comparables:', error);
    res.status(500).json({ error: 'Failed to fetch comparables' });
  }
});

router.post('/comparables', async (req, res) => {
  try {
    const { 
      appraisalId, address, city, state, zipCode,
      salePrice, saleDate, squareFeet, bedrooms,
      bathrooms, yearBuilt, propertyType, lotSize,
      condition, daysOnMarket, source, adjustedPrice,
      adjustmentNotes
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO comparables 
       (appraisal_id, address, city, state, zip_code,
        sale_price, sale_date, square_feet, bedrooms,
        bathrooms, year_built, property_type, lot_size,
        condition, days_on_market, source, adjusted_price,
        adjustment_notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       RETURNING *`,
      [appraisalId, address, city, state, zipCode,
       salePrice, saleDate, squareFeet, bedrooms,
       bathrooms, yearBuilt, propertyType, lotSize,
       condition, daysOnMarket, source, adjustedPrice,
       adjustmentNotes]
    );
    
    const row = result.rows[0];
    const comparable = {
      id: row.id,
      appraisalId: row.appraisal_id,
      address: row.address,
      city: row.city,
      state: row.state,
      zipCode: row.zip_code,
      salePrice: row.sale_price,
      saleDate: row.sale_date,
      squareFeet: row.square_feet,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      yearBuilt: row.year_built,
      propertyType: row.property_type,
      lotSize: row.lot_size,
      condition: row.condition,
      daysOnMarket: row.days_on_market,
      source: row.source,
      adjustedPrice: row.adjusted_price,
      adjustmentNotes: row.adjustment_notes,
      createdAt: row.created_at
    };
    
    res.status(201).json(comparable);
  } catch (error) {
    console.error('Error creating comparable:', error);
    res.status(500).json({ error: 'Failed to create comparable' });
  }
});

// Market Analysis Data routes
router.get('/market-data', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM market_data
      ORDER BY created_at DESC
    `);
    
    // Transform column names to match frontend expectations
    const marketData = result.rows.map(row => ({
      id: row.id,
      location: row.location,
      dataType: row.data_type,
      time: row.time,
      value: row.value,
      comparisonValue: row.comparison_value,
      percentChange: row.percent_change,
      source: row.source,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    
    res.json(marketData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Mock Market Analysis Data 
router.get('/market-analysis', (req, res) => {
  const marketData = {
    pricePerSqftTrend: [
      { month: "Jan", value: 450, year: 2024 },
      { month: "Feb", value: 452, year: 2024 },
      { month: "Mar", value: 458, year: 2024 },
      { month: "Apr", value: 465, year: 2024 },
      { month: "May", value: 472, year: 2024 },
      { month: "Jun", value: 480, year: 2024 }
    ],
    salesVolume: [
      { month: "Jan", sales: 120, year: 2024 },
      { month: "Feb", sales: 105, year: 2024 },
      { month: "Mar", sales: 130, year: 2024 },
      { month: "Apr", sales: 142, year: 2024 },
      { month: "May", sales: 155, year: 2024 },
      { month: "Jun", sales: 162, year: 2024 }
    ],
    daysOnMarket: [
      { month: "Jan", days: 32, year: 2024 },
      { month: "Feb", days: 30, year: 2024 },
      { month: "Mar", days: 28, year: 2024 },
      { month: "Apr", days: 25, year: 2024 },
      { month: "May", days: 22, year: 2024 },
      { month: "Jun", days: 20, year: 2024 }
    ],
    medianPrices: {
      currentYear: 950000,
      previousYear: 880000,
      percentChange: 7.95
    },
    propertyTypes: [
      { name: 'Single Family', value: 65 },
      { name: 'Condo', value: 18 },
      { name: 'Multi-Family', value: 10 },
      { name: 'Townhouse', value: 7 }
    ],
    neighborhoodPrices: [
      { name: 'Downtown', medianPrice: 625000, pricePerSqft: 450 },
      { name: 'North End', medianPrice: 875000, pricePerSqft: 520 },
      { name: 'South Side', medianPrice: 425000, pricePerSqft: 320 },
      { name: 'Westview', medianPrice: 750000, pricePerSqft: 480 },
      { name: 'Eastside', medianPrice: 580000, pricePerSqft: 410 }
    ]
  };
  
  res.json(marketData);
});

module.exports = router;