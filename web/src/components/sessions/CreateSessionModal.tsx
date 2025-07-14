import React, { useState } from 'react';
import { X, Calendar, Clock, Users, Globe, Lock, Save, Plus } from 'lucide-react';
import { Session } from '../../types';
import { currentUser } from '../../data/mockData';
import { useToast } from "@/hooks/use-toast";
import { useCreateSession } from "@/hooks/useCreateSession";

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    skillCategory: '',
    isPublic: true,
    maxParticipants: 5,
    isTeaching: true,
    meetingLink: ''
  });
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [focusedTopics, setFocusedTopics] = useState<string[]>([]);
  const [focusedTopicInput, setFocusedTopicInput] = useState('');
  const [generalSubTopics, setGeneralSubTopics] = useState<string[]>(['', '', '', '', '']);
  const [focusKeywords, setFocusKeywords] = useState<string[]>([]);
  const [focusKeywordInput, setFocusKeywordInput] = useState('');
  const { toast } = useToast();
  const { mutate: createSession, status } = useCreateSession({
    onSuccess: () => {
      toast({
        title: "Session created!",
        description: "Your session has been created successfully.",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Session creation failed",
        description: error?.response?.data?.message || "Could not create session.",
        variant: "destructive",
      });
    },
  });

  if (!isOpen) return null;

  // Get teachable skills (type: teaching)
  const teachableSkills = (currentUser.skills || []).filter((s: any) => s.type === 'teaching');
  const selectedSkill = teachableSkills.find(s => s.id === selectedSkillId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate topics
    if (!selectedSkillId) {
      alert('Please select a skill you want to teach.');
      return;
    }
    if (focusedTopics.length !== 5) {
      alert('Please provide exactly 5 focused topics for this session.');
      return;
    }
    if (generalSubTopics.some(t => !t.trim())) {
      alert('Please provide exactly 5 general sub-topics for this session.');
      return;
    }
    if (focusKeywords.length < 1 || focusKeywords.length > 5) {
      alert('Please provide between 1 and 5 focus keywords for this session.');
      return;
    }
    const sessionData = {
      ...formData,
      maxParticipants: formData.isTeaching ? formData.maxParticipants : 1,
      teachSkillId: selectedSkillId,
      teachSkillName: selectedSkill?.name || '',
      focusedTopics: [...focusedTopics],
      subTopics: [...generalSubTopics],
      meetingLink: formData.meetingLink,
      focusKeywords: [...focusKeywords]
    };
    createSession(sessionData);
    // Reset form
    setFormData({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      skillCategory: '',
      isPublic: true,
      maxParticipants: 5,
      isTeaching: true,
      meetingLink: ''
    });
    setSelectedSkillId('');
    setFocusedTopics([]);
    setFocusedTopicInput('');
    setGeneralSubTopics(['', '', '', '', '']);
    setFocusKeywords([]);
    setFocusKeywordInput('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) : value
    }));
  };

  const skillCategories = [
    'Programming',
    'Design',
    'Management',
    'Marketing',
    'Data Science',
    'Business',
    'Finance',
    'Writing',
    'Communication',
    'Sales'
  ];

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleAddFocusedTopic = () => {
    if (focusedTopicInput.trim() && focusedTopics.length < 5) {
      setFocusedTopics(prev => [...prev, focusedTopicInput.trim()]);
      setFocusedTopicInput('');
    }
  };

  const handleRemoveFocusedTopic = (idx: number) => {
    setFocusedTopics(prev => prev.filter((_, i) => i !== idx));
  };

  const handleGeneralSubTopicChange = (idx: number, value: string) => {
    setGeneralSubTopics(prev => prev.map((t, i) => (i === idx ? value : t)));
  };

  const handleAddFocusKeyword = () => {
    if (focusKeywordInput.trim() && focusKeywords.length < 5) {
      setFocusKeywords(prev => [...prev, focusKeywordInput.trim()]);
      setFocusKeywordInput('');
    }
  };

  const handleRemoveFocusKeyword = (idx: number) => {
    setFocusKeywords(prev => prev.filter((_, i) => i !== idx));
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
            <h2 className="text-xl font-bold text-white">Create New Session</h2>
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
                Session Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g., React Hooks Masterclass"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Describe what this session covers and what participants will learn"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={minDate}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Time *
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
                  End Time *
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

            {/* Teachable Skill Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select a Skill to Teach *
              </label>
              {teachableSkills.length === 0 ? (
                <div className="text-sm text-gray-400 mb-2">You have no teachable skills. Add a teaching skill first.</div>
              ) : (
                <select
                  value={selectedSkillId}
                  onChange={e => setSelectedSkillId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select a skill</option>
                  {teachableSkills.map(skill => (
                    <option key={skill.id} value={skill.id}>{skill.name} ({skill.category})</option>
                  ))}
                </select>
              )}
            </div>

            {/* Focused Topics */}
            
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Focused Topics for this Session (up to 5)
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={focusedTopicInput}
                    onChange={e => setFocusedTopicInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Type a topic and press Add"
                    disabled={focusedTopics.length > 5}
                  />
                  <button
                    type="button"
                    onClick={handleAddFocusedTopic}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={focusedTopics.length >= 5 || !focusedTopicInput.trim()}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {focusedTopics.map((topic, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-gray-800 border border-gray-700 rounded-md px-3 py-2">
                      <span className="flex-1 text-white">{topic}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFocusedTopic(idx)}
                        className="text-red-400 hover:text-red-600"
                        title="Remove topic"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Add up to 5 specific topics or subtopics you will cover in this session.</p>
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
              <p className="text-xs text-gray-500 mt-2">Please provide exactly 5 general sub-topics for this session.</p>
            </div>

            {/* Skill Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skill Category *
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

            {/* Meeting Link (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meeting Link (optional)
              </label>
              <input
                type="url"
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Paste a meeting URL (Zoom, Google Meet, etc.)"
              />
            </div>

            {/* Focus Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Focus Keywords (up to 5)
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={focusKeywordInput}
                  onChange={e => setFocusKeywordInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Type a keyword and press Add"
                  disabled={focusKeywords.length >= 5}
                />
                <button
                  type="button"
                  onClick={handleAddFocusKeyword}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={focusKeywords.length >= 5 || !focusKeywordInput.trim()}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {focusKeywords.map((keyword, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-gray-800 border border-gray-700 rounded-md px-3 py-2">
                    <span className="flex-1 text-white">{keyword}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFocusKeyword(idx)}
                      className="text-red-400 hover:text-red-600"
                      title="Remove keyword"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Add up to 5 focus keywords for this session.</p>
            </div>

            {/* Session Preview */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h4 className="text-sm font-medium text-white mb-2">Session Preview</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  <span>{formData.date || 'Select date'}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  <span>{formData.startTime && formData.endTime ? `${formData.startTime} - ${formData.endTime}` : 'Select time'}</span>
                </div>
              
                <div className="flex items-center">
                  {formData.isPublic ? (
                    <Globe className="w-4 h-4 mr-2 text-primary" />
                  ) : (
                    <Lock className="w-4 h-4 mr-2 text-gray-400" />
                  )}
                  <span>{formData.isPublic ? 'Public session' : 'Private session'}</span>
                </div>
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
                Create Session
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionModal;