import useGetRequest from "@/hooks/useGetRequest";
import { PaginatedResult, ExchangeSession } from "./useGetUpcomingExchangeSessions";

export const useGetExchangeSessions = (
  params?: Record<string, any>,
  options?: any
) => useGetRequest<PaginatedResult<ExchangeSession>>(
  "/exchange-sessions",
  params,
  options
);


