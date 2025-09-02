import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Globe, Lock, Save, X, BookOpen, Target, Settings, Edit3, Loader2 } from 'lucide-react';
import { Session } from '../../types';
import { SessionRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useUpdateSession } from '@/hooks/useUpdateSession';
import { motion } from "motion/react";
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

interface SessionEditModalMultiStepProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
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

export const SessionEditModalMultiStep: React.FC<SessionEditModalMultiStepProps> = ({
  isOpen,
  onClose,
  session,
  onSuccess
}) => {
  const { toast } = useToast();
  const [generalSubTopics, setGeneralSubTopics] = useState<string[]>(['', '', '', '', '']);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: undefined as Date | undefined,
    startTime: '',
    endTime: '',
    skillCategory: '',
    isPublic: true,
    maxParticipants: 5,
    isTeaching: true
  });

  const updateSession = useUpdateSession(session?._id || '', {
    onSuccess: () => {
      toast({
        title: 'Session updated!',
        description: 'Your session has been updated successfully.',
      });
      // Add a small delay to allow the exit animation to complete
      setTimeout(() => {
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      }, 100);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to update session',
        variant: 'destructive'
      });
    },
  });

  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title || '',
        description: session.description || '',
        date: session.date ? new Date(session.date) : undefined,
        startTime: session.startTime || '',
        endTime: session.endTime || '',
        skillCategory: session.skillCategory || '',
        isPublic: session.isPublic || false,
        maxParticipants: session.maxParticipants || 5,
        isTeaching: session.isTeaching || true
      });
      const focusedTopics = Array.isArray((session as any).focusKeywords) ? (session as any).focusKeywords : [];
      const savedSubTopics = Array.isArray((session as any).subTopics) ? (session as any).subTopics : [];
      const sourceTopics = focusedTopics.length > 0 ? focusedTopics : savedSubTopics;
      const normalizedTopics = Array.from({ length: 5 }, (_, i) => sourceTopics[i] ?? '');
      setGeneralSubTopics(normalizedTopics);
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) : value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      date: date
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSession.mutate({
      ...formData,
      date: formData.date ? formData.date.toISOString().split('T')[0] : '',
      focusKeywords: generalSubTopics.filter(t => t.trim()),
    });
  };

  const skillCategoryOptions: ComboboxOption[] = skillCategories.map(cat => ({
    value: cat,
    label: cat
  }));

  if (!isOpen || !session) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalBody>
        <ModalContent>
          {updateSession.isPending && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="flex items-center space-x-3 text-primary">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm font-medium">Saving your changes...</span>
              </div>
            </div>
          )}
          <div className={`space-y-6 ${updateSession.isPending ? 'pointer-events-none opacity-50' : ''}`}>
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Edit3 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold mb-2">
                Edit Session
              </h4>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Update your session details
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
                    <p className="text-sm text-muted-foreground">Update the fundamental details</p>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Session Title
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter session title"
                      className="h-12"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description
                    </label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe what this session will cover"
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* Skill Category */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category
                    </label>
                    <Combobox
                    className='w-full'
                      options={skillCategoryOptions}
                      value={formData.skillCategory}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, skillCategory: value }))}
                      placeholder="Select skill category"
                    />
                  </div>
                </div>

                {/* Schedule & Time */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Schedule & Time</h3>
                    <p className="text-sm text-muted-foreground">Update when your session will take place</p>
                  </div>

                  {/* Date */}
                  <div>
                    <DatePicker
                      date={formData.date}
                      onDateChange={handleDateChange}
                      label="Session Date"
                      placeholder="Select session date"
                    />
                  </div>

                                       {/* Time Range */}
                     <div className="grid grid-cols-2 gap-3">
                       <div>
                         <TimePicker
                           value={formData.startTime}
                           onChange={(time) => setFormData(prev => ({ ...prev, startTime: time }))}
                           label="Start Time"
                           placeholder="Select start time"
                           className="[&_button]:focus:outline-none [&_button]:focus:ring-0"
                         />
                       </div>
                       <div>
                         <TimePicker
                           value={formData.endTime}
                           onChange={(time) => setFormData(prev => ({ ...prev, endTime: time }))}
                           label="End Time"
                           placeholder="Select end time"
                           className="[&_button]:focus:outline-none [&_button]:focus:ring-0"
                         />
                       </div>
                     </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Session Topics */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Session Topics</h3>
                    <p className="text-sm text-muted-foreground">Define the topics and agenda</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Session Topics (Optional)
                    </label>
                    {generalSubTopics.map((topic, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={topic}
                          onChange={(e) => {
                            const newTopics = [...generalSubTopics];
                            newTopics[index] = e.target.value;
                            setGeneralSubTopics(newTopics);
                          }}
                          placeholder={`Topic ${index + 1}`}
                          className="h-10"
                        />
                      </div>
                    ))}
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
                        {formData.isPublic ? <Globe className="w-5 h-5 text-primary" /> : <Lock className="w-5 h-5 text-primary" />}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {formData.isPublic ? 'Public - Anyone can join' : 'Private - Invite only'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                    />
                  </div>


                </div>
              </div>
            </div>


          </div>
        </ModalContent>
        <ModalFooter className="gap-4">
                      <button 
              onClick={() => {
                // Add a small delay to allow the exit animation to complete
                setTimeout(() => {
                  onClose();
                }, 100);
              }}
              disabled={updateSession.isPending}
              className="px-2 py-2 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
                      <button
              onClick={handleSubmit}
              disabled={updateSession.isPending}
              className="bg-primary font-semibold text-primary-foreground text-sm px-2 py-2 rounded-md border border-primary w-30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {updateSession.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};
