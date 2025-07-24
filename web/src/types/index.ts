// User related types
export interface User {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  skills: Skill[];
  status?: 'online' | 'offline' | 'busy' | 'away';
  bio?: string;
  location?: string;
}

// Skill related types
export interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  type: 'teaching' | 'learning';
  agenda: string[];
  description?: string;
  experience?: string;
  goals?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

// Session related types
export interface Session {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  skillCategory: string;
  participant: User;
  status: 'upcoming' | 'completed' | 'cancelled';
  isTeaching: boolean;
  description?: string;
  maxParticipants?: number;
  isPublic?: boolean;
  pin?: string;
  swappedSkills?: {
    offeredSkill: string;
    requestedSkill: string;
    swapPartner: string;
  };
  subTopics?: string[];
}

// Analytics related types
export interface AnalyticsData {
  sessionsToday: {
    count: number;
    trend: number;
  };
  learningTime: {
    hours: number;
    data: { name: string; hours: number }[];
  };
  connections: {
    count: number;
    recent: User[];
  };
  skillsProgress: {
    skills: {
      name: string;
      progress: number;
    }[];
  };
}

// Activity related types
export interface Activity {
  id: string;
  type: 'session_completed' | 'feedback' | 'achievement';
  date: string;
  content: string;
  user?: User;
  relatedSkill?: string;
}

// Exchange Request related types
export interface ExchangeRequest {
  id: string;
  sessionId: string;
  session: Session;
  requester: User;
  recipient: User;
  offeredSkill: string;
  requestedSkill: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Session creation request type (matches backend CreateSessionDto)
export interface SessionRequest {
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  skillCategory: string;
  isTeaching: boolean;
  maxParticipants?: number;
  isPublic?: boolean;
  teachSkillId?: string;
  teachSkillName?: string;
  subTopics?: string[];
  meetingLink?: string;
  focusKeywords?: string[];
}

// Navigation item type
export interface NavItem {
  name: string;
  icon: string;
  path: string;
  isActive?: boolean;
}