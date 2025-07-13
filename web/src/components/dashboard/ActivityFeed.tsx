import { Clock, Award, MessageSquare } from 'lucide-react';
import { Activity } from '../../types';

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }).format(date);
    }
  };
  
  // Function to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'session_completed':
        return <Clock className="w-5 h-5 text-green-500" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-purple-500" />;
      case 'feedback':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };
  
  // Function to get background color based on activity type
  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'session_completed':
        return 'bg-green-100';
      case 'achievement':
        return 'bg-purple-100';
      case 'feedback':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
      
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex">
            {/* Activity icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getActivityBgColor(activity.type)} flex items-center justify-center mr-4`}>
              {getActivityIcon(activity.type)}
            </div>
            
            {/* Activity content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800">{activity.content}</p>
              
              {/* Related skill tag if exists */}
              {activity.relatedSkill && (
                <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {activity.relatedSkill}
                </span>
              )}
              
              {/* Date */}
              <p className="mt-1 text-xs text-gray-500">{formatDate(activity.date)}</p>
            </div>
            
            {/* User avatar if exists */}
            {activity.user && (
              <div className="flex-shrink-0 ml-4">
                <img 
                  src={activity.user.avatar} 
                  alt={activity.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;