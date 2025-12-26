import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import './Snackbar.scss';
import { Alert, Snackbar } from '@mui/material';
import Typography from '@mui/material/Typography';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

interface SnackbarProps {
  open: boolean;
  message: string;
  title?: string;
  type: SnackbarType;
  onClose: () => void;
  autoHideDuration?: number;
}

const SnackbarComponent: React.FC<SnackbarProps> = ({
  open,
  message,
  title,
  type,
  onClose,
  autoHideDuration,
}) => {
  const getColor = (type: SnackbarType): 'success' | 'danger' | 'warning' | 'primary' => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'primary';
      default:
        return 'primary';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
      default:
        return <InfoIcon />;
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      color={getColor(type)}
    >
      <Alert
        onClose={onClose}
        severity={type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        <div className="snackbar-content">
          {title && (
            <Typography
              className="snackbar-title"
              variant="h6"
              component="span"
            >
              {title}
            </Typography>
          )}
          <Typography
            className="snackbar-message"
            variant="body2"
            component="span"
          >
            {message}
          </Typography>
        </div>
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;

