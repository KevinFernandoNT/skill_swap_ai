import useGetRequest from "@/hooks/useGetRequest";

export interface ExchangeSession {
  _id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  skillCategory: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  maxParticipants?: number;
  isPublic?: boolean;
  hostId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  subTopics?: string[];
  meetingLink?: string;
  focusKeywords?: string[];
  skillId: {
    _id: string;
    name: string;
    category: string;
  };
  requestedSkillId: {
    _id: string;
    name: string;
    category: string;
  };
  requestedBy: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  // New fields for session agenda and requested skill focus keywords
  sessionAgenda?: string[];
  requestedSkillFocusKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useGetUpcomingExchangeSessions = (params?: Record<string, any>, options?: any) =>
  useGetRequest<PaginatedResult<ExchangeSession>>("/exchange-sessions/upcoming-dashboard", params, options); 