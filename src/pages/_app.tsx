import React, { useEffect, ReactNode } from 'react';
import type { AppProps } from 'next/app';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { store } from '@/store';
import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from '@/components/LoadingScreen';
import { RootState } from '@/store';
import { setLoading, setGlobalError, clearGlobalError } from '@/store/slices/appSlice';

interface ErrorBoundaryProps {
  dispatch: any;
  children: ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    this.props.dispatch(setGlobalError(error?.message || 'Unexpected error'));
  }
  render() {
    return this.props.children;
  }
}

function AppContent({ Component, pageProps }: AppProps) {
  const loading = useSelector((state: RootState) => state.app.loading);
  const globalError = useSelector((state: RootState) => state.app.globalError);
  const dispatch = useDispatch();
  const { version, name: appName } = require('../../package.json');

  useEffect(() => {
    const startup = async () => {
      dispatch(setLoading(true));
      try {
        // Simulate startup tasks (e.g., check auth, fetch user, init APIs)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // If you have real startup logic, place it here
      } catch (err: any) {
        dispatch(setGlobalError(err?.message || 'Unknown startup error'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    startup();
  }, [dispatch]);

  useEffect(() => {
    if (globalError) {
      toast.error(globalError);
      dispatch(clearGlobalError());
    }
  }, [globalError, dispatch]);

  return (
    <>
      {loading && <LoadingScreen version={version} appName={appName} />}
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
  return (
    <Provider store={store}>
      <ErrorBoundary dispatch={store.dispatch}>
        <AppContent {...props} />
      </ErrorBoundary>
    </Provider>
  );
} 