import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import SnackbarComponent, { type SnackbarType } from '../components/Snackbar/Snackbar';

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

  const showSnackbar = useCallback((message: string, type: SnackbarType, duration = 3000, title?: string) => {
    setSnackbar({ open: true, message, title, type, duration });
  }, []);

  const handleClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

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

