import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../AuthProvider';
import type { User } from '../../models/user';

// --- Mocks ---
const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    pictureUrl: 'https://example.com/pic.jpg',
    fullName: 'Test User',
};

let mockGetUserProfile: Mock;
let mockLoginWithGoogle: Mock;

vi.mock('../../services/userService.ts', () => ({
    getUserProfile: (...args: unknown[]) => mockGetUserProfile(...args),
}));

vi.mock('../../services/authService.ts', () => ({
    loginWithGoogle: (...args: unknown[]) => mockLoginWithGoogle(...args),
}));

vi.mock('@react-oauth/google', () => ({
    GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Helper: create a fresh QueryClient for each test (no retries, no cache sharing)
const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

// Test helper component to access auth context
const AuthConsumer = ({ onRender }: { onRender: (auth: ReturnType<typeof useAuth>) => void }) => {
    const auth = useAuth();
    onRender(auth);
    return (
        <div>
            <span data-testid="loading">{String(auth.isLoading)}</span>
            <span data-testid="authenticated">{String(auth.isAuthenticated)}</span>
            <span data-testid="user">{auth.currentUser?.fullName ?? 'null'}</span>
        </div>
    );
};

// Wrapper that provides both QueryClientProvider and AuthProvider
const renderWithProviders = (ui: React.ReactNode, queryClient?: QueryClient) => {
    const client = queryClient ?? createTestQueryClient();
    return render(
        <QueryClientProvider client={client}>
            <AuthProvider>{ui}</AuthProvider>
        </QueryClientProvider>
    );
};

describe('AuthProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        mockGetUserProfile = vi.fn().mockResolvedValue(mockUser);
        mockLoginWithGoogle = vi.fn().mockResolvedValue({ token: 'backend_jwt_token', user: mockUser });
    });

    describe('initialization', () => {
        it('should set isLoading=false and not authenticated when no token', async () => {
            renderWithProviders(<AuthConsumer onRender={() => {}} />);

            await waitFor(() => {
                expect(screen.getByTestId('loading').textContent).toBe('false');
            });
            expect(screen.getByTestId('authenticated').textContent).toBe('false');
            expect(screen.getByTestId('user').textContent).toBe('null');
        });

        it('should fetch profile and authenticate when token exists in localStorage', async () => {
            localStorage.setItem('auth_token', 'valid_token');

            renderWithProviders(<AuthConsumer onRender={() => {}} />);

            await waitFor(() => {
                expect(screen.getByTestId('authenticated').textContent).toBe('true');
                expect(screen.getByTestId('user').textContent).toBe('Test User');
            });

            expect(mockGetUserProfile).toHaveBeenCalled();
        });

        it('should clean up token on 401 during profile fetch', async () => {
            mockGetUserProfile.mockRejectedValue({ response: { status: 401 } });
            localStorage.setItem('auth_token', 'expired_token');

            renderWithProviders(<AuthConsumer onRender={() => {}} />);

            await waitFor(() => {
                expect(screen.getByTestId('authenticated').textContent).toBe('false');
            });

            expect(localStorage.getItem('auth_token')).toBeNull();
        });

        it('should not delete token on non-401 errors (network, 500)', async () => {
            mockGetUserProfile.mockRejectedValue({ response: { status: 500 } });
            localStorage.setItem('auth_token', 'valid_token');

            renderWithProviders(<AuthConsumer onRender={() => {}} />);

            // Wait for the query to settle (error state)
            await waitFor(() => {
                expect(mockGetUserProfile).toHaveBeenCalled();
            });

            // Token should NOT be removed on 500 errors
            expect(localStorage.getItem('auth_token')).toBe('valid_token');
        });
    });

    describe('login', () => {
        it('should call backend, store JWT, and set user immediately', async () => {
            let capturedAuth: ReturnType<typeof useAuth> | null = null;

            renderWithProviders(
                <AuthConsumer onRender={(auth) => { capturedAuth = auth; }} />
            );

            await waitFor(() => {
                expect(screen.getByTestId('loading').textContent).toBe('false');
            });

            await act(async () => {
                await capturedAuth!.login('google_id_token');
            });

            expect(mockLoginWithGoogle).toHaveBeenCalledWith('google_id_token', expect.anything());
            expect(localStorage.getItem('auth_token')).toBe('backend_jwt_token');
            expect(screen.getByTestId('authenticated').textContent).toBe('true');
            expect(screen.getByTestId('user').textContent).toBe('Test User');
        });

        it('should propagate error when backend login fails', async () => {
            mockLoginWithGoogle.mockRejectedValue(new Error('Invalid Google ID token'));

            let capturedAuth: ReturnType<typeof useAuth> | null = null;

            renderWithProviders(
                <AuthConsumer onRender={(auth) => { capturedAuth = auth; }} />
            );

            await waitFor(() => {
                expect(screen.getByTestId('loading').textContent).toBe('false');
            });

            await expect(
                act(async () => {
                    await capturedAuth!.login('bad_token');
                })
            ).rejects.toThrow('Invalid Google ID token');

            expect(localStorage.getItem('auth_token')).toBeNull();
            expect(screen.getByTestId('authenticated').textContent).toBe('false');
        });
    });

    describe('logout', () => {
        it('should clear localStorage and reset user state', async () => {
            localStorage.setItem('auth_token', 'valid_token');

            let capturedAuth: ReturnType<typeof useAuth> | null = null;

            renderWithProviders(
                <AuthConsumer onRender={(auth) => { capturedAuth = auth; }} />
            );

            await waitFor(() => {
                expect(screen.getByTestId('user').textContent).toBe('Test User');
            });

            act(() => {
                capturedAuth!.logout();
            });

            expect(localStorage.getItem('auth_token')).toBeNull();

            await waitFor(() => {
                expect(screen.getByTestId('authenticated').textContent).toBe('false');
                expect(screen.getByTestId('user').textContent).toBe('null');
            });
        });
    });

    describe('useAuth hook', () => {
        it('should throw when used outside AuthProvider', () => {
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

            const BadComponent = () => {
                useAuth();
                return null;
            };

            expect(() => render(<BadComponent />)).toThrow(
                'useAuth must be used within an AuthProvider'
            );

            consoleError.mockRestore();
        });
    });
});
