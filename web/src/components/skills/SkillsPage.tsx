import React, { useState } from 'react';
import { Plus, Search, Trash2, BookOpen, GraduationCap, Target, CheckCircle } from 'lucide-react';
import { Skill } from '../../types';
import { currentUser } from '../../data/mockData';
import AddSkillModal from './AddSkillModal';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '../ui/alert-dialog';

interface ExtendedSkill extends Skill {
  type: 'teaching' | 'learning';
  agenda: string[];
}

const SkillsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'teaching' | 'learning'>('teaching');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

  // Extended skills data with teaching agenda and learning goals
  const [skills, setSkills] = useState<ExtendedSkill[]>([
    {
      id: 's1',
      name: 'JavaScript',
      category: 'Programming',
      proficiency: 85,
      type: 'teaching',
      agenda: [
        'JavaScript fundamentals and ES6+ features',
        'Asynchronous programming with Promises and async/await',
        'DOM manipulation and event handling',
        'Modern development tools and debugging techniques',
        'Best practices and code organization'
      ]
    },
    {
      id: 's2',
      name: 'React',
      category: 'Programming',
      proficiency: 78,
      type: 'teaching',
      agenda: [
        'React fundamentals: components, props, and state',
        'Hooks and functional components',
        'State management with Context API and Redux',
        'React Router for navigation',
        'Testing React applications'
      ]
    },
    {
      id: 's3',
      name: 'UX Design',
      category: 'Design',
      proficiency: 62,
      type: 'learning',
      agenda: [
        'Design thinking principles',
        'User research methods',
        'Wireframing and prototyping',
        'Figma and design tools',
        'Usability testing'
      ]
    },
    {
      id: 's4',
      name: 'Node.js',
      category: 'Programming',
      proficiency: 70,
      type: 'teaching',
      agenda: [
        'Node.js fundamentals and npm ecosystem',
        'Building REST APIs with Express.js',
        'Database integration (MongoDB, PostgreSQL)',
        'Authentication and authorization',
        'Deployment and production best practices'
      ]
    },
    {
      id: 's5',
      name: 'Machine Learning',
      category: 'Data Science',
      proficiency: 45,
      type: 'learning',
      agenda: [
        'Supervised learning algorithms',
        'Unsupervised learning techniques',
        'Python libraries (scikit-learn, TensorFlow)',
        'Data preprocessing and feature engineering',
        'Model evaluation and validation'
      ]
    },
    {
      id: 's6',
      name: 'Product Management',
      category: 'Management',
      proficiency: 30,
      type: 'learning',
      agenda: [
        'Product strategy and vision',
        'User research and market analysis',
        'Roadmap planning and prioritization',
        'Stakeholder management',
        'Agile methodologies and sprint planning'
      ]
    }
  ]);

  const teachingSkills = skills.filter(skill => skill.type === 'teaching');
  const learningSkills = skills.filter(skill => skill.type === 'learning');

  const filteredSkills = (activeTab === 'teaching' ? teachingSkills : learningSkills).filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSkill = (newSkill: Omit<ExtendedSkill, 'id'>) => {
    const skill: ExtendedSkill = {
      ...newSkill,
      id: `s${Date.now()}`
    };
    setSkills(prev => [...prev, skill]);
    setIsAddModalOpen(false);
  };

  const handleDeleteSkill = (skillId: string) => {
    setSkillToDelete(skillId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSkill = () => {
    if (skillToDelete) {
      setSkills(prev => prev.filter(skill => skill.id !== skillToDelete));
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
      <div className="bg-black min-h-screen">
        {/* Header */}
        <div className="px-4 py-6 border-b border-gray-800 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-white">My Skills</h1>
              <p className="mt-1 text-sm text-gray-400">Manage your teaching and learning skills</p>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </button>
          </div>
        </div>

        <div className="px-4 py-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-800 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('teaching')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'teaching'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Skills I Can Teach ({teachingSkills.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('learning')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'learning'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Skills I Wanna Learn({learningSkills.length})</span>
              </button>
            </nav>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full py-2 pl-10 pr-3 text-sm bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-6 transition-all duration-300 hover:shadow-md hover:border-primary/50"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                      {skill.category}
                    </span>
                    <h3 className="text-lg font-medium text-white mt-2">{skill.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Proficiency */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">
                      {activeTab === 'teaching' ? 'Proficiency' : 'Interest Level'}
                    </span>
                    <span className={`text-sm font-medium ${getProficiencyColor(skill.proficiency)}`}>
                      {skill.proficiency}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>

                {/* Teaching Agenda or Learning Topics */}
                {activeTab === 'teaching' && skill.agenda ? (
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      Teaching Topics
                    </h4>
                    <ul className="space-y-1">
                      {skill.agenda.slice(0, 3).map((item, index) => (
                        <li key={index} className="text-xs text-gray-400 flex items-start">
                          <CheckCircle className="w-3 h-3 mr-1 mt-0.5 text-primary flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                      {skill.agenda.length > 3 && (
                        <li className="text-xs text-gray-500">
                          +{skill.agenda.length - 3} more topics
                        </li>
                      )}
                    </ul>
                  </div>
                ) : activeTab === 'learning' && skill.agenda ? (
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      Learning Topics
                    </h4>
                    <ul className="space-y-1">
                      {skill.agenda.slice(0, 3).map((item, index) => (
                        <li key={index} className="text-xs text-gray-400 flex items-start">
                          <CheckCircle className="w-3 h-3 mr-1 mt-0.5 text-primary flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                      {skill.agenda.length > 3 && (
                        <li className="text-xs text-gray-500">
                          +{skill.agenda.length - 3} more topics
                        </li>
                      )}
                    </ul>
                  </div>
                ) : null}

              
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredSkills.length === 0 && (
            <div className="text-center py-12">
              {activeTab === 'teaching' ? (
                <GraduationCap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              ) : (
                <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              )}
              <h3 className="text-lg font-medium text-white mb-2">
                {searchTerm 
                  ? 'No skills found' 
                  : `No ${activeTab} skills yet`
                }
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search term'
                  : `Add your first ${activeTab} skill to get started`
                }
              </p>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add {activeTab === 'teaching' ? 'Teaching' : 'Learning'} Skill
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSkill}
        defaultType={activeTab}
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