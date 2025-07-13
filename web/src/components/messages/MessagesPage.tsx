import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
  useChannelStateContext,
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/v2/index.css';

// TODO: Replace with your actual Stream API key
const apiKey = '4ngq5ws5e4b8';

interface User {
  id: string;
  name: string;
  image: string;
  email?: string;
}

interface StoredUser {
  _id: string;
  name: string;
  avatar: string;
  email: string;
}

const sort = { last_message_at: -1 };
const options = { state: true, watch: true, presence: true };

// Custom Message Input component that handles API calls
const CustomMessageInput: React.FC = () => {

  return (
    <MessageInput />
  );
};

const MessagesPage: React.FC = () => {
  const [clientReady, setClientReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>(null);
  const chatClientRef = useRef<StreamChat | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        // Load user data and stream chat token from localStorage
        const storedUserData = localStorage.getItem('user');
        const streamChatToken = localStorage.getItem('stream_chat_token');
        
        if (!storedUserData || !streamChatToken) {
          throw new Error('User not authenticated. Please login first.');
        }

        const storedUser: StoredUser = JSON.parse(storedUserData);
        // Build Stream Chat user object
        const streamUser: User = {
          id: storedUser._id,
          name: storedUser.name,
          image: storedUser.avatar,
          email: storedUser.email,
        };
        setUser(streamUser);
        setUserToken(streamChatToken);
        // Set filters for channels that include the current user
        setFilters({ type: 'messaging', members: { $in: [streamUser.id] } });
        // Only create and connect client if not already done
        if (!chatClientRef.current) {
          const client = StreamChat.getInstance(apiKey);
          await client.connectUser(streamUser, streamChatToken);
          chatClientRef.current = client;
        }
        setClientReady(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize chat');
        console.error('Chat initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
    initializeChat();
    // Cleanup on unmount
    return () => {
      if (chatClientRef.current) {
        chatClientRef.current.disconnectUser();
        chatClientRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Initializing chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!clientReady || !user || !userToken) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Connecting to chat...
      </div>
    );
  }

  // Use the ref for the Chat component
  return (
    <div className="h-screen bg-black">
      <Chat client={chatClientRef.current!} theme="str-chat__theme-dark">
        <div className="flex h-screen">
          {/* Channel List */}
          <div className="w-80 border-r border-gray-800 bg-black flex flex-col">
            <ChannelList
              filters={filters}
              options={options}
            />
          </div>
          {/* Chat Area */}
          <div className="flex-1 bg-black flex flex-col">
            <Channel>
              <Window>
                <ChannelHeader />
                <MessageList />
                <CustomMessageInput />
              </Window>
              <Thread />
            </Channel>
          </div>
        </div>
      </Chat>
    </div>
  );
};

export default MessagesPage;