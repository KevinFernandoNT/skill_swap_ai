import React, { useState } from 'react';
import { ArrowRightLeft, Star, Key, Loader2, LogOut } from 'lucide-react';
import { Session } from '../../types';
import { sessions as mockSessions, users, currentUser } from '../../data/mockData';
import { useGetSuggestedSessions, SuggestedSession } from '../../hooks/useGetSuggestedSessions';
import { useToast } from '../../hooks/use-toast';
import { ConnectDataTable } from './ConnectDataTable';
import ConnectSessionDetailsSheet from './ConnectSessionDetailsSheet';
import SkillSwapRequestDialog from './SkillSwapRequestDialog';
import ConnectWithCodeDialog from './ConnectWithCodeDialog';

const ConnectPage: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isSessionDetailsSheetOpen, setIsSessionDetailsSheetOpen] = useState(false);
  const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false);
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [foundPrivateSession, setFoundPrivateSession] = useState<Session | null>(null);
  const { toast } = useToast();

  // Fetch suggested sessions from API
  const { data: suggestedSessionsResponse, isLoading: isLoadingSuggestedSessions, error: suggestedSessionsError } = useGetSuggestedSessions();

  // Get suggested sessions from API response
  const suggestedSessions: SuggestedSession[] = suggestedSessionsResponse?.data || [];

  // Filter sessions based on category
  const filteredSessions = suggestedSessions.filter(session => {
    const matchesCategory = filterCategory === 'all' || session.skillCategory.toLowerCase() === filterCategory.toLowerCase();
    return matchesCategory;
  });

  const handleSwapRequest = (sessionId: string, selectedSkillId: string, message: string) => {
    // This will be handled by the SkillSwapModal
  };

  const handleViewDetails = (session: SuggestedSession) => {
    setSelectedSession(session as any);
    setIsSessionDetailsSheetOpen(true);
  };

  const handleSwapClick = (session: Session, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSession(session);
    setIsSwapDialogOpen(true);
  };

  const handleSessionFound = (session: Session) => {
    setFoundPrivateSession(session);
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

  const getMatchingTypeColor = (matchingType: string) => {
    switch (matchingType) {
      case 'learning_match':
        return 'bg-blue-900 text-blue-300';
      case 'teaching_match':
        return 'bg-green-900 text-green-300';
      case 'mutual_match':
        return 'bg-purple-900 text-purple-300';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  const getMatchingTypeLabel = (matchingType: string) => {
    switch (matchingType) {
      case 'learning_match':
        return 'Learning Match';
      case 'teaching_match':
        return 'Teaching Match';
      case 'mutual_match':
        return 'Perfect Match';
      default:
        return 'Match';
    }
  };

  const categories = ['All', 'Programming', 'Design', 'Management', 'Marketing', 'Data Science'];

  // Helper to get teaching skill with agenda for a user matching a session
  const getOfferedSkillWithAgenda = (user, session) => {
    if (!user.skills) return null;
    // Try to match by skillCategory or title
    return user.skills.find(
      (s) =>
        s.type === 'teaching' &&
        (s.category?.toLowerCase() === session.skillCategory.toLowerCase() ||
          s.name?.toLowerCase() === session.title.toLowerCase()) &&
        Array.isArray(s.agenda) && s.agenda.length > 0
    );
  };
  
  // Helper to get learning skill for a user
  const getLookingForSkill = (user, session) => {
    if (!user.skills) return null;
    // Try to match by category or just return the first learning skill
    return (
      user.skills.find(
        (s) =>
          s.type === 'learning' &&
          (s.category?.toLowerCase() === session.skillCategory.toLowerCase() ||
            s.name?.toLowerCase() === session.title.toLowerCase())
      ) || user.skills.find((s) => s.type === 'learning')
    );
  };

  return (
    <>
      <div className="bg-background min-h-screen">
        {/* Header */}
        <div className="px-4 py-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-foreground">Connect & Swap Skills</h1>
              <p className="mt-1 text-sm text-muted-foreground">Discover sessions and request skill swaps with other learners</p>
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
                onClick={() => setIsPinDialogOpen(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                <Key className="w-4 h-4 mr-2" />
                Connect using code
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 lg:px-8">
          {/* Private Session Found */}
          {foundPrivateSession && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Private Session Found</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
                    Private
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(foundPrivateSession.skillCategory)}`}>
                        {foundPrivateSession.skillCategory}
                      </span>
                      <h3 className="text-lg font-medium text-white mt-2">{foundPrivateSession.title}</h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{foundPrivateSession.description}</p>

                    {/* Session Details */}
                    <div className="space-y-2 text-sm text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(foundPrivateSession.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{foundPrivateSession.startTime} - {foundPrivateSession.endTime}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span>with {foundPrivateSession.participant.name}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => handleSwapClick(foundPrivateSession, e)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      <ArrowRightLeft className="w-4 h-4 mr-2" />
                      Request Skill Swap
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Loading State */}
          {isLoadingSuggestedSessions && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin mr-3" />
              <span className="text-white">Loading suggested sessions...</span>
            </div>
          )}

          {/* Error State */}
          {suggestedSessionsError && (
            <div className="text-center py-12">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-2">Error Loading Sessions</h3>
                <p className="text-gray-400 mb-4">
                  {suggestedSessionsError?.response?.data?.message || "Could not load suggested sessions. Please try again."}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Suggested Sessions */}
          {!isLoadingSuggestedSessions && !suggestedSessionsError && (
            <div>
              <ConnectDataTable
                data={filteredSessions}
                onSwapClick={handleSwapClick}
                onViewDetails={handleViewDetails}
              />

              {/* Empty State */}
              {filteredSessions.length === 0 && !isLoadingSuggestedSessions && (
                <div className="text-center py-12">
                  <ArrowRightLeft className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No sessions found</h3>
                  <p className="text-muted-foreground">
                    {filterCategory !== 'all'
                      ? 'Try adjusting your filters'
                      : 'No suggested sessions available at the moment. Add more skills to your profile to get personalized recommendations.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Connect with Code Dialog */}
      <ConnectWithCodeDialog
        isOpen={isPinDialogOpen}
        onOpenChange={(open) => {
          setIsPinDialogOpen(open);
        }}
        onSessionFound={handleSessionFound}
      />


      {/* Session Details Sheet */}
      <ConnectSessionDetailsSheet
        session={selectedSession as SuggestedSession}
        isOpen={isSessionDetailsSheetOpen}
        onOpenChange={(open) => {
          setIsSessionDetailsSheetOpen(open);
          if (!open) setSelectedSession(null);
        }}
        onSwapClick={handleSwapClick}
      />

      {/* Skill Swap Request Dialog */}
      <SkillSwapRequestDialog
        isOpen={isSwapDialogOpen}
        onOpenChange={(open) => {
          setIsSwapDialogOpen(open);
          if (!open) {
            setSelectedSession(null);
          }
        }}
        session={selectedSession as SuggestedSession}
      />
    </>
  );
};

export default ConnectPage;