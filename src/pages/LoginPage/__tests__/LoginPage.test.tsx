import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';

// --- Mocks ---
const mockNavigate = vi.fn();
const mockLogin = vi.fn();
const mockLoginWithCredentials = vi.fn();
const mockLogout = vi.fn();

let mockIsAuthenticated = false;
let mockIsLoading = false;

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../../providers/AuthProvider', () => ({
    useAuth: () => ({
        isAuthenticated: mockIsAuthenticated,
        isLoading: mockIsLoading,
        login: mockLogin,
        loginWithCredentials: mockLoginWithCredentials,
        logout: mockLogout,
        currentUser: null,
        signup: vi.fn(),
        setCurrentUser: vi.fn(),
    }),
}));

vi.mock('@react-oauth/google', () => ({
    GoogleLogin: ({ onSuccess, onError }: { onSuccess: (res: unknown) => void; onError: () => void }) => (
        <div data-testid="google-login">
            <button data-testid="google-success-btn" onClick={() => onSuccess({ credential: 'mock_google_token' })}>
                Google Login
            </button>
            <button data-testid="google-error-btn" onClick={() => onError()}>
                Google Error
            </button>
            <button data-testid="google-no-cred-btn" onClick={() => onSuccess({})}>
                Google No Credential
            </button>
        </div>
    ),
}));

const renderLoginPage = (initialEntries: string[] = ['/login']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <LoginPage />
        </MemoryRouter>
    );
};

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsAuthenticated = false;
        mockIsLoading = false;
    });

    // === RENDERING ===
    describe('rendering', () => {
        it('should render the page title and subtitle', () => {
            renderLoginPage();

            expect(screen.getByText('MimoSe')).toBeInTheDocument();
            expect(screen.getByText('Bridge between worlds')).toBeInTheDocument();
        });

        it('should render the username and password fields', () => {
            renderLoginPage();

            expect(screen.getByLabelText('Username')).toBeInTheDocument();
            expect(screen.getByLabelText('Password')).toBeInTheDocument();
        });

        it('should render the Sign In button', () => {
            renderLoginPage();

            expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
        });

        it('should render the Google login button', () => {
            renderLoginPage();

            expect(screen.getByTestId('google-login')).toBeInTheDocument();
        });

        it('should render the signup link', () => {
            renderLoginPage();

            expect(screen.getByText('Start your journey')).toBeInTheDocument();
        });

        it('should render the divider with "or" text', () => {
            renderLoginPage();

            expect(screen.getByText('or')).toBeInTheDocument();
        });

        it('should render Privacy Policy and Terms of Service links', () => {
            renderLoginPage();

            expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
            expect(screen.getByText('Terms of Service')).toBeInTheDocument();
        });
    });

    // === LOADING STATE ===
    describe('loading state', () => {
        it('should show loading text when isLoading is true', () => {
            mockIsLoading = true;

            renderLoginPage();

            expect(screen.getByText('Signing in...')).toBeInTheDocument();
            expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
        });
    });

    // === REDIRECT WHEN AUTHENTICATED ===
    describe('redirect when authenticated', () => {
        it('should redirect to /home when already authenticated', () => {
            mockIsAuthenticated = true;

            renderLoginPage();

            expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
        });
    });

    // === CREDENTIAL LOGIN ===
    describe('credential login', () => {
        it('should show error when submitting with empty fields', async () => {
            renderLoginPage();

            fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

            expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
            expect(mockLoginWithCredentials).not.toHaveBeenCalled();
        });

        it('should show error when only username is filled', async () => {
            renderLoginPage();

            fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
            fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

            expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
        });

        it('should show error when only password is filled', async () => {
            renderLoginPage();

            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
            fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

            expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
        });

        it('should call loginWithCredentials with username and password on valid submit', async () => {
            mockLoginWithCredentials.mockResolvedValue(undefined);
            renderLoginPage();

            fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
            fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

            await waitFor(() => {
                expect(mockLoginWithCredentials).toHaveBeenCalledWith('testuser', 'pass123');
            });
        });

        it('should navigate to /home after successful credential login', async () => {
            mockLoginWithCredentials.mockResolvedValue(undefined);
            renderLoginPage();

            fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
            fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
            });
        });

        it('should show error message when credential login fails with Error', async () => {
            mockLoginWithCredentials.mockRejectedValue(new Error('Invalid credentials'));
            renderLoginPage();

            fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass' } });
            fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

            await waitFor(() => {
                expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
            });
        });

        it('should show generic error when credential login fails with non-Error', async () => {
            mockLoginWithCredentials.mockRejectedValue('unknown error');
            renderLoginPage();

            fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
            fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass' } });
            fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

            await waitFor(() => {
                expect(screen.getByText('Login failed. Please check your credentials.')).toBeInTheDocument();
            });
        });
    });

    // === PASSWORD VISIBILITY TOGGLE ===
    describe('password visibility toggle', () => {
        it('should toggle password visibility when eye icon is clicked', () => {
            renderLoginPage();

            const passwordInput = screen.getByLabelText('Password');
            expect(passwordInput).toHaveAttribute('type', 'password');

            const toggleButton = passwordInput.parentElement!.querySelector('button')!;
            fireEvent.click(toggleButton);

            expect(passwordInput).toHaveAttribute('type', 'text');

            fireEvent.click(toggleButton);

            expect(passwordInput).toHaveAttribute('type', 'password');
        });
    });

    // === GOOGLE LOGIN ===
    describe('google login', () => {
        it('should call login with Google credential on success', async () => {
            mockLogin.mockResolvedValue(undefined);
            renderLoginPage();

            fireEvent.click(screen.getByTestId('google-success-btn'));

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith('mock_google_token');
            });
        });

        it('should navigate after successful Google login', async () => {
            mockLogin.mockResolvedValue(undefined);
            renderLoginPage();

            fireEvent.click(screen.getByTestId('google-success-btn'));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
            });
        });

        it('should show error when Google login fails', async () => {
            mockLogin.mockRejectedValue(new Error('Google backend error'));
            renderLoginPage();

            fireEvent.click(screen.getByTestId('google-success-btn'));

            await waitFor(() => {
                expect(screen.getByText('Google backend error')).toBeInTheDocument();
            });
        });

        it('should show error when Google returns no credential', async () => {
            renderLoginPage();

            fireEvent.click(screen.getByTestId('google-no-cred-btn'));

            expect(screen.getByText('Did not receive credential from Google.')).toBeInTheDocument();
        });

        it('should show error when Google onError fires', () => {
            renderLoginPage();

            fireEvent.click(screen.getByTestId('google-error-btn'));

            expect(screen.getByText('Google authentication failed. Please try again.')).toBeInTheDocument();
        });
    });
});
