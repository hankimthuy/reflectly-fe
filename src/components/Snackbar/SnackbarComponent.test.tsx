import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SnackbarComponent from './Snackbar';

// Setup: Create a mock function for the onClose prop
const onCloseMock = vi.fn();

// Setup: Clear mock history before each test
beforeEach(() => {
    vi.clearAllMocks();
});

describe('SnackbarComponent', () => {
    // UI & RENDERING
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

    // INTERACTION 
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
});

    

// LOGIC & LIFECYCLE (Async/API, Timer, Error Handling)

// ACCESSIBILITY

