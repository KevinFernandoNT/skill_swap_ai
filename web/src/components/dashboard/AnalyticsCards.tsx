import { AnalyticsData, Session } from '../../types';
import { ExchangeSession } from '../../hooks/useGetUpcomingExchangeSessions';
import { useGetExchangeSessionStats } from '../../hooks/useGetExchangeSessionStats';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';
import { ChartLineDots } from '../ui/chart-line-dots';
import { ChartBarSessions } from '../ui/chart-bar-sessions';
import { ExpandableCards } from '../ui/expandable-cards';
import {
  IconCalendar,
  IconClock,
  IconUsers,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";

interface AnalyticsCardsProps {
  data: AnalyticsData;
  upcomingSessions?: Session[];
  upcomingExchangeSessions?: ExchangeSession[];
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ 
  data, 
  upcomingSessions = [], 
  upcomingExchangeSessions = [] 
}) => {
  // Get exchange session statistics
  const { data: statsData, isLoading: statsLoading, error: statsError } = useGetExchangeSessionStats();
  const stats = statsData?.data || { completedExchangeSessions: 0, scheduledExchangeSessions: 0, uniqueExchangePartners: 0 };

  // Get today's sessions from the upcoming sessions
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = upcomingSessions.filter(session => session.date === today);
  const todayExchangeSessions = upcomingExchangeSessions.filter(session => session.date === today);
  
  // Get upcoming exchange sessions count (next 3 days) - fallback to API stats if data not available
  const upcomingExchangeCount = upcomingExchangeSessions.length || stats.scheduledExchangeSessions;

  // Mock data for recent connections and upcoming sessions
  const recentConnections = [
    { name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", date: "2 hours ago" },
    { name: "Michael Chen", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", date: "1 day ago" },
    { name: "Emily Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", date: "3 days ago" },
  ];

  const upcomingSessionsList = [
    { title: "React Advanced Concepts", date: "Today, 3:00 PM", partner: "Sarah Johnson" },
    { title: "Data Science Study Group", date: "Tomorrow, 5:30 PM", partner: "Michael Chen" },
    { title: "UI/UX Design Workshop", date: "Friday, 2:00 PM", partner: "Emily Rodriguez" },
  ];

  return (
    <div className="w-full h-full">
      <BentoGrid className="w-full h-full">
        {/* Row 1 */}
        <BentoGridItem className='h-[400px]'>
          <div className="w-full h-full flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Scheduled Sessions</h3>
              <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                <IconTrendingUp className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary">+12.5%</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="text-3xl font-bold text-foreground mb-1">
                {statsLoading ? '...' : stats.scheduledExchangeSessions}
              </div>
              <p className="text-sm text-muted-foreground mb-3">Upcoming exchanges</p>
              
              <div className="space-y-2 flex-1">
                {upcomingSessionsList.map((session, index) => (
                  <div key={index} className="p-3 flex items-center gap-3 hover:bg-muted rounded-xl cursor-pointer border border-border">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{session.title}</p>
                      <p className="text-xs text-muted-foreground">{session.date}</p>
                    </div>
                    <button className="px-3 py-1 text-xs rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </BentoGridItem>

        <BentoGridItem  className='h-[400px]'>
          <ChartBarSessions />
        </BentoGridItem>

        <BentoGridItem  className='h-[400px]'>
          <div className="w-full h-full flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Exchange Partners</h3>
              <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                <IconTrendingUp className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary">+15.3%</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="text-3xl font-bold text-foreground mb-1">
                {statsLoading ? '...' : stats.uniqueExchangePartners}
              </div>
              <p className="text-sm text-muted-foreground mb-3">Recent Connections</p>
              
              <div className="space-y-2 flex-1">
                {recentConnections.map((connection, index) => (
                  <div key={index} className="p-3 flex items-center gap-3 hover:bg-muted rounded-xl cursor-pointer border border-border">
                    <img 
                      src={connection.avatar} 
                      alt={connection.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{connection.name}</p>
                      <p className="text-xs text-muted-foreground">{connection.date}</p>
                    </div>
                    <button className="px-3 py-1 text-xs rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </BentoGridItem>
        
        {/* Row 2 - Chart spans 2 columns, ExpandableCards in 3rd column */}
        <BentoGridItem className="col-span-2">
          <ChartLineDots />
        </BentoGridItem>
        <BentoGridItem>
          <ExpandableCards />
        </BentoGridItem>
      </BentoGrid>
    </div>
  );
};

export default AnalyticsCards;