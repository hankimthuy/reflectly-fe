import type { AuthUser } from "../contexts/AuthProvider.tsx";
import apiClient from "./apiClient.ts";

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

const fetchUserProfile = async (idToken?: string): Promise<BackendAuthResponse> => {
  try {
    const headers = idToken ? { Authorization: `Bearer ${idToken}` } : undefined;
    const response = await apiClient.get<BackendAuthResponse>('/api/users/profile', headers ? { headers } : undefined);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const loginWithGoogleIdToken = async (idToken: string): Promise<GoogleLoginResponse> => {
  const backendData = await fetchUserProfile(idToken);

  // Validate required fields
  if (!backendData.id || !backendData.email || !backendData.fullName || !backendData.pictureUrl) {
    throw new Error('Missing required fields in backend response');
  }

  // Map backend response to AuthUser
  const userData: AuthUser = {
    id: backendData.id,
    email: backendData.email,
    fullName: backendData.fullName,
    pictureUrl: backendData.pictureUrl
  };

  return { user: userData };
};