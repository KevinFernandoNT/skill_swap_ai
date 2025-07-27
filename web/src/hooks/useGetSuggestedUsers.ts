import useGetRequest from "@/hooks/useGetRequest";

export interface SuggestedUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  matchingType: 'can_teach' | 'wants_to_learn' | 'mutual_match';
  matchingSkills: Array<{
    _id: string;
    name: string;
    category: string;
    proficiency: number;
    description?: string;
    metadata?: string[];
    skillType: 'teaching' | 'learning';
  }>;
}

export interface SuggestedUsersApiResponse {
  success: boolean;
  data: SuggestedUser[];
}

export const useGetSuggestedUsers = (options?: any) =>
  useGetRequest<SuggestedUsersApiResponse>("/skills/suggested-users", undefined, options); 