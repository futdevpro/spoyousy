const { execSync } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const WEBOS_CLI_VERSION = '3.2.1';
const WEBOS_CLI_PACKAGE = '@webos/cli';

// Platform-specific paths
const PATHS = {
  win32: {
    sdk: 'C:\\Program Files\\webOS TV SDK',
    cli: 'C:\\Program Files\\webOS TV SDK\\CLI\\bin'
  },
  darwin: {
    sdk: '/opt/webOS_TV_SDK',
    cli: '/opt/webOS_TV_SDK/CLI/bin'
  },
  linux: {
    sdk: '/opt/webOS_TV_SDK',
    cli: '/opt/webOS_TV_SDK/CLI/bin'
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

// Check if WebOS CLI is installed and handle setup if needed
async function checkWebOSCLI(interactive = true) {
  try {
    // Check for old CLI first
    try {
      execSync('ares-cli -V', { stdio: 'ignore' });
      console.log('Found old @webosose/ares-cli installation');
      if (interactive) {
        const shouldSetup = await askQuestion('Would you like to update to the new CLI now? (y/n): ');
        if (shouldSetup) {
          await setup();
          return true;
        } else {
          printSetupInstructions();
          return false;
        }
      }
      return 'old';
    } catch {
      // Ignore error, continue to check new CLI
    }

    // Check for new CLI
    execSync('ares -V', { stdio: 'ignore' });
    return true;
  } catch {
    if (interactive) {
      console.error('Error: WebOS CLI not found.');
      const shouldSetup = await askQuestion('Would you like to run the setup script now? (y/n): ');
      if (shouldSetup) {
        await setup();
        return true;
      } else {
        printSetupInstructions();
        return false;
      }
    }
    return false;
  } finally {
    if (interactive) {
      rl.close();
    }
  }
}

// Install WebOS CLI
function installWebOSCLI() {
  console.log('Installing WebOS CLI...');
  try {
    // First uninstall any existing ares-cli
    try {
      execSync('npm uninstall -g @webosose/ares-cli', { stdio: 'ignore' });
      console.log('Removed old @webosose/ares-cli');
    } catch {
      // Ignore errors if not installed
    }

    // Install the new CLI
    execSync('npm install -g @webos-tools/cli', { stdio: 'inherit' });
    console.log('✅ WebOS CLI installed.');
    return true;
  } catch (error) {
    console.error('❌ Failed to install WebOS CLI:', error.message);
    return false;
  }
}

// Add WebOS SDK to PATH
function addToPath() {
  const platform = os.platform();
  const paths = PATHS[platform];
  
  if (!paths) {
    console.error('❌ Unsupported platform:', platform);
    return false;
  }

  // Check if SDK directory exists
  if (!fs.existsSync(paths.sdk)) {
    console.error('❌ WebOS SDK not found at:', paths.sdk);
    console.error('Please install WebOS TV SDK from:');
    console.error('https://webostv.developer.lge.com/sdk/installation/');
    return false;
  }

  // Add to PATH
  const pathVar = process.env.PATH || '';
  if (!pathVar.includes(paths.cli)) {
    console.log('Adding WebOS SDK to PATH...');
    process.env.PATH = `${paths.cli}${path.delimiter}${pathVar}`;
    console.log('✅ WebOS SDK path added.');
  }

  return true;
}

// Print setup instructions
function printSetupInstructions() {
  console.log('\n📋 Manual Setup Instructions:');
  console.log('1. Install WebOS CLI:');
  console.log('   - Run: npm uninstall -g @webosose/ares-cli');
  console.log('   - Run: npm install -g @webos-tools/cli');
  console.log('\n2. Configure your device:');
  console.log('   - Enable Developer Mode on your WebOS TV');
  console.log('   - Note down the IP address and passphrase');
  console.log('   - Run: ares-setup-device');
  console.log('\n3. After setup:');
  console.log('   - Close and reopen your terminal');
  console.log('   - Run: pnpm run build-webos');
  console.log('   - Run: pnpm run package-webos');
  console.log('   - Run: pnpm run install:webos');
  console.log('\n📝 Note: The new WebOS CLI supports all platform versions.');
  console.log('   For more information, visit:');
  console.log('   https://webostv.developer.lge.com/develop/tools/sdk-introduction');
}

// Main setup function
async function setup() {
  console.log('Setting up WebOS development environment...');

  // Install WebOS CLI
  if (!installWebOSCLI()) {
    printSetupInstructions();
    return false;
  }

  // Add SDK to PATH
  if (!addToPath()) {
    printSetupInstructions();
    return false;
  }

  console.log('✅ WebOS development environment setup completed!');
  console.log('\n⚠️  Important: Please close and reopen your terminal to ensure the PATH changes take effect.');
  console.log('\nNext steps:');
  console.log('1. Run "pnpm run build-webos" to build your app');
  console.log('2. Run "pnpm run package-webos" to package your app');
  console.log('3. Run "pnpm run install:webos" to install your app on the device');

  return true;
}

// Export functions for use in other scripts
module.exports = {
  checkWebOSCLI,
  installWebOSCLI,
  addToPath,
  setup,
  printSetupInstructions
};

// Run setup if this script is executed directly
if (require.main === module) {
  setup().then(success => {
    if (!success) {
      process.exit(1);
    }
  });
} 