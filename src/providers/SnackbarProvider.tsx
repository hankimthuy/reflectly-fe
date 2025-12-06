import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import SnackbarComponent, { type SnackbarType } from '../components/Snackbar/Snackbar';

interface SnackbarContextValue {
  showSnackbar: (message: string, type: SnackbarType, duration?: number, title?: string) => void;
  showSuccess: (message: string, duration?: number, title?: string) => void;
  showError: (message: string, duration?: number, title?: string) => void;
  showWarning: (message: string, duration?: number, title?: string) => void;
  showInfo: (message: string, duration?: number, title?: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

interface SnackbarState {
  open: boolean;
  message: string;
  title?: string;
  type: SnackbarType;
  duration?: number;
}

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    type: 'info',
  });

  const showSnackbar = useCallback((message: string, type: SnackbarType, duration = 3000, title?: string) => {
    setSnackbar({
      open: true,
      message,
      title,
      type,
      duration,
    });
  }, []);

  const showSuccess = useCallback((message: string, duration?: number, title?: string) => {
    showSnackbar(message, 'success', duration, title);
  }, [showSnackbar]);

  const showError = useCallback((message: string, duration?: number, title?: string) => {
    showSnackbar(message, 'error', duration, title);
  }, [showSnackbar]);

  const showWarning = useCallback((message: string, duration?: number, title?: string) => {
    showSnackbar(message, 'warning', duration, title);
  }, [showSnackbar]);

  const showInfo = useCallback((message: string, duration?: number, title?: string) => {
    showSnackbar(message, 'info', duration, title);
  }, [showSnackbar]);

  const handleClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const contextValue: SnackbarContextValue = {
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <SnackbarContext.Provider value={contextValue}>
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

