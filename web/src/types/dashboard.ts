export interface DashboardData {
  user: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  stats: {
    totalSessions: number;
    completedSessions: number;
    scheduledSessions: number;
    uniquePartners: number;
  };
  kpiAnalytics: KPIAnalytics;
  upcomingSessions: UpcomingSession[];
  recentConnections: RecentConnection[];
  skillCategories: SkillCategory[];
  learningProgress: LearningProgress[];
  todaySessions: TodaySession[];
}

export interface KPIAnalytics {
  todaySessions: {
    count: number;
    trend: string;
    message: string;
  };
  completedSessions: {
    count: number;
    change: number;
    trend: string;
    message: string;
    chartData: ChartDataPoint[];
  };
  growthRate: {
    rate: number;
    trend: string;
    message: string;
    engagement: string;
    chartData: ChartDataPoint[];
  };
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface UpcomingSession {
  id: string;
  title: string;
  date: string;
  partner: {
    _id: string;
    name: string;
    avatar: string;
  };
  status: string;
  skill: string;
}

export interface RecentConnection {
  id: string;
  name: string;
  avatar: string;
  date: string;
}

export interface SkillCategory {
  _id: string;
  count: number;
}

export interface LearningProgress {
  name: string;
  hours: number;
}

export interface TodaySession {
  id: string;
  title: string;
  time: string;
  partner: {
    _id: string;
    name: string;
    avatar: string;
  };
  status: string;
}

export interface DashboardApiResponse {
  success: boolean;
  data: DashboardData;
}
