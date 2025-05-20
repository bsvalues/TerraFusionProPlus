const http = require('http');
const fs = require('fs');
const path = require('path');

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  // Serve the HTML file
  fs.readFile(path.join(__dirname, '../simple-html-app.html'), (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading the file');
      return;
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data);
  });
});

// Listen on port 5000
server.listen(5000, '0.0.0.0', () => {
  console.log('TerraFusionProfessional server is running on port 5000');
});