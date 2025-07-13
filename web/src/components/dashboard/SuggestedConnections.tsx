import { useState, useEffect } from 'react';
import { User } from '../../types';
import { ChevronRight, MessageSquare, UserPlus, Search, RefreshCw } from 'lucide-react';
import UserProfileModal from '../ui/UserProfileModal';
import { StreamChat } from 'stream-chat';
import { toast } from "@/components/ui/use-toast";
import { useSuggestedUsers } from "@/hooks/useAuth";

interface SuggestedConnectionsProps {
  connections: User[];
  onNavigate?: (page: string) => void;
}

const SuggestedConnections: React.FC = () => {
  const { data: connections = [], isLoading, isError } = useSuggestedUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConnections, setFilteredConnections] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<User | null>(null);

  // Update filteredConnections when connections change
  useEffect(() => {
    // Map backend _id to id and ensure skills is always an array
    const mapped = connections.map((user: any) => ({
      ...user,
      id: user._id || user.id,
      skills: Array.isArray(user.skills) ? user.skills : [],
    }));
    setFilteredConnections(mapped);
  }, []);

  // Filter connections based on search term
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredConnections(connections);
    } else {
      const filtered = connections.filter(connection =>
        connection.name.toLowerCase().includes(term.toLowerCase()) ||
        connection.email.toLowerCase().includes(term.toLowerCase()) ||
        connection.skills.some(skill => 
          skill.name.toLowerCase().includes(term.toLowerCase()) ||
          skill.category.toLowerCase().includes(term.toLowerCase())
        )
      );
      setFilteredConnections(filtered);
    }
  };

  // Refresh suggestions (in a real app, this would fetch new data)
  const handleRefresh = () => {
    // Simulate refreshing by shuffling the array
    const shuffled = [...connections].sort(() => Math.random() - 0.5);
    setFilteredConnections(shuffled);
    setSearchTerm('');
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsUserProfileOpen(true);
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
  
  const apiKey = '4ngq5ws5e4b8';

  // Add this handler inside the component
  const handleMessageClick = async (connection: User) => {
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
  
      const channelId = `sc_${connection.id}`;
      
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
  
      const channelId = `sc_${pendingConnection.id}`;
      let channel;
    
      const existingChannels = await chatClient.queryChannels({
        id: { $eq: channelId },
      });
  
  
      if (existingChannels.length > 0) {
        console.log("CHANEL EXIST")
        channel = existingChannels[0];
      } else {
        channel = chatClient.channel('messaging', channelId, {
          members: [streamUser.id, pendingConnection.id],
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
  
  if (isLoading) {
    return <div className="text-white">Loading suggested users...</div>;
  }
  if (isError) {
    return <div className="text-red-500">Failed to load suggested users.</div>;
  }

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
            />
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-400 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Refresh suggestions"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex space-x-4 pb-2 overflow-x-auto hide-scrollbar">
          {filteredConnections.length > 0 ? (
            filteredConnections.map(connection => (
              <div 
                key={connection.id}
                className="flex-shrink-0 w-40 bg-gray-800 rounded-lg border border-gray-700 p-4 transition-shadow duration-300 hover:shadow-md hover:border-primary/50"
              >
                <div className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <img 
                      src={connection.avatar} 
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
                  <p className="text-xs text-gray-400 text-center mb-3">{connection.email}</p>
                  
                 
                  
                  <div className="flex space-x-2 mt-4">
                    <button 
                      className="p-1.5 text-gray-400 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label={`Message ${connection.name}`}
                      onClick={() => handleMessageClick(connection)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                 
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-8">
              <p className="text-gray-400">No users found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        user={selectedUser}
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
                  src={pendingConnection.avatar} 
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