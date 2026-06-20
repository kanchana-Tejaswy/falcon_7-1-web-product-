const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');

// Remove existing dist directory to ensure a clean build
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
  console.log('Cleaned existing dist/ directory.');
}
fs.mkdirSync(distDir, { recursive: true });

// Helper to copy files/folders recursively
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Files and folders to copy
const itemsToCopy = ['index.html', 'css', 'js', 'assets', 'hero'];

itemsToCopy.forEach(item => {
  const srcPath = path.join(__dirname, '..', item);
  const destPath = path.join(distDir, item);
  if (fs.existsSync(srcPath)) {
    console.log(`Copying ${item} to dist...`);
    copyRecursiveSync(srcPath, destPath);
  } else {
    console.warn(`Warning: ${item} does not exist at ${srcPath}`);
  }
});

console.log('Build complete! Files successfully copied to dist/.');
