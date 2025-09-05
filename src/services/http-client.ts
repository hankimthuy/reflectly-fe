
// Create a configured Axios instance
import axios, {type AxiosInstance, type AxiosResponse} from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api', // Replace with your Spring Boot backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default apiClient;