import useGetRequest from "@/hooks/useGetRequest";
import { SkillResponse } from "@/hooks/types";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useGetSkills = (params?: Record<string, any>, options?: any) =>
  useGetRequest<PaginatedResult<SkillResponse>>("/skills", params, options); 