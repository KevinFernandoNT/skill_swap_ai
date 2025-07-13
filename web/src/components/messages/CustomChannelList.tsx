import React from 'react';
import { ChannelList as StreamChannelList } from 'stream-chat-react';
import { users, currentUser } from '../../data/mockData';

const CustomChannelPreview: React.FC<any> = ({ channel, setActiveChannel, activeChannel }) => {
  const isActive = activeChannel?.id === channel.id;
  
  // Get the other user in the channel
  const otherUser:any = Object.values(channel.state.members).find(
    (member: any) => member.user?.id !== currentUser.id
  );
  
  const user = otherUser?.user;
  const lastMessage = channel.state.messages[channel.state.messages.length - 1];
  
  return (
    <div
      className={`p-4 cursor-pointer border-b border-gray-800 hover:bg-gray-800 transition-colors ${
        isActive ? 'bg-gray-800 border-l-4 border-l-primary' : ''
      }`}
      onClick={() => setActiveChannel(channel)}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={user?.image || 'https://via.placeholder.com/40'}
            alt={user?.name || 'User'}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-gray-900"></span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-sm text-white truncate">
              {user?.name || 'Unknown User'}
            </span>
            {lastMessage && (
              <span className="text-xs text-gray-400">
                {new Date(lastMessage.created_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-400 truncate">
            {lastMessage?.text || 'No messages yet'}
          </p>
        </div>
      </div>
    </div>
  );
};

const CustomChannelList: React.FC<any> = (props) => {
  return (
    <div className="h-full">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">Conversations</h2>
      </div>
      
      <StreamChannelList
        {...props}
        Preview={CustomChannelPreview}
      />
    </div>
  );
};

export default CustomChannelList;