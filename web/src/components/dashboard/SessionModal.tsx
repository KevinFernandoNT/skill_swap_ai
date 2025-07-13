import React from 'react';
import { X, Calendar, Clock, User, BookOpen, Target, ArrowRightLeft } from 'lucide-react';
import { Session } from '../../types';
import UserProfile from '../ui/UserProfile';
import { currentUser } from '../../data/mockData';

interface SessionModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({ session, isOpen, onClose }) => {
  if (!isOpen || !session) return null;

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric' 
    }).format(date);
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

  // Mock session details - in a real app, this would come from the session data
  const sessionDetails = {
    description: session.isTeaching 
      ? `Share your expertise in ${session.skillCategory.toLowerCase()} with ${session.participant.name}. This session will cover practical applications and real-world examples to help them advance their skills.`
      : `Learn from ${session.participant.name}'s expertise in ${session.skillCategory.toLowerCase()}. This session will provide hands-on experience and practical knowledge to enhance your understanding.`,
    agenda: session.isTeaching ? [
      'Introduction and goal setting',
      'Core concepts and best practices',
      'Hands-on practice session',
      'Q&A and feedback',
      'Next steps and resources'
    ] : [
      'Current skill level assessment',
      'Learning objectives discussion',
      'Guided practice and examples',
      'Problem-solving exercises',
      'Action plan for continued learning'
    ],
    prerequisites: session.isTeaching 
      ? 'Basic understanding of the topic area'
      : 'Willingness to learn and ask questions',
    duration: '90 minutes',
    format: 'Interactive video session'
  };

  // Check if this is a skill swap session
  const swappedSkills = (session as any).swappedSkills;

  // Helper to get key points for a skill
  const getSkillKeyPoints = (user, skillName) => {
    const skill = user.skills?.find(s => s.name === skillName);
    // Try to get agenda/goals from extended skill if available
    const extendedSkill = (user as any).skills?.find((s: any) => s.name === skillName);
    if (extendedSkill?.agenda && extendedSkill.agenda.length > 0) {
      return extendedSkill.agenda;
    }
    if (extendedSkill?.goals) {
      return [extendedSkill.goals];
    }
    return null;
  };

  // Helper to get all teaching skills with agenda for a user
  const getTeachingSkillsWithAgenda = (user) => {
    return (user.skills || []).filter((s: any) => s.type === 'teaching' && Array.isArray(s.agenda) && s.agenda.length > 0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-gray-900 rounded-lg shadow-xl border border-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-white mb-2">{session.title}</h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(session.skillCategory)}`}>
                {session.skillCategory}
              </span>
             
              {swappedSkills && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                  <ArrowRightLeft className="w-3 h-3 mr-1" />
                  Skill Swap
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Session Title */}
            <div>
             
              <p className="text-gray-400">{sessionDetails.description}</p>
            </div>

            {/* Two User Profiles and What They Offer */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex flex-col items-center">
            
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
                {/* Current User */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <UserProfile user={currentUser} showEmail={false} />
                  <div className="mt-2 text-xs text-gray-400">Offers</div>
                  <div className="text-base font-bold text-white text-center">
                    {(session.swappedSkills && session.swappedSkills.offeredSkill && currentUser.id === session.participant.id)
                      ? session.swappedSkills.requestedSkill
                      : (session.swappedSkills && session.swappedSkills.offeredSkill)
                        ? session.swappedSkills.offeredSkill
                        : (currentUser.skills && currentUser.skills.length > 0 ? currentUser.skills[0].name : 'Your Skill')}
                  </div>
                  {/* List all teaching skills and their subtopics */}
                  <div className="mt-2 w-full max-w-xs">
                    {getTeachingSkillsWithAgenda(currentUser).length > 0 ? (
                      getTeachingSkillsWithAgenda(currentUser).map((skill, idx) => (
                        <div key={skill.id} className="mb-2">
                          <div className="font-semibold text-primary text-xs mb-1">{skill.name} Subtopics:</div>
                          <ul className="space-y-1 text-xs text-gray-300">
                            {skill.agenda.map((point: string, i: number) => (
                              <li key={i} className="flex items-start"><span className="mr-2">•</span>{point}</li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-500">No teaching subtopics available.</div>
                    )}
                  </div>
                </div>
                <ArrowRightLeft className="w-8 h-8 text-primary mx-4 hidden md:block" />
                {/* Other Participant */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <UserProfile user={session.participant} showEmail={false} />
                  <div className="mt-2 text-xs text-gray-400">Offers</div>
                  <div className="text-base font-bold text-white text-center">
                    {(session.swappedSkills && session.swappedSkills.requestedSkill && currentUser.id === session.participant.id)
                      ? session.swappedSkills.offeredSkill
                      : (session.swappedSkills && session.swappedSkills.requestedSkill)
                        ? session.swappedSkills.requestedSkill
                        : (session.participant.skills && session.participant.skills.length > 0 ? session.participant.skills[0].name : 'Their Skill')}
                  </div>
                  {/* List all teaching skills and their subtopics */}
                  <div className="mt-2 w-full max-w-xs">
                    {getTeachingSkillsWithAgenda(session.participant).length > 0 ? (
                      getTeachingSkillsWithAgenda(session.participant).map((skill, idx) => (
                        <div key={skill.id} className="mb-2">
                          <div className="font-semibold text-primary text-xs mb-1">{skill.name} Subtopics:</div>
                          <ul className="space-y-1 text-xs text-gray-300">
                            {skill.agenda.map((point: string, i: number) => (
                              <li key={i} className="flex items-start"><span className="mr-2">•</span>{point}</li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-500">No teaching subtopics available.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="text-white">{getFormattedDate(session.date)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-400">Time</p>
                    <p className="text-white">{session.startTime} - {session.endTime}</p>
                  </div>
                </div>

                
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Duration</p>
                  <p className="text-white">{sessionDetails.duration}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-800">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Close
            </button>
       
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionModal;