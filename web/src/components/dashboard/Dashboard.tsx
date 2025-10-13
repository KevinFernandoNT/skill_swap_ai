import AnalyticsCards from './AnalyticsCards';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useGetUpcomingExchangeSessions } from '@/hooks/useGetUpcomingExchangeSessions';
import { Button } from '@/components/ui/button';
import { Crown, ArrowRight } from 'lucide-react';

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

  const handleNavigateToSubscription = () => {
    // Dispatch navigation event to switch to subscription page
    const event = new CustomEvent('navigateToTab', {
      detail: { tab: 'subscription' }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Subscription Upgrade Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Unlock Premium Features</h3>
              <p className="text-xs text-muted-foreground">
                Get unlimited exchanges, advanced analytics, and priority support
              </p>
            </div>
          </div>
          <Button 
            onClick={handleNavigateToSubscription}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
          >
            View Plans
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <AnalyticsCards 
        dashboardData={dashboardData?.data}
        upcomingExchangeSessions={upcomingExchangeSessions}
      />
    </div>
  );
};

export default Dashboard;