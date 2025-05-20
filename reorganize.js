// Reorganize TerraFusionProfessional codebase to monorepo structure
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const sourceDir = __dirname;
const packagesDir = path.join(sourceDir, 'packages');

// Create directory structure if not exists
const dirs = [
  'packages/client/src/components',
  'packages/client/src/pages',
  'packages/client/src/hooks',
  'packages/client/src/api',
  'packages/client/src/lib',
  'packages/server/src/routes',
  'packages/shared/src',
];

dirs.forEach(dir => {
  const fullPath = path.join(sourceDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${fullPath}`);
  }
});

// Copy client files
console.log('Copying client files...');
copyDir('client/src/components', 'packages/client/src/components');
copyDir('client/src/pages', 'packages/client/src/pages');
copyDir('client/src/hooks', 'packages/client/src/hooks');
copyDir('client/src/api', 'packages/client/src/api');
copyDir('client/src/lib', 'packages/client/src/lib');
copyFile('client/src/App.tsx', 'packages/client/src/App.tsx');
copyFile('client/src/main.tsx', 'packages/client/src/main.tsx');
copyFile('client/src/index.css', 'packages/client/src/index.css');
copyFile('client/src/types.ts', 'packages/client/src/types.ts');
copyFile('client/vite.config.js', 'packages/client/vite.config.js');
copyFile('client/tailwind.config.js', 'packages/client/tailwind.config.js');
copyFile('client/index.html', 'packages/client/index.html');

// Copy server files
console.log('Copying server files...');
copyDir('server/routes', 'packages/server/src/routes');
copyFile('server/index.js', 'packages/server/src/index.js');
copyFile('server/db.ts', 'packages/server/src/db.ts');
copyFile('server/storage.ts', 'packages/server/src/storage.ts');
copyFile('server/init-db.ts', 'packages/server/src/init-db.ts');

// Copy shared files
console.log('Copying shared files...');
copyFile('shared/schema.ts', 'packages/shared/src/schema.ts');
copyFile('shared/terrainsight-schema.ts', 'packages/shared/src/terrainsight-schema.ts');

// Utility functions
function copyDir(source, destination) {
  try {
    const fullSourcePath = path.join(sourceDir, source);
    const fullDestPath = path.join(sourceDir, destination);
    
    if (!fs.existsSync(fullSourcePath)) {
      console.log(`Source directory doesn't exist: ${fullSourcePath}`);
      return;
    }
    
    if (!fs.existsSync(fullDestPath)) {
      fs.mkdirSync(fullDestPath, { recursive: true });
    }
    
    const files = fs.readdirSync(fullSourcePath);
    
    files.forEach(file => {
      const srcFile = path.join(fullSourcePath, file);
      const destFile = path.join(fullDestPath, file);
      
      if (fs.statSync(srcFile).isDirectory()) {
        copyDir(path.join(source, file), path.join(destination, file));
      } else {
        fs.copyFileSync(srcFile, destFile);
        console.log(`Copied ${srcFile} to ${destFile}`);
      }
    });
  } catch (err) {
    console.error(`Error copying directory ${source} to ${destination}:`, err);
  }
}

function copyFile(source, destination) {
  try {
    const fullSourcePath = path.join(sourceDir, source);
    const fullDestPath = path.join(sourceDir, destination);
    
    if (!fs.existsSync(fullSourcePath)) {
      console.log(`Source file doesn't exist: ${fullSourcePath}`);
      return;
    }
    
    const destDir = path.dirname(fullDestPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.copyFileSync(fullSourcePath, fullDestPath);
    console.log(`Copied ${fullSourcePath} to ${fullDestPath}`);
  } catch (err) {
    console.error(`Error copying file ${source} to ${destination}:`, err);
  }
}

console.log('TerraFusionProfessional monorepo structure reorganization complete!');