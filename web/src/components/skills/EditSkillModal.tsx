import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useToast } from '@/hooks/use-toast';
import { SkillRequest } from '@/hooks/types';
import { useApiMutation } from '@/hooks/useApiMutation';

interface ExtendedSkill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  type: 'teaching' | 'learning';
  agenda: string[];
  description?: string;
  experience?: string;
  goals?: string;
}

interface EditSkillModalProps {
  skill: ExtendedSkill | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

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

const EditSkillModal: React.FC<EditSkillModalProps> = ({ skill, isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const updateSkill = useApiMutation({
    method: 'put',
    endpoint: skill ? `/skills/${skill._id}` : '',
    onSuccess: () => {
      toast({ title: 'Skill updated!', description: 'Your skill was updated successfully.' });
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      const err = error as any;
      toast({ title: 'Error', description: err?.response?.data?.message || 'Failed to update skill', variant: 'destructive' });
    },
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<SkillRequest>({
    resolver: yupResolver(skillSchema),
    defaultValues: {
      name: skill?.name || '',
      category: skill?.category || '',
      proficiency: skill?.proficiency || 50,
      type: skill?.type || 'teaching',
      agenda: skill?.agenda || [],
      description: skill?.description || '',
      experience: skill?.experience || '',
      goals: skill?.goals || '',
    },
  });

  React.useEffect(() => {
    if (skill) {
      reset({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        type: skill.type,
        agenda: skill.agenda || [],
        description: skill.description || '',
        experience: skill.experience || '',
        goals: skill.goals || '',
      });
    }
  }, [skill, reset]);

  const agenda = watch('agenda') || [];
  const [topicInput, setTopicInput] = React.useState('');

  if (!isOpen || !skill) return null;

  const onSubmit = (data: SkillRequest) => {
    if (!skill) return;
    updateSkill.mutate(data);
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
            <h2 className="text-xl font-bold text-white">Edit Skill</h2>
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

            {/* Topics */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {watch('type') === 'teaching' ? 'Topics I can teach' : 'Topics I want to learn'} (Required: 5 topics)
              </label>
              <div className="space-y-3">
                {agenda.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400 w-8">#{index + 1}</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newAgenda = [...agenda];
                        newAgenda[index] = e.target.value;
                        setValue('agenda', newAgenda);
                      }}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder={watch('type') === 'teaching' 
                        ? `Teaching topic ${index + 1} (e.g., React Hooks, State Management)`
                        : `Learning topic ${index + 1} (e.g., Basic Syntax, Data Structures)`
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(item)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {agenda.length < 5 && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTopic();
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Add a new topic (press Enter to add)"
                    />
                    <button
                      type="button"
                      onClick={handleAddTopic}
                      className="text-primary hover:text-primary/90"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              {errors.agenda && <p className="text-red-500 text-xs mt-1">{errors.agenda.message}</p>}
              <p className="text-xs text-gray-500 mt-2">
                Please provide exactly 5 specific topics or subtopics related to this skill.
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSkillModal;