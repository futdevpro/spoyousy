import React, { useEffect, ReactNode, useRef } from 'react';
import type { AppProps } from 'next/app';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { store } from '@/store';
import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from '@/components/LoadingScreen';
import { RootState } from '@/store';
import { setLoading, setGlobalError, clearGlobalError } from '@/store/slices/appSlice';

// Add WebOS type declaration with documented interface for WebOS system integration
declare global {
  interface Window {
    webOSSystem?: {
      /** Indicates if high contrast mode is enabled on the WebOS device */
      highContrast: boolean;
      /** Current screen orientation of the WebOS device */
      screenOrientation: string;
      /** Launch parameters passed to the WebOS application */
      launchParams: Record<string, any>;
      /** 
       * Registers a callback function to be executed when the WebOS application is closing
       * @param callback - Function to be called when the application is closing
       */
      onClose: (callback: () => void) => void;
      /** 
       * Fetches information about the current WebOS application
       * @returns Promise containing application ID and version
       */
      fetchAppInfo: () => Promise<{ id: string; version: string }>;
      /** 
       * Fetches network information of the WebOS device
       * @returns Promise containing the device's IP address
       */
      fetchNetworkInfo: () => Promise<{ ipAddress: string }>;
      /**
       * Plays a system sound on WebOS device
       * @param soundType - Type of system sound to play
       */
      playSystemSound?: (soundType: string) => void;
    };
  }
}

interface ErrorBoundaryProps {
  dispatch: any;
  children: ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    console.log('🚀 ErrorBoundary initialized');
  }
  static getDerivedStateFromError() {
    console.error('❌ ErrorBoundary caught an error');
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.error('❌ ErrorBoundary error details:', error);
    this.props.dispatch(setGlobalError(error?.message || 'Unexpected error'));
  }
  render() {
    console.log('🔄 ErrorBoundary rendering');
    return this.props.children;
  }
}

function AppContent({ Component, pageProps }: AppProps) {
  const loading = useSelector((state: RootState) => state.app.loading);
  const globalError = useSelector((state: RootState) => state.app.globalError);
  const dispatch = useDispatch();
  const { version, name: appName } = require('../../package.json');
  const buildTimestamp = new Date().toISOString();
  const startupSoundRef = useRef<HTMLAudioElement | null>(null);

  console.log('🚀 AppContent component initialized with configuration:', { version, appName, buildTimestamp });
  console.log('📊 Current application state:', { loading, globalError });

  const playStartupSound = () => {
    try {
      if (!startupSoundRef.current) {
        startupSoundRef.current = new Audio('/_next/static/chunks/start_hehe.mp3');
        // Set volume to 50% to avoid startling users
        startupSoundRef.current.volume = 0.5;
      }
      startupSoundRef.current.currentTime = 0;
      
      // Try to play with user interaction
      const playPromise = startupSoundRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('🔊 Autoplay prevented, waiting for user interaction:', error);
          // Add click listener to document to play sound on first interaction
          const playOnInteraction = () => {
            startupSoundRef.current?.play().catch(console.error);
            document.removeEventListener('click', playOnInteraction);
          };
          document.addEventListener('click', playOnInteraction);
        });
      }
      console.log('🔊 Playing startup sound');
    } catch (error) {
      console.error('🔊 Error initializing startup sound:', error);
    }
  };

  useEffect(() => {
    const startup = async () => {
      console.log('🎬 Starting application initialization sequence');
      dispatch(setLoading(true));
      try {
        console.log('🔍 Analyzing runtime environment configuration');
        
        // Play startup sound immediately
        playStartupSound();
        
        // Check if running on WebOS
        const isWebOS = typeof window !== 'undefined' && window.webOSSystem;
        console.log('🌐 Environment details:', {
          NODE_ENV: process.env.NODE_ENV,
          NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
          isWebOS,
          appId: process.env.NEXT_PUBLIC_WEBOS_APP_ID,
          webOSVersion: process.env.NEXT_PUBLIC_WEBOS_VERSION
        });

        if (isWebOS) {
          try {
            // Initialize WebOS specific features
            const appInfo = await window.webOSSystem?.fetchAppInfo();
            const networkInfo = await window.webOSSystem?.fetchNetworkInfo();
            console.log('📱 WebOS initialization successful:', { appInfo, networkInfo });
            
            // Set up WebOS close handler
            window.webOSSystem?.onClose(() => {
              console.log('👋 WebOS app closing');
              // Add any cleanup logic here
            });

            // Verify WebOS environment
            if (!appInfo?.id || !networkInfo?.ipAddress) {
              throw new Error('WebOS environment verification failed');
            }
          } catch (webOSError) {
            console.error('⚠️ WebOS initialization error:', webOSError);
            // Don't throw here, as the app should still work even if WebOS features fail
          }
        }

        // Simulate startup tasks (e.g., check auth, fetch user, init APIs)
        console.log('⚙️ Executing startup tasks and initializations');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('✅ All startup tasks completed successfully');
      } catch (err: any) {
        console.error('💥 Critical startup error encountered:', err);
        dispatch(setGlobalError(err?.message || 'Unknown startup error'));
      } finally {
        console.log('🏁 Application startup sequence completed');
        dispatch(setLoading(false));
      }
    };
    startup();
  }, [dispatch]);

  useEffect(() => {
    if (globalError) {
      console.error('⚠️ Global application error detected:', globalError);
      toast.error(globalError);
      dispatch(clearGlobalError());
    }
  }, [globalError, dispatch]);

  console.log('🎨 Rendering application content, loading state:', loading);

  if (loading) {
    console.log('⏳ Displaying loading screen interface');
  }
  console.log('📱 Rendering main application component');

  return (
    <>
      {loading && (
        <LoadingScreen version={version} appName={appName} buildTimestamp={buildTimestamp} />
      )}
      <Component {...pageProps} />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default function App(props: AppProps) {
  console.log('🚀 App component initializing');
  return (
    <Provider store={store}>
      <ErrorBoundary dispatch={store.dispatch}>
        <AppContent {...props} />
      </ErrorBoundary>
    </Provider>
  );
} 