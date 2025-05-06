const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');
const readline = require('readline');

// Import setup functions
const { checkWebOSCLI, setup, printSetupInstructions } = require('./setup-webos');

// Platform-specific copy commands
const PLATFORM = {
  win32: {
    copy: (src, dest) => `xcopy /E /I /Y "${src}" "${dest}"`
  },
  darwin: {
    copy: (src, dest) => `cp -r "${src}"/* "${dest}"`
  },
  linux: {
    copy: (src, dest) => `cp -r "${src}"/* "${dest}"`
  }
};

// Files that should skip minification
const SKIP_MINIFY = [
  'server/chunks/826.js',
  'server/chunks/font-manifest.json'
];

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask user for confirmation
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Build Next.js app
function buildNextApp() {
  console.log('🛠️ [Build] Starting Next.js build for WebOS...');
  try {
    execSync('pnpm run build', { stdio: 'inherit' });
    console.log('✅ [Build] Next.js build for WebOS completed.');
  } catch (error) {
    console.error('❌ [Build] Error building Next.js app for WebOS:', error);
    process.exit(1);
  }
}

// Copy WebOS files
function copyWebOSFiles() {
  console.log('📁 [Copy] Copying WebOS files to dist...');
  const webosDir = path.join(__dirname, '..', 'webos');
  const distDir = path.join(__dirname, '..', 'dist');

  // Create dist directory if it doesn't exist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  // Get platform-specific copy command
  const platform = os.platform();
  const platformConfig = PLATFORM[platform];
  
  if (!platformConfig) {
    console.error('❌ Unsupported platform:', platform);
    process.exit(1);
  }

  // Copy WebOS files using platform-specific command
  try {
    execSync(platformConfig.copy(webosDir, distDir), { stdio: 'inherit' });
  } catch (error) {
    console.error('Error copying WebOS files:', error);
    process.exit(1);
  }

  // Always copy custom icon from src/assets/icon.png
  const customIconSrc = path.join(__dirname, '..', 'src', 'assets', 'icon.png');
  const iconDest = path.join(distDir, 'icon.png');
  if (fs.existsSync(customIconSrc)) {
    fs.copyFileSync(customIconSrc, iconDest);
    console.log('🖼️ [Copy] Custom icon.png copied from src/assets/icon.png to dist.');
  } else {
    console.warn('⚠️ [Copy] Custom icon.png not found at src/assets/icon.png');
  }

  console.log('✅ [Copy] WebOS files copied to dist.');
}

// Copy Next.js build output
function copyNextBuild() {
  console.log('📁 [Copy] Copying Next.js build output to dist...');
  const nextDir = path.join(__dirname, '..', '.next');
  const distDir = path.join(__dirname, '..', 'dist');

  // Create dist directory if it doesn't exist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  // Get platform-specific copy command
  const platform = os.platform();
  const platformConfig = PLATFORM[platform];

  // Copy Next.js build output using platform-specific command
  try {
    execSync(platformConfig.copy(nextDir, distDir), { stdio: 'inherit' });
  } catch (error) {
    console.error('Error copying Next.js build output:', error);
    process.exit(1);
  }

  console.log('✅ [Copy] Next.js build output copied to dist.');
}

// Copy files that should skip minification to a temporary directory
function copySkipMinifyFiles() {
  console.log('📁 [Copy] Copying files that should skip minification to temp...');
  const distDir = path.join(__dirname, '..', 'dist');
  const tempDir = path.join(__dirname, '..', '.temp-skip-minify');

  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  // Copy each file that should skip minification
  SKIP_MINIFY.forEach(file => {
    const sourcePath = path.join(distDir, file);
    const destPath = path.join(tempDir, file);
    const destDir = path.dirname(destPath);

    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Copy file if it exists
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
    }
  });

  console.log('✅ [Copy] Skip-minify files copied to temp.');
}

// Restore files that should skip minification
function restoreSkipMinifyFiles() {
  console.log('♻️ [Restore] Restoring files that should skip minification from temp...');
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

  console.log('✅ [Restore] Skip-minify files restored from temp.');
}

// Main build process
async function build() {
  try {
    console.log('🚀 [Build] Starting full WebOS build process...');
    // Check WebOS CLI and handle setup if needed
    const cliStatus = await checkWebOSCLI(true);
    if (!cliStatus) {
      process.exit(1);
    }

    // Build Next.js app
    buildNextApp();

    // Copy WebOS files
    copyWebOSFiles();

    // Copy Next.js build output
    copyNextBuild();

    // Copy files that should skip minification
    copySkipMinifyFiles();

    // Restore files that should skip minification
    restoreSkipMinifyFiles();

    console.log('✅ [Build] Full WebOS build process completed!');
    console.log('To package the app, run: pnpm run package-webos');
    console.log('To install the app, run: pnpm run install-webos');
  } catch (error) {
    console.error('❌ [Build] Build process failed:', error);
    process.exit(1);
  }
}

build(); 