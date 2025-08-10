import usePatchRequest from "@/hooks/usePatchRequest";

type StartResponse = any;
type CompleteResponse = any;

export const useStartExchangeSession = (sessionId: string, options?: any) =>
  usePatchRequest<unknown, StartResponse>(`/exchange-sessions/${sessionId}/start`, options);

export const useCompleteExchangeSession = (sessionId: string, options?: any) =>
  usePatchRequest<unknown, CompleteResponse>(`/exchange-sessions/${sessionId}/complete`, options);


