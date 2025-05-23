const { spawn } = require('child_process');
const path = require('path');

function spawnProcess(command, args, options, name) {
  const proc = spawn(command, args, options);
  
  console.log(`[${name}] Starting process...`);
  
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

function startServer() {
  return spawnProcess(
    'node',
    ['server/index.js'],
    { stdio: ['inherit', 'pipe', 'pipe'] },
    'SERVER'
  );
}

function startClient() {
  return spawnProcess(
    'npm',
    ['run', 'dev'],
    { cwd: path.join(process.cwd(), 'client'), stdio: ['inherit', 'pipe', 'pipe'] },
    'CLIENT'
  );
}

// Start both processes
const serverProcess = startServer();
const clientProcess = startClient();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down processes...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit(0);
});