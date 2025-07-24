import usePostRequest from "@/hooks/usePostRequest";
import { SessionRequest } from "@/types";

export const useCreateSession = (options?: any) =>
  usePostRequest<SessionRequest, any>(
    "/sessions",
    options
  ); 