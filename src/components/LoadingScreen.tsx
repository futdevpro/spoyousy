import React from 'react';
import Image from 'next/image';
import styles from './LoadingScreen.module.css';

/**
 * LoadingScreen component displays a branded loading overlay with app name and version.
 * @param version - The app version to display
 * @param appName - The app name to display
 */
interface LoadingScreenProps {
  version: string;
  appName: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ version, appName }) => (
  <div className={styles.overlay}>
    <div className={styles.center}>
      <Image src="/src/assets/icon.png" alt="App Logo" width={128} height={128} className={styles.logo} />
      <div className={styles.appName}>{appName}</div>
      <div className={styles.spinner}></div>
      <div className={styles.text}>Loading...</div>
      <div className={styles.version}>v{version}</div>
    </div>
  </div>
);

export default LoadingScreen; 