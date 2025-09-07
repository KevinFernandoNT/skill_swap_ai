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
  experience?: string;
  focusedTopics?: string;
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
  hostId: User;
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
  teachSkillId?: Skill[];
  teachSkillName?: string;
  meetingLink?: string;
  focusKeywords?: string[];
  metadata?: string[];
  matchingType?: string;
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
  _id: string;
  sessionId: {
    _id: string;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    skillCategory: string;
    status: string;
    isTeaching: boolean;
    maxParticipants: number;
    isPublic: boolean;
    hostId: string;
    participants: any[];
    teachSkillId: string[];
    teachSkillName: string;
    meetingLink: string;
    focusKeywords: string[];
    metadata: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  requester: {
    _id: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    location: string;
  };
  recipient: {
    _id: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    location: string;
  };
  offeredSkillId: {
    _id: string;
    name: string;
    category: string;
    proficiency: number;
    type: string;
    description: string;
    experience: string;
    goals: string;
    agenda: string[];
    metadata: string[];
    userId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  requestedSkillId: {
    _id: string;
    name: string;
    category: string;
    proficiency: number;
    type: string;
    description: string;
    experience: string;
    goals: string;
    agenda: string[];
    metadata: string[];
    userId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  __v: number;
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

export interface Notification {
  _id: string;
  recipient: string;
  title: string;
  message: string;
  type: string;
  exchangeRequestId?: string;
  sessionId?: string;
  sender?: {
    _id: string;
    name: string;
    avatar: string;
  };
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}