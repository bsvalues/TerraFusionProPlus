const { spawn } = require('child_process');
const path = require('path');

// Helper function to spawn a process and pipe output
function spawnProcess(command, args, options, name) {
  const proc = spawn(command, args, options);
  
  proc.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });
  
  proc.stderr.on('data', (data) => {
    console.error(`[${name}] ${data.toString().trim()}`);
  });
  
  proc.on('close', (code) => {
    console.log(`[${name}] Process exited with code ${code}`);
  });
  
  return proc;
}

// Start client dev server (Vite)
console.log('Starting client development server...');
const clientProc = spawnProcess('npx', ['vite'], { cwd: path.join(__dirname, 'client') }, 'CLIENT');

// Start server with nodemon for auto-reloading
console.log('Starting server...');
const serverProc = spawnProcess('node', ['index.js'], { cwd: path.join(__dirname, 'server') }, 'SERVER');

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down development servers...');
  clientProc.kill();
  serverProc.kill();
  process.exit(0);
});

console.log('\nTerraFusionProfessional development environment running');
console.log('Press Ctrl+C to stop all processes\n');