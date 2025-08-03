import usePutRequest from "@/hooks/usePutRequest";
import { Notification } from "@/types";

export const useMarkNotificationAsRead = (notificationId: string, options?: any) =>
  usePutRequest<any, Notification>(
    `/notifications/${notificationId}/read`,
    options
  ); 