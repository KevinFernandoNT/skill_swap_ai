import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Loader2, Edit, Target } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  activeTab?: 'teaching' | 'learning';
}

const skillSchema = yup.object({
  name: yup.string().required('Skill name is required'),
  category: yup.string().required('Category is required'),
  proficiency: yup.number().min(0).max(100).required('Proficiency is required'),
  type: yup.string().oneOf(['teaching', 'learning']).required('Skill type is required'),
  focusedTopics: yup.array().of(yup.string().trim().required('Topic cannot be empty')).notRequired(),
});

const SkillSheet: React.FC<SkillSheetProps> = ({ isOpen, onOpenChange, onSuccess, skill, mode, activeTab = 'teaching' }) => {
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingClose, setPendingClose] = useState(false);
  const { toast } = useToast();
  
  const createSkill = useCreateSkill({
    onSuccess: () => {
      if (onSuccess) onSuccess();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Skill creation error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add skill';
      toast({ 
        title: 'Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    },
  });

  const updateSkill = useApiMutation({
    method: 'put',
    endpoint: skill ? `/skills/${skill._id}` : '',
    onSuccess: () => {
      if (onSuccess) onSuccess();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Skill update error:', error);
      const err = error as any;
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update skill';
      toast({ 
        title: 'Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    },
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isDirty } } = useForm<SkillRequest>({
    resolver: yupResolver(skillSchema),
    defaultValues: {
      name: '',
      category: '',
      proficiency: 50,
      type: activeTab,
      focusedTopics: [],
    },
  });

  const focusedTopics = watch('focusedTopics') || [];
  const [topicInput, setTopicInput] = useState('');

  // Reset form when skill changes (for edit mode)
  useEffect(() => {
    if (skill && mode === 'edit') {
      // Convert agenda array or focusedTopics string to array for edit mode
      let topicsArray: string[] = [];
      if (skill.agenda && Array.isArray(skill.agenda)) {
        topicsArray = skill.agenda;
      } else if (skill.focusedTopics && typeof skill.focusedTopics === 'string') {
        topicsArray = skill.focusedTopics.split(',').map(t => t.trim()).filter(t => t.length > 0);
      }
      
      reset({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        type: skill.type || activeTab,
        focusedTopics: topicsArray,
      });
    } else if (mode === 'create') {
      reset({
        name: '',
        category: '',
        proficiency: 50,
        type: activeTab,
        focusedTopics: [],
      });
    }
  }, [skill, mode, reset, activeTab]);

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
      // Map focusedTopics array to agenda field for backend
      const createData = {
        ...data,
        agenda: data.focusedTopics || [],
        experience: data.experience && data.experience.length > 0 ? data.experience.join(', ') : '',
      };
      // Remove focusedTopics as it's not part of the backend schema
      delete createData.focusedTopics;
      createSkill.mutate(createData);
    } else {
      // Convert arrays back to strings for edit mode
      const editData = {
        ...data,
        agenda: data.focusedTopics || [],
        experience: data.experience && data.experience.length > 0 ? data.experience.join(', ') : '',
      };
      // Remove focusedTopics as it's not part of the backend schema
      delete editData.focusedTopics;
      updateSkill.mutate(editData);
    }
    
    // Reset form
    reset({
      name: '',
      category: '',
      proficiency: 50,
      type: activeTab,
      focusedTopics: [],
    });
    setTopicInput('');
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
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
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

            {/* Form Vertical Layout */}
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="text-left">
                  <h3 className="text-base font-semibold text-foreground mb-2">Basic Information</h3>
                  <p className="text-sm text-muted-foreground">
                    {mode === 'create' ? "Let's start with the fundamentals" : "Update the fundamentals"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Skill Name */}
                  <div>
                    <Label className="block text-xs font-medium text-foreground mb-2">
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
                    <Label className="block text-xs font-medium text-foreground mb-2">
                      Category *
                    </Label>
                    <Select value={watch('category')} onValueChange={(value) => setValue('category', value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {skillCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-destructive text-xs mt-1">{errors.category.message}</p>}
                  </div>
                </div>

                {/* Proficiency Level - Full Width */}
                <div>
                  <Label className="block text-xs font-medium text-foreground mb-2">
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

              {/* Additional Information */}
              <div className="space-y-6">
                <div className="text-left">
                  <h3 className="text-base font-semibold text-foreground mb-2">Additional Information</h3>
                  <p className="text-sm text-muted-foreground">Optional details about your skill</p>
                </div>


                {/* Focused Sub Topics */}
                <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-4 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <Label className="text-sm font-medium text-foreground">
                      Focused Sub Topics
                    </Label>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      Optional
                    </span>
                  </div>
                  
                  <div className="mb-3 p-3 bg-blue-50/80 dark:bg-blue-950/30 rounded-md border border-blue-200/50 dark:border-blue-800/30">
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                      💡 Purpose of this section:
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                      Specify the particular areas or topics within this skill that you focus on teaching. 
                      This helps learners understand your expertise depth and find sessions that match their specific learning goals.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Input
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        placeholder="e.g., React Hooks, Component Lifecycle, State Management, Context API..."
                        className="flex-1 border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-600"
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
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {focusedTopics.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Added topics ({focusedTopics.length}):
                        </p>
                        <div className="space-y-2">
                          {focusedTopics.map((topic, index) => (
                            <div key={index} className="flex items-center gap-2 p-3 border border-blue-200/50 dark:border-blue-800/50 rounded-lg bg-white/80 dark:bg-gray-800/80 shadow-sm">
                              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                              <span className="flex-1 text-sm text-foreground font-medium">{topic}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTopic(topic)}
                                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors rounded-md"
                                title="Remove topic"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {focusedTopics.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No sub topics added yet</p>
                        <p className="text-xs">Add specific areas you focus on teaching</p>
                      </div>
                    )}
                  </div>
                  
                  {errors.focusedTopics && (
                    <p className="text-destructive text-xs mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive"></span>
                      {errors.focusedTopics.message}
                    </p>
                  )}
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
