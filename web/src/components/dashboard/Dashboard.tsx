import AnalyticsCards from './AnalyticsCards';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useGetUpcomingExchangeSessions } from '@/hooks/useGetUpcomingExchangeSessions';

const Dashboard: React.FC = () => {
  // Fetch dashboard data from API
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useDashboardData();
  
  // Fetch upcoming exchange sessions for next 3 days (fallback)
  const { data: upcomingExchangeSessionsResult, isLoading: exchangeSessionsLoading, error: exchangeSessionsError } = useGetUpcomingExchangeSessions();
  const upcomingExchangeSessions = upcomingExchangeSessionsResult?.data || [];

  // Debug logging
  console.log('Dashboard component state:', {
    dashboardLoading,
    dashboardError,
    dashboardData,
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user')
  });

  if (dashboardLoading) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="text-center text-destructive">
          <p>Failed to load dashboard data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <AnalyticsCards 
        dashboardData={dashboardData?.data}
        upcomingExchangeSessions={upcomingExchangeSessions}
      />
    </div>
  );
};

export default Dashboard;