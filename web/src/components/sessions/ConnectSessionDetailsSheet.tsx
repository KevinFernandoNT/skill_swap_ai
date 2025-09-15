import React from 'react';
import { Calendar, Clock, User, MapPin, Users, BookOpen, ArrowRightLeft } from 'lucide-react';
import { SuggestedSession } from '../../hooks/useGetSuggestedSessions';
import {
  CustomSheet as Sheet,
  CustomSheetClose as SheetClose,
  CustomSheetContent as SheetContent,
  CustomSheetDescription as SheetDescription,
  CustomSheetFooter as SheetFooter,
  CustomSheetHeader as SheetHeader,
  CustomSheetTitle as SheetTitle,
} from '@/components/ui/custom-sheet';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ConnectSessionDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  session: SuggestedSession | null;
  onSwapClick: (session: SuggestedSession, event: React.MouseEvent) => void;
}

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'programming': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    'design': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    'marketing': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'data science': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
    'business': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    'finance': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    'writing': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
    'communication': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
    'sales': 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300',
  };
  return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
};

const ConnectSessionDetailsSheet: React.FC<ConnectSessionDetailsSheetProps> = ({
  isOpen,
  onOpenChange,
  session,
  onSwapClick
}) => {
  if (!session) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[450px] sm:w-[600px] lg:w-[750px] xl:w-[850px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/30 [&::-webkit-scrollbar-corner]:bg-transparent data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-sm ml-3">
            <BookOpen className="w-5 h-5" />
            Session Details
          </SheetTitle>
          <SheetDescription className='ml-3'>
            View detailed information about this session
          </SheetDescription>
        </SheetHeader>

        <div className="py-8 px-2 space-y-8">
          {/* Session Information */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Session Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-2">Title</label>
                <p className="text-sm text-foreground">{session.title || 'Untitled Session'}</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-foreground mb-2">Description</label>
                <p className="text-sm text-muted-foreground">{session.description || 'No description available'}</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-foreground mb-2">Category</label>
                <Badge variant="secondary" className={`${getCategoryColor(session.skillCategory || '')} border border-border/50`}>
                  {session.skillCategory?.charAt(0).toUpperCase() + session.skillCategory?.slice(1).toLowerCase() || 'General'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Focus Topics */}
          {session.focusKeywords && session.focusKeywords.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Focus Topics</h3>
              </div>
              
              <ul className="space-y-2">
                {session.focusKeywords.map((topic, index) => (
                  <li 
                    key={index}
                    className="flex items-center text-sm text-foreground"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Schedule */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Schedule</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-foreground">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {session.date ? new Date(session.date).toLocaleDateString() : 'Date TBD'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-foreground">Time</p>
                  <p className="text-sm text-muted-foreground">
                    {session.startTime && session.endTime ? `${session.startTime} - ${session.endTime}` : 'TBD'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Host Information */}
          {session.hostId && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Host Information</h3>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={session.hostId.avatar} 
                    alt={session.hostId.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center" style={{ display: 'none' }}>
                    <span className="text-white text-lg font-semibold">
                      {session.hostId.name?.charAt(0) || 'H'}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{session.hostId.name}</p>
                  {session.hostId.email && (
                    <p className="text-xs text-muted-foreground">{session.hostId.email}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Request Swap Button */}
        <SheetFooter className="px-2 pb-6">
          <Button 
            onClick={(e) => onSwapClick(session, e)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Request Skill Swap
          </Button>
        </SheetFooter>

      </SheetContent>
    </Sheet>
  );
};

export default ConnectSessionDetailsSheet;
