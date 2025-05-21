const { spawn } = require('child_process');
const path = require('path');

function spawnProcess(command, args, options, name) {
  const proc = spawn(command, args, options);
  
  console.log(`${name} process started`);
  
  proc.stdout.on('data', (data) => {
    console.log(`[${name}] ${data}`);
  });
  
  proc.stderr.on('data', (data) => {
    console.error(`[${name}] ${data}`);
  });
  
  proc.on('close', (code) => {
    console.log(`${name} process exited with code ${code}`);
  });
  
  return proc;
}

// Start the Express server
const serverProc = spawnProcess(
  'node',
  ['server/index.js'],
  { stdio: 'pipe', shell: process.platform === 'win32' },
  'SERVER'
);

// Start the Vite development server for React
const clientProc = spawnProcess(
  'npx',
  ['vite', 'serve', 'client', '--port', '3000'],
  { stdio: 'pipe', shell: process.platform === 'win32' },
  'CLIENT'
);

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  serverProc.kill();
  clientProc.kill();
  process.exit(0);
});