import React, { useState } from 'react';
import { X, ArrowRightLeft, Send, User } from 'lucide-react';
import { Session, Skill } from '../../types';
import { currentUser } from '../../data/mockData';
import { toast } from '../../hooks/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '../ui/alert-dialog';

interface SkillSwapModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestSwap: (sessionId: string, selectedSkillId: string, message: string) => void;
}

const SkillSwapModal: React.FC<SkillSwapModalProps> = ({ 
  session, 
  isOpen, 
  onClose, 
  onRequestSwap 
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [message, setMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<null | React.FormEvent>(null);

  if (!isOpen || !session) return null;

  // Filter user's skills that could be swapped (teaching skills)
  const availableSkills = currentUser.skills.filter(skill => 
    skill.category === session.skillCategory || skill.proficiency >= 70
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) return;
    setPendingSubmit(e);
    setConfirmDialogOpen(true);
  };
    
  const handleConfirmSwap = () => {
    if (!selectedSkillId) return;
    onRequestSwap(session.id, selectedSkillId, message);
    onClose();
    toast({
      title: 'Swap Request Sent',
      description: 'Your skill swap request has been sent successfully!'
    });
    setSelectedSkillId('');
    setMessage('');
    setConfirmDialogOpen(false);
    setPendingSubmit(null);
  };

  const handleCancelSwap = () => {
    setConfirmDialogOpen(false);
    setPendingSubmit(null);
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
            <h2 className="text-xl font-bold text-white flex items-center">
              <ArrowRightLeft className="w-5 h-5 mr-2" />
              Request Skill Swap
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Session Info */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-2">{session.title}</h3>
              <div className="flex items-center space-x-4 mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(session.skillCategory)}`}>
                  {session.skillCategory}
                </span>
                <div className="flex items-center text-gray-400">
                  <User className="w-4 h-4 mr-1" />
                  <span className="text-sm">with {session.participant.name}</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                {new Date(session.date).toLocaleDateString()} at {session.startTime} - {session.endTime}
              </p>
            </div>

            {/* Skill Selection */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select a skill you can offer in exchange:
                </label>
                
                {availableSkills.length > 0 ? (
                  <div className="space-y-3">
                    {availableSkills.map((skill) => (
                      <label
                        key={skill.id}
                        className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedSkillId === skill.id
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="skill"
                          value={skill.id}
                          checked={selectedSkillId === skill.id}
                          onChange={(e) => setSelectedSkillId(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-sm">{skill.name}</h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                              {skill.category}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Proficiency</span>
                            <span className="text-sm font-medium text-primary">{skill.proficiency}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">
                      You don't have any skills that match this session category or meet the proficiency requirements.
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-primary hover:text-primary/80"
                    >
                      Add skills to your profile first
                    </button>
                  </div>
                )}
              </div>

              {/* Message */}
              {availableSkills.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Introduce yourself and explain why you'd like to swap skills..."
                  />
                </div>
              )}

              {/* Swap Preview */}
              {selectedSkillId && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-medium mb-3">Swap Preview:</h4>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">You offer</div>
                      <div className="text-white font-medium">
                        {availableSkills.find(s => s.id === selectedSkillId)?.name}
                      </div>
                      {/* Agenda for offered skill */}
                      {(() => {
                        const skill = availableSkills.find(s => s.id === selectedSkillId) as any;
                        return skill && skill.agenda && skill.agenda.length > 0 ? (
                          <ul className="mt-1 text-xs text-gray-300 text-left inline-block">
                            {skill.agenda.map((point: string, idx: number) => (
                              <li key={idx}>• {point}</li>
                            ))}
                          </ul>
                        ) : null;
                      })()}
                    </div>
                    <ArrowRightLeft className="w-5 h-5 text-primary" />
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">You learn</div>
                      <div className="text-white font-medium">{session.title}</div>
                      {/* Agenda for learning skill (from session.participant) */}
                      {(() => {
                        const learnSkill = session.participant.skills?.find(
                          s => s.name.toLowerCase() === session.title.toLowerCase() && (s as any).agenda && (s as any).agenda.length > 0
                        ) as any;
                        return learnSkill && learnSkill.agenda && learnSkill.agenda.length > 0 ? (
                          <ul className="mt-1 text-xs text-gray-300 text-left inline-block">
                            {learnSkill.agenda.map((point: string, idx: number) => (
                              <li key={idx}>• {point}</li>
                            ))}
                          </ul>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {availableSkills.length > 0 && (
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedSkillId}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Swap Request
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Custom Confirmation Dialog for Swap Request */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Swap Request?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send this skill swap request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelSwap}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSwap}>Send Request</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SkillSwapModal;