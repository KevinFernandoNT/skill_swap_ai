import api from "@/lib/api";
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { ApiError, SkillResponse } from "./types";

export const useDeleteAllSkills = (
  options?: UseMutationOptions<SkillResponse, ApiError, void>
): UseMutationResult<SkillResponse, ApiError, void> => {
  const mutationFn = () =>
    api.delete("/skills/all").then((res) => res.data);

  return useMutation<SkillResponse, ApiError, void>({
    ...options,
    mutationFn,
  });
};
// Usage: deleteAllSkills.mutate() 
