import useGetRequest from "@/hooks/useGetRequest";
import { Session } from "@/types";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useGetSessions = (params?: Record<string, any>, options?: any) =>
  useGetRequest<PaginatedResult<Session>>("/sessions", params, options);