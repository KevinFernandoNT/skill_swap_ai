import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Loader2, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useToast } from '@/hooks/use-toast';
import { SkillRequest } from '@/hooks/types';
import { useApiMutation } from '@/hooks/useApiMutation';
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

interface ExtendedSkill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  experience?: string;
  focusedTopics?: string;
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
  experience: yup.string().max(500, 'Experience is too long').notRequired(),
  focusedTopics: yup.string().max(500, 'Focused topics is too long').notRequired(),
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
      experience: skill?.experience || '',
      focusedTopics: skill?.focusedTopics || '',
    },
  });

  React.useEffect(() => {
    if (skill) {
      reset({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        experience: skill.experience || '',
        focusedTopics: skill.focusedTopics || '',
      });
    }
  }, [skill, reset]);


  if (!isOpen || !skill) return null;

  const onSubmit = (data: SkillRequest) => {
    if (!skill) return;
    updateSkill.mutate(data);
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
          {updateSkill.isPending && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="bg-card border border-border rounded-lg p-8 max-w-sm mx-4 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Updating Skill</h3>
                <p className="text-sm text-muted-foreground mb-4">Please wait while we update your skill...</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {updateSkill.error && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-4">
                <div className="flex items-center space-x-3 text-destructive mb-4">
                  <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                    <span className="text-sm font-bold">!</span>
                  </div>
                  <span className="text-sm font-medium">Error Updating Skill</span>
                </div>
                <p className="text-sm text-destructive mb-4">
                  {updateSkill.error?.response?.data?.message || updateSkill.error?.message || 'An unexpected error occurred'}
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

          <div className={`space-y-6 ${updateSkill.isPending || updateSkill.error ? 'pointer-events-none opacity-50' : ''}`}>
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Edit className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold mb-2">
                Edit Skill
              </h4>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Update your skill details
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
                    <p className="text-sm text-muted-foreground">Update the fundamentals</p>
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
                    <Textarea
                      {...register('experience')}
                      placeholder="Your experience with this skill..."
                      className="min-h-[100px]"
                    />
                    {errors.experience && <p className="text-destructive text-xs mt-1">{errors.experience.message}</p>}
                  </div>

                  {/* Focused Sub Topics */}
                  <div>
                    <Label className="block text-sm font-medium text-foreground mb-2">
                      Focused Sub Topics
                    </Label>
                    <Textarea
                      {...register('focusedTopics')}
                      placeholder="e.g., Hooks, Components, State Management (comma-separated)"
                      className="min-h-[100px]"
                    />
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
              disabled={updateSkill.isPending}
              className="w-full sm:w-auto"
            >
              {updateSkill.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Skill...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Skill
                </>
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
};

export default EditSkillModal;