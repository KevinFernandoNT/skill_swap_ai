import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Globe, Lock, Save, Plus, X, BookOpen, Target, Link, Settings, Loader2, Edit3 } from 'lucide-react';
import { useGetUserSkills } from '@/hooks/useGetUserSkills';
import { useToast } from "@/hooks/use-toast";
import { useCreateSession } from "@/hooks/useCreateSession";
import { useUpdateSession } from '@/hooks/useUpdateSession';
import { SessionRequest } from "@/types";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from "motion/react";
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
import { Calendar22 } from "@/components/ui/calendar22";
import { TimePicker } from "@/components/ui/time-picker";
import { Combobox } from "@/components/ui/combobox";
import { UnsavedChangesModal } from "@/components/ui/unsaved-changes-modal";

interface SessionSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  session?: any | null; // For editing
  mode: 'create' | 'edit';
}

// Validation schema
const sessionSchema = yup.object({
  title: yup.string().required('Session title is required'),
  description: yup.string().required('Description is required'),
  date: yup.date().required('Date is required'),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
  skillCategory: yup.string().required('Skill category is required'),
  isPublic: yup.boolean(),
  maxParticipants: yup.number().min(1, 'At least 1 participant').optional(),
  isTeaching: yup.boolean(),
  meetingLink: yup.string().url('Invalid meeting link').notRequired(),
  teachSkillId: yup.string().required('Please select a skill you want to teach'),
  teachSkillName: yup.string().notRequired(),
  focusKeywords: yup.array().of(yup.string()).min(1, 'At least 1 focus keyword is required').max(5, 'Up to 5 focus keywords').required('Focus keywords are required'),
});

type SessionFormValues = yup.InferType<typeof sessionSchema>;

