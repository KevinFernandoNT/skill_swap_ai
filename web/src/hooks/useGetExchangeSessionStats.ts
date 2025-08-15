import useGetRequest from "@/hooks/useGetRequest";

export interface ExchangeSessionStats {
  completedExchangeSessions: number;
  scheduledExchangeSessions: number;
  uniqueExchangePartners: number;
  recentExchangePartners?: Array<{
    _id: string;
    name: string;
    avatar?: string;
  }>;
}

export interface StatsApiResponse {
  success: boolean;
  data: ExchangeSessionStats;
}

export const useGetExchangeSessionStats = (options?: any) =>
  useGetRequest<StatsApiResponse>("/exchange-sessions/stats", undefined, options); 