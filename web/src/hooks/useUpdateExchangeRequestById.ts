import usePutRequest from "@/hooks/usePutRequest";
import { ExchangeRequest } from "@/types";

export interface UpdateExchangeRequestData {
  status?: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  message?: string;
}

export const useUpdateExchangeRequestById = (requestId: string, options?: any) =>
  usePutRequest<UpdateExchangeRequestData, ExchangeRequest>(
    `/exchange-requests/${requestId}`,
    options
  ); 