import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Globe, Lock, Save, X, BookOpen, Target, Settings, Edit3 } from 'lucide-react';
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
  ModalHeader,
} from "../ui/animated-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SessionEditModalProps {
  session: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: any) => void;
  refetchSessions: () => void;
}

const SessionEditModal: React.FC<SessionEditModalProps> = ({ session, isOpen, onClose, onSave, refetchSessions }) => {
  const toast = useToast();
  const { mutate: updateSession, status: updateStatus } = useUpdateSession(session?._id, {
    onSuccess: () => {
      toast.toast({ title: 'Session updated!', description: 'Your session was updated successfully.' });
      onSave({ ...session, ...formData, subTopics: generalSubTopics });
      onClose();
      refetchSessions();
    },
    onError: (error: any) => {
      toast.toast({ title: 'Error', description: error?.response?.data?.message || 'Failed to update session', variant: 'destructive' });
    },
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    skillCategory: '',
    isPublic: true,
    maxParticipants: 5,
    isTeaching: true
  });
  const [generalSubTopics, setGeneralSubTopics] = useState<string[]>(['', '', '', '', '']);

  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title || '',
        description: session.description || '',
        date: session.date || '',
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

  const handleGeneralSubTopicChange = (idx: number, value: string) => {
    setGeneralSubTopics(prev => prev.map((t, i) => (i === idx ? value : t)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSession({
      ...formData,
      subTopics: generalSubTopics,
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBody className="max-w-4xl">
        <ModalHeader onClose={onClose}>
          Edit Session
        </ModalHeader>
        
        <ModalContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6"
          >
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Edit3 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Edit Session
              </h2>
              <p className="text-muted-foreground">
                Update your session details and settings
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      Session Title
                    </label>
                    <Input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter session title"
                      required
                      className="text-lg"
                    />
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                      placeholder="Describe what this session covers"
                      required
                    />
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
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Date
                      </label>
                      <Input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Time Range */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Start Time
                        </label>
                        <Input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          End Time
                        </label>
                        <Input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                          required
                        />
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
                    {/* Skill Category */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Category
                      </label>
                      <select
                        name="skillCategory"
                        value={formData.skillCategory}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      >
                        <option value="">Select a category</option>
                        {skillCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Max Participants */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Max Participants
                      </label>
                      <Input
                        type="number"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleChange}
                        min={1}
                        max={50}
                        className="w-24"
                      />
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
                    {/* Visibility */}
                    <div>
                      <label className="flex items-center space-x-3 p-3 bg-muted rounded-md">
                        <input
                          type="checkbox"
                          name="isPublic"
                          checked={formData.isPublic}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
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

                    {/* Teaching Mode */}
                    <div>
                      <label className="flex items-center space-x-3 p-3 bg-muted rounded-md">
                        <input
                          type="checkbox"
                          name="isTeaching"
                          checked={formData.isTeaching}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-foreground">
                            Teaching session
                          </span>
                          <p className="text-xs text-muted-foreground">
                            You will be teaching others in this session
                          </p>
                        </div>
                        <Users className="w-4 h-4 text-primary" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Topics */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Session Topics</h3>
                  <span className="text-xs text-muted-foreground">(5 required)</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generalSubTopics.map((topic, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium">
                        {idx + 1}
                      </div>
                      <Input
                        type="text"
                        value={topic}
                        onChange={e => handleGeneralSubTopicChange(idx, e.target.value)}
                        placeholder={`Topic ${idx + 1}`}
                        required
                        className="flex-1"
                      />
                    </motion.div>
                  ))}
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
                    <span className="text-foreground">{formData.date || 'Select date'}</span>
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
        </ModalContent>
        
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={updateStatus === 'pending'} className="min-w-[140px]">
            <Save className="w-4 h-4 mr-2" />
            {updateStatus === 'pending' ? 'Saving...' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};

export default SessionEditModal;