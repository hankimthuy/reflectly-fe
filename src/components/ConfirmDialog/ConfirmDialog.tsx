import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

export interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmColor = 'primary',
    onConfirm,
    onCancel,
    loading = false,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
        >
            <DialogTitle id="confirm-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="inherit" disabled={loading}>
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    color={confirmColor}
                    variant="contained"
                    disabled={loading}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;

