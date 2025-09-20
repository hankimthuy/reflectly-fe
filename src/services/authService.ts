import type { AuthUser } from "../contexts/AuthProvider.tsx";
import apiClient from "./apiClient.ts";

// Actual backend response structure (flat structure)
interface BackendAuthResponse {
  id: string;
  email: string;
  fullName: string;
  pictureUrl: string;
  internalJwtToken: string;
}

interface GoogleLoginResponse {
  token: string;
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
    if (!backendData.id || !backendData.email || !backendData.fullName || !backendData.pictureUrl || !backendData.internalJwtToken) {
      throw new Error('Missing required fields in backend response');
    }
    
    // Map backend response to AuthUser
    const userData: AuthUser = {
      id: backendData.id,
      email: backendData.email,
      fullName: backendData.fullName,
      pictureUrl: backendData.pictureUrl
    };
    
    // Transform backend response to match frontend interface
    const transformedResponse: GoogleLoginResponse = {
      token: backendData.internalJwtToken,
      user: userData
    };

    return transformedResponse;
  } catch (error) {
    console.error('Error sending Google ID Token to backend:', error);
    throw error;
  }
};


// Get user profile using internal JWT token
export const getUserProfile = async (): Promise<BackendAuthResponse> => {
  try {
    const response = await apiClient.get<BackendAuthResponse>('/api/auth/get-user-profile');
    return response.data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};