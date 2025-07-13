import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Eye, EyeOff, Calendar, Clock, Users, Globe, Lock, MoreVertical, ArrowRightLeft } from 'lucide-react';
import { Session } from '../../types';
import { sessions as mockSessions, currentUser } from '../../data/mockData';
import SessionEditModal from './SessionEditModal';
import CreateSessionModal from './CreateSessionModal';
import RescheduleModal from './RescheduleModal';
import {
  AlertDialog,
  AlertDialogTrigger,
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

  // Extended sessions with visibility property
  const [sessionsData, setSessionsData] = useState(
    mockSessions.map(session => ({
      ...session,
      description: session.description || `Learn ${session.skillCategory.toLowerCase()} skills through hands-on practice and real-world examples. This session covers fundamental concepts and practical applications.`,
      maxParticipants: session.maxParticipants || (session.isTeaching ? Math.floor(Math.random() * 8) + 3 : 1),
      currentParticipants: session.isTeaching ? Math.floor(Math.random() * 5) + 1 : 1,
      isPublic: session.isPublic !== undefined ? session.isPublic : Math.random() > 0.5,
      swappedSkills: session.id === 'session1' ? {
        offeredSkill: 'JavaScript',
        requestedSkill: 'React Hooks',
        swapPartner: 'Sarah Williams'
      } : undefined
    }))
  );

  // Filter sessions
  const filteredSessions = sessionsData.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.skillCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    const matchesVisibility = filterVisibility === 'all' || 
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
      id: `session${Date.now()}`,
      participant: currentUser,
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
    
    setSessionsData(prev => [newSession, ...prev]);
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
    setSessionsData(prev => 
      prev.map(session => 
        session.id === updatedSession.id ? updatedSession : session
      )
    );
    handleCloseEditModal();
  };

  const handleReschedule = (sessionId: string, newDate: string, newStartTime: string, newEndTime: string) => {
    setSessionsData(prev =>
      prev.map(session =>
        session.id === sessionId 
          ? { ...session, date: newDate, startTime: newStartTime, endTime: newEndTime }
          : session
      )
    );
    setIsRescheduleModalOpen(false);
    setSelectedSession(null);
  };

  const handleCancelSession = (sessionId: string) => {
    setSessionsData(prev =>
      prev.map(session =>
        session.id === sessionId 
          ? { ...session, status: 'cancelled' as const }
          : session
      )
    );
    setIsRescheduleModalOpen(false);
    setSelectedSession(null);
  };

  const toggleSessionVisibility = (sessionId: string) => {
    setSessionsData(prev =>
      prev.map(session =>
        session.id === sessionId ? { ...session, isPublic: !session.isPublic } : session
      )
    );
    setActiveDropdown(null);
  };

  const handleMarkAsCompleted = (sessionId: string) => {
    setSessionsData(prev =>
      prev.map(session =>
        session.id === sessionId 
          ? { ...session, status: 'completed' as const }
          : session
      )
    );
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-6 transition-all duration-300 hover:shadow-md hover:border-primary/50 relative"
              >
                {/* Hamburger Edit Icon */}
              
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-primary focus:outline-none"
                    onClick={() => handleEditSession(session)}
                    title="Edit Session"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                
                {/* Session Code */}
                <div className="mb-2 text-xs text-gray-400">Session Code: <span className="text-primary font-mono">{(session.id.match(/\d{4}$/)?.[0] || session.id.slice(-4).padStart(4, '0'))}</span></div>
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
                      onClick={() => setConfirmAction({ type: 'complete', session })}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition"
                    >
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => setConfirmAction({ type: 'cancel', session })}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-700 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition"
                    >
                      Cancel Session
                    </button>
                  </div>
                )}
                {/* Edit Session Button */}
                {session.participant.id === currentUser.id && (
                  <button
                    onClick={() => handleEditSession(session)}
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
          {/* Empty State */}
          {filteredSessions.length === 0 && (
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
        onSave={handleCreateSession}
      />

      {/* Edit Session Modal */}
      <SessionEditModal
        session={selectedSession}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveSession}
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
            <AlertDialogTitle>
              {confirmAction?.type === 'complete' ? 'Mark Session as Completed?' : 'Cancel Session?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === 'complete'
                ? 'Are you sure you want to mark this session as completed? This action cannot be undone.'
                : 'Are you sure you want to cancel this session? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmAction(null)}>No</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmAction) {
                  if (confirmAction.type === 'complete') {
                    handleMarkAsCompleted(confirmAction.session.id);
                  } else {
                    handleCancelSession(confirmAction.session.id);
                  }
                  setConfirmAction(null);
                }
              }}
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SessionsPage;