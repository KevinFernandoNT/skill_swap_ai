import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { User } from '../types';

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useGetUsers = (options?: any) => {
  return useQuery<UsersResponse>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export default useGetUsers;
