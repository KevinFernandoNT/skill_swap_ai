import api from "@/lib/api";
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { ApiError } from "./types";

type MutationFn<TRequest, TResponse> = (data: TRequest) => Promise<TResponse>;

const usePutRequest = <TRequest = unknown, TResponse = unknown>(
  url: string,
  options?: UseMutationOptions<TResponse, ApiError, TRequest>
): UseMutationResult<TResponse, ApiError, TRequest> => {
  const mutationFn: MutationFn<TRequest, TResponse> = (data) => {
    const config =
      data instanceof FormData
        ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        : {};
    return api.put(url, data, config).then((res) => res.data);
  };

  return useMutation<TResponse, ApiError, TRequest>({ ...options, mutationFn });
};

export default usePutRequest;
