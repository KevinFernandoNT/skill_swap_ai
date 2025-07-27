import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ExchangeSessionCard from './ExchangeSessionCard';
import { ExchangeSession } from '../../hooks/useGetUpcomingExchangeSessions';

interface UpcomingExchangeSessionsProps {
  sessions: ExchangeSession[];
  isLoading?: boolean;
  error?: any;
}

const UpcomingExchangeSessions: React.FC<UpcomingExchangeSessionsProps> = ({ sessions, isLoading = false, error = null }) => {
  const [selectedSession, setSelectedSession] = useState<ExchangeSession | null>(null);

  // Filter only upcoming sessions
  const upcomingSessions = sessions.filter(session => session.status === 'upcoming');
  
  const handleSessionClick = (session: ExchangeSession) => {
    setSelectedSession(session);
    // Handle modal opening if needed
  };

  const handleRescheduleClick = (session: ExchangeSession) => {
    // Handle reschedule if needed
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Upcoming Exchange Sessions (Next 3 Days)</h2>
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-1 text-gray-400 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            className="p-1 text-gray-400 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading upcoming exchange sessions...</p>
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <p className="text-red-400">Failed to load upcoming exchange sessions.</p>
          <p className="text-gray-500 text-sm mt-2">Please try again later.</p>
        </div>
      ) : upcomingSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingSessions.map(session => (
            <ExchangeSessionCard 
              key={session._id} 
              session={session} 
              onClick={() => handleSessionClick(session)}
              onRescheduleClick={() => handleRescheduleClick(session)}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-400">You have no upcoming exchange sessions in the next 3 days.</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingExchangeSessions; 