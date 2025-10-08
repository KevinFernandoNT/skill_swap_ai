import { AnalyticsData, Session } from '../../types';
import { ExchangeSession } from '../../hooks/useGetUpcomingExchangeSessions';
import { useGetExchangeSessionStats } from '../../hooks/useGetExchangeSessionStats';
import { DashboardData } from '../../types/dashboard';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';
import { ChartLineDots } from '../ui/chart-line-dots';
import { ExpandableCards } from '../ui/expandable-cards';
import KPICards from './KPICards';
import SessionCategoryPieChart from './SessionCategoryPieChart';
import {
  IconCalendar,
  IconClock,
  IconUsers,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";

interface AnalyticsCardsProps {
  dashboardData?: DashboardData;
  data?: AnalyticsData;
  upcomingSessions?: Session[];
  upcomingExchangeSessions?: ExchangeSession[];
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ 
  dashboardData,
  data, 
  upcomingSessions = [], 
  upcomingExchangeSessions = [] 
}) => {
  // Use API data if available, otherwise fallback to existing hooks
  const { data: statsData, isLoading: statsLoading, error: statsError } = useGetExchangeSessionStats();
  const stats = dashboardData?.stats || statsData?.data || { completedExchangeSessions: 0, scheduledExchangeSessions: 0, uniqueExchangePartners: 0 };

  // Get today's sessions from the upcoming sessions
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = upcomingSessions.filter(session => session.date === today);
  const todayExchangeSessions = upcomingExchangeSessions.filter(session => session.date === today);
  
  // Get upcoming exchange sessions count (next 3 days) - fallback to API stats if data not available
  const upcomingExchangeCount = upcomingExchangeSessions.length || stats.scheduledExchangeSessions;

  // Use API data for recent connections and upcoming sessions if available
  const recentConnections = dashboardData?.recentConnections || [
    { name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", date: "2 hours ago" },
    { name: "Michael Chen", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", date: "1 day ago" },
    { name: "Emily Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", date: "3 days ago" },
  ];

  const upcomingSessionsList = dashboardData?.upcomingSessions?.map(session => ({
    title: session.title,
    date: new Date(session.date).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }),
    partner: session.partner.name
  })) || [
    { title: "React Advanced Concepts", date: "Today, 3:00 PM", partner: "Sarah Johnson" },
    { title: "Data Science Study Group", date: "Tomorrow, 5:30 PM", partner: "Michael Chen" },
    { title: "UI/UX Design Workshop", date: "Friday, 2:00 PM", partner: "Emily Rodriguez" },
  ];

  return (
    <div className="w-full h-full">
      {/* KPI Cards Row */}
      <KPICards 
        dashboardData={dashboardData}
        upcomingExchangeSessions={upcomingExchangeSessions} 
      />
      
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
                {upcomingSessionsList.length > 0 ? (
                  upcomingSessionsList.map((session, index) => (
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
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                      <IconCalendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">No sessions scheduled</p>
                    <p className="text-xs text-muted-foreground">Start by creating your first session</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </BentoGridItem>

        <BentoGridItem  className='h-[400px]'>
          <ExpandableCards />
        </BentoGridItem>

        <BentoGridItem  className='h-[400px] bg-transaparent border-0 p-0'>
          <SessionCategoryPieChart 
            skillCategories={dashboardData?.skillCategories}
            showDetails={true} 
          />
        </BentoGridItem>
        
        {/* Row 2 - Learning Progress chart spans 2 columns */}
        <BentoGridItem className="col-span-2 h-[400px]">
          <ChartLineDots learningProgress={dashboardData?.learningProgress} />
        </BentoGridItem>
      </BentoGrid>
    </div>
  );
};

export default AnalyticsCards;