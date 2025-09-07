import { Calendar, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { Session } from '../../types';
import { Button } from '@/components/ui/button';

interface SessionCardProps {
  session: Session;
  onClick: () => void;
  onRescheduleClick?: () => void;
  onDeleteClick?: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onClick, onRescheduleClick, onDeleteClick }) => {
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
        return 'bg-blue-100 text-blue-800';
      case 'design':
        return 'bg-purple-100 text-purple-800';
      case 'management':
        return 'bg-green-100 text-green-800';
      case 'marketing':
        return 'bg-orange-100 text-orange-800';
      case 'data science':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Generate tags based on session data
  const getSessionTags = () => {
    const tags = [];
    if (session.skillCategory) tags.push(session.skillCategory);
    if (session.isTeaching) tags.push('Teaching');
    else tags.push('Learning');
    if (session.isPublic) tags.push('Public');
    else tags.push('Private');
    return tags.slice(0, 3); // Limit to 3 tags
  };

  return (
    <div 
      className="bg-card border border-border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer group max-w-md"
      onClick={onClick}
    >
      {/* Card Header with Delete Button */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Title */}
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
            {session.title}
          </h3>
        </div>
        {onDeleteClick && (
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick();
            }}
            className="h-6 w-6 p-0 ml-2 flex-shrink-0"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      {/* Card Content */}
      <div className="mb-4">
        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">
          {session.description || 'Join this skill exchange session to learn and grow together.'}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {getSessionTags().map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Session Details */}
      <div className="space-y-1.5 text-sm text-muted-foreground mb-3">
        <div className="flex items-center">
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          <span>{getFormattedDate(session.date)}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          <span>{session.startTime} - {session.endTime}</span>
        </div>
      </div>

      {/* Explore Section */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-sm font-semibold text-foreground">Explore</span>
        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

export default SessionCard;