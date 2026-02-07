import { describe, it, expect, beforeEach, vi } from 'vitest';
import NavigationUtil from '../navigationUtil';

// Helper to reset private static navigateCallback
const resetNavigateCallback = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (NavigationUtil as any).navigateCallback = null;
};

describe('NavigationUtil', () => {
    beforeEach(() => {
        resetNavigateCallback();
    });

    describe('setNavigate', () => {
        it('should register a navigate callback', () => {
            const mockNavigate = vi.fn();
            NavigationUtil.setNavigate(mockNavigate);

            NavigationUtil.navigate('/test');

            expect(mockNavigate).toHaveBeenCalledWith('/test', undefined);
        });
    });

    describe('navigate', () => {
        it('should call the registered callback with path and options', () => {
            const mockNavigate = vi.fn();
            NavigationUtil.setNavigate(mockNavigate);

            NavigationUtil.navigate('/home', { replace: true });

            expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
        });

        it('should fallback to window.location.href when no callback is registered', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            // navigateCallback is already null from beforeEach
            NavigationUtil.navigate('/fallback');

            expect(warnSpy).toHaveBeenCalledWith(
                'NavigationService: navigate callback not registered, using fallback'
            );

            warnSpy.mockRestore();
        });
    });

    describe('navigateToLogin', () => {
        it('should navigate to /login with replace and state containing from path', () => {
            const mockNavigate = vi.fn();
            NavigationUtil.setNavigate(mockNavigate);

            NavigationUtil.navigateToLogin('/dashboard');

            expect(mockNavigate).toHaveBeenCalledWith('/login', {
                replace: true,
                state: { from: '/dashboard' },
            });
        });

        it('should navigate to /login without state when no currentPath provided', () => {
            const mockNavigate = vi.fn();
            NavigationUtil.setNavigate(mockNavigate);

            NavigationUtil.navigateToLogin();

            expect(mockNavigate).toHaveBeenCalledWith('/login', {
                replace: true,
                state: undefined,
            });
        });
    });
});
