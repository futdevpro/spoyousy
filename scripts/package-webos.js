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
  console.log('🌀 [Minify] Starting JavaScript minification for WebOS package...');
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
  console.log('✅ [Minify] JavaScript minification completed for WebOS package.');
}

// Package the app
async function packageApp() {
  try {
    // Build first
    console.log('🚧 Building Next.js app before packaging...');
    execSync('pnpm run build:webos', { stdio: 'inherit' });
    console.log('✅ Next.js build completed.');

    // Minify files
    await minifyFiles();

    // Read appId from dist/appinfo.json and version from package.json
    const distDir = path.join(__dirname, '..', 'dist');
    const appInfoPath = path.join(distDir, 'appinfo.json');
    let appId = 'app';
    if (fs.existsSync(appInfoPath)) {
      const appInfo = JSON.parse(fs.readFileSync(appInfoPath, 'utf8'));
      appId = appInfo.id || appId;
    }
    // Read version from package.json
    const pkg = require('../package.json');
    const version = pkg.version || '0.0.0';
    // Optionally update dist/appinfo.json with the correct version
    if (fs.existsSync(appInfoPath)) {
      const appInfo = JSON.parse(fs.readFileSync(appInfoPath, 'utf8'));
      if (appInfo.version !== version) {
        appInfo.version = version;
        fs.writeFileSync(appInfoPath, JSON.stringify(appInfo, null, 2));
        console.log(`🔄 [Version Sync] Updated dist/appinfo.json version to ${version}`);
      }
    }
    // Use a root-level 'ipks' directory for all IPK files
    const ipkDir = 'ipks';
    if (!fs.existsSync(ipkDir)) {
      fs.mkdirSync(ipkDir, { recursive: true });
      console.log(`📁 [IPK Output] Created root-level IPK output directory: ${ipkDir}`);
    }
    const ipkName = `${appId}_${version}_all`;
    const ipkFile = path.join(ipkDir, `${ipkName}.ipk`);
    // If a directory with the same name as the intended IPK file exists, remove it
    if (fs.existsSync(ipkFile) && fs.lstatSync(ipkFile).isDirectory()) {
      fs.rmSync(ipkFile, { recursive: true, force: true });
      console.log(`🧹 [IPK Output] Removed directory with conflicting IPK file name: ${ipkFile}`);
    }

    // Run ares-package with --no-minify flag and output directory only
    // --no-minify: We run our own minification step (minifyFiles), so we do not want ares-package to minify again.
    // -o: Specifies the output directory for the generated .ipk package.
    console.log(`📦 [Packaging] Packaging the application to directory: ${ipkDir}...`);
    execSync(`ares-package dist --no-minify -o ${ipkDir}`, { stdio: 'inherit' });
    console.log('✅ [Packaging] WebOS app packaging step completed.');

    console.log('🎉 [Packaging] Successfully created WebOS IPK package in ipks directory.');
  } catch (error) {
    console.error('❌ Error packaging app:', error);
    process.exit(1);
  }
}

// Run packaging process
packageApp(); 