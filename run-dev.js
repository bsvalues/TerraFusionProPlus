const { spawn } = require('child_process');

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
    if (name === 'SERVER' && code !== 0) {
      console.log('Server crashed, restarting...');
      startServer();
    }
  });
  
  return proc;
}

function startServer() {
  return spawnProcess(
    'node',
    ['server/server.js'],
    { stdio: 'pipe', shell: process.platform === 'win32' },
    'SERVER'
  );
}

// Start both server and client
const serverProc = startServer();
const clientProc = spawnProcess(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['vite', '--config', 'client/vite.config.ts', 'client'],
  { stdio: 'pipe', shell: process.platform === 'win32', cwd: process.cwd() },
  'CLIENT'
);

// Handle graceful shutdown
const shutdown = () => {
  console.log('Shutting down all processes...');
  if (serverProc && !serverProc.killed) serverProc.kill();
  if (clientProc && !clientProc.killed) clientProc.kill();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);