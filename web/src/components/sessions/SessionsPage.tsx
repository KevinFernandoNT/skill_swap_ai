import React, { useState } from 'react';
import { Plus, Search, Edit, Calendar, Clock, MoreVertical } from 'lucide-react';
import { Session } from '../../types';
import SessionEditModal from './SessionEditModal';
import CreateSessionModal from './CreateSessionModal';
import RescheduleModal from './RescheduleModal';
import { useGetUserSkills } from '@/hooks/useGetUserSkills';
import { useGetSessions } from '@/hooks/useGetSessions';
import { useNavigate } from 'react-router-dom';
import { useDeleteSession } from '@/hooks/useDeleteSession';
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
    // setSessionsData(prev =>
    //   prev.map(session =>
    //     session.id === sessionId 
    //       ? { ...session, date: newDate, startTime: newStartTime, endTime: newEndTime }
    //       : session
    //   )
    // ); // No mock data, so no state update
    setIsRescheduleModalOpen(false);
    setSelectedSession(null);
  };

  const handleCancelSession = (sessionId: string) => {
    // setSessionsData(prev =>
    //   prev.map(session =>
    //     session.id === sessionId 
    //       ? { ...session, status: 'cancelled' as const }
    //       : session
    //   )
    // ); // No mock data, so no state update
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

  return (
    <>
      <div className="bg-black min-h-screen">
        {/* Header */}
        <div className="px-4 py-6 border-b border-gray-800 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-white">Session Management</h1>
              <p className="mt-1 text-sm text-gray-400">Manage your teaching and learning sessions</p>
            </div>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Session
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-6 lg:px-8">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full py-2 pl-10 pr-3 text-sm bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Status Filter */}
            <select
              className="px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {/* Visibility Filter */}
            <select
              className="px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value as any)}
            >
              <option value="all">All Visibility</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          {/* Sessions Grid */}
          {sessionsLoading ? (
            <div className="text-center py-12 text-gray-400">Loading sessions...</div>
          ) : sessionsError ? (
            <div className="text-center py-12 text-red-500">Failed to load sessions.</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <div
                key={session._id}
                className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-6 transition-all duration-300 hover:shadow-md hover:border-primary/50 relative cursor-pointer"
                onClick={() => handleEditSession(session)}
              >
                {/* Hamburger Edit Icon */}
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-primary focus:outline-none"
                  onClick={e => { e.stopPropagation(); handleEditSession(session); }}
                  title="Edit Session"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {/* Session Code */}
                <div className="mb-2 text-xs text-gray-400">
                  Session Code: <span className="text-primary font-mono">{(session._id && typeof session._id === 'string'
  ? (session._id.match(/\d{4}$/)?.[0] || session._id.slice(-4).padStart(4, '0'))
  : '----')}</span>
                </div>
                {/* Title */}
                <h3 className="text-lg font-medium text-white mb-2">{session.title}</h3>
                {/* Skill & Agenda */}
                <div className="mb-4">
                  <div className="text-xs text-primary font-semibold mb-1">Skill: {session.skillCategory}</div>
                  {/* Agenda/subtopics: mock for now */}
                  <ul className="pl-4 list-disc text-xs text-gray-300">
                    {[
                      'Fundamentals',
                      'Best Practices',
                      'Hands-on Practice',
                      'Q&A',
                      'Resources'
                    ].map((topic: string, idx: number) => (
                      <li key={idx}>{topic}</li>
                    ))}
                  </ul>
                </div>
                {/* Description */}
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{session.description}</p>
                {/* Session Details */}
                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(session.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{session.startTime} - {session.endTime}</span>
                  </div>
                </div>
                {/* Mark as Completed & Cancel Session Buttons */}
                {(session.status !== 'completed' && session.status !== 'cancelled') && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={e => { e.stopPropagation(); setConfirmAction({ type: 'cancel', session }); }}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-700 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition"
                    >
                      Delete Session
                    </button>
                  </div>
                )}
                {/* Edit Session Button */}
                {session?.participant?._id === 'currentUser' && ( // Placeholder for current user ID
                  <button
                    onClick={e => { e.stopPropagation(); handleEditSession(session); }}
                    className="mt-3 flex items-center px-4 py-2 text-sm font-medium text-primary bg-gray-800 border border-primary rounded-md hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 transition"
                    title="Edit Session"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Session
                  </button>
                )}
              </div>
            ))}
          </div>
          )}
          {/* Empty State */}
          {!sessionsLoading && !sessionsError && filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No sessions found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || filterStatus !== 'all' || filterVisibility !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first session to get started'}
              </p>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Session
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Session Modal */}
      <CreateSessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Session Modal */}
      <SessionEditModal
        session={selectedSession}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveSession}
        refetchSessions={refetchSessions}
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