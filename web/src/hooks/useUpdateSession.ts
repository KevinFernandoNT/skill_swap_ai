import usePutRequest from './usePutRequest';
import { SessionRequest } from '@/types';

export const useUpdateSession = (id: string, options?: any) =>
  usePutRequest<SessionRequest, any>(`/sessions/${id}`, options); 