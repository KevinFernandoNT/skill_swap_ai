import useGetRequest from "@/hooks/useGetRequest";
import { ExchangeRequest } from "@/types";

export interface HostedSessionExchangeRequestsResponse {
  success: boolean;
  data: ExchangeRequest[];
  message: string;
}

export const useGetHostedSessionExchangeRequests = (options?: any) =>
  useGetRequest<HostedSessionExchangeRequestsResponse>(
    "/exchange-requests/hosted-sessions",
    options
  ); 