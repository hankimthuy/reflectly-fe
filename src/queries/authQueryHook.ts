import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../services/userService';
import { COOKIE_KEYS } from '../constants/storage';
import CookieUtil from '../utils/cookieUtil';

export const useUserProfile = () => {
  const hasToken = !!CookieUtil.getCookie(COOKIE_KEYS.AUTH_TOKEN);

  return useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    retry: (failureCount, error: any) => {

      if (failureCount > 2) return false;

      const status = error?.response?.status;
      
      // Don't retry on client errors (4xx) 
      if (status === 400 || status === 401 || status === 403 || status === 404) {
        return false;
      }
      
      // Allow retry for server errors (5xx) or network errors
      return true;
    },
    staleTime: 1000 * 60 * 60 * 24, 
    enabled: hasToken,
  });
};