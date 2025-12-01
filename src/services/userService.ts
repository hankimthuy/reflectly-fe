import axiosInstance from "./axiosSetup";
import type {User} from "../models/user";

export const getUserProfile = async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/users/profile');
    return response.data;
};
