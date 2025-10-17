import React, { useState, useMemo } from 'react';
import { Search, Filter, Users, Mail, MapPin, Calendar, Eye, MoreHorizontal, MessageCircle } from 'lucide-react';
import { useGetUsers } from '@/hooks/useGetUsers';
import { User } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { StreamChat } from 'stream-chat';

const UsersPage: React.FC = () => {
  const { data: usersResponse, isLoading, error, refetch } = useGetUsers();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const users = usersResponse?.data || [];

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter((user: User) => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skills?.some(skill => 
          skill.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          skill.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return matchesSearch;
    });
  }, [users, searchTerm]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'offline':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      case 'busy':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'away':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const handleViewProfile = (user: User) => {
    toast({
      title: "View Profile",
      description: `Viewing profile for ${user.name}`,
    });
    // TODO: Implement profile view functionality
  };

  const handleSendMessage = async (user: User) => {
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

      const apiKey = '4ngq5ws5e4b8';
      const chatClient = StreamChat.getInstance(apiKey);
      await chatClient.connectUser(streamUser, streamChatToken);

      const channelId = `user_${user._id}`;
      
      // Check if channel already exists
      const existingChannels = await chatClient.queryChannels({
        id: { $eq: channelId },
      });

      let channel;
      if (existingChannels.length > 0) {
        // Channel exists, use it
        channel = existingChannels[0];
        await channel.watch();
      } else {
        // Create new channel
        channel = chatClient.channel('messaging', channelId, {
          members: [streamUser.id, user._id],
        });
        await channel.create();
        
        toast({
          title: 'Chat Started',
          description: `A new chat with ${user.name} has been created.`,
        });
      }

      // Store globally for MessagesPage to use
      (window as any).selectedChannel = channel;
      
      // Navigate to Messages tab
      const navigateEvent = new CustomEvent('navigateToTab', { 
        detail: { tab: 'messages' } 
      });
      window.dispatchEvent(navigateEvent);

    } catch (error: any) {
      console.error("Error starting chat:", error);
      
      toast({
        title: 'Chat Error',
        description: error.message || 'Unable to start chat. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load users</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="px-4 py-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-6 h-6" />
              All Users
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse and connect with users in the system ({filteredUsers.length} users)
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 lg:px-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-start">
              {/* Search */}
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users, skills, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-muted-foreground">
                          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">No users found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user: User) => (
                      <TableRow key={user._id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </p>
                              {user.bio && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                  {user.bio}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status || 'offline')}>
                            {user.status || 'offline'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.location ? (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {user.location}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.skills?.slice(0, 2).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill.name}
                              </Badge>
                            ))}
                            {user.skills && user.skills.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.skills.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewProfile(user)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendMessage(user)}>
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersPage;
