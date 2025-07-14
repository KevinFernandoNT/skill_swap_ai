import usePostRequest from "@/hooks/usePostRequest";
import { ExchangeRequest } from "@/types";

export const useCreateExchangeRequest = (options?: any) =>
  usePostRequest<
    Omit<ExchangeRequest, 'id' | 'session' | 'requester' | 'recipient' | 'status' | 'createdAt' | 'updatedAt'> & { sessionId: string; recipient: string },
    any
  >(
    "/exchange-requests",
    options
  ); 