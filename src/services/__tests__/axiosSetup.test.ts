import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';
import type { AxiosError } from 'axios';

describe('axiosSetup', () => {
    let mockNavigateToLogin: Mock;
    let mockDeleteCookie: Mock;
    let mockGetCookie: Mock;

    beforeEach(() => {
        vi.resetModules();
        vi.useFakeTimers();
        mockNavigateToLogin = vi.fn();
        mockDeleteCookie = vi.fn();
        mockGetCookie = vi.fn().mockReturnValue('mock_token');

        vi.doMock('../../utils/navigationUtil.ts', () => ({
            default: {
                navigateToLogin: mockNavigateToLogin,
                navigate: vi.fn(),
                setNavigate: vi.fn(),
            },
        }));

        vi.doMock('../../utils/cookieUtil.ts', () => ({
            default: {
                getCookie: mockGetCookie,
                setCookie: vi.fn(),
                deleteCookie: mockDeleteCookie,
            },
        }));

        vi.doMock('../../constants/storage.ts', () => ({
            COOKIE_KEYS: {
                AUTH_TOKEN: 'auth_token',
                USER_PROFILE: 'user_profile',
            },
        }));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should export setAuthInitializing function', async () => {
        const module = await import('../axiosSetup');
        expect(typeof module.setAuthInitializing).toBe('function');
    });

    it('should export axiosInstance as default with interceptors', async () => {
        const module = await import('../axiosSetup');
        expect(module.default).toBeDefined();
        expect(module.default.interceptors).toBeDefined();
        expect(module.default.interceptors.request).toBeDefined();
        expect(module.default.interceptors.response).toBeDefined();
    });

    describe('setAuthInitializing', () => {
        it('should suppress 401 redirect when auth is initializing', async () => {
            const { default: axiosInstance, setAuthInitializing } = await import('../axiosSetup');

            setAuthInitializing(true);

            // Trigger the response error interceptor by using the internal handlers
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handlers = (axiosInstance.interceptors.response as any).handlers;
            const errorHandler = handlers[0]?.rejected;

            if (errorHandler) {
                await errorHandler({ response: { status: 401 } } as AxiosError).catch(() => {});
            }

            expect(mockNavigateToLogin).not.toHaveBeenCalled();
            expect(mockDeleteCookie).not.toHaveBeenCalled();
        });

        it('should allow 401 redirect after setAuthInitializing(false)', async () => {
            const { default: axiosInstance, setAuthInitializing } = await import('../axiosSetup');

            setAuthInitializing(false);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handlers = (axiosInstance.interceptors.response as any).handlers;
            const errorHandler = handlers[0]?.rejected;

            if (errorHandler) {
                await errorHandler({ response: { status: 401 } } as AxiosError).catch(() => {});
            }

            expect(mockDeleteCookie).toHaveBeenCalledWith('auth_token');
            expect(mockDeleteCookie).toHaveBeenCalledWith('user_profile');
            expect(mockNavigateToLogin).toHaveBeenCalled();
        });

        it('should debounce multiple 401 redirects', async () => {
            const { default: axiosInstance, setAuthInitializing } = await import('../axiosSetup');

            setAuthInitializing(false);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handlers = (axiosInstance.interceptors.response as any).handlers;
            const errorHandler = handlers[0]?.rejected;

            if (errorHandler) {
                await errorHandler({ response: { status: 401 } } as AxiosError).catch(() => {});
                await errorHandler({ response: { status: 401 } } as AxiosError).catch(() => {});
                await errorHandler({ response: { status: 401 } } as AxiosError).catch(() => {});
            }

            // Should only redirect once due to debounce
            expect(mockNavigateToLogin).toHaveBeenCalledTimes(1);
        });
    });

    describe('request interceptor', () => {
        it('should attach Authorization header from cookie', async () => {
            const { default: axiosInstance } = await import('../axiosSetup');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handlers = (axiosInstance.interceptors.request as any).handlers;
            const fulfilledHandler = handlers[0]?.fulfilled;

            if (fulfilledHandler) {
                const config = { headers: {} as Record<string, string>, withCredentials: false };
                const result = await fulfilledHandler(config);
                expect(result.headers.Authorization).toBe('Bearer mock_token');
                expect(result.withCredentials).toBe(true);
            }
        });
    });

    describe('response interceptor', () => {
        it('should pass through successful responses unchanged', async () => {
            const { default: axiosInstance } = await import('../axiosSetup');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handlers = (axiosInstance.interceptors.response as any).handlers;
            const fulfilledHandler = handlers[0]?.fulfilled;

            if (fulfilledHandler) {
                const response = { data: { id: 1 }, status: 200 };
                const result = await fulfilledHandler(response);
                expect(result).toEqual(response);
            }
        });

        it('should NOT redirect on non-401 errors (e.g. 500)', async () => {
            const { default: axiosInstance, setAuthInitializing } = await import('../axiosSetup');

            setAuthInitializing(false);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handlers = (axiosInstance.interceptors.response as any).handlers;
            const errorHandler = handlers[0]?.rejected;

            if (errorHandler) {
                await errorHandler({ response: { status: 500 } } as AxiosError).catch(() => {});
            }

            expect(mockNavigateToLogin).not.toHaveBeenCalled();
            expect(mockDeleteCookie).not.toHaveBeenCalled();
        });

        it('should NOT redirect on network errors (no response)', async () => {
            const { default: axiosInstance, setAuthInitializing } = await import('../axiosSetup');

            setAuthInitializing(false);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handlers = (axiosInstance.interceptors.response as any).handlers;
            const errorHandler = handlers[0]?.rejected;

            if (errorHandler) {
                await errorHandler({ message: 'Network Error' } as AxiosError).catch(() => {});
            }

            expect(mockNavigateToLogin).not.toHaveBeenCalled();
        });
    });
});
