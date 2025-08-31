import React, { useState } from 'react';
import { Calendar, Clock, Users, Globe, Lock, Save, Plus, X, BookOpen, Target, Link, Settings } from 'lucide-react';
import { useGetUserSkills } from '@/hooks/useGetUserSkills';
import { useToast } from "@/hooks/use-toast";
import { useCreateSession } from "@/hooks/useCreateSession";
import { SessionRequest } from "@/types";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from "motion/react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../ui/animated-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar22 } from "@/components/ui/calendar22";
import { TimePicker } from "@/components/ui/time-picker";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
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

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ isOpen, onClose, onSuccess }) => {
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
      focusKeywords: [''],
    },
  });
  
  const selectedSkill = teachableSkills.find(s => s._id === watch('teachSkillId'));

  if (skillsLoading) return <div>Loading...</div>;
  if (!skillsResult) return <div>No skills loaded.</div>;

  const handleSubmitForm = (data: SessionFormValues) => {
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
      focusKeywords: data.focusKeywords,
    };
    createSession(sessionData);
  };

  const handleClose = () => {
    // Add a small delay to allow the exit animation to complete
    setTimeout(() => {
      reset();
      setFocusKeywordInput('');
      onClose();
    }, 100);
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
      setValue('focusKeywords', [...current, focusKeywordInput.trim()]);
      setFocusKeywordInput('');
    }
  };

  const handleRemoveFocusKeyword = (idx: number) => {
    const current = watch('focusKeywords') || [];
    setValue('focusKeywords', current.filter((_, i) => i !== idx));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl">
      <ModalBody>
        <ModalHeader onClose={handleClose}>
          Create New Session
        </ModalHeader>
        
        <ModalContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Create Your Session
              </h2>
              <p className="text-muted-foreground">
                Set up a new learning session and share your expertise
              </p>
            </div>
            
            <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
              {/* Basic Information Grid */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Session Title *
                    </label>
                    <Input
                      type="text"
                      {...register('title')}
                      onChange={handleChange}
                      placeholder="e.g., React Hooks Masterclass"
                      className="text-lg focus:outline-none focus:ring-0 focus:border-border"
                    />
                    {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description *
                    </label>
                    <textarea
                      {...register('description')}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-0 focus:border-border resize-none"
                      placeholder="Describe what this session covers and what participants will learn"
                    />
                    {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
                  </div>
                </div>
              </div>

              {/* Schedule, Skills & Settings Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Schedule Section */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Schedule</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Date */}
                    <div>
                                             <Calendar22
                        date={watch('date')}
                        onDateChange={(date) => setValue('date', date)}
                        label="Date *"
                        minDate={new Date()}
                        placeholder="Select session date"
                         className="[&_button]:focus:outline-none [&_button]:focus:ring-0 [&_.day]:focus:outline-none [&_.day]:focus:ring-0 [&_.nav_button]:focus:outline-none [&_.nav_button]:focus:ring-0"
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

                {/* Skills Section */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Skills & Category</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Teachable Skill */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
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
                           className="[&_button]:focus:outline-none [&_button]:focus:ring-0 [&_[cmdk-item]]:focus:outline-none [&_[cmdk-item]]:focus:ring-0 [&_[cmdk-input]]:focus:outline-none [&_[cmdk-input]]:focus:ring-0"
                        />
                      )}
                      {errors.teachSkillId && <p className="text-destructive text-xs mt-1">{errors.teachSkillId.message}</p>}
                    </div>

                    {/* Skill Category */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
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
                         className="[&_button]:focus:outline-none [&_button]:focus:ring-0 [&_[cmdk-item]]:focus:outline-none [&_[cmdk-item]]:focus:ring-0 [&_[cmdk-input]]:focus:outline-none [&_[cmdk-input]]:focus:ring-0"
                      />
                      {errors.skillCategory && <p className="text-destructive text-xs mt-1">{errors.skillCategory.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Session Settings */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Session Settings</h3>
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
                        className="focus:outline-none focus:ring-0 focus:border-border"
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
                          <span className="text-sm font-medium text-foreground">
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
              </div>

              {/* Focus Topics */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-primary" />
                                     <h3 className="text-lg font-semibold text-foreground">Focus Topics *</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      value={focusKeywordInput}
                      onChange={e => setFocusKeywordInput(e.target.value)}
                      placeholder="Type a topic and press Add"
                      disabled={(watch('focusKeywords') || []).length >= 5}
                      className="flex-1 focus:outline-none focus:ring-0 focus:border-border"
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                    {(watch('focusKeywords') || []).map((keyword, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center space-x-2 bg-muted border border-border rounded-md px-3 py-2"
                      >
                        <span className="flex-1 text-foreground text-sm">{keyword}</span>
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

              {/* Session Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6 border border-primary/20"
              >
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Session Preview</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{watch('date') ? watch('date')?.toLocaleDateString() : 'Select date'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-foreground">
                      {watch('startTime') && watch('endTime') ? `${watch('startTime')} - ${watch('endTime')}` : 'Select time'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {watch('isPublic') ? (
                      <Globe className="w-4 h-4 text-primary" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-foreground">{watch('isPublic') ? 'Public session' : 'Private session'}</span>
                  </div>
                </div>
              </motion.div>
            </form>
          </motion.div>
        </ModalContent>
        
        <ModalFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleSubmitForm)} disabled={status === 'pending'} className="min-w-[140px]">
            <Save className="w-4 h-4 mr-2" />
            {status === 'pending' ? 'Creating...' : 'Create Session'}
          </Button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};

export default CreateSessionModal;