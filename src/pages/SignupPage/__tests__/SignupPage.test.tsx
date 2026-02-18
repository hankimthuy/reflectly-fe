import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignupPage from '../SignupPage';

// --- Mocks ---
const mockNavigate = vi.fn();
const mockSignup = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../../providers/AuthProvider', () => ({
    useAuth: () => ({
        signup: mockSignup,
        isAuthenticated: false,
        isLoading: false,
        login: vi.fn(),
        loginWithCredentials: vi.fn(),
        logout: vi.fn(),
        currentUser: null,
        setCurrentUser: vi.fn(),
    }),
}));

const renderSignupPage = () => {
    return render(
        <MemoryRouter initialEntries={['/signup']}>
            <SignupPage />
        </MemoryRouter>
    );
};

describe('SignupPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // === RENDERING ===
    describe('rendering', () => {
        it('should render the page title and subtitle', () => {
            renderSignupPage();

            expect(screen.getByText('MimoSe')).toBeInTheDocument();
            expect(screen.getByText('Start your journey')).toBeInTheDocument();
        });

        it('should render all form fields', () => {
            renderSignupPage();

            expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
            expect(screen.getByLabelText('Username')).toBeInTheDocument();
            expect(screen.getByLabelText('Password')).toBeInTheDocument();
            expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        });

        it('should render the Create Account button', () => {
            renderSignupPage();

            expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
        });

        it('should render the sign in link', () => {
            renderSignupPage();

            expect(screen.getByText('Sign in')).toBeInTheDocument();
            expect(screen.getByText(/Already have an account/)).toBeInTheDocument();
        });

        it('should render Privacy Policy and Terms of Service links', () => {
            renderSignupPage();

            expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
            expect(screen.getByText('Terms of Service')).toBeInTheDocument();
        });
    });

    // === VALIDATION ===
    describe('validation', () => {
        it('should show error when submitting with all empty fields', () => {
            renderSignupPage();

            fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

            expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();
            expect(mockSignup).not.toHaveBeenCalled();
        });

        it('should show error when full name is missing', () => {
            renderSignupPage();

            fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
            fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'pass123' } });
            fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

            expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();
        });

        it('should show error when username is missing', () => {
            renderSignupPage();

            fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test User' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
            fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'pass123' } });
            fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

            expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();
        });

        it('should show error when passwords do not match', () => {
            renderSignupPage();

            fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test User' } });
            fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
            fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'different' } });
            fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

            expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
            expect(mockSignup).not.toHaveBeenCalled();
        });

        it('should show error when password is less than 6 characters', () => {
            renderSignupPage();

            fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test User' } });
            fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: '12345' } });
            fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: '12345' } });
            fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

            expect(screen.getByText('Password must be at least 6 characters.')).toBeInTheDocument();
            expect(mockSignup).not.toHaveBeenCalled();
        });
    });

    // === SUCCESSFUL SIGNUP ===
    describe('successful signup', () => {
        it('should call signup with fullName, username, and password', async () => {
            mockSignup.mockResolvedValue(undefined);
            renderSignupPage();

            fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test User' } });
            fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
            fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'pass123' } });
            fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

            await waitFor(() => {
                expect(mockSignup).toHaveBeenCalledWith('Test User', 'testuser', 'pass123');
            });
        });

        it('should navigate to /home after successful signup', async () => {
            mockSignup.mockResolvedValue(undefined);
            renderSignupPage();

            fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test User' } });
            fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
            fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'pass123' } });
            fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
            });
        });

        it('should show "Creating account..." while submitting', async () => {
            let resolveSignup: () => void;
            mockSignup.mockImplementation(() => new Promise<void>((resolve) => { resolveSignup = resolve; }));
            renderSignupPage();

            fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test User' } });
            fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
            fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'pass123' } });
            fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Creating account...' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Creating account...' })).toBeDisabled();
            });

            // Resolve to clean up
            resolveSignup!();
        });
    });

    // === FAILED SIGNUP ===
    describe('failed signup', () => {
        it('should show error message when signup fails with Error', async () => {
            mockSignup.mockRejectedValue(new Error('Username already taken'));
            renderSignupPage();

            fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test User' } });
            fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
            fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'pass123' } });
            fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

            await waitFor(() => {
                expect(screen.getByText('Username already taken')).toBeInTheDocument();
            });
        });

        it('should show generic error when signup fails with non-Error', async () => {
            mockSignup.mockRejectedValue('unknown');
            renderSignupPage();

            fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test User' } });
            fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
            fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'pass123' } });
            fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

            await waitFor(() => {
                expect(screen.getByText('Signup failed. Please try again.')).toBeInTheDocument();
            });
        });

        it('should re-enable the button after signup failure', async () => {
            mockSignup.mockRejectedValue(new Error('Signup failed'));
            renderSignupPage();

            fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test User' } });
            fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
            fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'pass123' } });
            fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Create Account' })).not.toBeDisabled();
            });
        });
    });

    // === PASSWORD VISIBILITY TOGGLE ===
    describe('password visibility toggle', () => {
        it('should toggle password field visibility', () => {
            renderSignupPage();

            const passwordInput = screen.getByLabelText('Password');
            expect(passwordInput).toHaveAttribute('type', 'password');

            const toggleButton = passwordInput.parentElement!.querySelector('button')!;
            fireEvent.click(toggleButton);

            expect(passwordInput).toHaveAttribute('type', 'text');
        });

        it('should toggle confirm password field visibility independently', () => {
            renderSignupPage();

            const confirmInput = screen.getByLabelText('Confirm Password');
            expect(confirmInput).toHaveAttribute('type', 'password');

            const toggleButton = confirmInput.parentElement!.querySelector('button')!;
            fireEvent.click(toggleButton);

            expect(confirmInput).toHaveAttribute('type', 'text');

            // Password field should still be hidden
            expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
        });
    });
});
