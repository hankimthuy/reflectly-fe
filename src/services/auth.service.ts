import apiClient from "./apiClient.ts";

interface GoogleLoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    picture: string;
    fullName: string;
  };
}

export const loginWithGoogleIdToken = async (idToken: string) => {
  try {
    const response = await apiClient.post<GoogleLoginResponse>('/auth/google-login', { idToken });

    return response.data;
  } catch (error) {
    console.error('Error ID Token to BE:', error);
    throw error;
  }
};