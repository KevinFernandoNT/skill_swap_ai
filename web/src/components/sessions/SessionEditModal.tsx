import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, Globe, Lock, Save } from 'lucide-react';
import { Session } from '../../types';
import { SessionRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useUpdateSession } from '@/hooks/useUpdateSession';

interface SessionEditModalProps {
  session: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: any) => void;
  refetchSessions: () => void;
}

const SessionEditModal: React.FC<SessionEditModalProps> = ({ session, isOpen, onClose, onSave, refetchSessions }) => {
  if (!isOpen || !session) return null;

  // All hooks at the top!
  const toast = useToast();
  const { mutate: updateSession, status: updateStatus } = useUpdateSession(session._id, {
    onSuccess: () => {
      toast.toast({ title: 'Session updated!', description: 'Your session was updated successfully.' });
      onSave({ ...session, ...formData, focusedTopics, subTopics: generalSubTopics });
      onClose();
      refetchSessions();
    },
    onError: (error: any) => {
      toast.toast({ title: 'Error', description: error?.response?.data?.message || 'Failed to update session', variant: 'destructive' });
    },
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    skillCategory: '',
    isPublic: true,
    maxParticipants: 5,
    isTeaching: true
  });
  const [focusedTopics, setFocusedTopics] = useState<string[]>(['', '', '', '', '']);
  const [generalSubTopics, setGeneralSubTopics] = useState<string[]>(['', '', '', '', '']);

  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title || '',
        description: session.description || '',
        date: session.date || '',
        startTime: session.startTime || '',
        endTime: session.endTime || '',
        skillCategory: session.skillCategory || '',
        isPublic: session.isPublic || false,
        maxParticipants: session.maxParticipants || 5,
        isTeaching: session.isTeaching || true
      });
      setFocusedTopics(session.focusedTopics && session.focusedTopics.length === 5 ? [...session.focusedTopics] : ['', '', '', '', '']);
      setGeneralSubTopics(session.subTopics && session.subTopics.length === 5 ? [...session.subTopics] : ['', '', '', '', '']);
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) : value
    }));
  };

  const handleTopicChange = (idx: number, value: string) => {
    setFocusedTopics(prev => prev.map((t, i) => (i === idx ? value : t)));
  };

  const handleGeneralSubTopicChange = (idx: number, value: string) => {
    setGeneralSubTopics(prev => prev.map((t, i) => (i === idx ? value : t)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSession({
      ...formData,
      focusedTopics,
      subTopics: generalSubTopics,
    });
  };

  const skillCategories = [
    'Programming',
    'Design',
    'Management',
    'Marketing',
    'Data Science',
    'Business',
    'Finance',
    'Writing'
  ];

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
            <h2 className="text-xl font-bold text-white">Edit Session</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Session Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter session title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Describe what this session covers"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Skill Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skill Category
              </label>
              <select
                name="skillCategory"
                value={formData.skillCategory}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select a category</option>
                {skillCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            {/* Visibility */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary bg-gray-800 border-gray-700 rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-300">
                  Make this session public
                </span>
                {formData.isPublic ? (
                  <Globe className="w-4 h-4 text-primary" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
              </label>
              <p className="mt-1 text-xs text-gray-400">
                Public sessions can be discovered and joined by other users
              </p>
            </div>

          
            {/* General Sub-Topics */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                General Sub-Topics for this Session (5 required)
              </label>
              <div className="space-y-3">
                {generalSubTopics.map((topic, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400 w-8">#{idx + 1}</span>
                    <input
                      type="text"
                      value={topic}
                      onChange={e => handleGeneralSubTopicChange(idx, e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder={`Sub-topic ${idx + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SessionEditModal;