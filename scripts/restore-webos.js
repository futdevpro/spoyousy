const fs = require('fs');
const path = require('path');

// Files that should skip minification
const SKIP_MINIFY = [
  'server/chunks/826.js',
  'server/chunks/font-manifest.json'
];

// Restore files that should skip minification
function restoreSkipMinifyFiles() {
  console.log('Restoring files that should skip minification...');
  const distDir = path.join(__dirname, '..', 'dist');
  const tempDir = path.join(__dirname, '..', '.temp-skip-minify');

  // Restore each file that should skip minification
  SKIP_MINIFY.forEach(file => {
    const sourcePath = path.join(tempDir, file);
    const destPath = path.join(distDir, file);

    // Restore file if it exists
    if (fs.existsSync(sourcePath)) {
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(sourcePath, destPath);
    }
  });

  // Clean up temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });
}

// Run restore process
try {
  restoreSkipMinifyFiles();
  console.log('✅ Successfully restored files that should skip minification');
} catch (error) {
  console.error('❌ Error restoring files:', error);
  process.exit(1);
} 