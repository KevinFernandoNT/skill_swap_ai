import usePutRequest from "@/hooks/usePutRequest";

export const useMarkAllNotificationsAsRead = (options?: any) =>
  usePutRequest<any, any>(
    "/notifications/mark-all-read",
    options
  ); 