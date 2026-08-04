import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { STORAGE_KEYS } from '../constants/storage';
import { loginWithGoogle, loginWithCredentials, signupWithCredentials } from '../services/authService';
import { getUserProfile, completeOnboarding } from '../services/userService';
import type { CreatePersonRequest } from '../models/person';

export const USER_PROFILE_QUERY_KEY = ['userProfile'] as const;

/**
 * React Query hook for fetching user profile on page refresh.
 * Enabled only when a token exists in localStorage.
 */
export const useUserProfileQuery = (hasToken: boolean) => {
    return useQuery({
        queryKey: USER_PROFILE_QUERY_KEY,
        queryFn: getUserProfile,
        enabled: hasToken,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error) => {
            const status = (error as { response?: { status?: number } })?.response?.status;
            if (status === 401) {
                localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
                return false;
            }
            return failureCount < 2;
        },
    });
};

/**
 * React Query mutation hook for Google login.
 * Calls POST /api/auth/google, stores backend JWT, and updates profile cache.
 */
export const useLoginMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginWithGoogle,
        onSuccess: ({ token, user }) => {
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            queryClient.setQueryData(USER_PROFILE_QUERY_KEY, user);
        },
    });
};

/**
 * React Query mutation hook for username/password login.
 * Calls POST /auth/login, stores backend JWT, and updates profile cache.
 */
export const useCredentialLoginMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ username, password }: { username: string; password: string }) =>
            loginWithCredentials(username, password),
        onSuccess: ({ token, user }) => {
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            queryClient.setQueryData(USER_PROFILE_QUERY_KEY, user);
        },
    });
};

/**
 * React Query mutation hook for username/password signup.
 * Calls POST /auth/signup, stores backend JWT, and updates profile cache.
 */
export const useSignupMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ fullName, username, password }: { fullName: string; username: string; password: string }) =>
            signupWithCredentials(fullName, username, password),
        onSuccess: ({ token, user }) => {
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            queryClient.setQueryData(USER_PROFILE_QUERY_KEY, user);
        },
    });
};

/**
 * React Query mutation hook for completing onboarding (core values + initial relationships).
 */
export const useCompleteOnboardingMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { coreValues: string[]; people: CreatePersonRequest[] }) => completeOnboarding(data),
        onSuccess: (user) => {
            queryClient.setQueryData(USER_PROFILE_QUERY_KEY, user);
        },
    });
};