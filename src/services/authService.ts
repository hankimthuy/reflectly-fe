import axiosInstance from './axiosSetup';
import type { User } from '../models/user';

export interface AuthLoginResponse {
    token: string;
    user: User;
}

/**
 * Exchange a Google ID token for a backend JWT + user profile.
 * The request interceptor skips Authorization when no token is stored yet.
 */
export const loginWithGoogle = async (idToken: string): Promise<AuthLoginResponse> => {
    const response = await axiosInstance.post<AuthLoginResponse>(
        '/auth/google',
        { idToken }
    );
    return response.data;
};

/**
 * Login with username and password credentials.
 * POST /auth/login  body: { username, password }
 */
export const loginWithCredentials = async (username: string, password: string): Promise<AuthLoginResponse> => {
    const response = await axiosInstance.post<AuthLoginResponse>(
        '/auth/login',
        { username, password }
    );
    return response.data;
};

/**
 * Register a new account with username and password.
 * POST /auth/signup  body: { fullName, username, password }
 */
export const signupWithCredentials = async (fullName: string, username: string, password: string): Promise<AuthLoginResponse> => {
    const response = await axiosInstance.post<AuthLoginResponse>(
        '/auth/signup',
        { fullName, username, password }
    );
    return response.data;
};
