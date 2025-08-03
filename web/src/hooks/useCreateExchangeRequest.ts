import usePostRequest from "@/hooks/usePostRequest";
import { ExchangeRequest } from "@/types";

export const useCreateExchangeRequest = (options?: any) =>
  usePostRequest<
    Omit<ExchangeRequest, '_id' | 'sessionId' | 'requester' | 'recipient' | 'offeredSkillId' | 'requestedSkillId' | 'status' | 'createdAt' | 'updatedAt' | '__v'> & { 
      sessionId: string; 
      recipient: string; 
      offeredSkillId: string;
      requestedSkillId: string;
    },
    any
  >(
    "/exchange-requests",
    options
  ); 