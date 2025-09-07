import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Globe, Lock, Save, X, BookOpen, Target, Settings, Edit3, Plus, Loader2 } from 'lucide-react';
import { Session } from '../../types';
import { SessionRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useUpdateSession } from '@/hooks/useUpdateSession';
import { motion } from "motion/react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar22 } from "@/components/ui/calendar22";
import { TimePicker } from "@/components/ui/time-picker";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";

interface SessionEditSheetProps {
  session: any | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (session: any) => void;
  refetchSessions: () => void;
}

const SessionEditSheet: React.FC<SessionEditSheetProps> = ({ session, isOpen, onOpenChange, onSave, refetchSessions }) => {
  const toast = useToast();
  const { mutate: updateSession, status: updateStatus } = useUpdateSession(session?._id, {
    onSuccess: () => {
      toast.toast({ title: 'Session updated!', description: 'Your session was updated successfully.' });
      onSave({ ...session, ...formData, focusKeywords: generalSubTopics.filter(t => t.trim()) });
      // Add a small delay to allow the exit animation to complete
      setTimeout(() => {
        onOpenChange(false);
        refetchSessions();
      }, 100);
    },
    onError: (error: any) => {
      toast.toast({ title: 'Error', description: error?.response?.data?.message || 'Failed to update session', variant: 'destructive' });
    },
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: undefined as Date | undefined,
    startTime: '',
    endTime: '',
    skillCategory: '',
    isPublic: true
  });
  const [generalSubTopics, setGeneralSubTopics] = useState<string[]>(['', '', '', '', '']);
  const [focusKeywordInput, setFocusKeywordInput] = useState('');

  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title || '',
        description: session.description || '',
        date: session.date ? new Date(session.date) : undefined,
        startTime: session.startTime || '',
        endTime: session.endTime || '',
        skillCategory: session.skillCategory || '',
        isPublic: session.isPublic || false
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

  const handleGeneralSubTopicChange = (idx: number, value: string) => {
    setGeneralSubTopics(prev => prev.map((t, i) => (i === idx ? value : t)));
  };

  const handleAddFocusKeyword = () => {
    const current = generalSubTopics.filter(t => t.trim());
    if (focusKeywordInput.trim() && current.length < 5) {
      setGeneralSubTopics(prev => [...prev, focusKeywordInput.trim()]);
      setFocusKeywordInput('');
    }
  };

  const handleRemoveFocusKeyword = (idx: number) => {
    const current = generalSubTopics.filter(t => t.trim());
    setGeneralSubTopics(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSession({
      ...formData,
      date: formData.date ? formData.date.toISOString().split('T')[0] : '',
      focusKeywords: generalSubTopics.filter(t => t.trim()),
      isTeaching: true, // Default to true for edit sessions
      maxParticipants: 5, // Default value
    });
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

  if (!isOpen || !session) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[600px] lg:w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-lg">
            <Edit3 className="w-5 h-5" />
            Edit Session
          </SheetTitle>
          <SheetDescription>
            Update your session details and settings
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col py-6">
          {updateStatus === 'pending' && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="flex items-center space-x-3 text-primary">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm font-medium">Saving your changes...</span>
              </div>
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={updateStatus === 'pending' ? 'pointer-events-none opacity-50' : ''}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Basic Information</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Session Title *
                    </label>
                    <Input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter session title"
                      required
                      className="text-base focus:outline-none focus:ring-0 focus:border-border"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-0 focus:border-border resize-none"
                      placeholder="Describe what this session covers"
                      required
                    />
                  </div>

                  {/* Skill Category */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category *
                    </label>
                    <Combobox
                      options={skillCategories.map(category => ({ value: category, label: category }))}
                      value={formData.skillCategory}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, skillCategory: value }))}
                      placeholder="Select a category"
                      searchPlaceholder="Search categories..."
                      emptyMessage="No categories found."
                      width="w-full"
                      className="[&_button]:focus:outline-none [&_button]:focus:ring-0 [&_[cmdk-item]]:focus:outline-none [&_[cmdk-item]]:focus:ring-0 [&_[cmdk-input]]:focus:outline-none [&_[cmdk-input]]:focus:ring-0"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule & Settings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Schedule Section */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-primary" />
                    <h3 className="text-base font-semibold text-foreground">Schedule</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Date */}
                    <div>
                      <Calendar22
                        date={formData.date}
                        onDateChange={handleDateChange}
                        label="Date *"
                        placeholder="Select session date"
                      />
                    </div>

                    {/* Time Range */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <TimePicker
                          value={formData.startTime}
                          onChange={(time) => setFormData(prev => ({ ...prev, startTime: time }))}
                          label="Start Time *"
                          placeholder="Select start time"
                          className="[&_button]:focus:outline-none [&_button]:focus:ring-0"
                        />
                      </div>
                      <div>
                        <TimePicker
                          value={formData.endTime}
                          onChange={(time) => setFormData(prev => ({ ...prev, endTime: time }))}
                          label="End Time *"
                          placeholder="Select end time"
                          className="[&_button]:focus:outline-none [&_button]:focus:ring-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session Settings */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-4 h-4 text-primary" />
                    <h3 className="text-base font-semibold text-foreground">Session Settings</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Visibility */}
                    <div>
                      <label className="flex items-center space-x-3 p-3 bg-muted rounded-md">
                        <input
                          type="checkbox"
                          name="isPublic"
                          checked={formData.isPublic}
                          onChange={handleChange}
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
                        {formData.isPublic ? (
                          <Globe className="w-4 h-4 text-primary" />
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Topics */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Focus Topics *</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      value={focusKeywordInput}
                      onChange={e => setFocusKeywordInput(e.target.value)}
                      placeholder="Type a topic and press Add"
                      disabled={(generalSubTopics.filter(t => t.trim()).length >= 5)}
                      className="flex-1 focus:outline-none focus:ring-0 focus:border-border"
                    />
                    <Button
                      type="button"
                      onClick={handleAddFocusKeyword}
                      disabled={(generalSubTopics.filter(t => t.trim()).length >= 5) || !focusKeywordInput.trim()}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {generalSubTopics.filter(t => t.trim()).map((keyword, idx) => (
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
                className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20"
              >
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Session Preview</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{formData.date ? formData.date.toLocaleDateString() : 'Select date'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-foreground">
                      {formData.startTime && formData.endTime ? `${formData.startTime} - ${formData.endTime}` : 'Select time'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.isPublic ? (
                      <Globe className="w-4 h-4 text-primary" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-foreground">{formData.isPublic ? 'Public session' : 'Private session'}</span>
                  </div>
                </div>
              </motion.div>
            </form>
          </motion.div>
        </div>

        <SheetFooter className="flex flex-row justify-end gap-2 pt-4 border-t">
          <SheetClose asChild>
            <Button variant="outline" disabled={updateStatus === 'pending'}>
              Cancel
            </Button>
          </SheetClose>
          <Button onClick={handleSubmit} disabled={updateStatus === 'pending'} className="min-w-[140px]">
            {updateStatus === 'pending' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {updateStatus === 'pending' ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SessionEditSheet;
