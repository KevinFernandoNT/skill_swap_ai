import usePatchRequest from "@/hooks/usePatchRequest";

export const useMarkAllNotificationsAsRead = (options?: any) =>
  usePatchRequest<any, any>(
    "/notifications/mark-all-read",
    options
  ); 