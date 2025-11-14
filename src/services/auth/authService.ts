import axiosInstance from "../core/axiosSetup";
import type {User} from "../../models/user";
import CookieService from "./cookieService";

interface GoogleLoginResponse {
    user: User;
}

export const getUserProfile = async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/users/profile');
    return response.data;
};

export const loginWithGoogleIdToken = async (idToken: string): Promise<GoogleLoginResponse> => {
    try {
        CookieService.setToken(idToken);
        
        const userData = await getUserProfile();

        if (!userData.id || !userData.email || !userData.fullName || !userData.pictureUrl) {
            throw new Error('Missing required fields in backend response');
        }

        return {
            user: userData
        };
    } catch (error) {
        CookieService.removeToken();
        throw error;
    }
};