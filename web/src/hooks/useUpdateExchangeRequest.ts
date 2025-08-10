import usePatchRequest from "@/hooks/usePatchRequest";
import { ExchangeRequest } from "@/types";

export interface UpdateExchangeRequestData {
  status?: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  message?: string;
}

export const useUpdateExchangeRequest = (options?: any) =>
  usePatchRequest<UpdateExchangeRequestData, ExchangeRequest>(
    "/exchange-requests",
    options
  );

export const useUpdateExchangeRequestById = (requestId: string, options?: any) =>
  usePatchRequest<UpdateExchangeRequestData, ExchangeRequest>(
    `/exchange-requests/${requestId}`,
    options
  );