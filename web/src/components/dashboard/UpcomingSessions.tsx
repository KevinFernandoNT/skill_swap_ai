import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SessionCard from './SessionCard';
import SessionModal from './SessionModal';
import RescheduleModal from '../sessions/RescheduleModal';
import { Session } from '../../types';

interface UpcomingSessionsProps {
  sessions: Session[];
}

const UpcomingSessions: React.FC<UpcomingSessionsProps> = ({ sessions }) => {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rescheduleSession, setRescheduleSession] = useState<Session | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [sessionList, setSessionList] = useState(sessions);

  // Filter only upcoming sessions
  const upcomingSessions = sessions.filter(session => session.status === 'upcoming');
  
  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const handleRescheduleClick = (session: Session) => {
    setRescheduleSession(session);
    setIsRescheduleModalOpen(true);
  };

  const handleReschedule = (sessionId: string, newDate: string, newStartTime: string, newEndTime: string) => {
    setSessionList(prev => prev.map(s =>
      s.id === sessionId ? { ...s, date: newDate, startTime: newStartTime, endTime: newEndTime } : s
    ));
  };

  return (
    <>
      <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Upcoming Exchange Sessions</h2>
          
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
        
        {upcomingSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessionList.filter(session => session.status === 'upcoming').map(session => (
              <SessionCard 
                key={session.id} 
                session={session} 
                onClick={() => handleSessionClick(session)}
                onRescheduleClick={() => handleRescheduleClick(session)}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-400">No upcoming sessions.</p>
            <button 
              className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Schedule a Session
            </button>
          </div>
        )}
      </div>

      {/* Session Modal */}
      <SessionModal 
        session={selectedSession}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <RescheduleModal
        session={rescheduleSession}
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        onReschedule={handleReschedule}
        onCancel={() => {}}
      />
    </>
  );
};

export default UpcomingSessions;