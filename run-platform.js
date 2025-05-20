// TerraFusionProfessional Platform Runner
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting TerraFusionProfessional platform...');

// Start the server
const server = spawn('node', ['packages/server/src/index.js'], {
  stdio: 'inherit'
});

// Start the client 
const client = spawn('npx', ['vite'], {
  cwd: path.join(__dirname, 'packages/client'),
  stdio: 'inherit'
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down TerraFusionProfessional platform...');
  server.kill('SIGINT');
  client.kill('SIGINT');
  process.exit(0);
});

// Handle errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

client.on('error', (err) => {
  console.error('Client error:', err);
});

// Log process exits
server.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
});

client.on('exit', (code) => {
  console.log(`Client process exited with code ${code}`);
});