import useDeleteRequest from './useDeleteRequest';

export const useDeleteSession = (options?: any) =>
  useDeleteRequest<any>('/sessions', options); 