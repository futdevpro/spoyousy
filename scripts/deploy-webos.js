const DEVICE_NAME = "mytv";
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function checkDeviceConnection() {
  try {
    console.log(`🔍 Checking connection to device "${DEVICE_NAME}"...`);
    execSync(`ares-device -i --device ${DEVICE_NAME}`, { stdio: 'pipe' });
    return true;
  } catch {
    console.error(`\n❌ Device connection error detected!`);
    console.error(`Could not connect to device named "${DEVICE_NAME}". Make sure it is set up with ares-setup-device and is online.`);
    console.error('\n📋 Physical TV Setup (Recommended):');
    console.error('1. On your WebOS TV:');
    console.error('   - Install "Developer Mode" app from LG Content Store');
    console.error('   - Create a developer account at https://webostv.developer.lge.com/');
    console.error('   - Note: You might need a new email/account due to LG\'s country-specific account restrictions');
    console.error('2. Enable Developer Mode:');
    console.error('   - Open Developer Mode app');
    console.error('   - Log in with your developer account');
    console.error('   - Toggle "Developer Mode" ON');
    console.error('   - Toggle "Key Server" ON');
    console.error('3. Configure TV connection:');
    console.error('   Run these commands in your terminal:');
    console.error(`   ares-setup-device --add ${DEVICE_NAME} --info "{ \"host\": \"<TV_IP>\", \"port\": 22, \"username\": \"prisoner\" }"`);
    console.error(`   ares-novacom --device ${DEVICE_NAME} --getkey`);
    console.error('\n📋 Simulator Setup (Alternative):');
    console.error('1. Install WebOS Studio extension in VSCode');
    console.error('2. Configure WebOS Studio:');
    console.error('   - Open WebOS Studio, and it will automatically ask for you to set the folder');
    console.error('3. Start the simulator:');
    console.error('   - Navigate to your given installation folder');
    console.error('   - Go to TV/Simulator/[version]/');
    console.error('   - Run the simulator executable');
    console.error('4. Configure the simulator connection:');
    console.error('   Run this command in your terminal:');
    console.error('   ares-setup-device --add simulator --info "{ \"host\": \"127.0.0.1\", \"port\": 6622, \"username\": \"prisoner\", \"privateKey\": \"~/.webos-sdks/privatekey.pem\" }"');
    console.error('\n📋 Troubleshooting steps:');
    console.error('1. For Physical TV:');
    console.error('   - Ensure TV and computer are on the same network');
    console.error('   - Verify TV IP address is correct');
    console.error('   - Check if Developer Mode is properly enabled');
    console.error('   - Try restarting the TV');
    console.error('2. For Simulator:');
    console.error('   - Make sure the simulator is running');
    console.error('   - Check if the simulator is properly initialized');
    console.error('   - Verify simulator settings (port 6622)');
    console.error('   - Check for firewall issues');
    console.error('\n💡 If the issue persists:');
    console.error('- Try running: ares-setup-device');
    console.error('- Check WebOS CLI installation: ares-package --version');
    console.error('- Ensure WebOS IDE is properly installed and configured');
    console.error('\n⚠️ Note: The simulator solution is temporary and may not work reliably.');
    console.error('   For production development, it is recommended to use a physical WebOS TV.\n');
    return false;
  }
}

async function deployAndLaunch() {
  try {
    console.log('🚀 Starting WebOS packaging and deployment process...');

    // Run the build script first
    console.log('📦 Building the application...');
    execSync('pnpm run build:webos', { stdio: 'inherit' });

    // Package the app
    console.log('📦 Packaging the application...');
    execSync('pnpm run package:webos', { stdio: 'inherit' });

    // Find the IPK file in root or dist directory
    const rootDir = process.cwd();
    const distDir = path.join(rootDir, 'dist');
    
    // Look for IPK files in both directories
    const rootIpkFiles = fs.readdirSync(rootDir).filter(file => file.endsWith('.ipk'));
    const distIpkFiles = fs.existsSync(distDir) ? fs.readdirSync(distDir).filter(file => file.endsWith('.ipk')) : [];
    
    const ipkFiles = [...rootIpkFiles, ...distIpkFiles];

    if (ipkFiles.length === 0) {
      throw new Error('No IPK file found in root or dist directory');
    }

    // Use the first IPK file found
    const ipkPath = path.join(rootDir, ipkFiles[0]);
    console.log(`📦 Found IPK file: ${ipkFiles[0]}`);

    // Check device connection before attempting deployment
    const isDeviceConnected = await checkDeviceConnection();
    if (!isDeviceConnected) {
      throw new Error('Device connection check failed. Please follow the troubleshooting steps above.');
    }

    // Deploy to device
    console.log(`📱 Deploying to WebOS device (${DEVICE_NAME})...`);
    execSync(`ares-install --device ${DEVICE_NAME} ${ipkPath}`, { stdio: 'inherit' });

    // Launch the app
    //console.log('🚀 Launching the application...');
    //const appId = require('../dist/appinfo.json').id;
    //execSync(`ares-launch ${appId}`, { stdio: 'inherit' });

    console.log('✅ Deployment completed successfully!');
  } catch (error) {
    console.error('❌ Error during packaging and deployment:', error.message);
    process.exit(1);
  }
}

deployAndLaunch(); 