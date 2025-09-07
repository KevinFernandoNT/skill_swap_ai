'use client';

import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Skill } from '@/types';

interface SkillCardFlipProps {
  skill: Skill;
  activeTab: 'teaching' | 'learning';
  onEdit: () => void;
  onDelete: () => void;
}

export default function SkillCardFlip({ skill, activeTab, onEdit, onDelete }: SkillCardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 80) return 'text-green-400';
    if (proficiency >= 60) return 'text-yellow-400';
    if (proficiency >= 40) return 'text-orange-400';
    return 'text-red-400';
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

  const features = skill.agenda?.slice(0, 4) || [
    'Fundamentals',
    'Best Practices',
    'Hands-on Practice',
    'Advanced Topics'
  ];

  return (
    <div
      className="group relative h-[360px] w-full max-w-[300px] [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          'relative h-full w-full',
          '[transform-style:preserve-3d]',
          'transition-all duration-700',
          isFlipped
            ? '[transform:rotateY(180deg)]'
            : '[transform:rotateY(0deg)]',
        )}
      >
                 {/* Front of card */}
         <div
           className={cn(
             'absolute inset-0 h-full w-full',
             '[transform:rotateY(0deg)] [backface-visibility:hidden]',
             'overflow-hidden rounded-2xl',
             'bg-[rgba(23,23,23,255)]',
             'border border-slate-200 dark:border-zinc-800/50',
             'shadow-lg dark:shadow-xl',
             'transition-all duration-700',
             'group-hover:shadow-xl dark:group-hover:shadow-2xl',
             'group-hover:border-primary/20 dark:group-hover:border-primary/30',
             isFlipped ? 'opacity-0' : 'opacity-100',
           )}
         >
           {/* Background gradient effect */}
           <div className="from-primary/5 dark:from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-blue-500/5 dark:to-blue-500/10" />

           {/* Category badge */}
           <div className="absolute top-4 left-4">
             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
               {skill.category}
             </span>
           </div>

                     {/* Central content */}
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-center">
               <h3 className="text-2xl leading-snug font-semibold tracking-tight text-white transition-all duration-500 ease-out group-hover:scale-105">
                 {skill.name}
               </h3>
             </div>
           </div>

                                           {/* Bottom content */}
            <div className="absolute right-0 bottom-0 left-0 p-5">
              <div className="text-center space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm tracking-tight text-zinc-300 transition-all delay-[50ms] duration-500 ease-out group-hover:translate-y-[-4px]">
                    {activeTab === 'teaching' ? 'Proficiency' : 'Interest Level'}
                  </p>
                  <span className={`text-sm font-medium ${getProficiencyColor(skill.proficiency)}`}>
                    {skill.proficiency}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-zinc-700 rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            </div>
        </div>

                 {/* Back of card */}
         <div
           className={cn(
             'absolute inset-0 h-full w-full',
             '[transform:rotateY(180deg)] [backface-visibility:hidden]',
             'rounded-2xl p-5',
             'bg-black',
             'border border-slate-200 dark:border-zinc-800',
             'shadow-lg dark:shadow-xl',
             'flex flex-col',
             'transition-all duration-700',
             'group-hover:shadow-xl dark:group-hover:shadow-2xl',
             'group-hover:border-primary/20 dark:group-hover:border-primary/30',
             !isFlipped ? 'opacity-0' : 'opacity-100',
           )}
         >
           {/* Background gradient */}
           <div className="from-primary/5 dark:from-primary/10 absolute inset-0 rounded-2xl bg-gradient-to-br via-transparent to-blue-500/5 dark:to-blue-500/10" />

           {/* Delete button */}
           <div className="absolute top-4 right-4 z-20">
             <button
               onClick={(e) => { e.stopPropagation(); onDelete(); }}
               className="p-1 text-muted-foreground hover:text-destructive transition-colors"
               title="Delete skill"
             >
               <Trash2 className="w-4 h-4" />
             </button>
           </div>

                       <div className="relative z-10 flex-1 space-y-5">
              <div className="space-y-2">
                <div className="mb-2 text-center">
                  <h3 className="text-lg leading-snug font-semibold tracking-tight text-white transition-all duration-500 ease-out group-hover:translate-y-[-2px]">
                    {skill.name}
                  </h3>
                </div>
                <p className="line-clamp-2 text-sm tracking-tight text-zinc-300 transition-all duration-500 ease-out group-hover:translate-y-[-2px] text-center">
                  {activeTab === 'teaching' ? 'Teaching Topics' : 'Learning Topics'}
                </p>
              </div>

             <div className="space-y-2.5">
               {features.map((feature, index) => (
                 <div
                   key={feature}
                   className="text-sm text-zinc-300 transition-all duration-500"
                   style={{
                     transform: isFlipped
                       ? 'translateX(0)'
                       : 'translateX(-10px)',
                     opacity: isFlipped ? 1 : 0,
                     transitionDelay: `${index * 100 + 200}ms`,
                   }}
                 >
                   <span className="font-medium">• {feature}</span>
                 </div>
               ))}
             </div>
           </div>

                       <div className="relative z-10 mt-auto border-t border-zinc-700 pt-4">
              <div
                onClick={onEdit}
                className="flex items-center justify-center rounded-lg p-2.5 bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <span className="text-sm font-semibold text-white">
                  Edit Skill
                </span>
              </div>
            </div>
         </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          0% {
            transform: translateX(-100px);
            opacity: 0;
          }
          50% {
            transform: translateX(0);
            opacity: 0.8;
          }
          100% {
            transform: translateX(100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
