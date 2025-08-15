import AnalyticsCard from './AnalyticsCard';
import { AnalyticsData, Session } from '../../types';
import { ExchangeSession } from '../../hooks/useGetUpcomingExchangeSessions';
import { useGetExchangeSessionStats } from '../../hooks/useGetExchangeSessionStats';

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
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Scheduled Exchange Sessions */}
      <AnalyticsCard
        title="Scheduled Sessions"
        value={statsLoading ? '...' : stats.scheduledExchangeSessions}
        icon="time"
        subtext="Upcoming exchanges"
      >
        <div className="space-y-2 mt-3">
          {upcomingExchangeSessions.slice(0, 3).map((session, index) => (
            <div key={session._id} className="text-xs text-gray-300">
              <div className="font-medium">{session.skillId.name} ↔ {session.requestedSkillId.name}</div>
              <div className="text-gray-400">{new Date(session.date).toLocaleDateString()}</div>
            </div>
          ))}
          {!statsLoading && stats.scheduledExchangeSessions === 0 && (
            <div className="text-xs text-gray-500">No scheduled sessions</div>
          )}
          {statsLoading && (
            <div className="text-xs text-gray-500">Loading...</div>
          )}
        </div>
      </AnalyticsCard>



      {/* Completed Exchange Sessions */}
      <AnalyticsCard
        title="Completed Sessions"
        value={statsLoading ? '...' : stats.completedExchangeSessions}
        icon="sessions"
        subtext="Successful exchanges"
      >
        <div className="space-y-2 mt-3">
          {!statsLoading && stats.completedExchangeSessions > 0 && (
            <div className="text-xs text-gray-300">
              <div className="font-medium">✓ {stats.completedExchangeSessions} exchange{stats.completedExchangeSessions !== 1 ? 's' : ''} completed</div>
              <div className="text-gray-400">Building your skill network</div>
            </div>
          )}
          {!statsLoading && stats.completedExchangeSessions === 0 && (
            <div className="text-xs text-gray-500">No completed sessions yet</div>
          )}
          {statsLoading && (
            <div className="text-xs text-gray-500">Loading...</div>
          )}
        </div>
      </AnalyticsCard>

      {/* Exchange Partners */}
      <AnalyticsCard
        title="Exchange Partners"
        value={statsLoading ? '...' : stats.uniqueExchangePartners}
        icon="connections"
        subtext="Unique skill partners"
      >
        <div className="space-y-2 mt-3">
          {!statsLoading && stats.uniqueExchangePartners > 0 && (
            <>
              <div className="text-xs text-gray-300">
                <div className="font-medium">🤝 {stats.uniqueExchangePartners} unique partner{stats.uniqueExchangePartners !== 1 ? 's' : ''}</div>
                <div className="text-gray-400">Growing your network</div>
              </div>
              
              {/* Recent Partners */}
              {stats.recentExchangePartners && stats.recentExchangePartners.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="text-xs text-gray-400 mb-2">Recent connections:</div>
                  <div className="flex flex-wrap gap-2">
                    {stats.recentExchangePartners.map((partner, index) => (
                      <div key={partner._id} className="flex items-center space-x-1">
                        <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                          {partner.avatar ? (
                            <img 
                              src={partner.avatar} 
                              alt={partner.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-300 font-medium">
                              {partner.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-300 truncate max-w-16" title={partner.name}>
                          {partner.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {!statsLoading && stats.uniqueExchangePartners === 0 && (
            <div className="text-xs text-gray-500">No exchange partners yet</div>
          )}
          {statsLoading && (
            <div className="text-xs text-gray-500">Loading...</div>
          )}
        </div>
      </AnalyticsCard>
    </div>
  );
};

export default AnalyticsCards;