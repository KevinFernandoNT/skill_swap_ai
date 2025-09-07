import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCreateSkill } from '@/hooks/useCreateSkill';
import { useToast } from '@/hooks/use-toast';
import { SkillRequest } from '@/hooks/types';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "../ui/animated-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const skillSchema = yup.object({
  name: yup.string().required('Skill name is required'),
  category: yup.string().required('Category is required'),
  proficiency: yup.number().min(0).max(100).required('Proficiency is required'),
  experience: yup.array().of(yup.string().trim().required('Experience item cannot be empty')).notRequired(),
  focusedTopics: yup.array().of(yup.string().trim().required('Topic cannot be empty')).notRequired(),
});

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddSkillModal: React.FC<AddSkillModalProps> = ({ isOpen, onClose, onSuccess }) => {
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
      experience: [],
      focusedTopics: [],
    },
  });

  const experience = watch('experience') || [];
  const focusedTopics = watch('focusedTopics') || [];
  const [experienceInput, setExperienceInput] = useState('');
  const [topicInput, setTopicInput] = useState('');


  if (!isOpen) return null;

  const onSubmit = (data: SkillRequest) => {
    createSkill.mutate(data);
    reset({
      name: '',
      category: '',
      proficiency: 50,
      experience: [],
      focusedTopics: [],
    });
    setExperienceInput('');
    setTopicInput('');
  };

  const handleAddExperience = () => {
    const trimmed = experienceInput.trim();
    if (!trimmed || experience.includes(trimmed)) return;
    setValue('experience', [...experience, trimmed]);
    setExperienceInput('');
  };

  const handleRemoveExperience = (item: string) => {
    setValue('experience', experience.filter(e => e !== item));
  };

  const handleAddTopic = () => {
    const trimmed = topicInput.trim();
    if (!trimmed || focusedTopics.includes(trimmed)) return;
    setValue('focusedTopics', [...focusedTopics, trimmed]);
    setTopicInput('');
  };

  const handleRemoveTopic = (topic: string) => {
    setValue('focusedTopics', focusedTopics.filter(t => t !== topic));
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
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalBody>
        <ModalContent>
          {createSkill.isPending && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="bg-card border border-border rounded-lg p-8 max-w-sm mx-4 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Adding Skill</h3>
                <p className="text-sm text-muted-foreground mb-4">Please wait while we add your skill...</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {createSkill.error && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-4">
                <div className="flex items-center space-x-3 text-destructive mb-4">
                  <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                    <span className="text-sm font-bold">!</span>
                  </div>
                  <span className="text-sm font-medium">Error Adding Skill</span>
                </div>
                <p className="text-sm text-destructive mb-4">
                  {createSkill.error?.response?.data?.message || createSkill.error?.message || 'An unexpected error occurred'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          <div className={`space-y-6 ${createSkill.isPending || createSkill.error ? 'pointer-events-none opacity-50' : ''}`}>
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold mb-2">
                New Skill
              </h4>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Add your skill details
              </p>
            </div>

            {/* Form Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Basic Information</h3>
                    <p className="text-sm text-muted-foreground">Let's start with the fundamentals</p>
                  </div>

                  {/* Skill Name */}
                  <div>
                    <Label className="block text-sm font-medium text-foreground mb-2">
                      Skill Name *
                    </Label>
                    <Input
                      {...register('name')}
                      placeholder="e.g., React, Python, UX Design"
                      className="h-12"
                    />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  {/* Category */}
                  <div>
                    <Label className="block text-sm font-medium text-foreground mb-2">
                      Category *
                    </Label>
                    <select
                      {...register('category')}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary h-12"
                    >
                      <option value="">Select a category</option>
                      {skillCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-destructive text-xs mt-1">{errors.category.message}</p>}
                  </div>


                  {/* Proficiency Level */}
                  <div>
                    <Label className="block text-sm font-medium text-foreground mb-2">
                      Proficiency Level ({watch('proficiency')}%)
                    </Label>
                    <input
                      type="range"
                      {...register('proficiency')}
                      min="0"
                      max="100"
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                    />
                    {errors.proficiency && <p className="text-destructive text-xs mt-1">{errors.proficiency.message}</p>}
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Expert</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Additional Information */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Additional Information</h3>
                    <p className="text-sm text-muted-foreground">Optional details about your skill</p>
                  </div>


                  {/* Experience */}
                  <div>
                    <Label className="block text-sm font-medium text-foreground mb-2">
                      Experience
                    </Label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={experienceInput}
                          onChange={(e) => setExperienceInput(e.target.value)}
                          placeholder="Add your experience with this skill..."
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddExperience();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={handleAddExperience}
                          disabled={!experienceInput.trim()}
                          size="sm"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {experience.length > 0 && (
                        <div className="space-y-2">
                          {experience.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 border border-border rounded-lg bg-card/50">
                              <span className="flex-1 text-sm text-foreground">{item}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveExperience(item)}
                                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.experience && <p className="text-destructive text-xs mt-1">{errors.experience.message}</p>}
                  </div>

                  {/* Focused Sub Topics */}
                  <div>
                    <Label className="block text-sm font-medium text-foreground mb-2">
                      Focused Sub Topics
                    </Label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={topicInput}
                          onChange={(e) => setTopicInput(e.target.value)}
                          placeholder="e.g., Hooks, Components, State Management"
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTopic();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={handleAddTopic}
                          disabled={!topicInput.trim()}
                          size="sm"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {focusedTopics.length > 0 && (
                        <div className="space-y-2">
                          {focusedTopics.map((topic, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 border border-border rounded-lg bg-card/50">
                              <span className="flex-1 text-sm text-foreground">{topic}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTopic(topic)}
                                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.focusedTopics && <p className="text-destructive text-xs mt-1">{errors.focusedTopics.message}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      List the specific topics or areas you focus on teaching for this skill
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={createSkill.isPending}
              className="w-full sm:w-auto"
            >
              {createSkill.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Skill...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Add Skill
                </>
              )}
            </Button>
          </ModalFooter>
                 </ModalContent>
       </ModalBody>
     </Modal>
   );
 };

export default AddSkillModal;