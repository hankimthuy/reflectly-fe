import React from 'react';
import { Dialog } from '@mui/material';
import Button, { type ButtonVariant } from '../Button/Button';
import './ConfirmDialog.scss';

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

// Call sites still pass the MUI-flavoured `confirmColor` prop (e.g. "error" for a destructive
// confirm) — mapped here onto this app's own Button variants so the dialog reads as Aura Soft,
// not as an MUI control dropped into it. Aura Soft has no dedicated "warning"/"info"/"success"
// button skin, so anything that isn't destructive falls back to the primary CTA look.
const CONFIRM_VARIANT: Record<NonNullable<ConfirmDialogProps['confirmColor']>, ButtonVariant> = {
    primary: 'primary',
    secondary: 'secondary',
    error: 'danger',
    warning: 'danger',
    info: 'primary',
    success: 'primary',
};

/**
 * Only the modal shell (backdrop, focus trap, Escape-to-close) still comes from MUI — everything
 * inside is plain markup styled off the design system, and the actions use the app's shared
 * Button so text is centered and consistent with every other button in the app. On narrow
 * screens the actions stack full-width instead of squeezing two small buttons onto one row.
 */
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
            fullWidth
            maxWidth="xs"
            classes={{ paper: 'confirm-dialog__paper' }}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
        >
            <div className="confirm-dialog">
                <h3 id="confirm-dialog-title" className="confirm-dialog__title">
                    {title}
                </h3>
                <p id="confirm-dialog-description" className="confirm-dialog__message">
                    {message}
                </p>
                <div className="confirm-dialog__actions">
                    <Button variant="secondary" onClick={onCancel} disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={CONFIRM_VARIANT[confirmColor]}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default ConfirmDialog;
