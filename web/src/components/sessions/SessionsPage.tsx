import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Edit, MoreVertical, Trash2, Filter, Plus, Globe, Lock, ArrowRight, LogOut } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useGetSessions } from '@/hooks/useGetSessions';
import { useUpdateSession } from '@/hooks/useUpdateSession';
import { useDeleteSession } from '@/hooks/useDeleteSession';
import { SessionDataTable } from './SessionDataTable';
import SessionSheet from './SessionSheet';
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
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'private'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isSessionSheetOpen, setIsSessionSheetOpen] = useState(false);
  const [sessionSheetMode, setSessionSheetMode] = useState<'create' | 'edit'>('create');
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
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

  // Get unique categories for filter
  const uniqueCategories = Array.from(new Set(allSessions.map(session => session.skillCategory).filter(Boolean)));

  // Filter sessions based on filters
  const filteredSessions = allSessions.filter(session => {
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    const matchesVisibility =
      filterVisibility === 'all' ||
      (filterVisibility === 'public' && session.isPublic) ||
      (filterVisibility === 'private' && !session.isPublic);
    const matchesCategory = filterCategory === 'all' || session.skillCategory === filterCategory;
    return matchesStatus && matchesVisibility && matchesCategory;
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
    setSessionSheetMode('edit');
    setIsSessionSheetOpen(true);
    setActiveDropdown(null);
  };

  const handleRescheduleSession = (session: any) => {
    setSelectedSession(session);
    setIsRescheduleModalOpen(true);
    setActiveDropdown(null);
  };

  const handleCloseSessionSheet = () => {
    setIsSessionSheetOpen(false);
    setSelectedSession(null);
  };

  const handleSaveSession = (updatedSession: any) => {
    handleCloseSessionSheet();
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
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
              <button 
                onClick={() => {
                  setSessionSheetMode('create');
                  setIsSessionSheetOpen(true);
                }}
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
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            {/* Visibility Filter */}
            <Select value={filterVisibility} onValueChange={setFilterVisibility}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Visibility</SelectLabel>
                  <SelectItem value="all">All Visibility</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Sessions Table */}
          {sessionsLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading sessions...</div>
          ) : sessionsError ? (
            <div className="text-center py-12 text-destructive">Failed to load sessions.</div>
          ) : (
            <SessionDataTable 
              data={filteredSessions}
              onEditSession={handleEditSession}
              onDeleteSession={(session) => setConfirmAction({ type: 'cancel', session })}
            />
          )}
          {/* Empty State */}
          {!sessionsLoading && !sessionsError && filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No sessions found</h3>
              <p className="text-muted-foreground mb-6">
                {filterStatus !== 'all' || filterVisibility !== 'all' || filterCategory !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first session to get started'}
              </p>
              <button 
                onClick={() => {
                  setSessionSheetMode('create');
                  setIsSessionSheetOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Session
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Session Sheet */}
      <SessionSheet
        isOpen={isSessionSheetOpen}
        onOpenChange={setIsSessionSheetOpen}
        onSuccess={refetchSessions}
        session={selectedSession}
        mode={sessionSheetMode}
      />

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
            <AlertDialogTitle className="text-white">Delete Session?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete this session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setConfirmAction(null)}
              className="text-white hover:text-white border-gray-600 hover:border-gray-500 bg-gray-700 hover:bg-gray-600"
            >
              No
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmAction) {
                  deleteSession(confirmAction.session._id);
                  setConfirmAction(null);
                }
              }}
              className="bg-destructive text-white hover:bg-destructive/90"
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
            }} className="bg-primary text-white hover:bg-primary/90">Go to Skills</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SessionsPage;