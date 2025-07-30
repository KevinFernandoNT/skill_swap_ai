import React, { useState } from 'react';
import { X, Calendar, Clock, Users, Globe, Lock, Save, Plus } from 'lucide-react';
import { useGetUserSkills } from '@/hooks/useGetUserSkills';
import { useToast } from "@/hooks/use-toast";
import { useCreateSession } from "@/hooks/useCreateSession";
import { SessionRequest } from "@/types";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Validation schema
const sessionSchema = yup.object({
  title: yup.string().required('Session title is required'),
  description: yup.string().required('Description is required'),
  date: yup.string().required('Date is required'),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
  skillCategory: yup.string().required('Skill category is required'),
  isPublic: yup.boolean(),
  maxParticipants: yup.number().min(1, 'At least 1 participant').optional(),
  isTeaching: yup.boolean(),
  meetingLink: yup.string().url('Invalid meeting link').notRequired(),
  teachSkillId: yup.string().required('Please select a skill you want to teach'),
  teachSkillName: yup.string().notRequired(),
  focusKeywords: yup.array().of(yup.string()).max(5, 'Up to 5 focus keywords').notRequired(),
});

type SessionFormValues = yup.InferType<typeof sessionSchema>;

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  // All hooks at the top!
  const [focusKeywordInput, setFocusKeywordInput] = useState('');
  const { toast } = useToast();
  const { mutate: createSession, status } = useCreateSession({
    onSuccess: () => {
      toast({
        title: "Session created!",
        description: "Your session has been created successfully.",
      });
      reset();
      setFocusKeywordInput('');
      onClose();
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Session creation failed",
        description: error?.response?.data?.message || "Could not create session.",
        variant: "destructive",
      });
    },
  });
  const { data: skillsResult, isLoading: skillsLoading } = useGetUserSkills();
  const teachableSkills = (skillsResult?.data || []).filter((s: any) => s.type === 'teaching');
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<SessionFormValues>({
    resolver: yupResolver(sessionSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      skillCategory: '',
      isPublic: true,
      maxParticipants: 5,
      isTeaching: true,
      meetingLink: '',
      teachSkillId: '',
      teachSkillName: '',
      focusKeywords: [],
    },
  });
  const selectedSkill = teachableSkills.find(s => s._id === watch('teachSkillId'));

  // Now do your conditional returns
  if (skillsLoading) return <div>Loading...</div>;
  if (!skillsResult) return <div>No skills loaded.</div>;

  if (!isOpen) return null;

  const handleSubmitForm = (data: SessionFormValues) => {
    const sessionData: SessionRequest = {
      title: data.title,
      description: data.description,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      skillCategory: data.skillCategory,
      isPublic: data.isPublic,
      maxParticipants: data.isTeaching ? data.maxParticipants : 1,
      isTeaching: data.isTeaching,
      teachSkillId: data.teachSkillId,
      teachSkillName: data.teachSkillName,
      meetingLink: data.meetingLink,
      focusKeywords: data.focusKeywords,
    };
    createSession(sessionData);
  };

  const handleClose = () => {
    reset();
    setFocusKeywordInput('');
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setValue(name as keyof SessionFormValues, type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) : value);
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



  const handleAddFocusKeyword = () => {
    const current = watch('focusKeywords') || [];
    if (focusKeywordInput.trim() && current.length < 5) {
      setValue('focusKeywords', [...current, focusKeywordInput.trim()]);
      setFocusKeywordInput('');
    }
  };

  const handleRemoveFocusKeyword = (idx: number) => {
    const current = watch('focusKeywords') || [];
    setValue('focusKeywords', current.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-gray-900 rounded-lg shadow-xl border border-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Create New Session</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleSubmitForm)} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Session Title *
              </label>
              <input
                type="text"
                {...register('title')}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g., React Hooks Masterclass"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Describe what this session covers and what participants will learn"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  {...register('date')}
                  onChange={handleChange}
                  min={minDate}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  {...register('startTime')}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  {...register('endTime')}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p>}
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
                  value={watch('teachSkillId')}
                  onChange={e => setValue('teachSkillId', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a skill</option>
                  {teachableSkills.map(skill => (
                    <option key={skill._id} value={skill._id}>{skill.name} ({skill.category})</option>
                  ))}
                </select>
              )}
              {errors.teachSkillId && <p className="text-red-500 text-xs mt-1">{errors.teachSkillId.message}</p>}
            </div>



            {/* Skill Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skill Category *
              </label>
              <select
                {...register('skillCategory')}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select a category</option>
                {skillCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.skillCategory && <p className="text-red-500 text-xs mt-1">{errors.skillCategory.message}</p>}
            </div>

            {/* Meeting Link (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meeting Link (optional)
              </label>
              <input
                type="url"
                {...register('meetingLink')}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Paste a meeting URL (Zoom, Google Meet, etc.)"
              />
              {errors.meetingLink && <p className="text-red-500 text-xs mt-1">{errors.meetingLink.message}</p>}
            </div>

            {/* Focus Keywords (optional, up to 5) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Focus Keywords (optional, up to 5)
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={focusKeywordInput}
                  onChange={e => setFocusKeywordInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Type a keyword and press Add"
                  disabled={(watch('focusKeywords') || []).length >= 5}
                />
                {errors.focusKeywords && <p className="text-red-500 text-xs mt-1">{errors.focusKeywords.message}</p>}
                <button
                  type="button"
                  onClick={handleAddFocusKeyword}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={(watch('focusKeywords') || []).length >= 5 || !focusKeywordInput.trim()}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {(watch('focusKeywords') || []).map((keyword, idx) => (
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
              <p className="text-xs text-gray-500 mt-2">You can provide up to 5 focus keywords for this session (optional).</p>
            </div>

            {/* Session Preview */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h4 className="text-sm font-medium text-white mb-2">Session Preview</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  <span>{watch('date') || 'Select date'}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  <span>{watch('startTime') && watch('endTime') ? `${watch('startTime')} - ${watch('endTime')}` : 'Select time'}</span>
                </div>
              
                <div className="flex items-center">
                  {watch('isPublic') ? (
                    <Globe className="w-4 h-4 mr-2 text-primary" />
                  ) : (
                    <Lock className="w-4 h-4 mr-2 text-gray-400" />
                  )}
                  <span>{watch('isPublic') ? 'Public session' : 'Private session'}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={handleClose}
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