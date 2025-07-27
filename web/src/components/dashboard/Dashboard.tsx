import Header from './Header';
import AnalyticsCards from './AnalyticsCards';
import UpcomingExchangeSessions from './UpcomingExchangeSessions';
import SuggestedConnections from './SuggestedConnections';
import { analyticsData } from '../../data/mockData';
import { useGetUpcomingExchangeSessions } from '@/hooks/useGetUpcomingExchangeSessions';

const Dashboard: React.FC = () => {
  // Fetch upcoming exchange sessions for next 3 days
  const { data: upcomingExchangeSessionsResult, isLoading: exchangeSessionsLoading, error: exchangeSessionsError } = useGetUpcomingExchangeSessions();
  const upcomingExchangeSessions = upcomingExchangeSessionsResult?.data || [];

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="space-y-8">
          {/* Analytics Cards Section */}
          <AnalyticsCards 
            data={analyticsData} 
            upcomingExchangeSessions={upcomingExchangeSessions}
          />
          
          {/* Upcoming Exchange Sessions Section */}
          <UpcomingExchangeSessions 
            sessions={upcomingExchangeSessions} 
            isLoading={exchangeSessionsLoading}
            error={exchangeSessionsError}
          />
          
          {/* Suggested Connections Section */}
          <div className="grid grid-cols-1">
            <SuggestedConnections />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;