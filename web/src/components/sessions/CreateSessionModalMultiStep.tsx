import React, { useState } from 'react';
import { Calendar, Clock, Users, Globe, Lock, Save, Plus, X, BookOpen, Target, Link, Settings, Loader2 } from 'lucide-react';
import { useGetUserSkills } from '@/hooks/useGetUserSkills';
import { useToast } from "@/hooks/use-toast";
import { useCreateSession } from "@/hooks/useCreateSession";
import { SessionRequest } from "@/types";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from "motion/react";
import { checkBackendHealth } from "@/lib/api";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../ui/animated-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  focusKeywords: yup.array().of(yup.string()).min(5, 'Exactly 5 focus keywords are required').max(5, 'Up to 5 focus keywords').required('Focus keywords are required'),
});

type SessionFormValues = yup.InferType<typeof sessionSchema>;

interface CreateSessionModalMultiStepProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const skillCategories = [
  'Technology',
  'Language',
  'Music',
  'Art',
  'Sports',
  'Cooking',
  'Business',
  'Science',
  'Health',
  'Education',
  'Other'
];

export const CreateSessionModalMultiStep: React.FC<CreateSessionModalMultiStepProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const { data: userSkillsResponse } = useGetUserSkills();
  const userSkills = userSkillsResponse?.data || [];
  const [focusKeywords, setFocusKeywords] = useState<string[]>(['', '', '', '', '']);

  const createSession = useCreateSession({
    onSuccess: (data) => {
      console.log('Session created successfully:', data);
      toast({
        title: 'Session created!',
        description: 'Your session has been created successfully.',
      });
      onClose();
      reset();
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error('Session creation failed:', error);
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error?.message || 'Failed to create session',
        variant: 'destructive'
      });
    },
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<SessionFormValues>({
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

  const handleSubmitForm = (data: SessionFormValues) => {
    console.log('Form data submitted:', data);
    console.log('Form validation errors:', errors);
    
    // Validate required fields
    if (!data.title || !data.date || !data.startTime || !data.endTime || !data.skillCategory || !data.teachSkillId) {
      console.log('Validation failed - missing required fields');
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (title, date, time, skill category, and teaching skill).",
        variant: "destructive",
      });
      return;
    }
    
    // Validate focus keywords
    if (!data.focusKeywords || data.focusKeywords.length === 0 || data.focusKeywords.every(k => !k.trim())) {
      console.log('Validation failed - no focus keywords');
      toast({
        title: "Validation Error",
        description: "Please add at least one focus keyword for the session.",
        variant: "destructive",
      });
      return;
    }
    
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
    
    // Trigger the session creation - this is a mutation, not awaited
    createSession.mutate(sessionData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setValue(name as keyof SessionFormValues, 
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
      type === 'number' ? parseInt(value) : value
    );
  };

  const addFocusKeyword = () => {
    // Always maintain exactly 5 keywords
    if (focusKeywords.length < 5) {
      setFocusKeywords([...focusKeywords, '']);
    }
  };

  const removeFocusKeyword = (index: number) => {
    if (focusKeywords.length > 1) {
      const newKeywords = focusKeywords.filter((_, i) => i !== index);
      setFocusKeywords(newKeywords);
      setValue('focusKeywords', newKeywords.filter(k => k.trim() !== ''));
    }
  };

  const updateFocusKeyword = (index: number, value: string) => {
    const newKeywords = [...focusKeywords];
    newKeywords[index] = value;
    setFocusKeywords(newKeywords);
    setValue('focusKeywords', newKeywords.filter(k => k.trim() !== ''));
  };

  const teachableSkills = userSkills.filter(skill => skill.type === 'teaching');
  const skillCategoryOptions: ComboboxOption[] = skillCategories.map(cat => ({
    value: cat,
    label: cat
  }));

  const teachableSkillOptions: ComboboxOption[] = teachableSkills.map(skill => ({
    value: skill._id,
    label: skill.name
  }));

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalBody>
        <ModalContent>
          {createSession.isPending && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="bg-card border border-border rounded-lg p-8 max-w-sm mx-4 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Creating Session</h3>
                <p className="text-sm text-muted-foreground mb-4">Please wait while we set up your session...</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {createSession.error && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-4">
                <div className="flex items-center space-x-3 text-destructive mb-4">
                  <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                    <span className="text-sm font-bold">!</span>
                  </div>
                  <span className="text-sm font-medium">Error Creating Session</span>
                </div>
                <p className="text-sm text-destructive mb-4">
                  {createSession.error?.response?.data?.message || createSession.error?.message || 'An unexpected error occurred'}
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
          

          
                      <div className={`space-y-6 ${createSession.isPending || createSession.error ? 'pointer-events-none opacity-50' : ''}`}>
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold mb-2">
                New Session
              </h4>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Set up your session
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

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Session Title *
                    </label>
                    <Input
                      {...register('title')}
                      onChange={handleChange}
                      placeholder="Enter session title"
                      className="h-12"
                    />
                    {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description *
                    </label>
                    <Textarea
                      {...register('description')}
                      onChange={handleChange}
                      placeholder="Describe what this session will cover"
                      rows={4}
                      className="resize-none"
                    />
                    {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
                  </div>

                  {/* Skill Category */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Skill Category *
                    </label>
                    <Combobox
                    className='w-full'
                      options={skillCategoryOptions}
                      value={watch('skillCategory')}
                      onValueChange={(value) => setValue('skillCategory', value)}
                      placeholder="Select skill category"
                    />
                    {errors.skillCategory && <p className="text-destructive text-xs mt-1">{errors.skillCategory.message}</p>}
                  </div>
                </div>

                {/* Schedule & Time */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Schedule & Time</h3>
                    <p className="text-sm text-muted-foreground">Set when your session will take place</p>
                  </div>

                  {/* Date */}
                  <div>
                    <DatePicker
                      date={watch('date')}
                      onDateChange={(date) => setValue('date', date)}
                      label="Session Date *"
                      minDate={minDate}
                    />
                    {errors.date && <p className="text-destructive text-xs mt-1">{errors.date.message}</p>}
                  </div>

                  {/* Time Range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <TimePicker
                        value={watch('startTime')}
                        onChange={(time) => setValue('startTime', time)}
                        label="Start Time *"
                        placeholder="Select start time"
                        className="[&_button]:focus:outline-none [&_button]:focus:ring-0"
                      />
                      {errors.startTime && <p className="text-destructive text-xs mt-1">{errors.startTime.message}</p>}
                    </div>
                    <div>
                      <TimePicker
                        value={watch('endTime')}
                        onChange={(time) => setValue('endTime', time)}
                        label="End Time *"
                        placeholder="Select end time"
                        className="[&_button]:focus:outline-none [&_button]:focus:ring-0"
                      />
                      {errors.endTime && <p className="text-destructive text-xs mt-1">{errors.endTime.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Teaching Details */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Teaching Details</h3>
                    <p className="text-sm text-muted-foreground">Configure what you'll be teaching</p>
                  </div>                 

                  {/* Teachable Skill */}
                  {watch('isTeaching') && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Skill to Teach *
                      </label>
                      <Combobox
                      className='w-full'
                        options={teachableSkillOptions}
                        value={watch('teachSkillId')}
                        onValueChange={(value) => {
                          setValue('teachSkillId', value);
                          const skill = teachableSkills.find(s => s._id === value);
                          setValue('teachSkillName', skill?.name || '');
                        }}
                        placeholder="Select skill to teach"
                      />
                      {errors.teachSkillId && <p className="text-destructive text-xs mt-1">{errors.teachSkillId.message}</p>}
                    </div>
                  )}

                  {/* Focus Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Sub Topics (5 topics are required) *
                    </label>
                    <div className="space-y-3">
                      {focusKeywords.map((keyword, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card/50">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">{index + 1}</span>
                          </div>
                          <Input
                            value={keyword}
                            onChange={(e) => updateFocusKeyword(index, e.target.value)}
                            placeholder={`Enter sub topic ${index + 1}`}
                            className="flex-1 h-9 border-0 bg-transparent focus:ring-0 focus:outline-none p-0"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      These sub topics will help participants understand what will be covered in your session.
                    </p>
                  </div>
                </div>

                {/* Session Settings */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Session Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure visibility and limits</p>
                  </div>

                  {/* Public/Private Toggle */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {watch('isPublic') ? <Globe className="w-5 h-5 text-primary" /> : <Lock className="w-5 h-5 text-primary" />}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {watch('isPublic') ? 'Public - Anyone can join' : 'Private - Invite only'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={watch('isPublic')}
                      onCheckedChange={(checked) => setValue('isPublic', checked)}
                    />
                  </div>

                  

                  {/* Meeting Link */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Meeting Link (Optional)
                    </label>
                    <Input
                      {...register('meetingLink')}
                      onChange={handleChange}
                      placeholder="https://meet.google.com/..."
                      className="h-12"
                    />
                    {errors.meetingLink && <p className="text-destructive text-xs mt-1">{errors.meetingLink.message}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalContent>
        <ModalFooter className="gap-4">
          <button 
            onClick={onClose}
            disabled={createSession.isPending}
            className="px-2 py-2 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
                      <button
              onClick={() => {
                console.log('Create Session button clicked (multi-step)');
                handleSubmit(handleSubmitForm)();
              }}
              disabled={createSession.isPending}
              className="bg-primary py-2 font-semibold text-primary-foreground text-sm px-2 py-1 rounded-md border border-primary w-30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden"
            >
              {createSession.isPending && (
                <div className="absolute inset-0 bg-primary/20 animate-pulse" />
              )}
              <div className="relative flex items-center">
                {createSession.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Session...
                  </>
                ) : (
                  'Create Session'
                )}
              </div>
            </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};
