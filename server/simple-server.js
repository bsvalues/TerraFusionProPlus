const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Properties endpoints
app.get('/api/properties', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM properties ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching property with id ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const { 
      address, city, state, zip_code, property_type, year_built, 
      square_feet, bedrooms, bathrooms, lot_size, description,
      parcel_number, zoning, latitude, longitude, features
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO properties (
        address, city, state, zip_code, property_type, year_built, 
        square_feet, bedrooms, bathrooms, lot_size, description,
        parcel_number, zoning, latitude, longitude, features,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
      RETURNING *`,
      [
        address, city, state, zip_code, property_type, year_built, 
        square_feet, bedrooms, bathrooms, lot_size, description,
        parcel_number, zoning, latitude, longitude, features
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

app.put('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      address, city, state, zip_code, property_type, year_built, 
      square_feet, bedrooms, bathrooms, lot_size, description,
      parcel_number, zoning, latitude, longitude, features
    } = req.body;
    
    const result = await pool.query(
      `UPDATE properties SET
        address = $1, city = $2, state = $3, zip_code = $4, property_type = $5, 
        year_built = $6, square_feet = $7, bedrooms = $8, bathrooms = $9, 
        lot_size = $10, description = $11, parcel_number = $12, zoning = $13, 
        latitude = $14, longitude = $15, features = $16, updated_at = NOW()
      WHERE id = $17
      RETURNING *`,
      [
        address, city, state, zip_code, property_type, year_built, 
        square_feet, bedrooms, bathrooms, lot_size, description,
        parcel_number, zoning, latitude, longitude, features, id
      ]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating property with id ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Appraisals endpoints
app.get('/api/appraisals', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM appraisals ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching appraisals:', err);
    res.status(500).json({ error: 'Failed to fetch appraisals' });
  }
});

app.get('/api/appraisals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM appraisals WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appraisal not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching appraisal with id ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to fetch appraisal' });
  }
});

app.get('/api/appraisals/property/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const result = await pool.query(
      'SELECT * FROM appraisals WHERE property_id = $1 ORDER BY created_at DESC', 
      [propertyId]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error(`Error fetching appraisals for property ${req.params.propertyId}:`, err);
    res.status(500).json({ error: 'Failed to fetch appraisals for property' });
  }
});

app.post('/api/appraisals', async (req, res) => {
  try {
    const {
      property_id, appraiser_id, status, purpose, market_value,
      inspection_date, effective_date, report_type, client_name,
      client_email, client_phone, lender_name, loan_number,
      intended_use, valuation_method, scope_of_work, notes
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO appraisals (
        property_id, appraiser_id, status, purpose, market_value,
        inspection_date, effective_date, report_type, client_name,
        client_email, client_phone, lender_name, loan_number,
        intended_use, valuation_method, scope_of_work, notes,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())
      RETURNING *`,
      [
        property_id, appraiser_id, status, purpose, market_value,
        inspection_date, effective_date, report_type, client_name,
        client_email, client_phone, lender_name, loan_number,
        intended_use, valuation_method, scope_of_work, notes
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating appraisal:', err);
    res.status(500).json({ error: 'Failed to create appraisal' });
  }
});

app.put('/api/appraisals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      property_id, appraiser_id, status, purpose, market_value,
      inspection_date, effective_date, report_type, client_name,
      client_email, client_phone, lender_name, loan_number,
      intended_use, valuation_method, scope_of_work, notes
    } = req.body;
    
    const result = await pool.query(
      `UPDATE appraisals SET
        property_id = $1, appraiser_id = $2, status = $3, purpose = $4,
        market_value = $5, inspection_date = $6, effective_date = $7,
        report_type = $8, client_name = $9, client_email = $10,
        client_phone = $11, lender_name = $12, loan_number = $13,
        intended_use = $14, valuation_method = $15, scope_of_work = $16,
        notes = $17, completed_at = CASE WHEN $3 = 'Completed' AND completed_at IS NULL THEN NOW() ELSE completed_at END
      WHERE id = $18
      RETURNING *`,
      [
        property_id, appraiser_id, status, purpose, market_value,
        inspection_date, effective_date, report_type, client_name,
        client_email, client_phone, lender_name, loan_number,
        intended_use, valuation_method, scope_of_work, notes, id
      ]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appraisal not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating appraisal with id ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to update appraisal' });
  }
});

