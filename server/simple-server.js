const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

// Database connection for testing
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
neonConfig.webSocketConstructor = ws;

// Create HTTP server
const server = http.createServer();
const PORT = process.env.PORT || 3000;

// Test database connection
async function testDatabaseConnection() {
  try {
    if (!process.env.DATABASE_URL) {
      console.log('DATABASE_URL not set, skipping database initialization');
      return;
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
  }
}

// Request handler
server.on('request', async (req, res) => {
  const parsedUrl = url.parse(req.url);
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
  
  // API routes
  if (pathname === '/api/test') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      message: 'TerraFusion Professional API Server is running!',
      time: new Date().toISOString()
    }));
    return;
  }
  
  // API database test
  if (pathname === '/api/database-test') {
    try {
      const pool = await testDatabaseConnection();
      
      if (!pool) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 
          error: 'Database connection failed or not configured'
        }));
        return;
      }
      
      const client = await pool.connect();
      const result = await client.query('SELECT NOW() as time');
      client.release();
      
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        message: 'Database connection successful',
        time: result.rows[0].time,
        database_url: process.env.DATABASE_URL ? '(Set)' : '(Not set)'
      }));
      return;
    } catch (error) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 500;
      res.end(JSON.stringify({ 
        error: 'Database error',
        message: error.message
      }));
      return;
    }
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
        res.end('<html><body><h1>TerraFusion Professional</h1><p>Server is running, but client files are not built yet.</p></body></html>');
      }
    } catch (error) {
      res.statusCode = 500;
      res.end('Server error');
    }
    return;
  }
  
  // Default response for other routes
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('TerraFusion Professional API Server is running!');
});

// Start server and test database connection
testDatabaseConnection().then(() => {
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