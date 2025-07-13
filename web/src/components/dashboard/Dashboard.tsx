import Header from './Header';
import AnalyticsCards from './AnalyticsCards';
import UpcomingSessions from './UpcomingSessions';
import SuggestedConnections from './SuggestedConnections';
import { analyticsData, sessions, users } from '../../data/mockData';

const Dashboard: React.FC = () => {
  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="space-y-8">
          {/* Analytics Cards Section */}
          <AnalyticsCards data={analyticsData} />
          
          {/* Upcoming Sessions Section */}
          <UpcomingSessions sessions={sessions} />
          
          {/* Suggested Connections Section */}
          <div className="grid grid-cols-1">
            <SuggestedConnections />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;