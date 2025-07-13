import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface ExtendedSkill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  type: 'teaching' | 'learning';
  agenda: string[];
}

interface EditSkillModalProps {
  skill: ExtendedSkill | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (skill: ExtendedSkill) => void;
}

const EditSkillModal: React.FC<EditSkillModalProps> = ({ skill, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<ExtendedSkill>({
    id: '',
    name: '',
    category: '',
    proficiency: 50,
    type: 'teaching',
    agenda: ['', '', '', '', '']
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        ...skill,
        agenda: skill.agenda && skill.agenda.length > 0 
          ? [...skill.agenda, ...Array(Math.max(0, 5 - skill.agenda.length)).fill('')].slice(0, 5)
          : ['', '', '', '', '']
      });
    }
  }, [skill]);

  if (!isOpen || !skill) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all 5 topics are filled
    const filledTopics = formData.agenda.filter(item => item.trim() !== '');
    if (filledTopics.length !== 5) {
      alert('Please fill in exactly 5 topics for this skill.');
      return;
    }
    
    const skillData: ExtendedSkill = {
      ...formData,
      agenda: formData.agenda.filter(item => item.trim())
    };
    
    onSave(skillData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleAgendaChange = (index: number, value: string) => {
    const newAgenda = [...formData.agenda];
    newAgenda[index] = value;
    setFormData(prev => ({ ...prev, agenda: newAgenda }));
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-gray-900 rounded-lg shadow-xl border border-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Edit Skill</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., React, Python, UX Design"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select a category</option>
                  {skillCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Skill Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skill Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="teaching">Teaching - I can teach this skill</option>
                <option value="learning">Learning - I want to learn this skill</option>
              </select>
            </div>

            {/* Proficiency/Interest Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {formData.type === 'teaching' ? 'Proficiency Level' : 'Interest Level'} ({formData.proficiency}%)
              </label>
              <input
                type="range"
                name="proficiency"
                value={formData.proficiency}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>

            {/* Topics */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {formData.type === 'teaching' ? 'Topics I can teach' : 'Topics I want to learn'} (Required: 5 topics)
              </label>
              <div className="space-y-3">
                {formData.agenda.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400 w-8">#{index + 1}</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleAgendaChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder={formData.type === 'teaching' 
                        ? `Teaching topic ${index + 1} (e.g., React Hooks, State Management)`
                        : `Learning topic ${index + 1} (e.g., Basic Syntax, Data Structures)`
                      }
                      required
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Please provide exactly 5 specific topics or subtopics related to this skill.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSkillModal;