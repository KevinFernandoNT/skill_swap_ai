import AnalyticsCards from './AnalyticsCards';
import { analyticsData } from '../../data/mockData';
import { useGetUpcomingExchangeSessions } from '@/hooks/useGetUpcomingExchangeSessions';

const Dashboard: React.FC = () => {
  // Fetch upcoming exchange sessions for next 3 days
  const { data: upcomingExchangeSessionsResult, isLoading: exchangeSessionsLoading, error: exchangeSessionsError } = useGetUpcomingExchangeSessions();
  const upcomingExchangeSessions = upcomingExchangeSessionsResult?.data || [];

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <AnalyticsCards 
        data={analyticsData} 
        upcomingExchangeSessions={upcomingExchangeSessions}
      />
    </div>
  );
};

export default Dashboard;