import axios from 'axios';
import NavigationUtil from '../utils/navigationUtil.ts';
import {STORAGE_KEYS} from "../constants/storage.ts";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

let isRedirecting = false;
const REDIRECT_DEBOUNCE_MS = 2000;

const handleUnauthorizedError = (): void => {
    if (isRedirecting) {
        return;
    }

    isRedirecting = true;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

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

        return Promise.reject(error);
    }
);

export default axiosInstance;