import type { EnergyLog } from '../models/energyLog';
import axiosInstance from './axiosSetup';

export const energyStatsService = {
  async getEnergyRange(days: number = 30): Promise<EnergyLog[]> {
    const { data } = await axiosInstance.get<EnergyLog[]>(`/energy-logs/range?days=${days}`);
    return data;
  },
};
