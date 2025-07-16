import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCreateSkill } from '@/hooks/useCreateSkill';
import { useToast } from '@/hooks/use-toast';
import { SkillRequest } from '@/hooks/types';

const skillSchema = yup.object({
  name: yup.string().required('Skill name is required'),
  category: yup.string().required('Category is required'),
  proficiency: yup.number().min(0).max(100).required('Proficiency is required'),
  type: yup.string().oneOf(['teaching', 'learning']).required('Type is required'),
  agenda: yup.array().of(yup.string()).max(5, 'You can add up to 5 sub topics or domain areas').notRequired(),
  description: yup.string().max(500, 'Description is too long').notRequired(),
  experience: yup.string().max(500, 'Experience is too long').notRequired(),
  goals: yup.string().max(500, 'Goals is too long').notRequired(),
});

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType: 'teaching' | 'learning';
  onSuccess?: () => void;
}

const AddSkillModal: React.FC<AddSkillModalProps> = ({ isOpen, onClose, defaultType, onSuccess }) => {
  const { toast } = useToast();
  const createSkill = useCreateSkill({
    onSuccess: () => {
      toast({ title: 'Skill added!', description: 'Your skill was added successfully.' });
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({ title: 'Error', description: error?.response?.data?.message || 'Failed to add skill', variant: 'destructive' });
    },
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<SkillRequest>({
    resolver: yupResolver(skillSchema),
    defaultValues: {
    name: '',
    category: '',
    proficiency: 50,
    type: defaultType,
      agenda: [],
      description: '',
      experience: '',
      goals: '',
    },
  });

  const agenda = watch('agenda') || [];
  const [topicInput, setTopicInput] = useState('');

  if (!isOpen) return null;

  const onSubmit = (data: SkillRequest) => {
    createSkill.mutate(data);
    reset();
    setTopicInput('');
  };

  const handleAddTopic = () => {
    const trimmed = topicInput.trim();
    if (!trimmed || agenda.includes(trimmed) || agenda.length >= 5) return;
    setValue('agenda', [...agenda, trimmed]);
    setTopicInput('');
  };

  const handleRemoveTopic = (topic: string) => {
    setValue('agenda', agenda.filter(t => t !== topic));
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
            <h2 className="text-xl font-bold text-white">Add New Skill</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., React, Python, UX Design"
                  required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select a category</option>
                  {skillCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
              </div>
            </div>

            {/* Skill Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skill Type
              </label>
              <select
                {...register('type')}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="teaching">Teaching - I can teach this skill</option>
                <option value="learning">Learning - I want to learn this skill</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
            </div>

            {/* Proficiency/Interest Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {watch('type') === 'teaching' ? 'Proficiency Level' : 'Interest Level'} ({watch('proficiency')}%)
              </label>
              <input
                type="range"
                {...register('proficiency')}
                min="0"
                max="100"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              {errors.proficiency && <p className="text-red-500 text-xs mt-1">{errors.proficiency.message}</p>}
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>

            {/* Optional Sub Topics or Domain Areas */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Optional Sub Topics or Domain Areas (up to 5)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={topicInput}
                  onChange={e => setTopicInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Add a sub topic or domain area and press +"
                  maxLength={100}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTopic(); } }}
                  disabled={agenda.length >= 5}
                />
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none"
                  title="Add sub topic"
                  disabled={agenda.length >= 5}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {agenda.length > 0 && (
                <ul className="flex flex-wrap gap-2 mt-2">
                  {agenda.map(topic => (
                    <li key={topic} className="flex items-center bg-gray-700 text-white px-2 py-1 rounded">
                      <span>{topic}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTopic(topic)}
                        className="ml-2 text-gray-300 hover:text-red-400"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {errors.agenda && <p className="text-red-500 text-xs mt-1">{errors.agenda.message}</p>}
              <p className="text-xs text-gray-500 mt-2">
                You can add up to 5 sub topics or domain areas you want to focus on for this skill. This is optional.
              </p>
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
                Add Skill
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSkillModal;