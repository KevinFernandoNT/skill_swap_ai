import api from "@/lib/api";
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { ApiError, SkillResponse } from "./types";

export const useDeleteAllTeachingSkills = (
  options?: UseMutationOptions<SkillResponse, ApiError, void>
): UseMutationResult<SkillResponse, ApiError, void> => {
  const mutationFn = () =>
    api.delete("/skills/all/teaching").then((res) => res.data);

  return useMutation<SkillResponse, ApiError, void>({
    ...options,
    mutationFn,
  });
};
// Usage: deleteAllTeachingSkills.mutate() 
