import api from "@/lib/api";
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { ApiError, SkillResponse } from "./types";

export const useDeleteSelectedSkills = (
  options?: UseMutationOptions<SkillResponse, ApiError, string[]>
): UseMutationResult<SkillResponse, ApiError, string[]> => {
  const mutationFn = (skillIds: string[]) => {
    // Delete skills one by one since we don't have a bulk delete endpoint
    return Promise.all(
      skillIds.map(id => api.delete(`/skills/${id}`).then(res => res.data))
    ).then(() => ({ success: true, deletedCount: skillIds.length }));
  };

  return useMutation<SkillResponse, ApiError, string[]>({
    ...options,
    mutationFn,
  });
};
// Usage: deleteSelectedSkills.mutate(['id1', 'id2', 'id3']) 
