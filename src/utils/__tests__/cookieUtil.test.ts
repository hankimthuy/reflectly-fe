import { describe, it, expect, beforeEach, vi } from 'vitest';
import CookieUtil from '../cookieUtil';

describe('CookieUtil', () => {
    beforeEach(() => {
        // Clear all cookies
        document.cookie.split(';').forEach((c) => {
            const name = c.trim().split('=')[0];
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
        });
        localStorage.clear();
    });

    describe('setCookie', () => {
        it('should set a cookie with the given name and value', () => {
            CookieUtil.setCookie('test_key', 'test_value', 1);

            expect(document.cookie).toContain('test_key=test_value');
        });

        it('should also store value in localStorage as backup', () => {
            CookieUtil.setCookie('test_key', 'test_value', 1);

            expect(localStorage.getItem('test_key')).toBe('test_value');
        });

        it('should not throw if localStorage is unavailable', () => {
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = vi.fn(() => {
                throw new Error('Storage full');
            });

            expect(() => CookieUtil.setCookie('key', 'val', 1)).not.toThrow();

            localStorage.setItem = originalSetItem;
        });
    });

    describe('getCookie', () => {
        it('should return the cookie value when cookie exists', () => {
            document.cookie = 'my_cookie=hello;path=/';

            expect(CookieUtil.getCookie('my_cookie')).toBe('hello');
        });

        it('should return empty string when cookie does not exist', () => {
            expect(CookieUtil.getCookie('nonexistent')).toBe('');
        });

        it('should fallback to localStorage when cookie is missing', () => {
            localStorage.setItem('fallback_key', 'fallback_value');

            expect(CookieUtil.getCookie('fallback_key')).toBe('fallback_value');
        });

        it('should prefer cookie value over localStorage value', () => {
            document.cookie = 'dual_key=from_cookie;path=/';
            localStorage.setItem('dual_key', 'from_storage');

            expect(CookieUtil.getCookie('dual_key')).toBe('from_cookie');
        });

        it('should not match partial cookie names', () => {
            document.cookie = 'auth_token_extra=wrong;path=/';

            expect(CookieUtil.getCookie('auth_token')).toBe('');
        });
    });

    describe('deleteCookie', () => {
        it('should remove the cookie', () => {
            document.cookie = 'to_delete=value;path=/';
            expect(CookieUtil.getCookie('to_delete')).toBe('value');

            CookieUtil.deleteCookie('to_delete');

            // After deletion, cookie should be gone (getCookie returns '' or localStorage fallback)
            // Also clear localStorage to ensure clean check
            localStorage.removeItem('to_delete');
            expect(CookieUtil.getCookie('to_delete')).toBe('');
        });

        it('should remove the localStorage entry', () => {
            localStorage.setItem('to_delete', 'value');

            CookieUtil.deleteCookie('to_delete');

            expect(localStorage.getItem('to_delete')).toBeNull();
        });
    });
});
