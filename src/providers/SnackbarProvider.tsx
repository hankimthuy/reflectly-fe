import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import SnackbarComponent, { type SnackbarType } from '../components/Snackbar/Snackbar';
import { RATE_LIMITED_EVENT } from '../services/axiosSetup';

interface SnackbarContextValue {
  showSnackbar: (message: string, type: SnackbarType, duration?: number, title?: string) => void;
}

interface SnackbarState {
  open: boolean;
  message: string;
  title?: string;
  type: SnackbarType;
  duration?: number;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export const useSnackbar = (): SnackbarContextValue => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    type: 'info',
  });

  const showSnackbar = useCallback((message: string, type: SnackbarType, duration?: number, title?: string) => {
    setSnackbar({ open: true, message, title, type, duration });
  }, []);

  const handleClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // Surfaces 429 (rate-limit/quota) responses from any API call app-wide — axiosSetup dispatches
  // this as a plain DOM event since it has no React context of its own to call showSnackbar from.
  useEffect(() => {
    const handleRateLimited = (event: Event) => {
      const detail = (event as CustomEvent<{ message: string }>).detail;
      showSnackbar(detail.message, 'warning', 6000);
    };
    window.addEventListener(RATE_LIMITED_EVENT, handleRateLimited);
    return () => window.removeEventListener(RATE_LIMITED_EVENT, handleRateLimited);
  }, [showSnackbar]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        title={snackbar.title}
        type={snackbar.type}
        onClose={handleClose}
        autoHideDuration={snackbar.duration}
      />
    </SnackbarContext.Provider>
  );
};

