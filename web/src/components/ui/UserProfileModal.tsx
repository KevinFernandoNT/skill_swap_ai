import React from 'react';
import { X, MapPin, Mail, Star, Award, GraduationCap, BookOpen, Calendar, Users } from 'lucide-react';
import { User } from '../../types';
import { useGetUserStats } from '../../hooks/useGetUserStats';

interface UserProfileModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, isOpen, onClose }) => {
  const { data: userStats, isLoading: statsLoading } = useGetUserStats(user?._id || null);

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
        <div className="relative w-full max-w-4xl bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
          {/* Enhanced Header */}
          <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 p-8 border-b border-gray-700">
            <div className="flex items-center justify-between mb-6">

            </div>
            
            {/* User Info Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-700 shadow-lg"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-3">{user.name}</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-300">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                  
                  {user.location && (
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-sm font-medium">{user.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="hidden md:flex space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{user.skills.filter(skill => skill.type === 'teaching').length}</div>
                  <div className="text-xs text-gray-400 font-medium">Teaching</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{user.skills.filter(skill => skill.type === 'learning').length}</div>
                  <div className="text-xs text-gray-400 font-medium">Learning</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center">
                    {statsLoading ? (
                      <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        {userStats?.stats.rating || 0}
                        <Star className="w-4 h-4 ml-1 fill-current" />
                      </>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Bio Section */}
            {userStats?.user.bio && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-400" />
                  About
                </h4>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-300 leading-relaxed">{userStats.user.bio}</p>
                </div>
              </div>
            )}

            {/* Skills Section */}
            <div className="space-y-6">
              {user.skills.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Teaching Skills */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 rounded-lg p-3 mr-4">
                        <GraduationCap className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h5 className="text-xl font-bold text-white mb-1">Skills I Can Teach</h5>
                        <p className="text-sm text-gray-400">Expertise I'm ready to share</p>
                      </div>
                    </div>
                    {user.skills.filter(skill => skill.type === 'teaching').length > 0 ? (
                      <div className="space-y-3">
                        {user.skills
                          .filter(skill => skill.type === 'teaching')
                          .map((skill) => (
                                                         <div
                               key={skill._id}
                               className="py-3 px-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200"
                             >
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center space-x-3">
                                   <div className="flex-1">
                                     <h6 className="font-semibold text-white text-base">{skill.name}</h6>
                                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                                       {skill.category}
                                     </span>
                                   </div>
                                 </div>
                                 <div className="text-right">
                                   <div className={`text-lg font-bold ${getProficiencyColor(skill.proficiency)}`}>
                                     {skill.proficiency}%
                                   </div>
                                   <div className="text-xs text-gray-400 font-medium">Proficiency</div>
                                 </div>
                               </div>
                               {Array.isArray(skill.agenda) && skill.agenda.length > 0 && (
                                 <div className="mt-3 pt-3 border-t border-gray-700">
                                   <div className="text-xs text-gray-400 mb-2">Agenda</div>
                                   <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                                     {skill.agenda.map((item, idx) => (
                                       <li key={idx}>{item}</li>
                                     ))}
                                   </ul>
                                 </div>
                               )}
                             </div>
                          ))}
                      </div>
                    ) : (
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                        <BookOpen className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400 font-medium text-sm">No teaching skills listed yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Learning Skills */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 rounded-lg p-3 mr-4">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="text-xl font-bold text-white mb-1">Skills I Want to Learn</h5>
                        <p className="text-sm text-gray-400">Areas I'm looking to grow</p>
                      </div>
                    </div>
                    {user.skills.filter(skill => skill.type === 'learning').length > 0 ? (
                      <div className="space-y-3">
                        {user.skills
                          .filter(skill => skill.type === 'learning')
                          .map((skill) => (
                                                         <div
                               key={skill._id}
                               className="py-3 px-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200"
                             >
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center space-x-3">
                                   <div className="flex-1">
                                     <h6 className="font-semibold text-white text-base">{skill.name}</h6>
                                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                                       {skill.category}
                                     </span>
                                   </div>
                                 </div>
                                 <div className="text-right">
                                   <div className={`text-lg font-bold ${getProficiencyColor(skill.proficiency)}`}>
                                     {skill.proficiency}%
                                   </div>
                                   <div className="text-xs text-gray-400 font-medium">Current Level</div>
                                 </div>
                               </div>
                               {Array.isArray(skill.agenda) && skill.agenda.length > 0 && (
                                 <div className="mt-3 pt-3 border-t border-gray-700">
                                   <div className="text-xs text-gray-400 mb-2">Agenda</div>
                                   <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                                     {skill.agenda.map((item, idx) => (
                                       <li key={idx}>{item}</li>
                                     ))}
                                   </ul>
                                 </div>
                               )}
                             </div>
                          ))}
                      </div>
                    ) : (
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                        <GraduationCap className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400 font-medium text-sm">No learning goals listed yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
                  <Award className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No skills listed yet.</p>
                </div>
              )}
            </div>

            {/* Enhanced Stats Section */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                Activity Statistics
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-green-400 mb-1">{user.skills.filter(skill => skill.type === 'teaching').length}</div>
                  <div className="text-sm text-gray-400 font-medium">Teaching Skills</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{user.skills.filter(skill => skill.type === 'learning').length}</div>
                  <div className="text-sm text-gray-400 font-medium">Learning Goals</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center mb-1">
                    {statsLoading ? (
                      <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        {userStats?.stats.rating || 0}
                        <Star className="w-4 h-4 ml-1 fill-current" />
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">Average Rating</div>
                </div>
              
              </div>

              {/* Additional Stats */}
              {userStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 
                 
                 
                  {/* Exchange-session specific stats */}
                  <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                    <div className="text-lg font-bold text-green-300 flex items-center justify-center mb-1">
                      {userStats.stats.completedExchangeSessions ?? 0}
                      <Calendar className="w-4 h-4 ml-1" />
                    </div>
                    <div className="text-sm text-gray-400 font-medium">Completed Exchange Sessions</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                    <div className="text-lg font-bold text-blue-300 flex items-center justify-center mb-1">
                      {userStats.stats.hostedExchangeSessions ?? 0}
                      <Users className="w-4 h-4 ml-1" />
                    </div>
                    <div className="text-sm text-gray-400 font-medium">Hosted Exchange Sessions</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-800 bg-gray-900">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;