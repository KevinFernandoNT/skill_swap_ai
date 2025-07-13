import React from 'react';
import { X, MapPin, Mail, Star, Award } from 'lucide-react';
import { User } from '../../types';

interface UserProfileModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

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

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 80) return 'text-green-400';
    if (proficiency >= 60) return 'text-yellow-400';
    if (proficiency >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500 text-white';
      case 'busy':
        return 'bg-red-500 text-white';
      case 'away':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
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
            <h2 className="text-xl font-bold text-white">User Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* User Info */}
            <div className="flex items-start space-x-6">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                {user.status && (
                  <span 
                    className={`absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}
                  >
                    {user.status}
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">{user.name}</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-400">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  
                  {user.location && (
                    <div className="flex items-center text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{user.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">About</h4>
                <p className="text-gray-300">{user.bio}</p>
              </div>
            )}

            {/* Skills */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Skills & Expertise
              </h4>
              
              {user.skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-white">{skill.name}</h5>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                          {skill.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Proficiency</span>
                        <span className={`text-sm font-medium ${getProficiencyColor(skill.proficiency)}`}>
                          {skill.proficiency}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No skills listed yet.</p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.skills.length}</div>
                <div className="text-sm text-gray-400">Skills</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.8</div>
                <div className="text-sm text-gray-400">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">23</div>
                <div className="text-sm text-gray-400">Sessions</div>
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
            <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;