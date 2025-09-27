import React from 'react';
import { Calendar, Clock, User, ArrowRightLeft, CheckCircle, XCircle, MessageCircle, Tag, MapPin } from 'lucide-react';
import { ExchangeRequest } from '../../types';
import {
  CustomSheet as Sheet,
  CustomSheetContent as SheetContent,
  CustomSheetDescription as SheetDescription,
  CustomSheetHeader as SheetHeader,
  CustomSheetTitle as SheetTitle,
} from "@/components/ui/custom-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ExchangeRequestDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  request: ExchangeRequest | null;
}

const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    'accepted': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'rejected': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    'cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
  };
  return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Clock className="w-3 h-3 mr-1" />;
    case 'accepted':
      return <CheckCircle className="w-3 h-3 mr-1" />;
    case 'rejected':
      return <XCircle className="w-3 h-3 mr-1" />;
    case 'cancelled':
      return <XCircle className="w-3 h-3 mr-1" />;
    default:
      return <Clock className="w-3 h-3 mr-1" />;
  }
};

export function ExchangeRequestDetailsSheet({ 
  isOpen, 
  onOpenChange, 
  request 
}: ExchangeRequestDetailsSheetProps) {
  if (!request) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[700px] sm:w-[900px] lg:w-[1100px] xl:w-[1300px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-foreground">
            Exchange Request Details
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Detailed information about this skill swap request
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className={getStatusColor(request.status)}>
              {getStatusIcon(request.status)}
              {request.status?.charAt(0).toUpperCase() + request.status?.slice(1).toLowerCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Requested on {new Date(request.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Session Information */}
          <div className="bg-muted/20 rounded-lg p-6 border border-border/50">
            <div className="flex items-center gap-2 mb-4">
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">{request.sessionId?.title || 'Session Title'}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {request.sessionId?.description || 'No description available'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Date:</span>
                  <span className="text-foreground">
                    {request.sessionId?.date ? new Date(request.sessionId.date).toLocaleDateString() : 'TBD'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Time:</span>
                  <span className="text-foreground">
                    {request.sessionId?.startTime && request.sessionId?.endTime 
                      ? `${request.sessionId.startTime} - ${request.sessionId.endTime}` 
                      : 'TBD'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Max Participants:</span>
                  <span className="text-foreground">{request.sessionId?.maxParticipants || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Category:</span>
                  <span className="text-foreground">{request.sessionId?.skillCategory || 'N/A'}</span>
                </div>
              </div>

              {/* Session Focus Keywords */}
              {request.sessionId?.focusKeywords && request.sessionId.focusKeywords.length > 0 && (
                <div>
                  <h5 className="font-medium text-foreground mb-2">Session Focus Topics</h5>
                  <div className="flex flex-wrap gap-2">
                    {request.sessionId.focusKeywords.map((keyword, index) => (
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
              {/* Offered Skill */}
              <div className="bg-background/50 rounded-lg p-4">
                <h4 className="font-medium text-[20px] text-foreground mb-2">Offered Skill</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {request.offeredSkillId?.name || 'Skill Name'}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {request.offeredSkillId?.category || 'Category'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {request.offeredSkillId?.description || 'No description available'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Proficiency: {request.offeredSkillId?.proficiency || 0}%</span>
                    <span>•</span>
                    <span>Type: {request.offeredSkillId?.type || 'N/A'}</span>
                  </div>
                  
                  {/* Offered Skill Focus Keywords */}
                  {request.offeredSkillId?.agenda && request.offeredSkillId.agenda.length > 0 && (
                    <div className="mt-3">
                      <h6 className="font-medium text-foreground mb-2 text-sm">Focus Areas</h6>
                      <div className="flex flex-wrap gap-1">
                        {request.offeredSkillId.agenda.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Requested Skill */}
              <div className="bg-background/50 rounded-lg p-4">
                <h4 className="font-medium text-[20px] text-foreground mb-2">Requested Skill</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {request.requestedSkillId?.name || 'Skill Name'}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {request.requestedSkillId?.category || 'Category'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {request.requestedSkillId?.description || 'No description available'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Proficiency: {request.requestedSkillId?.proficiency || 0}%</span>
                    <span>•</span>
                    <span>Type: {request.requestedSkillId?.type || 'N/A'}</span>
                  </div>
                  
                  {/* Requested Skill Focus Keywords */}
                  {request.requestedSkillId?.agenda && request.requestedSkillId.agenda.length > 0 && (
                    <div className="mt-3">
                      <h6 className="font-medium text-foreground mb-2 text-sm">Focus Areas</h6>
                      <div className="flex flex-wrap gap-1">
                        {request.requestedSkillId.agenda.map((keyword, index) => (
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

          {/* Requester Information */}
          <div className="bg-muted/20 rounded-lg p-6 border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-[20px] font-semibold text-foreground">Requested By</h3>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  src={request.requester?.avatar} 
                  alt={request.requester?.name}
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
                    {request.requester?.name?.charAt(0) || 'R'}
                  </span>
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-[16px] text-foreground">
                  {request.requester?.name || 'Unknown User'}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {request.requester?.email || 'No email available'}
                </p>
                {request.requester?.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{request.requester.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message */}
          {request.message && (
            <div className="bg-muted/20 rounded-lg p-6 border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <h3 className="text-md font-semibold text-foreground">Message from Requester</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {request.message}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

