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
    const response = await apiClient.post<GoogleLoginResponse>('/google-login', { idToken });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi gửi ID Token đến BE:', error);
    throw error;
  }
};