import React, { useState } from 'react';
import { IconTrendingUp, IconTrendingDown, IconCalendar, IconCheckCircle, IconChartLine, IconChevronDown } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExchangeSession } from '../../hooks/useGetUpcomingExchangeSessions';
import { useGetExchangeSessionStats } from '../../hooks/useGetExchangeSessionStats';
import CompletedSessionsChart from './CompletedSessionsChart';
import GrowthRateChart from './GrowthRateChart';

interface KPICardsProps {
  upcomingExchangeSessions?: ExchangeSession[];
}

const KPICards: React.FC<KPICardsProps> = ({ upcomingExchangeSessions = [] }) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [growthPeriod, setGrowthPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { data: statsData, isLoading: statsLoading } = useGetExchangeSessionStats();
  const stats = statsData?.data || { completedExchangeSessions: 0, scheduledExchangeSessions: 0, uniqueExchangePartners: 0 };

  // Get today's sessions
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = upcomingExchangeSessions.filter(session => session.date === today);
  
  // Sample data for demonstration
  const sampleTodaySessions = [
    {
      title: "React Advanced Concepts",
      startTime: "09:00",
      endTime: "10:30",
      skillCategory: "Programming",
      date: today
    },
    {
      title: "Data Science Study Group", 
      startTime: "14:00",
      endTime: "15:30",
      skillCategory: "Data Science",
      date: today
    },
    {
      title: "UI/UX Design Workshop",
      startTime: "16:00", 
      endTime: "17:30",
      skillCategory: "Design",
      date: today
    },
    {
      title: "Business Strategy Session",
      startTime: "19:00",
      endTime: "20:00", 
      skillCategory: "Business",
      date: today
    }
  ];
  
  // Use sample data if no real data available
  const displaySessions = todaySessions.length > 0 ? todaySessions : sampleTodaySessions;

  // Calculate growth rate based on selected period
  const getGrowthRate = () => {
    switch (growthPeriod) {
      case 'daily':
        return 8.2; // Daily growth
      case 'weekly':
        return 12.5; // Weekly growth
      case 'monthly':
        return 18.7; // Monthly growth
      default:
        return 12.5;
    }
  };

  const growthRate = getGrowthRate();
  const isGrowthPositive = growthRate > 0;

  const toggleExpanded = (cardType: string) => {
    setExpandedCard(expandedCard === cardType ? null : cardType);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Scheduled Sessions Card */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Today's Sessions </h3>
        
        </div>
        
        <div className="text-3xl font-bold text-foreground mb-2">
          {statsLoading ? '...' : displaySessions.length}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconTrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-foreground">Trending up this month</span>
          </div>
        </div>

        {/* Expandable section for today's sessions */}
        {displaySessions.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => toggleExpanded('scheduled')}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              {expandedCard === 'scheduled' ? 'Hide' : 'View'} Today's Sessions ({displaySessions.length})
            </button>
            
            <AnimatePresence>
              {expandedCard === 'scheduled' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    ease: 'easeInOut',
                    height: { duration: 0.3, ease: 'easeInOut' }
                  }}
                  className="mt-3 overflow-hidden"
                >
                  <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="relative"
                  >
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20"></div>
                    
                    <div className="space-y-4">
                      {displaySessions.slice(0, 3).map((session, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 + (index * 0.1), duration: 0.3 }}
                          className="relative flex items-start gap-4"
                        >
                          {/* Timeline dot */}
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 + (index * 0.1), duration: 0.2 }}
                            className="relative z-10 flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                          >
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </motion.div>
                          
                          {/* Session content */}
                          <motion.div 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 + (index * 0.1), duration: 0.3 }}
                            className="flex-1 min-w-0 pb-4"
                          >
                            <div className="bg-muted/30 rounded-lg p-3 border border-border/30 hover:bg-muted/40 transition-colors">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-foreground truncate">
                                  {session.title}
                                </h4>
                                <span className="text-xs text-primary font-medium">
                                  {session.startTime}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {session.startTime} - {session.endTime}
                                </span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                  {session.skillCategory}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      ))}
                      
                      {displaySessions.length > 3 && (
                        <motion.div 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                          className="relative flex items-start gap-4"
                        >
                          <div className="relative z-10 flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-xs text-muted-foreground font-medium">
                              +{displaySessions.length - 3}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">
                              more sessions scheduled for today
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Completed Sessions Card */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Completed Sessions</h3>
          <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 rounded-full">
            <IconTrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-red-600 dark:text-red-400">-5.2%</span>
          </div>
        </div>
        
        <div className="text-3xl font-bold text-foreground mb-2">
          {statsLoading ? '...' : stats.completedExchangeSessions}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconTrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-foreground">Down 5.2% this period</span>
          </div>
          <p className="text-sm text-muted-foreground">Completion rate needs attention</p>
          
          {/* Daily line chart */}
          <div className="mt-3">
            <CompletedSessionsChart />
          </div>
        </div>
      </div>

      {/* Growth Rate Card */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Growth Rate</h3>
          <div className="flex items-center gap-2">
            <select
              value={growthPeriod}
              onChange={(e) => setGrowthPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
              className="text-xs bg-muted border border-border rounded px-2 py-1 text-foreground"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
              <IconTrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400">+{growthRate}%</span>
            </div>
          </div>
        </div>
        
        <div className="text-3xl font-bold text-foreground mb-2">
          {growthRate}%
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconTrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-foreground">Strong user retention</span>
          </div>
          <p className="text-sm text-muted-foreground">Engagement exceeds targets</p>
          
          {/* Growth rate line chart */}
          <GrowthRateChart period={growthPeriod} />
        </div>
      </div>
    </div>
  );
};

export default KPICards;
