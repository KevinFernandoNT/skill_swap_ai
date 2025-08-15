import { useState, useEffect } from 'react';
import { User } from '../../types';
import { ChevronRight, MessageSquare, UserPlus, Search, RefreshCw, Loader2 } from 'lucide-react';
import UserProfileModal from '../ui/UserProfileModal';
import { StreamChat } from 'stream-chat';
import { toast } from "@/components/ui/use-toast";
import { useGetSuggestedUsers, SuggestedUser } from "@/hooks/useGetSuggestedUsers";

interface SuggestedConnectionsProps {
  connections: User[];
  onNavigate?: (page: string) => void;
}

const SuggestedConnections: React.FC = () => {
  const { data: suggestedUsersResponse, isLoading, isError, refetch } = useGetSuggestedUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConnections, setFilteredConnections] = useState<SuggestedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<SuggestedUser | null>(null);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<SuggestedUser | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Extract suggested users from API response
  const connections = suggestedUsersResponse?.data || [];

  // Update filteredConnections when connections change
  useEffect(() => {
    setFilteredConnections(connections);
  }, [connections]);

  // Filter connections based on search term
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredConnections(connections);
    } else {
      const filtered = connections.filter(connection =>
        connection.name.toLowerCase().includes(term.toLowerCase()) ||
        connection.email.toLowerCase().includes(term.toLowerCase()) ||
        connection.matchingSkills.some(skill => 
          skill.name.toLowerCase().includes(term.toLowerCase()) ||
          skill.category.toLowerCase().includes(term.toLowerCase())
        )
      );
      setFilteredConnections(filtered);
    }
  };

  // Refresh suggestions with loading state
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setSearchTerm('');
    try {
      await refetch();
      toast({
        title: "Suggestions refreshed",
        description: "Your suggested connections have been updated.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUserClick = (user: SuggestedUser) => {
    setSelectedUser(user);
    setIsUserProfileOpen(true);
  };

  // Convert SuggestedUser to User for the modal
  const convertToUser = (suggestedUser: SuggestedUser | null): User | null => {
    if (!suggestedUser) return null;
    
    return {
      _id: suggestedUser._id,
      name: suggestedUser.name,
      email: suggestedUser.email,
      avatar: suggestedUser.avatar || '/placeholder.svg',
      skills: suggestedUser.matchingSkills.map(skill => ({
        _id: skill._id,
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        type: skill.skillType, // Use the skillType from the API response
        agenda: skill.agenda || [], // Use agenda from API response
        description: skill.description,
      })),
      status: 'online' as const,
      bio: `${suggestedUser.matchingType === 'mutual_match' ? 'Perfect match for skill exchange!' : 
             suggestedUser.matchingType === 'can_teach' ? 'Can teach skills you want to learn' : 
             'Wants to learn skills you can teach'} (${suggestedUser.matchingSkills.length} matching skills)`,
    };
  };

  // Generate status label with proper styling
  const getStatusLabel = (status?: string) => {
    if (!status) return null;
    
    const colors = {
      online: 'bg-green-900 text-green-300',
      busy: 'bg-red-900 text-red-300',
      away: 'bg-yellow-900 text-yellow-300',
      offline: 'bg-gray-800 text-gray-400'
    };
    
    const colorClass = colors[status as keyof typeof colors] || colors.offline;
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="flex space-x-4 pb-2 overflow-x-auto hide-scrollbar">
      {[...Array(4)].map((_, index) => (
        <div 
          key={index}
          className="flex-shrink-0 w-48 bg-gray-800 rounded-lg border border-gray-700 p-4 animate-pulse"
        >
          <div className="flex flex-col items-center">
            {/* Avatar skeleton */}
            <div className="w-16 h-16 bg-gray-700 rounded-full mb-3"></div>
            
            {/* Name skeleton */}
            <div className="w-20 h-4 bg-gray-700 rounded mb-1"></div>
            
            {/* Email skeleton */}
            <div className="w-24 h-3 bg-gray-700 rounded mb-2"></div>
            
            {/* Matching type skeleton */}
            <div className="w-24 h-6 bg-gray-700 rounded-full mb-3"></div>
            
            {/* Skills skeleton */}
            <div className="w-full space-y-1">
              <div className="w-16 h-3 bg-gray-700 rounded mx-auto"></div>
              <div className="w-20 h-3 bg-gray-700 rounded mx-auto"></div>
              <div className="w-14 h-3 bg-gray-700 rounded mx-auto"></div>
            </div>
            
            {/* Button skeleton */}
            <div className="w-8 h-8 bg-gray-700 rounded-full mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
  
  const apiKey = '4ngq5ws5e4b8';

  // Add this handler inside the component
  const handleMessageClick = async (connection: SuggestedUser) => {
    try {
      // Get current user from localStorage
      const storedUserData = localStorage.getItem('user');
      const streamChatToken = localStorage.getItem('stream_chat_token');

      if (!storedUserData || !streamChatToken) {
        toast({
          title: 'Authentication Error',
          description: 'Please log in again to send messages.',
          variant: 'destructive',
        });
        return;
      }

      const storedUser = JSON.parse(storedUserData);
      
      const streamUser: any = {
        id: storedUser._id || storedUser.id,
        name: storedUser.name,
        image: storedUser.avatar,
        email: storedUser.email,
      };
  
      const chatClient = StreamChat.getInstance(apiKey);
      await chatClient.connectUser(streamUser, streamChatToken);
  
      const channelId = `sc_${connection._id}`;
      
      // Check if channel already exists
      const existingChannels = await chatClient.queryChannels({
        id: { $eq: channelId },
      });

      if (existingChannels.length > 0) {
        // Channel exists, directly navigate to messages
        console.log("Channel exists, navigating directly");
        const channel = existingChannels[0];
        await channel.watch();
        (window as any).selectedChannel = channel;
        
        // Navigate to Messages tab
        const navigateEvent = new CustomEvent('navigateToTab', { 
          detail: { tab: 'messages' } 
        });
        window.dispatchEvent(navigateEvent);
      } else {
        // Channel doesn't exist, show confirmation modal
        setPendingConnection(connection);
        setShowConfirmModal(true);
      }
  
    } catch (error: any) {
      console.error("Error checking channel:", error);
  
      toast({
        title: 'Chat Error',
        description: error.message || 'Unable to check chat status. Please try again.',
      });
    }
  };

  const confirmStartChat = async () => {
    if (!pendingConnection) return;
    
    try {
      // Get current user from localStorage
      const storedUserData = localStorage.getItem('user');
      const streamChatToken = localStorage.getItem('stream_chat_token');

      if (!storedUserData || !streamChatToken) {
        toast({
          title: 'Authentication Error',
          description: 'Please log in again to send messages.',
          variant: 'destructive',
        });
        return;
      }

      const storedUser = JSON.parse(storedUserData);
      
      const streamUser: any = {
        id: storedUser._id || storedUser.id,
        name: storedUser.name,
        image: storedUser.avatar,
        email: storedUser.email,
      };
  
      const chatClient = StreamChat.getInstance(apiKey);
  
      await chatClient.connectUser(streamUser, streamChatToken);
  
      const channelId = `sc_${pendingConnection._id}`;
      let channel;
    
      const existingChannels = await chatClient.queryChannels({
        id: { $eq: channelId },
      });
  
  
      if (existingChannels.length > 0) {
        console.log("CHANEL EXIST")
        channel = existingChannels[0];
      } else {
        channel = chatClient.channel('messaging', channelId, {
          members: [streamUser.id, pendingConnection._id],
        });
        await channel.create();
  
        toast({
          title: 'Channel Created',
          description: `A new chat with ${pendingConnection.name} has been created.`,
        });
      }
  
      await channel.watch(); // Optional: ensures channel is ready
  
      // Store globally
      (window as any).selectedChannel = channel;
  
      // Navigate to Messages tab
      const navigateEvent = new CustomEvent('navigateToTab', { 
        detail: { tab: 'messages' } 
      });
      window.dispatchEvent(navigateEvent);

      // Close the modal
      setShowConfirmModal(false);
      setPendingConnection(null);
  
    } catch (error: any) {
      console.error("Error initiating chat:", error);
  
      toast({
        title: 'Chat Error',
        description: error.message || 'Unable to initiate chat. Please try again.',
      });
      
      // Close the modal on error
      setShowConfirmModal(false);
      setPendingConnection(null);
    }
  };

  const cancelStartChat = () => {
    setShowConfirmModal(false);
    setPendingConnection(null);
  };

    // Store the selected channel globally for demo

    // Trigger navigation to messages page
    // Navigation logic can be handled here if needed
  
  return (
    <>
      <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Suggested Connections</h2>
          <a 
            href="/connections" 
            className="text-sm font-medium text-primary hover:text-primary/80 flex items-center"
          >
            View all
            <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        {/* Search and Refresh */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full py-2 pl-10 pr-3 text-sm bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Search users by name, email, or skills..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className={`p-2 text-gray-400 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
              isLoading || isRefreshing 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-700 hover:text-primary'
            }`}
            aria-label="Refresh suggestions"
          >
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            )}
          </button>
        </div>
        
        {/* Content Area */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : isError ? (
          <div className="w-full text-center py-12">
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Failed to load suggestions</h3>
              <p className="text-gray-400 mb-4">We couldn't load your suggested connections. Please try again.</p>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </>
              )}
            </button>
          </div>
        ) : filteredConnections.length > 0 ? (
          <div className="flex space-x-4 pb-2 overflow-x-auto hide-scrollbar">
            {filteredConnections.map(connection => (
              <div 
                key={connection._id}
                className="flex-shrink-0 w-48 bg-gray-800 rounded-lg border border-gray-700 p-4 transition-all duration-300 hover:shadow-md hover:border-green-500"
              >
                <div className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <img 
                      src={connection.avatar || '/placeholder.svg'} 
                      alt={connection.name}
                      className="w-16 h-16 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleUserClick(connection)}
                    />
                  </div>
                  
                  <h3 
                    className="text-sm font-medium text-white text-center mb-1 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleUserClick(connection)}
                  >
                    {connection.name}
                  </h3>
                  <p className="text-xs text-gray-400 text-center mb-2">{connection.email}</p>
                  
                  {/* Matching Skills */}
                  {connection.matchingSkills && connection.matchingSkills.length > 0 && (
                    <div className="w-full mb-3">
                                             {/* Matching Type Indicator - Only show for mutual matches */}
                       {connection.matchingType === 'mutual_match' && (
                         <div className="flex items-center justify-center mb-2">
                           <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30 font-medium">
                             Highly Recommended
                           </span>
                         </div>
                       )}
                    </div>
                  )}
                  
                  <div className="flex space-x-2 mt-2">
                    <button 
                      className="p-1.5 text-gray-400 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                      aria-label={`Message ${connection.name}`}
                      onClick={() => handleMessageClick(connection)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-12">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No connections found</h3>
              <p className="text-gray-400">
                {searchTerm ? 'No users match your search criteria.' : 'No suggested connections available at the moment.'}
              </p>
            </div>
            {searchTerm && (
              <button 
                onClick={() => handleSearch('')}
                className="text-primary hover:text-primary/80 text-sm"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        user={selectedUser ? convertToUser(selectedUser) : null}
        isOpen={isUserProfileOpen}
        onClose={() => {
          setIsUserProfileOpen(false);
          setSelectedUser(null);
        }}
      />

      {/* Confirmation Modal */}
      {showConfirmModal && pendingConnection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <img 
                  src={pendingConnection.avatar || '/placeholder.svg'} 
                  alt={pendingConnection.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{pendingConnection.name}</h3>
                <p className="text-sm text-gray-400">{pendingConnection.email}</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to start a conversation with <span className="font-semibold text-white">{pendingConnection.name}</span>?
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelStartChat}
                className="flex-1 px-4 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmStartChat}
                className="flex-1 px-4 py-2 text-white bg-primary border border-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuggestedConnections;