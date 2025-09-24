import apiClient from "./apiClient.ts";
import type {User} from "../models/user.ts";

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

export const loginWithGoogleIdToken = async (idToken: string): Promise<GoogleLoginResponse> => {
  try {
    // Call the backend API with Google ID token
    const response = await apiClient.get<BackendAuthResponse>('/api/auth/get-user-profile', {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });

    const backendData = response.data;
    
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
    const transformedResponse: GoogleLoginResponse = {
      user: userData
    };

    return transformedResponse;
  } catch (error) {
    console.error('Error sending Google ID Token to backend:', error);
    throw error;
  }
};


export const getUserProfile = async (): Promise<BackendAuthResponse> => {
  try {
    const response = await apiClient.get<BackendAuthResponse>('/api/auth/get-user-profile');
    return response.data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};