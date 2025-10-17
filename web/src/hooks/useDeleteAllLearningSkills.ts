import api from "@/lib/api";
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { ApiError, SkillResponse } from "./types";

export const useDeleteAllLearningSkills = (
  options?: UseMutationOptions<SkillResponse, ApiError, void>
): UseMutationResult<SkillResponse, ApiError, void> => {
  const mutationFn = () =>
    api.delete("/skills/all/learning").then((res) => res.data);

  return useMutation<SkillResponse, ApiError, void>({
    ...options,
    mutationFn,
  });
};
// Usage: deleteAllLearningSkills.mutate() 
