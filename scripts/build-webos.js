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

// Build Angular app
function buildAngularApp() {
  console.log('🛠️ [Build] Starting Angular build for WebOS...');
  try {
    execSync('pnpm run build', { stdio: 'inherit' });
    console.log('✅ [Build] Angular build for WebOS completed.');
  } catch (error) {
    console.error('❌ [Build] Error building Angular app for WebOS:', error);
    process.exit(1);
  }
}

// Copy WebOS files
function copyWebOSFiles() {
  console.log('📁 [Copy] Copying WebOS files to dist...');
  const webosDir = path.join(__dirname, '..', 'webos');
  const distDir = path.join(__dirname, '..', 'dist', 'spoyousy');

  // Create dist directory if it doesn't exist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
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

// Main build process
async function build() {
  try {
    console.log('🚀 [Build] Starting full WebOS build process...');
    // Check WebOS CLI and handle setup if needed
    const cliStatus = await checkWebOSCLI(true);
    if (!cliStatus) {
      process.exit(1);
    }

    // Build Angular app
    buildAngularApp();

    // Copy WebOS files
    copyWebOSFiles();

    console.log('✅ [Build] Full WebOS build process completed!');
    console.log('To package the app, run: pnpm run package-webos');
    console.log('To install the app, run: pnpm run install-webos');
  } catch (error) {
    console.error('❌ [Build] Build process failed:', error);
    process.exit(1);
  }
}

build(); 