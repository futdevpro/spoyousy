const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { minify } = require('terser');

// Files that should skip minification
const SKIP_MINIFY = [
  'server/chunks/826.js',
  'server/chunks/font-manifest.json'
];

// Minify JavaScript files
async function minifyFiles() {
  console.log('Minifying JavaScript files...');
  const distDir = path.join(__dirname, '..', 'dist');

  // Get all JavaScript files recursively
  function getJsFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(getJsFiles(file));
      } else if (file.endsWith('.js')) {
        const relativePath = path.relative(distDir, file);
        if (!SKIP_MINIFY.includes(relativePath.replace(/\\/g, '/'))) {
          results.push(file);
        }
      }
    });
    return results;
  }

  const jsFiles = getJsFiles(distDir);

  // Minify each file
  for (const file of jsFiles) {
    try {
      const code = fs.readFileSync(file, 'utf8');
      const result = await minify(code, {
        compress: {
          ecma: 5,
          keep_fnames: true,
          keep_classnames: true
        },
        mangle: {
          keep_fnames: true,
          keep_classnames: true
        },
        format: {
          ecma: 5
        }
      });

      if (result.code) {
        fs.writeFileSync(file, result.code);
      }
    } catch (error) {
      console.warn(`Warning: Could not minify ${file}:`, error.message);
    }
  }
}

// Package the app
async function packageApp() {
  try {
    // Run build first
    execSync('pnpm run build:webos', { stdio: 'inherit' });

    // Minify files
    await minifyFiles();

    // Run ares-package with --no-minify flag
    execSync('ares-package dist --no-minify', { stdio: 'inherit' });

    console.log('✅ Successfully packaged WebOS app');
  } catch (error) {
    console.error('❌ Error packaging app:', error);
    process.exit(1);
  }
}

// Run packaging process
packageApp(); 