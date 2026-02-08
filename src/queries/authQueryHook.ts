import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { STORAGE_KEYS } from '../constants/storage';
import { loginWithGoogle } from '../services/authService';
import { getUserProfile } from '../services/userService';

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