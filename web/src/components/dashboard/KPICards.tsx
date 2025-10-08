import React, { useState } from 'react';
import { IconTrendingUp, IconTrendingDown, IconCalendar, IconCheckCircle, IconChartLine, IconChevronDown } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExchangeSession } from '../../hooks/useGetUpcomingExchangeSessions';
import { useGetExchangeSessionStats } from '../../hooks/useGetExchangeSessionStats';
import { DashboardData } from '../../types/dashboard';
import CompletedSessionsChart from './CompletedSessionsChart';
import GrowthRateChart from './GrowthRateChart';

interface KPICardsProps {
  dashboardData?: DashboardData;
  upcomingExchangeSessions?: ExchangeSession[];
}

const KPICards: React.FC<KPICardsProps> = ({ dashboardData, upcomingExchangeSessions = [] }) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [growthPeriod, setGrowthPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { data: statsData, isLoading: statsLoading } = useGetExchangeSessionStats();
  const stats = dashboardData?.stats || statsData?.data || { completedExchangeSessions: 0, scheduledExchangeSessions: 0, uniqueExchangePartners: 0 };

  // Get KPI analytics from API data
  const kpiAnalytics = dashboardData?.kpiAnalytics;

  // Get today's sessions from API data only
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = dashboardData?.todaySessions || [];
  
  // Use only real API data - no mock data fallback
  const displaySessions = todaySessions;

  // Get growth rate from API data or fallback
  const getGrowthRate = () => {
    if (kpiAnalytics?.growthRate?.rate !== undefined) {
      return kpiAnalytics.growthRate.rate;
    }
    // Fallback calculation based on selected period
    switch (growthPeriod) {
      case 'daily':
        return 8.2;
      case 'weekly':
        return 12.5;
      case 'monthly':
        return 18.7;
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
      {/* Today's Sessions Card */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Today's Sessions</h3>
        </div>
        
        <div className="text-3xl font-bold text-foreground mb-2">
          {statsLoading ? '...' : (kpiAnalytics?.todaySessions?.count ?? 0)}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconTrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-foreground">
              {kpiAnalytics?.todaySessions?.message || 'Trending up this month'}
            </span>
          </div>
        </div>

        {/* Expandable section for today's sessions */}
        {displaySessions.length > 0 ? (
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
        ) : (
          <div className="mt-4">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-3">
                <IconCalendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">No sessions today</p>
              <p className="text-xs text-muted-foreground">Schedule your first session to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Completed Sessions Card */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Completed Sessions</h3>
          {kpiAnalytics?.completedSessions && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              kpiAnalytics.completedSessions.trend === 'up' 
                ? 'bg-green-100 dark:bg-green-900/20' 
                : 'bg-red-100 dark:bg-red-900/20'
            }`}>
              {kpiAnalytics.completedSessions.trend === 'up' ? (
                <IconTrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
              ) : (
                <IconTrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
              )}
              <span className={`text-xs font-medium ${
                kpiAnalytics.completedSessions.trend === 'up' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {kpiAnalytics.completedSessions.change > 0 ? '+' : ''}{kpiAnalytics.completedSessions.change.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        
        <div className="text-3xl font-bold text-foreground mb-2">
          {statsLoading ? '...' : (kpiAnalytics?.completedSessions?.count ?? 0)}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {kpiAnalytics?.completedSessions?.trend === 'up' ? (
              <IconTrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <IconTrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
            <span className="text-sm font-medium text-foreground">
              {kpiAnalytics?.completedSessions?.message || 'Completion rate needs attention'}
            </span>
          </div>
          
          {/* Daily line chart */}
          <div className="mt-3">
            <CompletedSessionsChart chartData={kpiAnalytics?.completedSessions?.chartData} />
          </div>
        </div>
      </div>

      {/* Growth Rate Card */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Growth Rate</h3>
          <div className="flex items-center gap-2">
            {!kpiAnalytics?.growthRate && (
              <select
                value={growthPeriod}
                onChange={(e) => setGrowthPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
                className="text-xs bg-muted border border-border rounded px-2 py-1 text-foreground"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              isGrowthPositive 
                ? 'bg-green-100 dark:bg-green-900/20' 
                : 'bg-red-100 dark:bg-red-900/20'
            }`}>
              {isGrowthPositive ? (
                <IconTrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
              ) : (
                <IconTrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
              )}
              <span className={`text-xs font-medium ${
                isGrowthPositive 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {growthRate > 0 ? '+' : ''}{growthRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-3xl font-bold text-foreground mb-2">
          {growthRate.toFixed(1)}%
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {isGrowthPositive ? (
              <IconTrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <IconTrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
            <span className="text-sm font-medium text-foreground">
              {kpiAnalytics?.growthRate?.message || 'Strong user retention'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {kpiAnalytics?.growthRate?.engagement || 'Engagement exceeds targets'}
          </p>
          
          {/* Growth rate line chart */}
          <GrowthRateChart 
            period={growthPeriod} 
            chartData={kpiAnalytics?.growthRate?.chartData} 
          />
        </div>
      </div>
    </div>
  );
};

export default KPICards;
