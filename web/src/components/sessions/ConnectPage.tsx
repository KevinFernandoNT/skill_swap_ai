import React, { useState } from 'react';
import { Search, Filter, ArrowRightLeft, Calendar, Clock, User, Star, Key } from 'lucide-react';
import { Session } from '../../types';
import { sessions as mockSessions, users, currentUser } from '../../data/mockData';
import SkillSwapModal from './SkillSwapModal';
import SessionModal from '../dashboard/SessionModal';

const ConnectPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');
  const [foundPrivateSession, setFoundPrivateSession] = useState<Session | null>(null);

  // Filter out current user's sessions and only show public sessions
  const availableSessions = mockSessions.filter(session => 
    session.isPublic && 
    session.status === 'upcoming' &&
    session.participant.id !== currentUser.id
  );

  // Add some mock recommended sessions based on user's learning interests
  const recommendedSessions: Session[] = [
    {
      id: 'rec1',
      title: 'Advanced UX Research Methods',
      date: '2025-06-13',
      startTime: '2:00 PM',
      endTime: '3:30 PM',
      skillCategory: 'Design',
      participant: users[0],
      status: 'upcoming',
      isTeaching: true,
      description: 'Deep dive into user research methodologies, usability testing, and data analysis',
      maxParticipants: 6,
      isPublic: true
    },
    {
      id: 'rec2',
      title: 'Machine Learning Fundamentals',
      date: '2025-06-14',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      skillCategory: 'Data Science',
      participant: users[2],
      status: 'upcoming',
      isTeaching: true,
      description: 'Introduction to ML algorithms, supervised learning, and practical applications',
      maxParticipants: 8,
      isPublic: true
    },
    {
      id: 'rec3',
      title: 'Product Strategy Workshop',
      date: '2025-06-16',
      startTime: '9:00 AM',
      endTime: '11:00 AM',
      skillCategory: 'Management',
      participant: users[3],
      status: 'upcoming',
      isTeaching: true,
      description: 'Learn product strategy, roadmap planning, and stakeholder management',
      maxParticipants: 4,
      isPublic: true
    }
  ];

  const allSessions = [...availableSessions, ...recommendedSessions];

  const filteredSessions = allSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.skillCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.participant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || session.skillCategory.toLowerCase() === filterCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const handleSwapRequest = (sessionId: string, selectedSkillId: string, message: string) => {

  };

  const handleSwapClick = (session: Session, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSession(session);
    setIsSwapModalOpen(true);
  };

  const handlePinSubmit = () => {
    setPinError('');
    
    // Find session with matching PIN
    const privateSession = mockSessions.find(session => 
      session.pin === pinCode && 
      session.status === 'upcoming' &&
      session.participant.id !== currentUser.id
    );

    if (privateSession) {
      setFoundPrivateSession(privateSession);
      setIsPinModalOpen(false);
      setPinCode('');
    } else {
      setPinError('Invalid PIN code. Please try again.');
    }
  };

  const handlePinModalClose = () => {
    setIsPinModalOpen(false);
    setPinCode('');
    setPinError('');
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
      <div className="bg-black min-h-screen">
        {/* Header */}
        <div className="px-4 py-6 border-b border-gray-800 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Connect & Swap Skills</h1>
              <p className="mt-1 text-sm text-gray-400">Discover sessions and request skill swaps with other learners</p>
            </div>
            <button
              onClick={() => setIsPinModalOpen(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <Key className="w-4 h-4 mr-2" />
              Connect using code
            </button>
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

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full py-2 pl-10 pr-3 text-sm bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Search sessions, skills, or instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

         

          {/* All Recomended Sessions */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Recomended Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.filter(session => !recommendedSessions.some(rec => rec.id === session.id)).map((session) => (
                <div
                  key={session.id}
                  className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-6 transition-all duration-300 hover:shadow-md hover:border-primary/50 cursor-pointer"
                >
                  {/* Header */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(session.skillCategory)}`}>
                      {session.skillCategory}
                    </span>
                    <h3 className="text-lg font-medium text-white mt-2">{session.title}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{session.description}</p>

                  {/* Skill Offer Section */}
                  <div className="mb-4">
              
                    
                        <div className="mb-2">
                          <ul className="pl-4 list-disc text-xs text-gray-300">
                            {["Advanced UX Models","AI with Figma","FIgma Basics"].map((topic, idx) => (
                              <li key={idx}>{topic}</li>
                            ))}
                          </ul>
                        </div>
                      
                 
                  </div>

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
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>with {session.participant.name}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={(e) => handleSwapClick(session, e)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Request Skill Swap
                  </button>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredSessions.length === 0 && (
              <div className="text-center py-12">
                <ArrowRightLeft className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No sessions found</h3>
                <p className="text-gray-400">
                  {searchTerm || filterCategory !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'No available sessions for skill swapping at the moment'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PIN Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-800 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Connect using code</h2>
              <button
                onClick={handlePinModalClose}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-4">
                Enter the PIN code provided by the session host to join their private session.
              </p>
              
              <div className="mb-4">
                <label htmlFor="pin" className="block text-sm font-medium text-white mb-2">
                  PIN Code
                </label>
                <input
                  id="pin"
                  type="text"
                  className="block w-full py-2 px-3 text-sm bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter 4-digit PIN"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  maxLength={4}
                />
                {pinError && (
                  <p className="mt-1 text-sm text-red-400">{pinError}</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handlePinModalClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handlePinSubmit}
                disabled={pinCode.length !== 4}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Swap Modal */}
      <SkillSwapModal
        session={selectedSession}
        isOpen={isSwapModalOpen}
        onClose={() => {
          setIsSwapModalOpen(false);
          setSelectedSession(null);
        }}
        onRequestSwap={handleSwapRequest}
      />

      {/* Session Details Modal */}
      <SessionModal
        session={selectedSession}
        isOpen={isSessionModalOpen}
        onClose={() => {
          setIsSessionModalOpen(false);
          setSelectedSession(null);
        }}
      />
    </>
  );
};

export default ConnectPage;