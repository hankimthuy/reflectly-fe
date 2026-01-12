import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SnackbarComponent from './Snackbar';

// Setup: Create a mock function for the onClose prop
const onCloseMock = vi.fn();

// Setup: Clear mock history before each test
beforeEach(() => {
    vi.clearAllMocks();
});

// UI & RENDER
describe('SnackbarComponent', () => {
    it('should render message correctly', () => {
        render(
            <SnackbarComponent
                message="Test Snackbar Message"
                open={true}
                onClose={onCloseMock}
                type={'success'} />
        );
        expect(screen.getByText('Test Snackbar Message')).toBeInTheDocument();
    });
});

describe('SnackbarComponent', () => {
    it('should render title correctly when provided', () => {
        render(
            <SnackbarComponent
                message="Created Failed"
                title="Error"
                open={true}
                onClose={onCloseMock}
                type="error" />
        );
        screen.debug();

        const alertBox = screen.getByRole('alert');
        expect(alertBox).toHaveTextContent('Error');
        expect(alertBox).toHaveClass('MuiAlert-filledError');
    })
});

// INTERACTION 

describe('SnackbarComponent', () => {
    it('should call onClose when Snackbar is closed', async () => {
        render(
            <SnackbarComponent
                message="Test Snackbar Message"
                open={true}
                onClose={onCloseMock}
                type={'success'} />
        )
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    })
})

// LOGIC & LIFECYCLE (Async/API, Timer, Error Handling)

// ACCESSIBILITY

