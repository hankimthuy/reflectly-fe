import type { PaginatedResponse } from '../models/base';
import type { CreateEnergyLogRequest, EnergyLog } from '../models/energyLog';
import axiosInstance from './axiosSetup';

export const energyLogService = {
  async getEnergyLogs(url?: string | null): Promise<PaginatedResponse<EnergyLog>> {
    const requestUrl = url || '/energy-logs?page=0&size=10';

    const { data } = await axiosInstance.get<PaginatedResponse<EnergyLog>>(requestUrl);
    return data;
  },

  async createEnergyLog(log: CreateEnergyLogRequest): Promise<EnergyLog> {
    const { data } = await axiosInstance.post<EnergyLog>('/energy-logs', log);
    return data;
  },

  async deleteEnergyLog(id: string): Promise<void> {
    await axiosInstance.delete(`/energy-logs/${id}`);
  }
};
