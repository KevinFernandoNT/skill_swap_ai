import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import api from '../lib/api';

interface ApiMutationOptions<TData = any, TVariables = any> extends UseMutationOptions<TData, unknown, TVariables> {
  method?: 'post' | 'put' | 'delete';
  endpoint: string;
}

export function useApiMutation<TData = any, TVariables = any>({ endpoint, method = 'post', ...options }: ApiMutationOptions<TData, TVariables>) {
  return useMutation<TData, unknown, TVariables>({
    mutationFn: async (variables: TVariables) => {
      let config = {};
      if (variables instanceof FormData) {
        config = { headers: { 'Content-Type': 'multipart/form-data' } };
      }
      const { data } = await api[method](endpoint, variables, config);
      return data;
    },
    ...options,
  });
} 