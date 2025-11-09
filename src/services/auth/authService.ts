import axiosInstance from "../core/axiosSetup";
import type {User} from "../../models/user";
import CookieService from "./cookieService";

// Actual backend response structure (flat structure)
interface BackendAuthResponse {
    id: string;
    email: string;
    fullName: string;
    pictureUrl: string;
}

interface GoogleLoginResponse {
    user: {
        id: string;
        email: string;
        pictureUrl: string;
        fullName: string;
    };
}

// Common method to get user profile from backend
const getUserProfile = async (): Promise<BackendAuthResponse> => {
    const response = await axiosInstance.get<BackendAuthResponse>('/users/profile');
    return response.data;
};

export const loginWithGoogleIdToken = async (idToken: string): Promise<GoogleLoginResponse> => {
    CookieService.setToken(idToken);

    // Call backend to verify token and get user profile
    const backendData = await getUserProfile();

    // Validate required fields
    if (!backendData.id || !backendData.email || !backendData.fullName || !backendData.pictureUrl) {
        throw new Error('Missing required fields in backend response');
    }

    // Map backend response to AuthUser
    const userData: User = {
        id: backendData.id,
        email: backendData.email,
        fullName: backendData.fullName,
        pictureUrl: backendData.pictureUrl
    };

    // Transform backend response to match frontend interface
    return {
        user: userData
    };
};