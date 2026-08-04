import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { peopleService } from '../services/peopleService';
import type { CreatePersonRequest } from '../models/person';

export const usePeopleQuery = () => {
  return useQuery({
    queryKey: ['people'],
    queryFn: () => peopleService.getPeople(),
    staleTime: 1000 * 60,
  });
};

export const useCreatePersonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (person: CreatePersonRequest) => peopleService.createPerson(person),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });
};

export const useUpdatePersonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, person }: { id: string; person: CreatePersonRequest }) =>
      peopleService.updatePerson(id, person),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });
};
