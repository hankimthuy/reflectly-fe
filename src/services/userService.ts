import axiosInstance from "./axiosSetup";
import type {User} from "../models/user";
import type {CreatePersonRequest} from "../models/person";

export const getUserProfile = async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/users/profile');
    return response.data;
};

/**
 * Update user display name.
 * PUT /users/profile  body: { fullName }
 */
export const updateUserProfile = async (data: { fullName?: string }): Promise<User> => {
    const response = await axiosInstance.put<User>('/users/profile', data);
    return response.data;
};

/**
 * Change user password (credential users only).
 * PUT /users/password  body: { currentPassword, newPassword }
 */
export const changePassword = async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await axiosInstance.put('/users/password', data);
};

/**
 * Upload a new avatar image.
 * POST /users/avatar  body: FormData with 'file' field
 */
export const uploadAvatar = async (file: File): Promise<{ pictureUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post<{ pictureUrl: string }>('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/**
 * Complete onboarding: persist core values + initial relationships in one call.
 * PUT /users/onboarding  body: { coreValues, people }
 */
export const completeOnboarding = async (data: {
    coreValues: string[];
    people: CreatePersonRequest[];
}): Promise<User> => {
    const response = await axiosInstance.put<User>('/users/onboarding', data);
    return response.data;
};
