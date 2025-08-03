import useGetRequest from "@/hooks/useGetRequest";
import { Notification } from "@/types";

export interface UnreadNotificationsResponse {
  success: boolean;
  data: Notification[];
  message: string;
}

export const useGetUnreadNotifications = (options?: any) =>
  useGetRequest<UnreadNotificationsResponse>(
    "/notifications/unread",
    options
  ); 