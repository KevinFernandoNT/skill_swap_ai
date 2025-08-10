import api from "@/lib/api";
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { ApiError } from "./types";
import { Notification } from "@/types";

type MarkAsReadRequest = { id: string };

export const useMarkNotificationAsRead = (
  options?: UseMutationOptions<Notification, ApiError, MarkAsReadRequest>
): UseMutationResult<Notification, ApiError, MarkAsReadRequest> => {
  return useMutation<Notification, ApiError, MarkAsReadRequest>({
    mutationFn: ({ id }) =>
      api.patch(`/notifications/${id}/read`, {}).then((res) => res.data),
    ...options,
  });
};