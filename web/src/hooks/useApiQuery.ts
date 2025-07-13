import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '../lib/api';

export function useApiQuery<T = any>(key: string | any[], endpoint: string, options?: UseQueryOptions<T>) {
  return useQuery<T>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const { data } = await api.get(endpoint);
      return data;
    },
    ...options,
  });
} 