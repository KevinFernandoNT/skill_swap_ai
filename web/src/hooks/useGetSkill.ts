import useGetRequest from "@/hooks/useGetRequest";
import { SkillResponse } from "@/hooks/types";
 
export const useGetSkill = (id: string, params?: Record<string, any>, options?: any) =>
  useGetRequest<SkillResponse>(`/skills/${id}`, params, options); 