const SessionSheet: React.FC<SessionSheetProps> = ({ isOpen, onOpenChange, onSuccess, session, mode }) => {
  const [focusKeywordInput, setFocusKeywordInput] = useState('');
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingClose, setPendingClose] = useState(false);
  const { toast } = useToast();
  
  const { mutate: createSession, status: createStatus, error: createError } = useCreateSession({
    onSuccess: (data) => {
      console.log('Session created successfully:', data);
      toast({
        title: "Session created!",
        description: "Your session has been created successfully.",
      });
      reset();
      setFocusKeywordInput('');
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      console.error('Session creation failed:', error);
      toast({
        title: "Session creation failed",
        description: error?.response?.data?.message || error?.message || "Could not create session.",
        variant: "destructive",
      });
    },
  });

  const { mutate: updateSession, status: updateStatus, error: updateError } = useUpdateSession(session?._id, {
    onSuccess: () => {
      toast({
        title: "Session updated!",
        description: "Your session has been updated successfully.",
      });
      reset();
      setFocusKeywordInput('');
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Session update failed",
        description: error?.response?.data?.message || error?.message || "Could not update session.",
        variant: "destructive",
      });
    },
  });
  
  const { data: skillsResult, isLoading: skillsLoading } = useGetUserSkills();
  const teachableSkills = (skillsResult?.data || []).filter((s: any) => s.type === 'teaching');
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isDirty } } = useForm<SessionFormValues>({
    resolver: yupResolver(sessionSchema),
    defaultValues: {
      title: '',
      description: '',
      date: undefined,
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

  // Reset form when session changes (for edit mode)
  useEffect(() => {
    if (session && mode === 'edit') {
      const focusedTopics = Array.isArray(session.focusKeywords) ? session.focusKeywords : [];
      const savedSubTopics = Array.isArray(session.subTopics) ? session.subTopics : [];
      const sourceTopics = focusedTopics.length > 0 ? focusedTopics : savedSubTopics;
      
      reset({
        title: session.title || '',
        description: session.description || '',
        date: session.date ? new Date(session.date) : undefined,
        startTime: session.startTime || '',
        endTime: session.endTime || '',
        skillCategory: session.skillCategory || '',
        isPublic: session.isPublic || false,
        maxParticipants: session.maxParticipants || 5,
        isTeaching: session.isTeaching || true,
        meetingLink: session.meetingLink || '',
        teachSkillId: session.teachSkillId || '',
        teachSkillName: session.teachSkillName || '',
        focusKeywords: sourceTopics,
      });
    } else if (mode === 'create') {
      reset({
        title: '',
        description: '',
        date: undefined,
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
      });
    }
  }, [session, mode, reset]);

  // Additional effect to ensure skill is set after form reset
  useEffect(() => {
    if (session && mode === 'edit' && teachableSkills.length > 0) {
      console.log('Setting skill for edit mode:');
      console.log('Session:', session);
      console.log('Teachable skills:', teachableSkills);
      console.log('Session teachSkillId:', session.teachSkillId);
      console.log('Session teachSkillName:', session.teachSkillName);
      
      // Small delay to ensure form is reset first
      const timer = setTimeout(() => {
        let skillExists = teachableSkills.find(s => s._id === session.teachSkillId);
        
        if (!skillExists && session.teachSkillName) {
          skillExists = teachableSkills.find(s => s.name === session.teachSkillName);
        }
        
        if (skillExists) {
          console.log('Found matching skill:', skillExists);
          setValue('teachSkillId', skillExists._id);
          setValue('teachSkillName', skillExists.name);
        } else {
          console.log('No matching skill found for:', session.teachSkillId, session.teachSkillName);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [session, mode, teachableSkills, setValue]);


  // Handle unsaved changes detection
  const handleSheetOpenChange = (open: boolean) => {
    if (!open && isDirty && !pendingClose) {
      setShowUnsavedModal(true);
      return;
    }
    
    if (pendingClose) {
      setPendingClose(false);
      reset();
      setFocusKeywordInput('');
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

  if (skillsLoading) return null;
  if (!skillsResult) return null;

  const handleSubmitForm = (data: SessionFormValues) => {
    console.log('Form data submitted:', data);
    console.log('Form validation errors:', errors);
    
    const sessionData: SessionRequest = {
      title: data.title,
      description: data.description,
      date: data.date ? data.date.toISOString().split('T')[0] : '',
      startTime: data.startTime,
      endTime: data.endTime,
      skillCategory: data.skillCategory,
      isPublic: data.isPublic,
      maxParticipants: data.isTeaching ? data.maxParticipants : 1,
      isTeaching: data.isTeaching,
      teachSkillId: data.teachSkillId,
      teachSkillName: data.teachSkillName,
      meetingLink: data.meetingLink,
      focusKeywords: data.focusKeywords ? data.focusKeywords.filter(k => k.trim() !== '') : [],
    };
    
    console.log('Sending session data to API:', sessionData);
    
    if (mode === 'create') {
      createSession(sessionData);
    } else {
      updateSession(sessionData);
    }
  };

  const handleClose = () => {
    if (isDirty) {
      setShowUnsavedModal(true);
    } else {
      reset();
      setFocusKeywordInput('');
      onOpenChange(false);
    }
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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleAddFocusKeyword = () => {
    const current = watch('focusKeywords') || [];
    if (focusKeywordInput.trim() && current.length < 5) {
      const newKeywords = [...current, focusKeywordInput.trim()];
      setValue('focusKeywords', newKeywords, { shouldValidate: true });
      setFocusKeywordInput('');
    }
  };

  const handleRemoveFocusKeyword = (idx: number) => {
    const current = watch('focusKeywords') || [];
    const newKeywords = current.filter((_, i) => i !== idx);
    setValue('focusKeywords', newKeywords, { shouldValidate: true });
  };

  const isPending = createStatus === 'pending' || updateStatus === 'pending';
  const error = createError || updateError;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
      <SheetContent className="w-[450px] sm:w-[600px] lg:w-[750px] xl:w-[850px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/30 [&::-webkit-scrollbar-corner]:bg-transparent">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-sm ml-3">
            {mode === 'create' ? (
              <>
                <BookOpen className="w-5 h-5" />
                Create New Session
              </>
            ) : (
              <>
                <Edit3 className="w-5 h-5" />
                Edit Session
              </>
            )}
          </SheetTitle>
          <SheetDescription className='ml-3'>
            {mode === 'create' 
              ? 'Set up a new learning session and share your expertise'
              : 'Update your session details and settings'
            }
          </SheetDescription>
        </SheetHeader>

         <div className="flex-1 flex flex-col py-8 px-2">
          {isPending && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {mode === 'create' ? 'Creating session...' : 'Updating session...'}
                </p>
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
                    Error {mode === 'create' ? 'Creating' : 'Updating'} Session
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
          
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={isPending || error ? 'pointer-events-none opacity-50' : ''}
          >
             <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-primary" />
                   <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Session Title *
                    </label>
                    <Input
                      type="text"
                      {...register('title')}
                      onChange={handleChange}
                      placeholder="e.g. React Hooks Masterclass"
                       className="text-[13px] placeholder:text-[13px] focus:outline-none focus:ring-0 focus:border-border"
                    />
                    {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description *
                    </label>
                    <textarea
                      {...register('description')}
                      onChange={handleChange}
                      rows={3}
                       className="w-full px-3 py-2 bg-background border border-border rounded-md text-[13px] text-foreground placeholder:text-[13px] placeholder-muted-foreground focus:outline-none focus:ring-0 focus:border-border resize-none"
                      placeholder="Describe what this session covers and what participants will learn"
                    />
                    {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
                  </div>
                </div>
              </div>

              {/* Schedule & Skills */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Schedule Section */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-primary" />
                     <h3 className="text-sm font-semibold text-foreground">Schedule</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Date */}
                    <div>
                      <Calendar22
                        date={watch('date')}
                        onDateChange={(date) => setValue('date', date)}
                        label="Date *"
                        
                        minDate={new Date()}
                        placeholder="Select session date"
                          className="text-xs [&_button]:focus:outline-none [&_button]:focus:ring-0 [&_.day]:focus:outline-none [&_.day]:focus:ring-0 [&_.nav_button]:focus:outline-none [&_.nav_button]:focus:ring-0 [&_button]:placeholder:text-[13px] [&_button]:text-[13px]"
                      />
                      {errors.date && <p className="text-destructive text-xs mt-1">{errors.date.message}</p>}
                    </div>

                    {/* Time Range */}
                     <div className="grid grid-cols-2 gap-4">
                      <div>
                        <TimePicker
                          value={watch('startTime')}
                          onChange={(time) => setValue('startTime', time)}
                          label="Start Time *"
                          placeholder="Start time"
                            className="text-[13px] [&_button]:focus:outline-none [&_button]:focus:ring-0 [&_button]:placeholder:text-[13px] [&_button]:text-[13px]"
                        />
                        {errors.startTime && <p className="text-destructive text-xs mt-1">{errors.startTime.message}</p>}
                      </div>
                      <div>
                        <TimePicker
                          value={watch('endTime')}
                          onChange={(time) => setValue('endTime', time)}
                          label="End Time *"
                          placeholder="End time"
                            className="text-[13px] [&_button]:focus:outline-none [&_button]:focus:ring-0 [&_button]:placeholder:text-[13px] [&_button]:text-[13px]"
                        />
                        {errors.endTime && <p className="text-destructive text-xs mt-1">{errors.endTime.message}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-primary" />
                     <h3 className="text-sm font-semibold text-foreground">Skills & Category</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Teachable Skill */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-2">
                        Skill to Teach *
                      </label>
                      {teachableSkills.length === 0 ? (
                        <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                          You have no teachable skills. Add a teaching skill first.
                        </div>
                      ) : (
                        <Combobox
                          options={teachableSkills.map(skill => ({ 
                            value: skill._id, 
                            label: `${skill.name} (${skill.category})` 
                          }))}
                          value={watch('teachSkillId')}
                          onValueChange={(value) => setValue('teachSkillId', value)}
                          placeholder="Select a skill"
                          searchPlaceholder="Search skills..."
                          emptyMessage="No skills found."
                          width="w-full"
                            className="[&_button]:focus:outline-none [&_button]:focus:ring-0 [&_[cmdk-item]]:focus:outline-none [&_[cmdk-item]]:focus:ring-0 [&_[cmdk-input]]:focus:outline-none [&_[cmdk-input]]:focus:ring-0 [&_button]:placeholder:text-sm [&_button]:text-sm [&_[cmdk-input]]:placeholder:text-sm [&_[cmdk-input]]:text-sm"
                        />
                      )}
                      {errors.teachSkillId && <p className="text-destructive text-xs mt-1">{errors.teachSkillId.message}</p>}
                    </div>

                    {/* Skill Category */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-2">
                        Category *
                      </label>
                      <Combobox
                        options={skillCategories.map(category => ({ value: category, label: category }))}
                        value={watch('skillCategory')}
                        onValueChange={(value) => setValue('skillCategory', value)}
                        placeholder="Select a category"
                        searchPlaceholder="Search categories..."
                        emptyMessage="No categories found."
                        width="w-full"
                           className="[&_button]:focus:outline-none [&_button]:focus:ring-0 [&_[cmdk-item]]:focus:outline-none [&_[cmdk-item]]:focus:ring-0 [&_[cmdk-input]]:focus:outline-none [&_[cmdk-input]]:focus:ring-0 [&_button]:placeholder:text-sm [&_button]:text-sm [&_[cmdk-input]]:placeholder:text-sm [&_[cmdk-input]]:text-sm"
                      />
                      {errors.skillCategory && <p className="text-destructive text-xs mt-1">{errors.skillCategory.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Settings */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-4 h-4 text-primary" />
                   <h3 className="text-sm font-semibold text-foreground">Session Settings</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Meeting Link */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Meeting Link
                    </label>
                    <Input
                      type="url"
                      {...register('meetingLink')}
                      onChange={handleChange}
                      placeholder="Paste a meeting URL"
                       className="text-[13px] placeholder:text-[13px] focus:outline-none focus:ring-0 focus:border-border"
                    />
                    {errors.meetingLink && <p className="text-destructive text-xs mt-1">{errors.meetingLink.message}</p>}
                  </div>

                  {/* Visibility */}
                  <div>
                    <label className="flex items-center space-x-3 p-3 bg-muted rounded-md">
                      <input
                        type="checkbox"
                        {...register('isPublic')}
                        className="w-4 h-4 text-primary bg-background border-border rounded focus:outline-none focus:ring-0"
                      />
                      <div className="flex-1">
                         <span className="text-xs font-medium text-foreground">
                          Make this session public
                        </span>
                        <p className="text-xs text-muted-foreground">
                          Public sessions can be discovered by other users
                        </p>
                      </div>
                      {watch('isPublic') ? (
                        <Globe className="w-4 h-4 text-primary" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Focus Topics */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-primary" />
                   <h3 className="text-sm font-semibold text-foreground">Focus Topics *</h3>
                </div>
                
                 <div className="space-y-4">
                   <div className="flex space-x-3">
                    <Input
                      type="text"
                      value={focusKeywordInput}
                      onChange={e => setFocusKeywordInput(e.target.value)}
                      placeholder="Type a topic and press Add"
                      disabled={(watch('focusKeywords') || []).length >= 5}
                       className="flex-1 text-[13px] placeholder:text-[13px] focus:outline-none focus:ring-0 focus:border-border"
                    />
                    <Button
                      type="button"
                      onClick={handleAddFocusKeyword}
                      disabled={(watch('focusKeywords') || []).length >= 5 || !focusKeywordInput.trim()}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-32 overflow-y-auto">
                    {(watch('focusKeywords') || []).map((keyword, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center space-x-2 bg-muted border border-border rounded-md px-3 py-2"
                      >
                         <span className="flex-1 text-foreground text-xs">{keyword}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFocusKeyword(idx)}
                          className="text-destructive hover:text-destructive/80"
                          title="Remove topic"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                     Add at least 1 and up to 5 focus topics for this session
                  </p>
                </div>
              </div>

            </form>
          </motion.div>
        </div>

        <SheetFooter className="flex flex-row justify-end gap-2 pt-4 border-t">
          <SheetClose asChild>
            <Button variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
          </SheetClose>
          <Button 
            onClick={() => {
              console.log('Submit button clicked');
              console.log('Current form values:', watch());
              console.log('Current form errors:', errors);
              console.log('Form is valid:', Object.keys(errors).length === 0);
              handleSubmit(handleSubmitForm, (formErrors) => {
                console.log('Form validation errors:', formErrors);
                toast({
                  title: "Validation Error",
                  description: "Please fix the errors in the form before submitting.",
                  variant: "destructive",
                });
              })();
            }} 
            disabled={isPending} 
            className="min-w-[140px] relative overflow-hidden"
          >
            {isPending && (
              <div className="absolute inset-0 bg-primary/20 animate-pulse" />
            )}
            <div className="relative flex items-center">
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isPending 
                ? (mode === 'create' ? 'Creating Session...' : 'Updating Session...')
                : (mode === 'create' ? 'Create Session' : 'Update Session')
              }
            </div>
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

export default SessionSheet;
