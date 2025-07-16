import usePostRequest from "@/hooks/usePostRequest";
import { SkillRequest, SkillResponse } from "@/hooks/types";
 
export const useCreateSkill = (options?: any) =>
  usePostRequest<SkillRequest, SkillResponse>("/skills", options); 