import useGetRequest from "@/hooks/useGetRequest";

export interface UnreadCountResponse {
  success: boolean;
  data: number;
  message: string;
}

export const useGetUnreadCount = (options?: any) =>
  useGetRequest<UnreadCountResponse>(
    "/notifications/unread-count",
    options
  ); 