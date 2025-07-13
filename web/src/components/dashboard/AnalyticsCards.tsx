import AnalyticsCard from './AnalyticsCard';
import { AnalyticsData } from '../../types';
import { sessions, users } from '../../data/mockData';

interface AnalyticsCardsProps {
  data: AnalyticsData;
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ data }) => {
  // Get today's sessions
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(session => session.date === '2025-06-10'); // Using mock date
  
  // Get completed sessions count
  const completedSessions = sessions.filter(session => session.status === 'completed');
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Sessions Today */}
      <AnalyticsCard
        title="Sessions Today"
        value={todaySessions.length}
        icon="sessions"
        subtext="Scheduled sessions"
      >
        <div className="space-y-2 mt-3">
          {todaySessions.slice(0, 3).map((session, index) => (
            <div key={session.id} className="text-xs text-gray-300">
              <div className="font-medium">{session.title}</div>
              <div className="text-gray-400">with {session.participant.name}</div>
            </div>
          ))}
        </div>
      </AnalyticsCard>

      {/* Total Connections */}
      <AnalyticsCard
        title="Total Connections"
        value={users.length + 15} // Adding some extra to make it realistic
        icon="connections"
        subtext="Active connections"
      >
        <div className="flex -space-x-2 overflow-hidden mt-2">
          {users.slice(0, 4).map((user, index) => (
            <img
              key={user.id}
              className="inline-block h-6 w-6 rounded-full ring-2 ring-gray-900"
              src={user.avatar}
              alt={user.name}
            />
          ))}
          {users.length > 4 && (
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-xs font-medium text-white ring-2 ring-gray-900">
              +{users.length - 4}
            </div>
          )}
        </div>
      </AnalyticsCard>

      {/* Total Completed Sessions */}
      <AnalyticsCard
        title="Completed Sessions"
        value={completedSessions.length + 47} // Adding some extra for realism
        icon="time"
        trend={12}
        subtext="All time"
      />
    </div>
  );
};

export default AnalyticsCards;