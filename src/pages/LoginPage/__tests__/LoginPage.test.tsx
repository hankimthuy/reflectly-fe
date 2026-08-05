import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();
const mockLoginWithCredentials = vi.fn();
const mockLogout = vi.fn();

let mockIsAuthenticated = false;
let mockIsLoading = false;
let mockGoogleLoginBehavior: 'success' | 'error' | 'no-code' = 'success';

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

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const labels: Record<string, string> = {
                'brand.name': 'Aura Self AI',
                'brand.acronym': 'AI Coach for Self-Understanding',
                'brand.welcome': 'Welcome back to Aura Self AI.',
                'auth.username': 'Username',
                'auth.password': 'Password',
                'auth.loginButton': 'Sign In',
                'auth.googleLogin': 'Sign in with Google',
                'auth.noAccount': "Don't have an account?",
                'auth.signupLink': 'Start your journey',
                'auth.usernamePlaceholder': 'Enter your username',
                'auth.forgotPassword': 'Forgot?',
                'auth.or': 'or',
                'auth.signingIn': 'Signing in...',
                'auth.privacyPolicy': 'Privacy Policy',
                'auth.termsOfService': 'Terms of Service',
                'auth.errors.usernamePasswordRequired': 'Please enter both username and password.',
                'auth.errors.loginFailed': 'Login failed. Please check your credentials.',
                'auth.errors.googleCodeMissing': 'Did not receive authorization code from Google.',
                'auth.errors.googleFailed': 'Google authentication failed. Please try again.',
            };
            return labels[key] ?? key;
        },
    }),
}));

vi.mock('@react-oauth/google', () => ({
    useGoogleLogin: ({ onSuccess, onError }: {
        onSuccess: (res: { code?: string }) => void;
        onError: () => void;
    }) => () => {
        if (mockGoogleLoginBehavior === 'success') {
            onSuccess({ code: 'mock_google_auth_code' });
        } else if (mockGoogleLoginBehavior === 'error') {
            onError();
        } else {
            onSuccess({});
        }
    },
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
        mockGoogleLoginBehavior = 'success';
    });

    describe('rendering', () => {
        it('should render the page title and subtitle', () => {
            renderLoginPage();

            expect(screen.getByText('Aura Self AI')).toBeInTheDocument();
            expect(screen.getByText('Welcome back to Aura Self AI.')).toBeInTheDocument();
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

            expect(screen.getByRole('button', { name: 'Sign in with Google' })).toBeInTheDocument();
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

    describe('loading state', () => {
        it('should show loading text when isLoading is true', () => {
            mockIsLoading = true;

            renderLoginPage();

            expect(screen.getByText('Signing in...')).toBeInTheDocument();
            expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
        });
    });

    describe('redirect when authenticated', () => {
        it('should redirect to /home when already authenticated', () => {
            mockIsAuthenticated = true;

            renderLoginPage();

            expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
        });
    });

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

    describe('google login', () => {
        it('should call login with Google auth code on success', async () => {
            mockLogin.mockResolvedValue(undefined);
            renderLoginPage();

            fireEvent.click(screen.getByRole('button', { name: 'Sign in with Google' }));

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith('mock_google_auth_code');
            });
        });

        it('should navigate after successful Google login', async () => {
            mockLogin.mockResolvedValue(undefined);
            renderLoginPage();

            fireEvent.click(screen.getByRole('button', { name: 'Sign in with Google' }));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
            });
        });

        it('should show error when Google login fails', async () => {
            mockLogin.mockRejectedValue(new Error('Google backend error'));
            renderLoginPage();

            fireEvent.click(screen.getByRole('button', { name: 'Sign in with Google' }));

            await waitFor(() => {
                expect(screen.getByText('Google backend error')).toBeInTheDocument();
            });
        });

        it('should show error when Google returns no auth code', async () => {
            mockGoogleLoginBehavior = 'no-code';
            renderLoginPage();

            fireEvent.click(screen.getByRole('button', { name: 'Sign in with Google' }));

            await waitFor(() => {
                expect(screen.getByText('Did not receive authorization code from Google.')).toBeInTheDocument();
            });
        });

        it('should show error when Google onError fires', async () => {
            mockGoogleLoginBehavior = 'error';
            renderLoginPage();

            fireEvent.click(screen.getByRole('button', { name: 'Sign in with Google' }));

            await waitFor(() => {
                expect(screen.getByText('Google authentication failed. Please try again.')).toBeInTheDocument();
            });
        });
    });
});
