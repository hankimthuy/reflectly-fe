import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';
import type { AxiosError } from 'axios';

describe('axiosSetup', () => {
    let mockNavigateToLogin: Mock;

    beforeEach(() => {
        vi.resetModules();
        vi.useFakeTimers();
        localStorage.clear();
        localStorage.setItem('auth_token', 'mock_token');
        mockNavigateToLogin = vi.fn();

        vi.doMock('../../utils/navigationUtil.ts', () => ({
            default: {
                navigateToLogin: mockNavigateToLogin,
                navigate: vi.fn(),
                setNavigate: vi.fn(),
            },
        }));

        vi.doMock('../../constants/storage.ts', () => ({
            STORAGE_KEYS: {
                AUTH_TOKEN: 'auth_token',
            },
            COOKIE_KEYS: {
                AUTH_TOKEN: 'auth_token',
            },
        }));
    });

    afterEach(() => {
        vi.useRealTimers();
        localStorage.clear();
    });

    it('should export axiosInstance as default with interceptors', async () => {
        const module = await import('../axiosSetup');
        expect(module.default).toBeDefined();
        expect(module.default.interceptors).toBeDefined();
        expect(module.default.interceptors.request).toBeDefined();
        expect(module.default.interceptors.response).toBeDefined();
    });

    describe('401 handling', () => {
        it('should redirect to login and clear token on 401', async () => {
            const { default: axiosInstance } = await import('../axiosSetup');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handlers = (axiosInstance.interceptors.response as any).handlers;
            const errorHandler = handlers[0]?.rejected;

            if (errorHandler) {
                await errorHandler({ response: { status: 401 } } as AxiosError).catch(() => {});
            }

            expect(localStorage.getItem('auth_token')).toBeNull();
            expect(mockNavigateToLogin).toHaveBeenCalled();
        });

        it('should debounce multiple 401 redirects', async () => {
            const { default: axiosInstance } = await import('../axiosSetup');

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
        it('should attach Authorization header from localStorage', async () => {
            const { default: axiosInstance } = await import('../axiosSetup');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handlers = (axiosInstance.interceptors.request as any).handlers;
            const fulfilledHandler = handlers[0]?.fulfilled;

            if (fulfilledHandler) {
                const config = { headers: {} as Record<string, string> };
                const result = await fulfilledHandler(config);
                expect(result.headers.Authorization).toBe('Bearer mock_token');
            }
        });

        it('should not attach Authorization header when no token', async () => {
            localStorage.removeItem('auth_token');
            const { default: axiosInstance } = await import('../axiosSetup');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handlers = (axiosInstance.interceptors.request as any).handlers;
            const fulfilledHandler = handlers[0]?.fulfilled;

            if (fulfilledHandler) {
                const config = { headers: {} as Record<string, string> };
                const result = await fulfilledHandler(config);
                expect(result.headers.Authorization).toBeUndefined();
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
            const { default: axiosInstance } = await import('../axiosSetup');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handlers = (axiosInstance.interceptors.response as any).handlers;
            const errorHandler = handlers[0]?.rejected;

            if (errorHandler) {
                await errorHandler({ response: { status: 500 } } as AxiosError).catch(() => {});
            }

            expect(mockNavigateToLogin).not.toHaveBeenCalled();
            expect(localStorage.getItem('auth_token')).toBe('mock_token');
        });

        it('should NOT redirect on network errors (no response)', async () => {
            const { default: axiosInstance } = await import('../axiosSetup');

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
