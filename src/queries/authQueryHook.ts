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

      return error?.response?.status >= 500;
    },
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    enabled: hasToken,
  });
};