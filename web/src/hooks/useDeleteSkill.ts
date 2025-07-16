import useDeleteRequest from "@/hooks/useDeleteRequest";
import { SkillResponse } from "@/hooks/types";
 
export const useDeleteSkill = (options?: any) =>
  useDeleteRequest<SkillResponse>("/skills", options);
// Usage: deleteSkill.mutate(skillId) 