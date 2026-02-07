import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

// --- Mocks ---
let mockIsLoading: boolean;
let mockGetCookie: Mock;

vi.mock('../../providers/AuthProvider', () => ({
    useAuth: () => ({
        isLoading: mockIsLoading,
        isAuthenticated: false,
        currentUser: null,
        setCurrentUser: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
    }),
}));

vi.mock('../../utils/cookieUtil.ts', () => ({
    default: {
        getCookie: (...args: unknown[]) => mockGetCookie(...args),
        setCookie: vi.fn(),
        deleteCookie: vi.fn(),
    },
}));

vi.mock('../../constants/storage.ts', () => ({
    COOKIE_KEYS: {
        AUTH_TOKEN: 'auth_token',
        USER_PROFILE: 'user_profile',
    },
}));

const renderProtectedRoute = (initialPath: string, redirectTo?: string) => {
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
                <Route
                    path="/protected"
                    element={
                        <ProtectedRoute redirectTo={redirectTo}>
                            <div data-testid="protected-content">Protected Content</div>
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
                <Route path="/custom-login" element={<div data-testid="custom-login">Custom Login</div>} />
            </Routes>
        </MemoryRouter>
    );
};

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsLoading = false;
        mockGetCookie = vi.fn().mockReturnValue('');
    });

    describe('when user has a valid token', () => {
        it('should render children when token exists', () => {
            mockGetCookie.mockReturnValue('valid_token');
            mockIsLoading = false;

            renderProtectedRoute('/protected');

            expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        });

        it('should render children even while still loading if token exists', () => {
            mockGetCookie.mockReturnValue('valid_token');
            mockIsLoading = true;

            renderProtectedRoute('/protected');

            expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        });
    });

    describe('when user has no token', () => {
        it('should redirect to /login when no token and not loading', () => {
            mockGetCookie.mockReturnValue('');
            mockIsLoading = false;

            renderProtectedRoute('/protected');

            expect(screen.getByTestId('login-page')).toBeInTheDocument();
            expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
        });

        it('should redirect to custom redirectTo path', () => {
            mockGetCookie.mockReturnValue('');
            mockIsLoading = false;

            renderProtectedRoute('/protected', '/custom-login');

            expect(screen.getByTestId('custom-login')).toBeInTheDocument();
        });

        it('should show loading spinner when loading and no token', () => {
            mockGetCookie.mockReturnValue('');
            mockIsLoading = true;

            renderProtectedRoute('/protected');

            expect(screen.getByText('Loading...')).toBeInTheDocument();
            expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
            expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
        });
    });

    describe('edge cases', () => {
        it('should treat empty string token as no token', () => {
            mockGetCookie.mockReturnValue('');
            mockIsLoading = false;

            renderProtectedRoute('/protected');

            expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });

        it('should treat any non-empty token as valid', () => {
            mockGetCookie.mockReturnValue('any_string');
            mockIsLoading = false;

            renderProtectedRoute('/protected');

            expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        });
    });
});
