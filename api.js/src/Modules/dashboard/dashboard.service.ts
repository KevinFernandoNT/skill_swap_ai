import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { ExchangeSession } from '../exchange-sessions/schemas/exchange-session.schema';
import { ExchangeRequest } from '../exchange-requests/exchange-request.schema';
import { Skill } from '../skills/schemas/skill.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(ExchangeSession.name) private exchangeSessionModel: Model<ExchangeSession>,
    @InjectModel(ExchangeRequest.name) private exchangeRequestModel: Model<ExchangeRequest>,
    @InjectModel(Skill.name) private skillModel: Model<Skill>,
  ) {}

  async getDashboardData(userId: string) {
    try {
      console.log('Dashboard service - User ID:', userId);
      console.log('Dashboard service - User ID type:', typeof userId);
      
      // Get user data
      const user = await this.userModel.findById(userId);
      console.log('Dashboard service - User found:', !!user);
      console.log('Dashboard service - User data:', user ? { id: user._id, name: user.name, email: user.email } : 'null');
      
      if (!user) {
        console.log('Dashboard service - User not found in database');
        // Let's check if there are any users in the database
        const totalUsers = await this.userModel.countDocuments();
        console.log('Dashboard service - Total users in database:', totalUsers);
        
        // Let's also check what users exist
        const allUsers = await this.userModel.find({}, '_id name email').limit(5);
        console.log('Dashboard service - Sample users in database:', allUsers);
        
        throw new Error('User not found');
      }
      
      // Get exchange session statistics
      const totalSessions = await this.exchangeSessionModel.countDocuments({
        $or: [
          { hostId: userId },
          { requestedBy: userId }
        ]
      });

      const completedSessions = await this.exchangeSessionModel.countDocuments({
        $or: [
          { hostId: userId, status: 'completed' },
          { requestedBy: userId, status: 'completed' }
        ]
      });

      const scheduledSessions = await this.exchangeSessionModel.countDocuments({
        $or: [
          { hostId: userId, status: 'upcoming' },
          { requestedBy: userId, status: 'upcoming' }
        ]
      });

      // Get upcoming sessions (next 7 days)
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const upcomingSessions = await this.exchangeSessionModel
        .find({
          $or: [
            { hostId: userId },
            { requestedBy: userId }
          ],
          status: 'upcoming',
          date: { $gte: today.toISOString().split('T')[0], $lte: nextWeek.toISOString().split('T')[0] }
        })
        .populate('hostId', 'name avatar')
        .populate('requestedBy', 'name avatar')
        .sort({ date: 1 })
        .limit(5);

      // Get recent connections (users who have exchanged with this user)
      const recentConnections = await this.exchangeSessionModel
        .find({
          $or: [
            { hostId: userId },
            { requestedBy: userId }
          ],
          status: 'completed'
        })
        .populate('hostId', 'name avatar')
        .populate('requestedBy', 'name avatar')
        .sort({ updatedAt: -1 })
        .limit(5);

      // Get skill categories for pie chart
      const skillCategories = await this.skillModel.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      // Get learning progress data (last 7 days)
      const learningProgress = await this.getLearningProgress(userId);

      // Get today's sessions
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const todaySessions = await this.exchangeSessionModel
        .find({
          $or: [
            { hostId: userId },
            { requestedBy: userId }
          ],
          date: today.toISOString().split('T')[0]
        })
        .populate('hostId', 'name avatar')
        .populate('requestedBy', 'name avatar');

       // Calculate KPI analytics
       const kpiAnalytics = await this.calculateKPIAnalytics(userId);

       // Get exchange session statistics
       const exchangeStats = {
         totalSessions,
         completedSessions,
         scheduledSessions,
         uniquePartners: await this.getUniquePartnersCount(userId)
       };

       return {
         success: true,
         data: {
           user: {
             id: user._id,
             name: user.name,
             avatar: user.avatar,
             email: user.email
           },
           stats: exchangeStats,
           kpiAnalytics,
           upcomingSessions: upcomingSessions.map(session => ({
             id: session._id,
             title: session.title,
             date: session.date,
             partner: session.hostId._id.toString() === userId ? session.requestedBy : session.hostId,
             status: session.status,
             skill: session.skillCategory
           })),
           recentConnections: recentConnections.map(session => ({
             id: session.hostId._id.toString() === userId ? session.requestedBy._id : session.hostId._id,
             name: session.hostId._id.toString() === userId ? (session.requestedBy as any).name : (session.hostId as any).name,
             avatar: session.hostId._id.toString() === userId ? (session.requestedBy as any).avatar : (session.hostId as any).avatar,
             date: session.updatedAt
           })),
           skillCategories,
           learningProgress,
           todaySessions: todaySessions.map(session => ({
             id: session._id,
             title: session.title,
             time: session.date,
             partner: session.hostId._id.toString() === userId ? session.requestedBy : session.hostId,
             status: session.status
           }))
         }
       };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard data: ${error.message}`);
    }
  }

  private async getLearningProgress(userId: string) {
    // Get sessions from the last 7 days grouped by day
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const sessions = await this.exchangeSessionModel.find({
      $or: [
        { hostId: userId },
        { requestedBy: userId }
      ],
      status: 'completed',
      updatedAt: { $gte: sevenDaysAgo }
    });

    // Group by day and calculate hours
    const progressData: Array<{ name: string; hours: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.updatedAt);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      });

      const totalHours = daySessions.reduce((total, session) => {
        // Calculate duration from start and end time
        const startTime = session.startTime;
        const endTime = session.endTime;
        const duration = this.calculateDuration(startTime, endTime);
        return total + duration;
      }, 0);

      progressData.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: totalHours
      });
    }

    return progressData;
  }

  private calculateDuration(startTime: string, endTime: string): number {
    // Simple duration calculation - assumes 1 hour if parsing fails
    try {
      const start = new Date(`2000-01-01 ${startTime}`);
      const end = new Date(`2000-01-01 ${endTime}`);
      const diffMs = end.getTime() - start.getTime();
      return Math.max(1, diffMs / (1000 * 60 * 60)); // Convert to hours, minimum 1 hour
    } catch {
      return 1; // Default 1 hour
    }
  }

   private async getUniquePartnersCount(userId: string) {
     const sessions = await this.exchangeSessionModel.find({
       $or: [
         { hostId: userId },
         { requestedBy: userId }
       ],
       status: 'completed'
     });

     const partners = new Set();
     sessions.forEach(session => {
       if (session.hostId.toString() !== userId) {
         partners.add(session.hostId.toString());
       }
       if (session.requestedBy.toString() !== userId) {
         partners.add(session.requestedBy.toString());
       }
     });

     return partners.size;
   }

   private async calculateKPIAnalytics(userId: string) {
     const today = new Date();
     const todayStart = new Date(today);
     todayStart.setHours(0, 0, 0, 0);
     const todayEnd = new Date(today);
     todayEnd.setHours(23, 59, 59, 999);

     // Get sessions for the last 30 days for comparison
     const thirtyDaysAgo = new Date(today);
     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

     // Today's sessions count
     const todaySessionsCount = await this.exchangeSessionModel.countDocuments({
       $or: [
         { hostId: userId },
         { requestedBy: userId }
       ],
       date: today.toISOString().split('T')[0]
     });

     // Completed sessions this month vs last month
     const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
     const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
     const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

     const [thisMonthCompleted, lastMonthCompleted] = await Promise.all([
       this.exchangeSessionModel.countDocuments({
         $or: [
           { hostId: userId },
           { requestedBy: userId }
         ],
         status: 'completed',
         updatedAt: { $gte: thisMonthStart }
       }),
       this.exchangeSessionModel.countDocuments({
         $or: [
           { hostId: userId },
           { requestedBy: userId }
         ],
         status: 'completed',
         updatedAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
       })
     ]);

     // Calculate completion rate change
     const completionRateChange = lastMonthCompleted > 0 
       ? ((thisMonthCompleted - lastMonthCompleted) / lastMonthCompleted) * 100 
       : thisMonthCompleted > 0 ? 100 : 0;

     // Growth rate calculation (new sessions this month vs last month)
     const [thisMonthTotal, lastMonthTotal] = await Promise.all([
       this.exchangeSessionModel.countDocuments({
         $or: [
           { hostId: userId },
           { requestedBy: userId }
         ],
         createdAt: { $gte: thisMonthStart }
       }),
       this.exchangeSessionModel.countDocuments({
         $or: [
           { hostId: userId },
           { requestedBy: userId }
         ],
         createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
       })
     ]);

     const growthRate = lastMonthTotal > 0 
       ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
       : thisMonthTotal > 0 ? 100 : 0;

     // Get last 7 days data for trend analysis
     const last7Days: Array<{ date: string; count: number }> = [];
     for (let i = 6; i >= 0; i--) {
       const date = new Date(today);
       date.setDate(date.getDate() - i);
       const dayStart = new Date(date);
       dayStart.setHours(0, 0, 0, 0);
       const dayEnd = new Date(date);
       dayEnd.setHours(23, 59, 59, 999);

       const daySessions = await this.exchangeSessionModel.countDocuments({
         $or: [
           { hostId: userId },
           { requestedBy: userId }
         ],
         createdAt: { $gte: dayStart, $lte: dayEnd }
       });

       last7Days.push({
         date: date.toISOString().split('T')[0],
         count: daySessions
       });
     }

     return {
       todaySessions: {
         count: todaySessionsCount,
         trend: 'up', // This could be calculated based on previous days
         message: todaySessionsCount > 0 ? `View Today's Sessions (${todaySessionsCount})` : 'No sessions today'
       },
       completedSessions: {
         count: thisMonthCompleted,
         change: completionRateChange,
         trend: completionRateChange >= 0 ? 'up' : 'down',
         message: completionRateChange < 0 ? 'Completion rate needs attention' : 'Great completion rate!',
         chartData: last7Days.map(day => ({ name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }), value: day.count }))
       },
       growthRate: {
         rate: growthRate,
         trend: growthRate >= 0 ? 'up' : 'down',
         message: growthRate > 5 ? 'Strong user retention' : 'Growth needs attention',
         engagement: growthRate > 5 ? 'Engagement exceeds targets' : 'Focus on user engagement',
         chartData: last7Days.map(day => ({ name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }), value: day.count }))
       }
     };
   }
}
