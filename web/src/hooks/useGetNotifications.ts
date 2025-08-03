import useGetRequest from "@/hooks/useGetRequest";
import { Notification } from "@/types";

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  message: string;
}

export const useGetNotifications = (options?: any) =>
  useGetRequest<NotificationsResponse>(
    "/notifications",
    options
  ); 