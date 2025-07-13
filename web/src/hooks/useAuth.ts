import usePostRequest from "@/hooks/usePostRequest";
import { useApiQuery } from "@/hooks/useApiQuery";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/hooks/types";
import { User } from "@/types";

export const useLogin = (options?: any) =>
  usePostRequest<LoginRequest, LoginResponse>('/auth/login', options);

export const useRegister = (options?: any) =>
  usePostRequest<RegisterRequest, RegisterResponse>('/auth/register', options);

export const useSuggestedUsers = (options?: any) => {
  const query = useApiQuery<User[]>('suggested-users', '/users/suggested', options);
  
  // Filter out current user and map backend fields
  const currentUserId = (() => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
      const parsed = JSON.parse(user);
      return parsed._id || parsed.id;
    } catch {
      return null;
    }
  })();

  return {
    ...query,
    data: query.data?.map((user: any) => ({
      ...user,
      id: user._id || user.id,
      skills: Array.isArray(user.skills) ? user.skills : [],
    })).filter((user) => user.id !== currentUserId) || [],
  };
};