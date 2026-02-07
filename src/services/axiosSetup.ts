import axios from 'axios';
import NavigationUtil from '../utils/navigationUtil.ts';
import CookieUtil from "../utils/cookieUtil.ts";
import {COOKIE_KEYS} from "../constants/storage.ts";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000,
});

let isRedirecting = false;
let isInitializingAuth = false;
const REDIRECT_DEBOUNCE_MS = 2000;

/** Called by AuthProvider to suppress 401 redirects during initial token check */
export const setAuthInitializing = (value: boolean): void => {
    isInitializingAuth = value;
};

const handleUnauthorizedError = (): void => {
    // Don't redirect during initial auth check — let AuthProvider handle it gracefully
    if (isRedirecting || isInitializingAuth) {
        return;
    }

    isRedirecting = true;
    CookieUtil.deleteCookie(COOKIE_KEYS.AUTH_TOKEN);
    CookieUtil.deleteCookie(COOKIE_KEYS.USER_PROFILE);

    const currentPath = window.location.pathname;
    NavigationUtil.navigateToLogin(currentPath);

    setTimeout(() => {
        isRedirecting = false;
    }, REDIRECT_DEBOUNCE_MS);
};

axiosInstance.interceptors.request.use(
    (config) => {
        config.headers.Authorization = `Bearer ${CookieUtil.getCookie(COOKIE_KEYS.AUTH_TOKEN)}`;
        config.withCredentials = true;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            handleUnauthorizedError();
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;