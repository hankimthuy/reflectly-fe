// Create a configured Axios instance
import {type AxiosResponse} from "axios";
import apiClient from "./apiClient.ts";

export const httpClient = {
  get: <T>(url: string, params?: object): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, { params });
  },

  getById: <T>(url: string, id: string | number): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(`${url}/${id}`);
  },

  post: <T, D>(url: string, data: D): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data);
  },

  put: <T, D>(url: string, id: string | number, data: D): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(`${url}/${id}`, data);
  },

  delete: <T>(url: string, id: string | number): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(`${url}/${id}`);
  },
};

export default httpClient;