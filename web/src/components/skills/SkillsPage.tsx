import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Target, CheckCircle } from 'lucide-react';
import { Skill } from '../../types';
import { currentUser } from '../../data/mockData';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '../ui/alert-dialog';
import { useGetSkills } from '@/hooks/useGetSkills';
import { useDeleteSkill } from '@/hooks/useDeleteSkill';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import SkillSheet from './SkillSheet';
import { PaginatedResult } from '@/hooks/useGetSkills';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SkillCardFlip from './SkillCardFlip';
import { SkillsDataTable } from './SkillsDataTable';

interface ExtendedSkill extends Skill {
  type: 'teaching' | 'learning';
  agenda: string[];
}

interface SkillsPageProps {
  activeTab?: 'teaching' | 'learning';
}

const SkillsPage: React.FC<SkillsPageProps> = ({ activeTab: initialActiveTab = 'teaching' }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: skillsResult = { data: [] }, refetch } = useGetSkills();
  const skills = skillsResult.data || [];
  // Function to invalidate skills query
  const invalidateSkills = () => {
    queryClient.invalidateQueries({ queryKey: ['/skills'] });
  };

  const deleteSkill = useDeleteSkill({
    onSuccess: () => {
      invalidateSkills();
    },
    onError: (error) => {
      toast({ title: 'Error', description: error?.response?.data?.message || 'Failed to delete skill', variant: 'destructive' });
    },
  });
  const [activeTab, setActiveTab] = useState<'teaching' | 'learning'>(initialActiveTab);

  // Update activeTab when prop changes
  useEffect(() => {
    setActiveTab(initialActiveTab);
  }, [initialActiveTab]);
  const [isSkillSheetOpen, setIsSkillSheetOpen] = useState(false);
  const [skillSheetMode, setSkillSheetMode] = useState<'create' | 'edit'>('create');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<ExtendedSkill | null>(null);

  // Remove all local skills state and replace with API data
  // Update handleAddSkill, handleDeleteSkill, confirmDeleteSkill, etc. to use API

  const teachingSkills = skills.filter(skill => skill.type === 'teaching');
  const learningSkills = skills.filter(skill => skill.type === 'learning');

  const filteredSkills = activeTab === 'teaching' ? teachingSkills : learningSkills;

  const handleDeleteSkill = (skillId: string) => {
    setSkillToDelete(skillId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSkill = () => {
    if (skillToDelete) {
      deleteSkill.mutate(skillToDelete);
      setSkillToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const cancelDeleteSkill = () => {
    setSkillToDelete(null);
    setDeleteDialogOpen(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'programming':
        return 'bg-blue-900 text-blue-300';
      case 'design':
        return 'bg-purple-900 text-purple-300';
      case 'management':
        return 'bg-green-900 text-green-300';
      case 'marketing':
        return 'bg-orange-900 text-orange-300';
      case 'data science':
        return 'bg-teal-900 text-teal-300';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 80) return 'text-green-400';
    if (proficiency >= 60) return 'text-yellow-400';
    if (proficiency >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <>
      <div className="bg-background min-h-screen">
        {/* Header */}
        <div className="px-4 py-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-foreground">My Skills</h1>
              <p className="mt-1 text-sm text-muted-foreground">Manage your teaching and learning skills</p>
            </div>
            <button 
              onClick={() => {
                setSkillSheetMode('create');
                setIsSkillSheetOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </button>
          </div>
        </div>

        <div className="px-4 py-6 lg:px-8">
          {/* Skills Table */}
          <SkillsDataTable 
            data={filteredSkills}
            onEditSkill={(skill) => { 
              setEditingSkill(skill); 
              setSkillSheetMode('edit');
              setIsSkillSheetOpen(true); 
            }}
            onDeleteSkill={handleDeleteSkill}
          />
        </div>
      </div>

      {/* Skill Sheet */}
      <SkillSheet
        isOpen={isSkillSheetOpen}
        onOpenChange={setIsSkillSheetOpen}
        onSuccess={invalidateSkills}
        skill={editingSkill}
        mode={skillSheetMode}
      />

      {/* Delete Skill Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Skill?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this skill? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteSkill}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSkill}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SkillsPage;