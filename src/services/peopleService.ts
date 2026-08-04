import type { CreatePersonRequest, Person } from '../models/person';
import axiosInstance from './axiosSetup';

export const peopleService = {
  async getPeople(): Promise<Person[]> {
    const { data } = await axiosInstance.get<Person[]>('/people');
    return data;
  },

  async createPerson(person: CreatePersonRequest): Promise<Person> {
    const { data } = await axiosInstance.post<Person>('/people', person);
    return data;
  },

  async updatePerson(id: string, person: CreatePersonRequest): Promise<Person> {
    const { data } = await axiosInstance.put<Person>(`/people/${id}`, person);
    return data;
  },
};
