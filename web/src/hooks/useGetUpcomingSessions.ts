import useGetRequest from "@/hooks/useGetRequest";
import { Session } from "@/types";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useGetUpcomingSessions = (params?: Record<string, any>, options?: any) =>
  useGetRequest<PaginatedResult<Session>>("/sessions/upcoming", params, options); 