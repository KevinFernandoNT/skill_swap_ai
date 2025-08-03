import React, { useState } from 'react';
import { X, ArrowRightLeft, Calendar, Clock, User, Star } from 'lucide-react';
import { Session, Skill } from '../../types';
import { currentUser } from '../../data/mockData';
import SkillSwapModal from './SkillSwapModal';

interface SessionDetailsModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({ 
  session, 
  isOpen, 
  onClose 
}) => {
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  if (!isOpen || !session) return null;

  // Filter user's teaching skills that could be offered
  const availableSkills = currentUser.skills.filter(skill => 
    skill.type === 'teaching' && skill.proficiency >= 50
  );

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

  const handleSwapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSwapModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-gray-900 rounded-lg shadow-xl border border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Session Details
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left side - Session details */}
                <div className="space-y-6">
                  {/* Session Info */}
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">{session.title || 'Untitled Session'}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(session.skillCategory || '')}`}>
                        {session.skillCategory || 'General'}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{session.description || 'No description available'}</p>
                    
                    <div className="space-y-3 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-3" />
                        <span>{session.date ? new Date(session.date).toLocaleDateString() : 'Date TBD'}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-3" />
                        <span>{session.startTime || 'TBD'} - {session.endTime || 'TBD'}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-3" />
                        <span>Hosted by {session.participant?.name || 'Session Host'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Host Information */}
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h4 className="text-lg font-medium text-white mb-4">About the Host</h4>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {session.participant?.name?.charAt(0) || 'H'}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-white font-medium">{session.participant?.name || 'Session Host'}</h5>
                        <p className="text-sm text-gray-400">Skill Exchange Partner</p>
                      </div>
                    </div>
                    {session.participant?.bio && (
                      <p className="text-sm text-gray-300">{session.participant.bio}</p>
                    )}
                  </div>
                </div>

                {/* Right side - Exchange options */}
                <div className="space-y-6">
                  {/* Available Skills */}
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h4 className="text-lg font-medium text-white mb-4">Your Teaching Skills</h4>
                    
                    {availableSkills.length > 0 ? (
                      <div className="space-y-3">
                        {availableSkills.map((skill) => (
                          <div
                            key={skill._id}
                            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                          >
                            <div>
                              <h5 className="text-white font-medium">{skill.name}</h5>
                              <p className="text-sm text-gray-400">{skill.category}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium text-primary">{skill.proficiency}%</span>
                              <div className="w-20 bg-gray-600 rounded-full h-2 mt-1">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${skill.proficiency}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-400 mb-4">
                          You don't have any teaching skills that meet the proficiency requirements.
                        </p>
                        <button
                          onClick={onClose}
                          className="text-primary hover:text-primary/80"
                        >
                          Add skills to your profile first
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  {availableSkills.length > 0 && (
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h4 className="text-lg font-medium text-white mb-4">Request Skill Swap</h4>
                      <p className="text-sm text-gray-300 mb-4">
                        Offer one of your teaching skills in exchange for learning from this session.
                      </p>
                      <button
                        onClick={handleSwapClick}
                        className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
                      >
                        <ArrowRightLeft className="w-4 h-4 mr-2" />
                        Request Skill Swap
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Swap Modal */}
      <SkillSwapModal
        session={session}
        isOpen={isSwapModalOpen}
        onClose={() => {
          setIsSwapModalOpen(false);
          onClose();
        }}
      />
    </>
  );
};

export default SessionDetailsModal; 