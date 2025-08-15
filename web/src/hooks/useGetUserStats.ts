import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export interface UserStats {
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
    location?: string;
    bio?: string;
    createdAt: string;
  };
  stats: {
    rating: number;
    totalSessions: number;
    completedSessions: number;
    hostedSessions: number;
    participatedSessions: number;
    // Exchange-session specific stats returned by backend (optional for backward compatibility)
    completedExchangeSessions?: number;
    hostedExchangeSessions?: number;
  };
}

export const useGetUserStats = (userId: string | null) => {
  return useQuery({
    queryKey: ['userStats', userId],
    queryFn: async (): Promise<UserStats> => {
      if (!userId) throw new Error('User ID is required');
      const response = await api.get(`/users/${userId}/stats`);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 