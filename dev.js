// Development server runner for TerraFusionProfessional DevOps platform
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting TerraFusionProfessional DevOps platform...');
console.log('- Backend will be available at: http://localhost:3000/api');
console.log('- Frontend will be available at: http://localhost:5000');

// Build shared package first
console.log('Building shared package...');
const buildShared = spawn('npx', ['tsc'], {
  cwd: path.join(__dirname, 'packages/shared'),
  stdio: 'inherit'
});

buildShared.on('exit', (code) => {
  if (code !== 0) {
    console.error('Failed to build shared package');
    process.exit(1);
  }

  console.log('Successfully built shared package');
  
  // Start the Express server
  let server = spawn('node', ['packages/server/src/index.js'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: 3000 }
  });

  // Give the server a moment to start up
  setTimeout(() => {
    // Start the Vite client development server
    let client = spawn('npx', ['vite', '--port', '5000', '--host', '0.0.0.0'], {
      cwd: path.join(__dirname, 'packages/client'),
      stdio: 'inherit'
    });

    // Handle client errors
    client.on('error', (err) => {
      console.error('Client error:', err);
    });

    // Handle client exits
    client.on('exit', (code) => {
      console.log(`Client process exited with code ${code}`);
      if (code !== 0 && code !== null) {
        console.error('Client process crashed, restarting...');
        setTimeout(() => {
          client = spawn('npx', ['vite', '--port', '5000', '--host', '0.0.0.0'], {
            cwd: path.join(__dirname, 'packages/client'),
            stdio: 'inherit'
          });
        }, 1000);
      }
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('Shutting down...');
      server.kill('SIGINT');
      client.kill('SIGINT');
      process.exit(0);
    });
  }, 2000);

  // Handle server errors
  server.on('error', (err) => {
    console.error('Server error:', err);
  });

  // Handle server exits
  server.on('exit', (code) => {
    console.log(`Server process exited with code ${code}`);
    if (code !== 0 && code !== null) {
      console.error('Server process crashed, restarting...');
      setTimeout(() => {
        server = spawn('node', ['packages/server/src/index.js'], {
          stdio: 'inherit',
          env: { ...process.env, PORT: 3000 }
        });
      }, 1000);
    }
  });
});