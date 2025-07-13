import { User } from '../../types';
import { ChevronRight, MessageSquare, UserPlus } from 'lucide-react';

interface RecentConnectionsProps {
  connections: User[];
}

const RecentConnections: React.FC<RecentConnectionsProps> = ({ connections }) => {
  // Generate status label with proper styling
  const getStatusLabel = (status?: string) => {
    if (!status) return null;
    
    const colors = {
      online: 'bg-green-100 text-green-800',
      busy: 'bg-red-100 text-red-800',
      away: 'bg-yellow-100 text-yellow-800',
      offline: 'bg-gray-100 text-gray-800'
    };
    
    const colorClass = colors[status as keyof typeof colors] || colors.offline;
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Connections</h2>
        <a 
          href="/connections" 
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center"
        >
          View all
          <ChevronRight className="w-4 h-4 ml-1" />
        </a>
      </div>
      
      <div className="flex space-x-4 pb-2 overflow-x-auto hide-scrollbar">
        {connections.map(connection => (
          <div 
            key={connection.id}
            className="flex-shrink-0 w-40 bg-white rounded-lg border border-gray-100 p-4 transition-shadow duration-300 hover:shadow-md"
          >
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <img 
                  src={connection.avatar} 
                  alt={connection.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                {connection.status && (
                  <span 
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white ${
                      connection.status === 'online' ? 'bg-green-400' : 
                      connection.status === 'busy' ? 'bg-red-400' : 
                      connection.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}
                  />
                )}
              </div>
              
              <h3 className="text-sm font-medium text-gray-900 text-center mb-1">{connection.name}</h3>
              <p className="text-xs text-gray-500 text-center mb-3">{connection.email}</p>
              
              {connection.status && getStatusLabel(connection.status)}
              
              <div className="flex space-x-2 mt-4">
                <button 
                  className="p-1.5 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label={`Message ${connection.name}`}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button 
                  className="p-1.5 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label={`Connect with ${connection.name}`}
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentConnections;