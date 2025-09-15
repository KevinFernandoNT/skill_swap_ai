import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Loader2, Edit, BookOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCreateSkill } from '@/hooks/useCreateSkill';
import { useToast } from '@/hooks/use-toast';
import { SkillRequest } from '@/hooks/types';
import { useApiMutation } from '@/hooks/useApiMutation';
import {
  CustomSheet as Sheet,
  CustomSheetClose as SheetClose,
  CustomSheetContent as SheetContent,
  CustomSheetDescription as SheetDescription,
  CustomSheetFooter as SheetFooter,
  CustomSheetHeader as SheetHeader,
  CustomSheetTitle as SheetTitle,
} from '@/components/ui/custom-sheet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UnsavedChangesModal } from "@/components/ui/unsaved-changes-modal";

interface ExtendedSkill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  experience?: string;
  focusedTopics?: string;
}

interface SkillSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  skill?: ExtendedSkill | null; // For editing
  mode: 'create' | 'edit';
}

const skillSchema = yup.object({
  name: yup.string().required('Skill name is required'),
  category: yup.string().required('Category is required'),
  proficiency: yup.number().min(0).max(100).required('Proficiency is required'),
  experience: yup.array().of(yup.string().trim().required('Experience item cannot be empty')).notRequired(),
  focusedTopics: yup.array().of(yup.string().trim().required('Topic cannot be empty')).notRequired(),
});

const SkillSheet: React.FC<SkillSheetProps> = ({ isOpen, onOpenChange, onSuccess, skill, mode }) => {
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingClose, setPendingClose] = useState(false);
  const { toast } = useToast();
  
  const createSkill = useCreateSkill({
    onSuccess: () => {
      toast({ title: 'Skill added!', description: 'Your skill was added successfully.' });
      if (onSuccess) onSuccess();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({ title: 'Error', description: error?.response?.data?.message || 'Failed to add skill', variant: 'destructive' });
    },
  });

  const updateSkill = useApiMutation({
    method: 'put',
    endpoint: skill ? `/skills/${skill._id}` : '',
    onSuccess: () => {
      toast({ title: 'Skill updated!', description: 'Your skill was updated successfully.' });
      if (onSuccess) onSuccess();
      onOpenChange(false);
    },
    onError: (error) => {
      const err = error as any;
      toast({ title: 'Error', description: err?.response?.data?.message || 'Failed to update skill', variant: 'destructive' });
    },
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isDirty } } = useForm<SkillRequest>({
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

  // Reset form when skill changes (for edit mode)
  useEffect(() => {
    if (skill && mode === 'edit') {
      // Convert string fields to arrays for edit mode
      const experienceArray = skill.experience ? [skill.experience] : [];
      const topicsArray = skill.focusedTopics ? [skill.focusedTopics] : [];
      
      reset({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        experience: experienceArray,
        focusedTopics: topicsArray,
      });
    } else if (mode === 'create') {
      reset({
        name: '',
        category: '',
        proficiency: 50,
        experience: [],
        focusedTopics: [],
      });
    }
  }, [skill, mode, reset]);

  // Handle unsaved changes detection
  const handleSheetOpenChange = (open: boolean) => {
    if (!open && isDirty && !pendingClose) {
      setShowUnsavedModal(true);
      return;
    }
    
    if (pendingClose) {
      setPendingClose(false);
      reset();
      setExperienceInput('');
      setTopicInput('');
      onOpenChange(false);
    } else if (!open) {
      onOpenChange(false);
    }
  };

  const handleConfirmClose = () => {
    setShowUnsavedModal(false);
    setPendingClose(true);
    onOpenChange(false);
  };

  const handleCancelClose = () => {
    setShowUnsavedModal(false);
  };

  const onSubmit = (data: SkillRequest) => {
    if (mode === 'create') {
      createSkill.mutate(data);
    } else {
      // Convert arrays back to strings for edit mode
      const editData = {
        ...data,
        experience: data.experience && data.experience.length > 0 ? data.experience.join(', ') : '',
        focusedTopics: data.focusedTopics && data.focusedTopics.length > 0 ? data.focusedTopics.join(', ') : '',
      };
      updateSkill.mutate(editData);
    }
    
    // Reset form
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

  const isPending = createSkill.isPending || updateSkill.isPending;
  const error = createSkill.error || updateSkill.error;

  return (
    <>
    <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
      <SheetContent className="w-[500px] sm:w-[650px] lg:w-[800px] xl:w-[900px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/30 [&::-webkit-scrollbar-corner]:bg-transparent">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-lg">
            {mode === 'create' ? (
              <>
                <Plus className="w-5 h-5" />
                Add New Skill
              </>
            ) : (
              <>
                <Edit className="w-5 h-5" />
                Edit Skill
              </>
            )}
          </SheetTitle>
          <SheetDescription>
            {mode === 'create' 
              ? 'Add your skill details and expertise'
              : 'Update your skill information'
            }
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col py-8 px-2">
          {isPending && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="bg-card border border-border rounded-lg p-8 max-w-sm mx-4 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {mode === 'create' ? 'Adding Skill' : 'Updating Skill'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please wait while we {mode === 'create' ? 'add' : 'update'} your skill...
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-4">
                <div className="flex items-center space-x-3 text-destructive mb-4">
                  <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                    <span className="text-sm font-bold">!</span>
                  </div>
                  <span className="text-sm font-medium">
                    Error {mode === 'create' ? 'Adding' : 'Updating'} Skill
                  </span>
                </div>
                <p className="text-sm text-destructive mb-4">
                  {error?.response?.data?.message || error?.message || 'An unexpected error occurred'}
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

          <div className={`space-y-8 ${isPending || error ? 'pointer-events-none opacity-50' : ''}`}>
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  {mode === 'create' ? (
                    <Plus className="w-6 h-6 text-primary" />
                  ) : (
                    <Edit className="w-6 h-6 text-primary" />
                  )}
                </div>
              </div>
              <h4 className="text-lg md:text-xl text-foreground font-bold mb-2">
                {mode === 'create' ? 'New Skill' : 'Edit Skill'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {mode === 'create' ? 'Add your skill details' : 'Update your skill details'}
              </p>
            </div>

            {/* Form Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-base font-semibold text-foreground mb-2">Basic Information</h3>
                    <p className="text-sm text-muted-foreground">
                      {mode === 'create' ? "Let's start with the fundamentals" : "Update the fundamentals"}
                    </p>
                  </div>

                  {/* Skill Name */}
                  <div>
                    <Label className="block text-sm font-medium text-foreground mb-2">
                      Skill Name *
                    </Label>
                    <Input
                      {...register('name')}
                      placeholder="e.g., React, Python, UX Design"
                      className="h-10"
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
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary h-10"
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
              <div className="space-y-8">
                {/* Additional Information */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-base font-semibold text-foreground mb-2">Additional Information</h3>
                    <p className="text-sm text-muted-foreground">Optional details about your skill</p>
                  </div>

                  {/* Experience */}
                  <div>
                    <Label className="block text-sm font-medium text-foreground mb-2">
                      Experience
                    </Label>
                    <div className="space-y-4">
                      <div className="flex gap-3">
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
                        <div className="space-y-3">
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
                    <div className="space-y-4">
                      <div className="flex gap-3">
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
                        <div className="space-y-3">
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

            {/* Skill Preview */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-primary" />
                <h3 className="text-base font-semibold text-foreground">Skill Preview</h3>
              </div>
              
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="text-foreground font-medium">{watch('name') || 'Enter skill name'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="text-foreground font-medium">{watch('category') || 'Select category'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Proficiency:</span>
                  <span className="text-foreground font-medium">{watch('proficiency')}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="flex flex-row justify-end gap-2 pt-4 border-t">
          <SheetClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (isDirty) {
                  setShowUnsavedModal(true);
                } else {
                  reset();
                  setExperienceInput('');
                  setTopicInput('');
                  onOpenChange(false);
                }
              }}
              className="w-full sm:w-auto"
              disabled={isPending}
            >
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === 'create' ? 'Adding Skill...' : 'Updating Skill...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Add Skill' : 'Update Skill'}
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
    
    <UnsavedChangesModal
      isOpen={showUnsavedModal}
      onClose={handleCancelClose}
      onConfirm={handleConfirmClose}
      title="Unsaved Changes"
      description="You have unsaved changes. Are you sure you want to close without saving?"
    />
    </>
  );
};

export default SkillSheet;
