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
  console.log('Building Next.js app...');
  try {
    execSync('pnpm run build', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error building Next.js app:', error);
    process.exit(1);
  }
}

// Copy WebOS files
function copyWebOSFiles() {
  console.log('Copying WebOS files...');
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
    console.log('Custom icon.png copied from src/assets/icon.png');
  } else {
    console.warn('Custom icon.png not found at src/assets/icon.png');
  }
}

// Copy Next.js build output
function copyNextBuild() {
  console.log('Copying Next.js build output...');
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
}

// Copy files that should skip minification to a temporary directory
function copySkipMinifyFiles() {
  console.log('Copying files that should skip minification...');
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
}

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

// Main build process
async function build() {
  try {
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

    console.log('WebOS build completed successfully!');
    console.log('To package the app, run: pnpm run package:webos');
    console.log('To install the app, run: pnpm run install:webos');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build(); 