// Comparables endpoints
app.get('/api/comparables', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM comparables ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching comparables:', err);
    res.status(500).json({ error: 'Failed to fetch comparables' });
  }
});

app.get('/api/comparables/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM comparables WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comparable not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching comparable with id ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to fetch comparable' });
  }
});

app.get('/api/comparables/appraisal/:appraisalId', async (req, res) => {
  try {
    const { appraisalId } = req.params;
    const result = await pool.query(
      'SELECT * FROM comparables WHERE appraisal_id = $1 ORDER BY sale_date DESC', 
      [appraisalId]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error(`Error fetching comparables for appraisal ${req.params.appraisalId}:`, err);
    res.status(500).json({ error: 'Failed to fetch comparables for appraisal' });
  }
});

app.post('/api/comparables', async (req, res) => {
  try {
    const {
      appraisal_id, address, city, state, zip_code, sale_price,
      sale_date, square_feet, bedrooms, bathrooms, year_built,
      property_type, lot_size, condition, days_on_market,
      source, adjusted_price, adjustment_notes
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO comparables (
        appraisal_id, address, city, state, zip_code, sale_price,
        sale_date, square_feet, bedrooms, bathrooms, year_built,
        property_type, lot_size, condition, days_on_market,
        source, adjusted_price, adjustment_notes, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW())
      RETURNING *`,
      [
        appraisal_id, address, city, state, zip_code, sale_price,
        sale_date, square_feet, bedrooms, bathrooms, year_built,
        property_type, lot_size, condition, days_on_market,
        source, adjusted_price, adjustment_notes
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating comparable:', err);
    res.status(500).json({ error: 'Failed to create comparable' });
  }
});

app.put('/api/comparables/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      appraisal_id, address, city, state, zip_code, sale_price,
      sale_date, square_feet, bedrooms, bathrooms, year_built,
      property_type, lot_size, condition, days_on_market,
      source, adjusted_price, adjustment_notes
    } = req.body;
    
    const result = await pool.query(
      `UPDATE comparables SET
        appraisal_id = $1, address = $2, city = $3, state = $4,
        zip_code = $5, sale_price = $6, sale_date = $7, square_feet = $8,
        bedrooms = $9, bathrooms = $10, year_built = $11, property_type = $12,
        lot_size = $13, condition = $14, days_on_market = $15, source = $16,
        adjusted_price = $17, adjustment_notes = $18
      WHERE id = $19
      RETURNING *`,
      [
        appraisal_id, address, city, state, zip_code, sale_price,
        sale_date, square_feet, bedrooms, bathrooms, year_built,
        property_type, lot_size, condition, days_on_market,
        source, adjusted_price, adjustment_notes, id
      ]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comparable not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating comparable with id ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to update comparable' });
  }
});

// Market data endpoints with sample data
app.get('/api/market-data/price-trends/:location', (req, res) => {
  const { location } = req.params;
  
  // Generate sample price trends data for the location
  const baseValue = location === 'San Francisco' ? 1200000 :
                 location === 'Oakland' ? 850000 :
                 location === 'San Jose' ? 1050000 : 900000;
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [];
  
  // Generate data for the current year and previous year
  for (let year = 2024; year <= 2025; year++) {
    for (let i = 0; i < months.length; i++) {
      // Create some realistic price trends with seasonal variations
      const seasonalFactor = i < 6 ? (i * 0.01) : ((12 - i) * 0.01); // Higher in spring/summer
      const yearFactor = year === 2024 ? 0 : 0.05; // 5% annual growth
      const randomVariation = (Math.random() * 0.04) - 0.02; // ±2% random variation
      
      const value = Math.round(baseValue * (1 + seasonalFactor + yearFactor + randomVariation));
      
      data.push({
        month: months[i],
        value,
        year
      });
    }
  }
  
  res.json(data);
});

app.get('/api/market-data/dom-trends/:location', (req, res) => {
  const { location } = req.params;
  
  // Generate sample days on market trends data for the location
  const baseDays = location === 'San Francisco' ? 25 :
                location === 'Oakland' ? 35 :
                location === 'San Jose' ? 30 : 32;
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [];
  
  // Generate data for the current year and previous year
  for (let year = 2024; year <= 2025; year++) {
    for (let i = 0; i < months.length; i++) {
      // Create some realistic DOM trends with seasonal variations
      const seasonalFactor = i < 6 ? (i * -0.8) : ((12 - i) * -0.8); // Lower in spring/summer
      const yearFactor = year === 2024 ? 0 : -3; // Decreasing trend for current year
      const randomVariation = (Math.random() * 6) - 3; // ±3 days random variation
      
      const days = Math.max(10, Math.round(baseDays + seasonalFactor + yearFactor + randomVariation));
      
      data.push({
        month: months[i],
        days,
        year
      });
    }
  }
  
  res.json(data);
});

app.get('/api/market-data/sales-trends/:location', (req, res) => {
  const { location } = req.params;
  
  // Generate sample sales volume trends data for the location
  const baseSales = location === 'San Francisco' ? 350 :
                 location === 'Oakland' ? 420 :
                 location === 'San Jose' ? 480 : 400;
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [];
  
  // Generate data for the current year and previous year
  for (let year = 2024; year <= 2025; year++) {
    for (let i = 0; i < months.length; i++) {
      // Create some realistic sales trends with seasonal variations
      const seasonalFactor = i < 6 ? (i * 15) : ((12 - i) * 15); // Higher in spring/summer
      const yearFactor = year === 2024 ? 0 : 40; // Increasing trend for current year
      const randomVariation = (Math.random() * 60) - 30; // ±30 sales random variation
      
      const sales = Math.max(150, Math.round(baseSales + seasonalFactor + yearFactor + randomVariation));
      
      data.push({
        month: months[i],
        sales,
        year
      });
    }
  }
  
  res.json(data);
});

app.get('/api/market-data/property-types', (req, res) => {
  // Sample property type distribution data
  const data = [
    { name: 'Single Family', value: 45 },
    { name: 'Condo', value: 30 },
    { name: 'Multi-Family', value: 12 },
    { name: 'Townhouse', value: 8 },
    { name: 'Land', value: 3 },
    { name: 'Commercial', value: 2 }
  ];
  
  res.json(data);
});

app.get('/api/market-data/neighborhood-prices', (req, res) => {
  // Sample neighborhood price comparison data
  const data = [
    { name: 'Pacific Heights', medianPrice: 2850000, pricePerSqft: 1450 },
    { name: 'Noe Valley', medianPrice: 2150000, pricePerSqft: 1350 },
    { name: 'Mission District', medianPrice: 1580000, pricePerSqft: 1180 },
    { name: 'Sunset District', medianPrice: 1450000, pricePerSqft: 950 },
    { name: 'Richmond District', medianPrice: 1630000, pricePerSqft: 1050 },
    { name: 'SOMA', medianPrice: 1250000, pricePerSqft: 1100 },
    { name: 'Potrero Hill', medianPrice: 1780000, pricePerSqft: 1150 },
    { name: 'Excelsior', medianPrice: 1150000, pricePerSqft: 850 },
    { name: 'Bayview', medianPrice: 980000, pricePerSqft: 720 }
  ];
  
  res.json(data);
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});