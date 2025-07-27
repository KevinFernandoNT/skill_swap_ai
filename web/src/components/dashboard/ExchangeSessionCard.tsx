import { Calendar, Clock, ArrowRightLeft } from 'lucide-react';
import { ExchangeSession } from '../../hooks/useGetUpcomingExchangeSessions';
import UserProfile from '../ui/UserProfile';

interface ExchangeSessionCardProps {
  session: ExchangeSession;
  onClick: () => void;
  onRescheduleClick?: () => void;
}

const ExchangeSessionCard: React.FC<ExchangeSessionCardProps> = ({ session, onClick, onRescheduleClick }) => {
  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    }).format(date);
  };

  // Determine the skill category background color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'programming':
        return 'bg-blue-900 text-blue-300';
      case 'design':
        return 'bg-purple-900 text-purple-300';
      case 'management':
        return 'bg-green-900 text-green-300';
      case 'marketing':
        return 'bg-orange-900 text-orange-300';
      case 'data science':
        return 'bg-teal-900 text-teal-300';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  return (
    <div 
      className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-5 transition-all duration-300 hover:shadow-md hover:border-primary/50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(session.skillCategory)}`}>
              {session.skillCategory}
            </span>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-300">
              <ArrowRightLeft className="w-3 h-3 mr-1" />
              Exchange
            </span>
          </div>
          <h3 className="text-lg font-medium text-white">{session.title}</h3>
          
          {/* Skills Exchange Information */}
          <div className="mt-2 mb-3 p-2 bg-gray-800 rounded-md">
            <div className="text-xs text-gray-400 mb-1">Skill Exchange:</div>
            <div className="flex items-center text-sm">
              <span className="text-green-400">{session.skillId.name}</span>
              <ArrowRightLeft className="w-3 h-3 mx-2 text-gray-500" />
              <span className="text-orange-400">{session.requestedSkillId.name}</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-1 text-sm text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5" />
              <span>{getFormattedDate(session.date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5" />
              <span>{session.startTime} - {session.endTime}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <div className="text-xs text-gray-400">Host:</div>
          <UserProfile user={session.hostId} showEmail={false} />
          <div className="text-xs text-gray-400">Requested by:</div>
          <UserProfile user={session.requestedBy} showEmail={false} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
        <div className="text-xs text-gray-500">
          {session.isPublic ? 'Public Exchange' : 'Private Exchange'}
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-gray-900"
            onClick={(e) => {
              e.stopPropagation();
              if (onRescheduleClick) onRescheduleClick();
            }}
            aria-label="Reschedule"
          >
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExchangeSessionCard; 