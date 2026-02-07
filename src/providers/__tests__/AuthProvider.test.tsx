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

let mockGetCookie: Mock;
let mockSetCookie: Mock;
let mockDeleteCookie: Mock;
let mockGetUserProfile: Mock;
let mockSetAuthInitializing: Mock;

vi.mock('../../utils/cookieUtil.ts', () => ({
    default: {
        getCookie: (...args: unknown[]) => mockGetCookie(...args),
        setCookie: (...args: unknown[]) => mockSetCookie(...args),
        deleteCookie: (...args: unknown[]) => mockDeleteCookie(...args),
    },
}));

vi.mock('../../services/userService.ts', () => ({
    getUserProfile: (...args: unknown[]) => mockGetUserProfile(...args),
}));

vi.mock('../../services/axiosSetup.ts', () => ({
    setAuthInitializing: (...args: unknown[]) => mockSetAuthInitializing(...args),
    default: {},
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
        mockGetCookie = vi.fn().mockReturnValue('');
        mockSetCookie = vi.fn();
        mockDeleteCookie = vi.fn();
        mockGetUserProfile = vi.fn().mockResolvedValue(mockUser);
        mockSetAuthInitializing = vi.fn();
    });

    describe('initialization', () => {
        it('should set isLoading=false and not authenticated when no token', async () => {
            mockGetCookie.mockReturnValue('');

            renderWithProviders(<AuthConsumer onRender={() => {}} />);

            await waitFor(() => {
                expect(screen.getByTestId('loading').textContent).toBe('false');
            });
            expect(screen.getByTestId('authenticated').textContent).toBe('false');
            expect(screen.getByTestId('user').textContent).toBe('null');
        });

        it('should call setAuthInitializing(true) on mount when token exists', async () => {
            mockGetCookie.mockImplementation((key: string) => {
                if (key === 'auth_token') return 'valid_token';
                return '';
            });

            renderWithProviders(<AuthConsumer onRender={() => {}} />);

            await waitFor(() => {
                expect(mockSetAuthInitializing).toHaveBeenCalledWith(true);
            });
        });

        it('should call setAuthInitializing(false) after profile query settles', async () => {
            mockGetCookie.mockImplementation((key: string) => {
                if (key === 'auth_token') return 'valid_token';
                return '';
            });

            renderWithProviders(<AuthConsumer onRender={() => {}} />);

            await waitFor(() => {
                expect(mockSetAuthInitializing).toHaveBeenCalledWith(false);
            });
        });

        it('should authenticate immediately when token exists in cookie', async () => {
            mockGetCookie.mockImplementation((key: string) => {
                if (key === 'auth_token') return 'valid_token';
                return '';
            });

            renderWithProviders(<AuthConsumer onRender={() => {}} />);

            // isAuthenticated is derived from token state, should be true on first render
            await waitFor(() => {
                expect(screen.getByTestId('authenticated').textContent).toBe('true');
            });
        });

        it('should load cached profile from cookie as initialData', async () => {
            mockGetCookie.mockImplementation((key: string) => {
                if (key === 'auth_token') return 'valid_token';
                if (key === 'user_profile') return JSON.stringify(mockUser);
                return '';
            });

            renderWithProviders(<AuthConsumer onRender={() => {}} />);

            // Cached profile should appear immediately (initialData)
            await waitFor(() => {
                expect(screen.getByTestId('user').textContent).toBe('Test User');
            });
        });

        it('should fetch fresh profile from API and update user', async () => {
            const freshUser: User = { ...mockUser, fullName: 'Fresh User' };
            mockGetUserProfile.mockResolvedValue(freshUser);

            mockGetCookie.mockImplementation((key: string) => {
                if (key === 'auth_token') return 'valid_token';
                return '';
            });

            renderWithProviders(<AuthConsumer onRender={() => {}} />);

            await waitFor(() => {
                expect(screen.getByTestId('user').textContent).toBe('Fresh User');
            });

            expect(mockSetCookie).toHaveBeenCalledWith(
                'user_profile',
                JSON.stringify(freshUser),
                1
            );
        });

        it('should clean up token on 401 during profile fetch', async () => {
            mockGetUserProfile.mockRejectedValue({ response: { status: 401 } });

            mockGetCookie.mockImplementation((key: string) => {
                if (key === 'auth_token') return 'expired_token';
                return '';
            });

            renderWithProviders(<AuthConsumer onRender={() => {}} />);

            await waitFor(() => {
                expect(mockDeleteCookie).toHaveBeenCalledWith('auth_token');
            });
            expect(mockDeleteCookie).toHaveBeenCalledWith('user_profile');
        });

        it('should keep user authenticated on non-401 errors (network, 500)', async () => {
            mockGetUserProfile.mockRejectedValue({ response: { status: 500 } });

            mockGetCookie.mockImplementation((key: string) => {
                if (key === 'auth_token') return 'valid_token';
                return '';
            });

            renderWithProviders(<AuthConsumer onRender={() => {}} />);

            await waitFor(() => {
                expect(screen.getByTestId('authenticated').textContent).toBe('true');
            });

            // Should NOT delete token on 500
            expect(mockDeleteCookie).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should set token cookie and trigger profile fetch', async () => {
            mockGetCookie.mockReturnValue('');

            let capturedAuth: ReturnType<typeof useAuth> | null = null;

            renderWithProviders(
                <AuthConsumer onRender={(auth) => { capturedAuth = auth; }} />
            );

            await waitFor(() => {
                expect(screen.getByTestId('loading').textContent).toBe('false');
            });

            // Perform login
            await act(async () => {
                await capturedAuth!.login('google_id_token');
            });

            expect(mockSetCookie).toHaveBeenCalledWith('auth_token', 'google_id_token', 1);
        });

        it('should still consider user logged in even if profile fetch fails during login', async () => {
            mockGetUserProfile.mockRejectedValue(new Error('Network error'));
            mockGetCookie.mockReturnValue('');

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

            expect(mockSetCookie).toHaveBeenCalledWith('auth_token', 'google_id_token', 1);
            // isAuthenticated is based on token state, not profile success
            expect(screen.getByTestId('authenticated').textContent).toBe('true');
        });
    });

    describe('logout', () => {
        it('should clear cookies and reset user state', async () => {
            mockGetCookie.mockImplementation((key: string) => {
                if (key === 'auth_token') return 'valid_token';
                return '';
            });

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

            expect(mockDeleteCookie).toHaveBeenCalledWith('auth_token');
            expect(mockDeleteCookie).toHaveBeenCalledWith('user_profile');

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
