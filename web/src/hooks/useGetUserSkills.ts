import useGetRequest from "@/hooks/useGetRequest";
import { Skill } from "@/types";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useGetUserSkills = (params?: any, options?: any) =>
  useGetRequest<PaginatedResult<Skill>>("/skills", params, options); 