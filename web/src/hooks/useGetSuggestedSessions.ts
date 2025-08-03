import useGetRequest from "@/hooks/useGetRequest";
import { Session } from "@/types";

export interface SuggestedSession extends Session {
  matchingType: 'learning_match' | 'teaching_match' | 'mutual_match';
}

export interface SuggestedSessionsResponse {
  success: boolean;
  data: SuggestedSession[];
}

export const useGetSuggestedSessions = (options?: any) =>
  useGetRequest<SuggestedSessionsResponse>("/sessions/suggested", undefined, options); 