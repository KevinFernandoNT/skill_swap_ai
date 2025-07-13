import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import api from '../lib/api';

interface ApiMutationOptions<TData = any, TVariables = any> extends UseMutationOptions<TData, unknown, TVariables> {
  method?: 'post' | 'put' | 'delete';
  endpoint: string;
}

export function useApiMutation<TData = any, TVariables = any>({ endpoint, method = 'post', ...options }: ApiMutationOptions<TData, TVariables>) {
  return useMutation<TData, unknown, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const { data } = await api[method](endpoint, variables);
      return data;
    },
    ...options,
  });
} 