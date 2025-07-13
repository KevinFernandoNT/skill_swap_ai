import api from "@/lib/api";
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { ApiError } from "./types";

type MutationFn<TResponse> = (id: string | number) => Promise<TResponse>;

const useDeleteRequest = <TResponse = unknown>(
  url: string,
  options?: UseMutationOptions<TResponse, ApiError, string | number>
): UseMutationResult<TResponse, ApiError, string | number> => {
  const mutationFn: MutationFn<TResponse> = (id) =>
    api.delete(`${url}/${id}`).then((res) => res.data);

  return useMutation<TResponse, ApiError, string | number>({
    ...options,
    mutationFn,
  });
};

export default useDeleteRequest;
