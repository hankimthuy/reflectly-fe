import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

// --- Mocks ---
let mockIsLoading: boolean;
let mockIsAuthenticated: boolean;

vi.mock('../../providers/AuthProvider', () => ({
    useAuth: () => ({
        isLoading: mockIsLoading,
        isAuthenticated: mockIsAuthenticated,
        currentUser: null,
        login: vi.fn(),
        logout: vi.fn(),
    }),
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
        mockIsAuthenticated = false;
    });

    describe('when user is authenticated', () => {
        it('should render children when authenticated', () => {
            mockIsAuthenticated = true;
            mockIsLoading = false;

            renderProtectedRoute('/protected');

            expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        });

        it('should show loading spinner while loading even if authenticated later', () => {
            mockIsAuthenticated = false;
            mockIsLoading = true;

            renderProtectedRoute('/protected');

            expect(screen.getByText('Loading...')).toBeInTheDocument();
            expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
        });
    });

    describe('when user is not authenticated', () => {
        it('should redirect to /login when not authenticated and not loading', () => {
            mockIsAuthenticated = false;
            mockIsLoading = false;

            renderProtectedRoute('/protected');

            expect(screen.getByTestId('login-page')).toBeInTheDocument();
            expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
        });

        it('should redirect to custom redirectTo path', () => {
            mockIsAuthenticated = false;
            mockIsLoading = false;

            renderProtectedRoute('/protected', '/custom-login');

            expect(screen.getByTestId('custom-login')).toBeInTheDocument();
        });

        it('should show loading spinner when loading', () => {
            mockIsAuthenticated = false;
            mockIsLoading = true;

            renderProtectedRoute('/protected');

            expect(screen.getByText('Loading...')).toBeInTheDocument();
            expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
            expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
        });
    });
});
