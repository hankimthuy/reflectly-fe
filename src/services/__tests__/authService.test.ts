import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginWithCredentials, signupWithCredentials, loginWithGoogle } from '../authService';

// --- Mock axiosInstance ---
const mockPost = vi.fn();

vi.mock('../axiosSetup', () => ({
    default: {
        post: (...args: unknown[]) => mockPost(...args),
    },
}));

const mockUser = {
    id: '1',
    email: 'test@example.com',
    pictureUrl: 'https://example.com/pic.jpg',
    fullName: 'Test User',
};

const mockAuthResponse = { token: 'jwt_token_123', user: mockUser };

describe('authService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('loginWithGoogle', () => {
        it('should POST to /auth/google with idToken', async () => {
            mockPost.mockResolvedValue({ data: mockAuthResponse });

            const result = await loginWithGoogle('google_id_token');

            expect(mockPost).toHaveBeenCalledWith('/auth/google', { idToken: 'google_id_token' });
            expect(result).toEqual(mockAuthResponse);
        });

        it('should propagate errors from the API', async () => {
            mockPost.mockRejectedValue(new Error('Network error'));

            await expect(loginWithGoogle('bad_token')).rejects.toThrow('Network error');
        });
    });

    describe('loginWithCredentials', () => {
        it('should POST to /auth/login with username and password', async () => {
            mockPost.mockResolvedValue({ data: mockAuthResponse });

            const result = await loginWithCredentials('testuser', 'pass123');

            expect(mockPost).toHaveBeenCalledWith('/auth/login', { username: 'testuser', password: 'pass123' });
            expect(result).toEqual(mockAuthResponse);
        });

        it('should propagate errors from the API', async () => {
            mockPost.mockRejectedValue(new Error('Invalid credentials'));

            await expect(loginWithCredentials('testuser', 'wrong')).rejects.toThrow('Invalid credentials');
        });
    });

    describe('signupWithCredentials', () => {
        it('should POST to /auth/signup with fullName, username, and password', async () => {
            mockPost.mockResolvedValue({ data: mockAuthResponse });

            const result = await signupWithCredentials('Test User', 'testuser', 'pass123');

            expect(mockPost).toHaveBeenCalledWith('/auth/signup', {
                fullName: 'Test User',
                username: 'testuser',
                password: 'pass123',
            });
            expect(result).toEqual(mockAuthResponse);
        });

        it('should propagate errors from the API', async () => {
            mockPost.mockRejectedValue(new Error('Username already exists'));

            await expect(signupWithCredentials('Test', 'taken', 'pass')).rejects.toThrow('Username already exists');
        });
    });
});
