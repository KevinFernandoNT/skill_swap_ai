import api from "@/lib/api";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { ApiError } from "./types";

const useGetRequest = <
  TQueryFnData = unknown,
  TError = ApiError,
  TResponse = TQueryFnData
>(
  url: string,
  params?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TResponse>,
    "queryFn" | "queryKey"
  >
): UseQueryResult<TResponse, TError> => {
  return useQuery<TQueryFnData, TError, TResponse>({
    queryKey: [url, params],
    queryFn: async () => {
      const response = await api.get<TQueryFnData>(url, { params });
      return response.data;
    },
    ...options,
  });
};

export default useGetRequest;
