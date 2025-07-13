import { User, Skill, Session, AnalyticsData, Activity, ExchangeRequest } from '../types';

// Mock Users
export const currentUser: User = {
  id: 'u1',
  name: 'Alex Johnson',
  avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=150',
  email: 'alex.johnson@example.com',
  bio: 'Passionate software developer with 5+ years of experience in React and Node.js. Love sharing knowledge and learning from others.',
  location: 'San Francisco, CA',
  skills: [
    { id: 's1', name: 'JavaScript', category: 'Programming', proficiency: 85 },
    { id: 's2', name: 'React', category: 'Programming', proficiency: 78 },
    { id: 's3', name: 'UX Design', category: 'Design', proficiency: 62 }
  ]
};

export const users: User[] = [
  {
    id: 'u2',
    name: 'Sarah Williams',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    email: 'sarah.williams@example.com',
    bio: 'Creative UI/UX designer passionate about creating intuitive user experiences. Specialized in design systems and user research.',
    location: 'New York, NY',
    skills: [
      { id: 's4', name: 'Figma', category: 'Design', proficiency: 90 },
      { id: 's5', name: 'User Research', category: 'Design', proficiency: 85 }
    ],
    status: 'online'
  },
  {
    id: 'u3',
    name: 'Michael Chen',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    email: 'michael.chen@example.com',
    bio: 'Data scientist with expertise in machine learning and statistical analysis. Love working with Python and helping others learn data science.',
    location: 'Seattle, WA',
    skills: [
      { id: 's6', name: 'Python', category: 'Programming', proficiency: 95 },
      { id: 's7', name: 'Machine Learning', category: 'Data Science', proficiency: 88 }
    ],
    status: 'busy'
  },
  {
    id: 'u4',
    name: 'Emma Roberts',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
    email: 'emma.roberts@example.com',
    bio: 'Experienced product manager with a focus on agile methodologies and user-centered design. Passionate about building great products.',
    location: 'Austin, TX',
    skills: [
      { id: 's8', name: 'Agile', category: 'Management', proficiency: 92 },
      { id: 's9', name: 'User Stories', category: 'Management', proficiency: 87 }
    ],
    status: 'offline'
  },
  {
    id: 'u5',
    name: 'David Kim',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    email: 'david.kim@example.com',
    bio: 'Mobile developer specializing in iOS and cross-platform development. Experienced in Swift, Flutter, and React Native.',
    location: 'Los Angeles, CA',
    skills: [
      { id: 's10', name: 'Swift', category: 'Programming', proficiency: 89 },
      { id: 's11', name: 'Flutter', category: 'Programming', proficiency: 81 }
    ],
    status: 'away'
  },
  {
    id: 'u6',
    name: 'Julia Martinez',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    email: 'julia.martinez@example.com',
    bio: 'Content strategist and SEO specialist. Help businesses create compelling content that drives engagement and conversions.',
    location: 'Miami, FL',
    skills: [
      { id: 's12', name: 'Content Writing', category: 'Marketing', proficiency: 94 },
      { id: 's13', name: 'SEO', category: 'Marketing', proficiency: 86 }
    ],
    status: 'online'
  }
];

// Mock Sessions
export const sessions: Session[] = [
  {
    id: 'session1',
    title: 'React Hooks Deep Dive',
    date: '2025-06-10',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    skillCategory: 'Programming',
    participant: users[0],
    status: 'upcoming',
    isTeaching: false,
    description: 'Learn advanced React hooks patterns and best practices',
    maxParticipants: 5,
    isPublic: true
  },
  {
    id: 'session2',
    title: 'User Research Basics',
    date: '2025-06-11',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    skillCategory: 'Design',
    participant: users[1],
    status: 'upcoming',
    isTeaching: true,
    description: 'Introduction to user research methodologies and tools',
    maxParticipants: 8,
    isPublic: true
  },
  {
    id: 'session3',
    title: 'Introduction to Python',
    date: '2025-06-12',
    startTime: '3:30 PM',
    endTime: '5:00 PM',
    skillCategory: 'Programming',
    participant: users[2],
    status: 'upcoming',
    isTeaching: false,
    description: 'Python fundamentals for beginners',
    maxParticipants: 1,
    isPublic: false,
    pin: '1234'
  },
  {
    id: 'session4',
    title: 'Agile Project Management',
    date: '2025-06-15',
    startTime: '1:00 PM',
    endTime: '2:30 PM',
    skillCategory: 'Management',
    participant: users[3],
    status: 'upcoming',
    isTeaching: false,
    description: 'Learn agile methodologies and project management best practices',
    maxParticipants: 1,
    isPublic: false,
    pin: '5678'
  },
  {
    id: 'session5',
    title: 'Mobile UI Best Practices',
    date: '2025-06-08',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    skillCategory: 'Design',
    participant: users[4],
    status: 'completed',
    isTeaching: true,
    description: 'Design principles for mobile applications',
    maxParticipants: 6,
    isPublic: true
  },
  {
    id: 'session6',
    title: 'Advanced Data Visualization',
    date: '2025-06-17',
    startTime: '4:00 PM',
    endTime: '5:30 PM',
    skillCategory: 'Data Science',
    participant: users[2],
    status: 'upcoming',
    isTeaching: true,
    description: 'Master D3.js and advanced charting techniques',
    maxParticipants: 4,
    isPublic: false,
    pin: '9999'
  },
  {
    id: 'session7',
    title: 'Product Strategy Workshop',
    date: '2025-06-18',
    startTime: '9:00 AM',
    endTime: '11:00 AM',
    skillCategory: 'Management',
    participant: users[3],
    status: 'upcoming',
    isTeaching: true,
    description: 'Strategic product planning and roadmap development',
    maxParticipants: 3,
    isPublic: false,
    pin: '4321'
  }
];

