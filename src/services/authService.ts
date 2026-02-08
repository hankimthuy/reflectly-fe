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
