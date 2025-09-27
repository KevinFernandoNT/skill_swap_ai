import React from 'react';
import { Calendar, Clock, User, ArrowRightLeft, CheckCircle, XCircle, MessageCircle, Tag, MapPin, Users, Target } from 'lucide-react';
import { ExchangeSession } from '@/hooks/useGetUpcomingExchangeSessions';
import {
  CustomSheet as Sheet,
  CustomSheetContent as SheetContent,
  CustomSheetDescription as SheetDescription,
  CustomSheetHeader as SheetHeader,
  CustomSheetTitle as SheetTitle,
} from "@/components/ui/custom-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ExchangeSessionDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  session: ExchangeSession | null;
  onComplete?: (sessionId: string) => void;
}

const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    'upcoming': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'expired': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  };
  return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return <Clock className="w-3 h-3 mr-1" />;
    case 'completed':
      return <CheckCircle className="w-3 h-3 mr-1" />;
    case 'expired':
      return <XCircle className="w-3 h-3 mr-1" />;
    default:
      return <Clock className="w-3 h-3 mr-1" />;
  }
};

export function ExchangeSessionDetailsSheet({ 
  isOpen, 
  onOpenChange, 
  session,
  onComplete
}: ExchangeSessionDetailsSheetProps) {
  if (!session) return null;

  // Determine current user id for display purposes
  const currentUserId = (() => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      const u = JSON.parse(userStr);
      return u?._id || u?.id || null;
    } catch {
      return null;
    }
  })();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[700px] sm:w-[900px] lg:w-[1100px] xl:w-[1300px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-foreground">
            Exchange Session Details
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Detailed information about this skill exchange session
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className={getStatusColor(session.status)}>
              {getStatusIcon(session.status)}
              {session.status?.charAt(0).toUpperCase() + session.status?.slice(1).toLowerCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Created on {formatDate(session.createdAt || session.date)}
            </span>
          </div>

          {/* Session Information */}
          <div className="bg-muted/20 rounded-lg p-6 border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-[20px] font-semibold text-foreground">Session Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-[20px] text-foreground mb-2">{session.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {session.description || 'No description available'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Date:</span>
                  <span className="text-foreground">
                    {session.date ? formatDate(session.date) : 'TBD'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Time:</span>
                  <span className="text-foreground">
                    {session.startTime && session.endTime 
                      ? `${session.startTime} - ${session.endTime}` 
                      : 'TBD'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Max Participants:</span>
                  <span className="text-foreground">{session.maxParticipants || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Category:</span>
                  <span className="text-foreground">{session.skillCategory || 'N/A'}</span>
                </div>
              </div>

              {/* Session Agenda */}
              {session.sessionAgenda && session.sessionAgenda.length > 0 && (
                <div>
                  <h5 className="font-medium text-foreground mb-2">Session Agenda</h5>
                  <div className="flex flex-wrap gap-2">
                    {session.sessionAgenda.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skill Exchange Details */}
          <div className="bg-muted/20 rounded-lg p-6 border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <ArrowRightLeft className="w-5 h-5 text-primary" />
              <h3 className="text-[20px] font-semibold text-foreground">Exchange Information</h3>
            </div>
            
            <div className="space-y-4">
              {/* Teaching Skill */}
              <div className="bg-background/50 rounded-lg p-4">
                <h4 className="font-medium text-[20px] text-foreground mb-2">Teaching Skill</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {session.skillId?.name || 'Skill Name'}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {session.skillId?.category || 'Category'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {session.skillId?.description || 'No description available'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Proficiency: {session.skillId?.proficiency || 0}%</span>
                    <span>•</span>
                    <span>Type: {session.skillId?.type || 'N/A'}</span>
                  </div>
                  
                  {/* Teaching Skill Focus Keywords */}
                  {session.skillId?.agenda && session.skillId.agenda.length > 0 && (
                    <div className="mt-3">
                      <h6 className="font-medium text-foreground mb-2 text-sm">Focus Areas</h6>
                      <div className="flex flex-wrap gap-1">
                        {session.skillId.agenda.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Learning Skill */}
              <div className="bg-background/50 rounded-lg p-4">
                <h4 className="font-medium text-[20px] text-foreground mb-2">Learning Skill</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {session.requestedSkillId?.name || 'Skill Name'}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {session.requestedSkillId?.category || 'Category'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {session.requestedSkillId?.description || 'No description available'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Proficiency: {session.requestedSkillId?.proficiency || 0}%</span>
                    <span>•</span>
                    <span>Type: {session.requestedSkillId?.type || 'N/A'}</span>
                  </div>
                  
                  {/* Learning Skill Focus Keywords */}
                  {session.requestedSkillFocusKeywords && session.requestedSkillFocusKeywords.length > 0 && (
                    <div className="mt-3">
                      <h6 className="font-medium text-foreground mb-2 text-sm">Focus Areas</h6>
                      <div className="flex flex-wrap gap-1">
                        {session.requestedSkillFocusKeywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Participants Information */}
          <div className="bg-muted/20 rounded-lg p-6 border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-[20px] font-semibold text-foreground">Participants</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Host */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={session.hostId?.avatar} 
                    alt={session.hostId?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center" style={{ display: 'none' }}>
                    <span className="text-white text-[16px] font-semibold">
                      {session.hostId?.name?.charAt(0) || 'H'}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-[16px] text-foreground">
                    {currentUserId && session.hostId?._id === currentUserId ? 'You' : session.hostId?.name || 'Unknown Host'}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {session.hostId?.email || 'No email available'}
                  </p>
                  {session.hostId?.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{session.hostId.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Requested By */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={session.requestedBy?.avatar} 
                    alt={session.requestedBy?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center" style={{ display: 'none' }}>
                    <span className="text-white text-[16px] font-semibold">
                      {session.requestedBy?.name?.charAt(0) || 'R'}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-[16px] text-foreground">
                    {currentUserId && session.requestedBy?._id === currentUserId ? 'You' : session.requestedBy?.name || 'Unknown User'}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {session.requestedBy?.email || 'No email available'}
                  </p>
                  {session.requestedBy?.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{session.requestedBy.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Meeting Link */}
          {session.meetingLink && (
            <div className="bg-muted/20 rounded-lg p-6 border border-border/50">
              <h3 className="text-[20px] font-semibold text-foreground mb-3">Meeting Link</h3>
              <a
                href={session.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 text-sm break-all"
              >
                {session.meetingLink}
              </a>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {session.meetingLink && session.meetingLink.trim() !== '' && (
              <Button asChild>
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Meeting
                </a>
              </Button>
            )}
            {session.status === 'upcoming' && onComplete && (
              <Button 
                onClick={() => onComplete(session._id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Complete
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
