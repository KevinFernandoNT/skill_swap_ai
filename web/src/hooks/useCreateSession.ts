import usePostRequest from "@/hooks/usePostRequest";
import { Session } from "@/types";

export const useCreateSession = (options?: any) =>
  usePostRequest<Omit<Session, 'id' | 'participant' | 'status'>, any>(
    "/sessions",
    options
  ); 