// Mock Analytics Data
export const analyticsData: AnalyticsData = {
  sessionsToday: {
    count: 3,
    trend: 15
  },
  learningTime: {
    hours: 28,
    data: [
      { name: 'Mon', hours: 2 },
      { name: 'Tue', hours: 4 },
      { name: 'Wed', hours: 3 },
      { name: 'Thu', hours: 5 },
      { name: 'Fri', hours: 6 },
      { name: 'Sat', hours: 4 },
      { name: 'Sun', hours: 4 }
    ]
  },
  connections: {
    count: 12,
    recent: users.slice(0, 5)
  },
  skillsProgress: {
    skills: [
      { name: 'JavaScript', progress: 85 },
      { name: 'React', progress: 78 },
      { name: 'UX Design', progress: 62 },
      { name: 'Node.js', progress: 45 }
    ]
  }
};

// Mock Activity Feed
export const activities: Activity[] = [
  {
    id: 'a1',
    type: 'session_completed',
    date: '2025-06-08',
    content: 'Completed a session on Mobile UI Best Practices',
    user: users[4],
    relatedSkill: 'Design'
  },
  {
    id: 'a2',
    type: 'feedback',
    date: '2025-06-07',
    content: 'Received positive feedback for React Hooks session',
    user: users[0],
    relatedSkill: 'Programming'
  },
  {
    id: 'a3',
    type: 'achievement',
    date: '2025-06-06',
    content: 'Earned "Skill Sharer" badge for completing 10 sessions',
    user: currentUser,
    relatedSkill: 'General'
  }
];

// Mock Exchange Requests
export const exchangeRequests: ExchangeRequest[] = [
  {
    id: 'er1',
    sessionId: 'session1',
    session: sessions[0], // React Hooks Deep Dive
    requester: currentUser,
    recipient: users[0], // Sarah Williams
    offeredSkill: 'JavaScript',
    requestedSkill: 'Figma',
    message: 'I can help you with JavaScript and React patterns in exchange for learning Figma design principles.',
    status: 'pending',
    createdAt: '2025-06-09T10:30:00Z',
    updatedAt: '2025-06-09T10:30:00Z'
  },
  {
    id: 'er2',
    sessionId: 'session2',
    session: sessions[1], // User Research Basics
    requester: users[1], // Sarah Williams
    recipient: currentUser,
    offeredSkill: 'User Research',
    requestedSkill: 'React',
    message: 'I\'d love to teach you user research methods in exchange for React development skills.',
    status: 'accepted',
    createdAt: '2025-06-08T14:20:00Z',
    updatedAt: '2025-06-08T16:45:00Z'
  },
  {
    id: 'er3',
    sessionId: 'session6',
    session: sessions[5], // Advanced Data Visualization
    requester: currentUser,
    recipient: users[2], // Michael Chen
    offeredSkill: 'UX Design',
    requestedSkill: 'Machine Learning',
    message: 'I can help you with UX design principles for data visualization in exchange for ML fundamentals.',
    status: 'rejected',
    createdAt: '2025-06-07T09:15:00Z',
    updatedAt: '2025-06-07T11:30:00Z'
  },
  {
    id: 'er4',
    sessionId: 'session7',
    session: sessions[6], // Product Strategy Workshop
    requester: users[3], // Emma Roberts
    recipient: currentUser,
    offeredSkill: 'Agile',
    requestedSkill: 'JavaScript',
    message: 'I can teach you agile methodologies and product strategy in exchange for JavaScript programming.',
    status: 'pending',
    createdAt: '2025-06-09T08:45:00Z',
    updatedAt: '2025-06-09T08:45:00Z'
  },
  {
    id: 'er5',
    sessionId: 'session3',
    session: sessions[2], // Introduction to Python
    requester: currentUser,
    recipient: users[2], // Michael Chen
    offeredSkill: 'React',
    requestedSkill: 'Python',
    message: 'I can help you with React development in exchange for Python programming basics.',
    status: 'cancelled',
    createdAt: '2025-06-06T13:20:00Z',
    updatedAt: '2025-06-06T15:10:00Z'
  }
];