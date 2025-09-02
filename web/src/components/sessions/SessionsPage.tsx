import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Edit, MoreVertical, Search, Trash2, Filter, Plus, Globe, Lock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useGetSessions } from '@/hooks/useGetSessions';
import { useUpdateSession } from '@/hooks/useUpdateSession';
import { useDeleteSession } from '@/hooks/useDeleteSession';
import SessionEditModal from './SessionEditModal';
import CreateSessionModal from './CreateSessionModal';
import { CreateSessionModalMultiStep } from './CreateSessionModalMultiStep';
import { SessionEditModalMultiStep } from './SessionEditModalMultiStep';
import RescheduleModal from './RescheduleModal';
import { Session } from '@/types';
import { useGetUserSkills } from '@/hooks/useGetUserSkills';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../ui/alert-dialog';

const SessionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'private'>('all');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [useMultiStepModals, setUseMultiStepModals] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<null | { type: 'complete' | 'cancel'; session: Session }>(null);

  const { data: skillsResult, isLoading: skillsLoading } = useGetUserSkills();
  const navigate = useNavigate();
  const teachableSkills = (skillsResult?.data || []).filter((s: any) => s.type === 'teaching');
  const [showNoSkillModal, setShowNoSkillModal] = useState(false);

  React.useEffect(() => {
    if (!skillsLoading && teachableSkills.length === 0) {
      setShowNoSkillModal(true);
    } else {
      setShowNoSkillModal(false);
    }
  }, [skillsLoading, teachableSkills.length]);

  // Fetch sessions
  const { data: sessionsResult, isLoading: sessionsLoading, error: sessionsError, refetch: refetchSessions } = useGetSessions();
  const allSessions = (sessionsResult?.data || []).map(session => ({
    ...session,
    id: session._id || session._id || '',
  }));

  // Filter sessions based on search and filters
  const filteredSessions = allSessions.filter(session => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.skillCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (session.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    const matchesVisibility =
      filterVisibility === 'all' ||
      (filterVisibility === 'public' && session.isPublic) ||
      (filterVisibility === 'private' && !session.isPublic);
    return matchesSearch && matchesStatus && matchesVisibility;
  });

  const handleCreateSession = (sessionData: Omit<Session, 'id' | 'participant' | 'status'>) => {
    const newSession: Session & {
      description: string;
      maxParticipants: number;
      currentParticipants: number;
      isPublic: boolean;
      swappedSkills: {
        offeredSkill: string;
        requestedSkill: string;
        swapPartner: string;
      };
    } = {
      ...sessionData,
      _id: `session${Date.now()}`,
      participant: { _id: 'currentUser', name: 'Current User', email: 'current@example.com', avatar: '', skills: [] }, // Placeholder
      status: 'upcoming',
      description: sessionData.description || `Learn ${sessionData.skillCategory.toLowerCase()} skills through hands-on practice and real-world examples. This session covers fundamental concepts and practical applications.`,
      maxParticipants: sessionData.maxParticipants || (sessionData.isTeaching ? Math.floor(Math.random() * 8) + 3 : 1),
      currentParticipants: sessionData.isTeaching ? Math.floor(Math.random() * 5) + 1 : 1,
      isPublic: sessionData.isPublic !== undefined ? sessionData.isPublic : Math.random() > 0.5,
      swappedSkills: {
        offeredSkill: '',
        requestedSkill: '',
        swapPartner: ''
      }
    };
    setIsCreateModalOpen(false);
  };

  const handleEditSession = (session: any) => {
    setSelectedSession(session);
    setIsEditModalOpen(true);
    setActiveDropdown(null);
  };

  const handleRescheduleSession = (session: any) => {
    setSelectedSession(session);
    setIsRescheduleModalOpen(true);
    setActiveDropdown(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSession(null);
  };

  const handleSaveSession = (updatedSession: any) => {
    handleCloseEditModal();
    refetchSessions();
  };

  const handleReschedule = (sessionId: string, newDate: string, newStartTime: string, newEndTime: string) => {
    // For now, we'll just refetch sessions after updates
    // In a real implementation, you would use the updateSession hook properly
    refetchSessions();
    
    setIsRescheduleModalOpen(false);
    setSelectedSession(null);
  };

  const handleCancelSession = (sessionId: string) => {
    // For now, we'll just refetch sessions after updates
    // In a real implementation, you would use the updateSession hook properly
    refetchSessions();
    
    setIsRescheduleModalOpen(false);
    setSelectedSession(null);
  };

  const toggleSessionVisibility = (sessionId: string) => {
    // setSessionsData(prev =>
    //   prev.map(session =>
    //     session.id === sessionId ? { ...session, isPublic: !session.isPublic } : session
    //   )
    // ); // No mock data, so no state update
    setActiveDropdown(null);
  };

  const handleMarkAsCompleted = (sessionId: string) => {
    // setSessionsData(prev =>
    //   prev.map(session =>
    //     session.id === sessionId 
    //       ? { ...session, status: 'completed' as const }
    //       : session
    //   )
    // ); // No mock data, so no state update
    setActiveDropdown(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-900 text-blue-300';
      case 'completed':
        return 'bg-green-900 text-green-300';
      case 'cancelled':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

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

  const toast = useToast();
  const { mutate: deleteSession } = useDeleteSession({
    onSuccess: () => {
      toast.toast({ title: 'Session deleted!', description: 'The session was deleted successfully.' });
      refetchSessions();
    },
    onError: (error: any) => {
      toast.toast({ title: 'Error', description: error?.response?.data?.message || 'Failed to delete session', variant: 'destructive' });
    },
  });

  // For now, we'll just refetch sessions after updates
  // In a real implementation, you would use the updateSession hook properly

  return (
    <>
      <div className="bg-background min-h-screen">
        {/* Header */}
        <div className="px-4 py-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-foreground">Session Management</h1>
              <p className="mt-1 text-sm text-muted-foreground">Manage your sessions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
              
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Session
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-6 lg:px-8">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <Search className="w-4 h-4 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[180px]">
                  Status: {filterStatus === 'all' ? 'All' : filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('upcoming')}>Upcoming</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('completed')}>Completed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('cancelled')}>Cancelled</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Visibility Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[180px]">
                  Visibility: {filterVisibility === 'all' ? 'All' : filterVisibility}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setFilterVisibility('all')}>All Visibility</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterVisibility('public')}>Public</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterVisibility('private')}>Private</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Sessions Grid */}
          {sessionsLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading sessions...</div>
          ) : sessionsError ? (
            <div className="text-center py-12 text-destructive">Failed to load sessions.</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
                             <Card
                 key={session._id}
                                   className="bg-card border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer group overflow-hidden relative"
                 onClick={() => handleEditSession(session)}
               >
                 <CardContent className="p-6">
                   {/* Header with title, date, and category */}
                   <div className="flex items-start justify-between mb-4">
                     <div className="flex-1 pr-4">
                       <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                         {session.title}
                       </h3>
                     </div>
                     <div className="flex items-center gap-2 flex-shrink-0">
                       <span className="text-xs text-muted-foreground">
                         {new Date(session.date).toLocaleDateString('en-US', { 
                           month: 'short', 
                           day: 'numeric' 
                         })}
                       </span>
                       <div className="w-8 h-8 rounded-full border border-green-500 flex items-center justify-center">
                         <Calendar className="w-4 h-4 text-green-500" />
                       </div>
                       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500 border border-green-500/30">
                         {session.skillCategory}
                       </span>
                     </div>
                   </div>
                    
                                                              {/* Skill Name */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-sm text-muted-foreground">
                            {Array.isArray(session.teachSkillId) 
                              ? session.teachSkillId[0]?.name || 'Skill Name'
                              : session.teachSkillId || 'Skill Name'
                            }
                          </span>
                        </div>
                      </div>
                   
                                       {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                      {session.description}
                    </p>


                    {/* Session Agenda */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
           
                      </div>
                      <div className="space-y-2">
                        {(session.focusKeywords && session.focusKeywords.length > 0 
                          ? session.focusKeywords 
                          : [
                              'Fundamentals',
                              'Best Practices', 
                              'Hands-on Practice',
                              'Q&A',
                              'Resources'
                            ]
                        ).map((topic, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-300">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Details Section */}
                    <div className="flex items-center justify-between">
                      {/* Duration */}
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-foreground" />
                        <span className="text-sm text-foreground">
                          {session.startTime && session.endTime 
                            ? `${session.startTime} - ${session.endTime}`
                            : '30 Minutes'
                          }
                        </span>
                      </div>
                      
                                                                     {/* Location/Platform */}
                        <div className="flex items-center gap-2">
                          {session.isPublic ? (
                            <Globe className="w-4 h-4 text-primary" />
                          ) : (
                            <Lock className="w-4 h-4 text-primary" />
                          )}
                          <span className="text-xs text-foreground">
                            {session.isPublic ? 'Public' : 'Private'}
                          </span>
                                                    {/* Delete Button - Always visible */}
                          <div className="ml-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={e => { e.stopPropagation(); setConfirmAction({ type: 'cancel', session }); }}
                              title="Delete Session"
                              className="h-6 w-6 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                       </div>
                     </div>
                 </CardContent>
               </Card>
            ))}
          </div>
          )}
          {/* Empty State */}
          {!sessionsLoading && !sessionsError && filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No sessions found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || filterStatus !== 'all' || filterVisibility !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first session to get started'}
              </p>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Session
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Session Modal */}
      {useMultiStepModals ? (
        <CreateSessionModalMultiStep
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={refetchSessions}
        />
      ) : (
        <CreateSessionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={refetchSessions}
        />
      )}

      {/* Edit Session Modal */}
      {useMultiStepModals ? (
        <SessionEditModalMultiStep
          session={selectedSession}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={refetchSessions}
        />
      ) : (
        <SessionEditModal
          session={selectedSession}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveSession}
          refetchSessions={refetchSessions}
        />
      )}

      {/* Reschedule Modal */}
      <RescheduleModal
        session={selectedSession}
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setSelectedSession(null);
        }}
        onReschedule={handleReschedule}
        onCancel={handleCancelSession}
      />

      {/* Confirmation Modal */}
      <AlertDialog open={!!confirmAction} onOpenChange={open => { if (!open) setConfirmAction(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmAction(null)}>No</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmAction) {
                  deleteSession(confirmAction.session._id);
                  setConfirmAction(null);
                }
              }}
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* No Teachable Skill Modal */}
      <AlertDialog open={showNoSkillModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Teachable Skill Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to create at least one teachable lesson (skill) to create a session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              window.dispatchEvent(new CustomEvent('navigateToTab', { detail: { tab: 'skills' } }));
              setShowNoSkillModal(false);
            }}>Go to Skills</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SessionsPage;