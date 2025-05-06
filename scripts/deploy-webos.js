const DEVICE_NAME = "mytv";
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Log that we're following the rules
console.log('📋 [Rules] Following deployment rules and best practices...');

async function checkDeviceConnection() {
  try {
    console.log(`🔍 [Device] Checking connection to device "${DEVICE_NAME}"...`);
    
    // First check if device exists in ares-device list
    const deviceList = execSync('ares-setup-device --list').toString();
    if (!deviceList.includes(DEVICE_NAME)) {
      console.error(`❌ [Device] Device "${DEVICE_NAME}" not found in device list.`);
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
      return false;
    }

    // Then check if we can connect to the device
    try {
      execSync(`ares-device -i --device ${DEVICE_NAME}`, { stdio: 'pipe' });
      console.log(`✅ [Device] Successfully connected to device "${DEVICE_NAME}"`);
      return true;
    } catch {
      console.error(`❌ [Device] Could not connect to device "${DEVICE_NAME}".`);
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
  } catch (error) {
    console.error(`❌ [Device] Error checking device connection:`, error.message);
    return false;
  }
}

async function deployAndLaunch() {
  try {
    console.log('🚀 Starting WebOS deployment process...');

    // Package the app (includes build, minify, and package)
    console.log('📦 Packaging the application...');
    execSync('pnpm run package:webos', { stdio: 'inherit' });
    console.log('✅ Package step completed.');

    // Read appId from dist/appinfo.json and version from package.json
    const distDir = path.join(process.cwd(), 'dist');
    const appInfoPath = path.join(distDir, 'appinfo.json');
    let appId = '';
    if (fs.existsSync(appInfoPath)) {
      const appInfo = JSON.parse(fs.readFileSync(appInfoPath, 'utf8'));
      appId = appInfo.id;
    }
    const pkg = require('../package.json');
    const version = pkg.version || '0.0.0';
    // Use the root-level 'ipks' directory for all IPK files
    const ipkDir = path.join(process.cwd(), 'ipks');
    const ipkName = `${appId}_${version}_all.ipk`;
    const ipkPath = path.join(ipkDir, ipkName);
    // Log the contents of the ipks directory
    if (fs.existsSync(ipkDir)) {
      const ipkFiles = fs.readdirSync(ipkDir);
      console.log(`📂 [Deploy] Contents of ipks directory before install:`, ipkFiles);
    } else {
      console.warn('⚠️ [Deploy] ipks directory does not exist!');
    }
    console.log(`📦 [Deploy] Using IPK file for install: ${ipkPath}`);

    // Check device connection before attempting deployment
    const isDeviceConnected = await checkDeviceConnection();
    if (!isDeviceConnected) {
      throw new Error('Device connection check failed. Please follow the troubleshooting steps above.');
    }

    // Check if app is already installed and uninstall if so
    if (appId) {
      try {
        console.log(`🔍 [Deploy] Checking if app ${appId} is installed...`);
        const listOutput = execSync(`ares-launch --device ${DEVICE_NAME} -r`).toString();
        if (listOutput.includes(appId)) {
          console.log(`🗑️ [Deploy] App ${appId} is already installed on ${DEVICE_NAME}. Uninstalling before install...`);
          execSync(`ares-install --device ${DEVICE_NAME} -r ${appId}`, { stdio: 'inherit' });
          console.log('✅ [Deploy] Uninstall step completed before install.');
        } else {
          console.log(`ℹ️ [Deploy] App ${appId} is not currently installed. No uninstall needed.`);
        }
      } catch (e) {
        console.warn('⚠️ [Deploy] Could not check/uninstall existing app:', e.message);
        if (e.stdout) {
          console.warn('⚠️ [Deploy] Uninstall check stdout:', e.stdout.toString());
        }
        if (e.stderr) {
          console.warn('⚠️ [Deploy] Uninstall check stderr:', e.stderr.toString());
        }
      }
    }

    // Deploy to device
    console.log(`📲 [Deploy] Installing IPK to WebOS device (${DEVICE_NAME})...`);
    execSync(`ares-install --device ${DEVICE_NAME} ${ipkPath}`, { stdio: 'inherit' });
    console.log('✅ [Deploy] Install step completed.');

    // Launch the app
    console.log('🚀 [Deploy] Launching the application on device...');
    if (appId) {
      execSync(`ares-launch --device ${DEVICE_NAME} ${appId}`, { stdio: 'inherit' });
      console.log('✅ [Deploy] Launch step completed.');
    }

    console.log('✅ Deployment and launch completed successfully!');
  } catch (error) {
    console.error('❌ Error during packaging and deployment:', error.message);
    process.exit(1);
  }
}

deployAndLaunch(); 