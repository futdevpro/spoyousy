import React, { useEffect } from 'react';
import Image from 'next/image';
import styles from './LoadingScreen.module.css';
import icon from '../assets/icon.png';

/**
 * LoadingScreen component displays a branded loading overlay with app name, version, and build timestamp.
 * @param version - The app version to display
 * @param appName - The app name to display
 * @param buildTimestamp - The build timestamp to display
 */
interface LoadingScreenProps {
  version: string;
  appName: string;
  buildTimestamp: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ version, appName, buildTimestamp }) => {
  useEffect(() => {
    console.log('🎬 LoadingScreen component mounted with configuration:', { version, appName, buildTimestamp });
  }, [version, appName, buildTimestamp]);

  console.log('🎨 Rendering LoadingScreen UI components');
  console.log('🖼️ Initializing logo image loading process');

  return (
    <div className={styles.overlay}>
      <div className={styles.center}>
        <Image 
          src={icon}
          alt="App Logo" 
          width={128} 
          height={128} 
          className={styles.logo}
          onLoad={() => console.log('✨ Logo image loaded and displayed successfully')}
          onError={(e) => console.error('💥 Logo image loading failed:', e)}
        />
        <div className={styles.appName}>{appName}</div>
        <div className={styles.spinner}></div>
        <div className={styles.text}>Loading...</div>
        <div className={styles.version}>v{version}</div>
        {buildTimestamp && <div className={styles.timestamp}>{buildTimestamp}</div>}
      </div>
    </div>
  );
};

export default LoadingScreen; 