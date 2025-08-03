import useGetRequest from "@/hooks/useGetRequest";
import { ExchangeRequest } from "@/types";

export interface ExchangeRequestsResponse {
  data: ExchangeRequest[];
  message: string;
}

export const useGetExchangeRequests = (options?: any) =>
  useGetRequest<ExchangeRequestsResponse>(
    "/exchange-requests",
    options
  ); 