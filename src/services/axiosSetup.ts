import axios from 'axios';
import NavigationUtil from '../utils/navigationUtil.ts';
import { STORAGE_KEYS } from "../constants/storage.ts";
import { queryClient } from "./queryClient.ts";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

let isRedirecting = false;
const REDIRECT_DEBOUNCE_MS = 2000;

/** Dispatched app-wide on 429 (quota/rate-limit) so any mounted listener (see SnackbarProvider)
 * can surface it without axiosSetup needing to depend on React. */
export const RATE_LIMITED_EVENT = 'api:rate-limited';

const DEFAULT_RATE_LIMIT_MESSAGE = 'Bạn đang thao tác quá nhanh hoặc đã dùng hết lượt cho phép. Vui lòng thử lại sau.';

const handleRateLimitedError = (error: unknown): void => {
    const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        DEFAULT_RATE_LIMIT_MESSAGE;
    window.dispatchEvent(new CustomEvent(RATE_LIMITED_EVENT, { detail: { message } }));
};

const handleUnauthorizedError = (): void => {
    if (isRedirecting) {
        return;
    }

    isRedirecting = true;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    queryClient.removeQueries();
    queryClient.clear();

    const currentPath = window.location.pathname;
    NavigationUtil.navigateToLogin(currentPath);

    setTimeout(() => {
        isRedirecting = false;
    }, REDIRECT_DEBOUNCE_MS);
};

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
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

        if (error.response?.status === 429) {
            handleRateLimitedError(error);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;