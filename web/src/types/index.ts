// User related types
export interface User {
  id: string;
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
  id: string;
  name: string;
  category: string;
  proficiency: number;
}

// Session related types
export interface Session {
  id: string;
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

// Navigation item type
export interface NavItem {
  name: string;
  icon: string;
  path: string;
  isActive?: boolean;
}