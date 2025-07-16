import usePutRequest from "@/hooks/usePutRequest";
import { SkillRequest, SkillResponse } from "@/hooks/types";
 
export const useUpdateSkill = (id: string, options?: any) =>
  usePutRequest<SkillRequest, SkillResponse>(`/skills/${id}`, options); 