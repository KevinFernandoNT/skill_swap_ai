import { useState, useEffect } from 'react';
import { Bell, Plus, LogOut, Check } from 'lucide-react';
import CreateSessionModal from '../sessions/CreateSessionModal';
import { Session } from '../../types';
import { useGetUnreadNotifications } from '../../hooks/useGetUnreadNotifications';
import { useGetUnreadCount } from '../../hooks/useGetUnreadCount';
import { useMarkNotificationAsRead } from '../../hooks/useMarkNotificationAsRead';
import { useToast } from '../../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';

const Header: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  // Get current user from localStorage and subscribe for real-time updates
  useEffect(() => {
    const applyUserFromStorage = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUser(user);
        } catch {}
      }
    };
    applyUserFromStorage();

    const onUserUpdated = (e: Event) => applyUserFromStorage();
    window.addEventListener('userUpdated', onUserUpdated as EventListener);
    return () => window.removeEventListener('userUpdated', onUserUpdated as EventListener);
  }, []);

  // Fetch unread notifications and count
  const { data: unreadNotificationsResponse, isLoading: isLoadingNotifications, refetch: refetchNotifications } = useGetUnreadNotifications();
  const { data: unreadCountResponse, refetch: refetchCount } = useGetUnreadCount();
  
  // Debug: Log the response to understand the structure
  console.log('Unread notifications response:', unreadNotificationsResponse);
  console.log('Unread count response:', unreadCountResponse);
  
  // Handle both response formats - direct array or wrapped in data property
  const unreadNotifications = Array.isArray(unreadNotificationsResponse) 
    ? unreadNotificationsResponse 
    : (unreadNotificationsResponse?.data || []);
  
  const unreadCount = typeof unreadCountResponse === 'number' 
    ? unreadCountResponse 
    : (unreadCountResponse?.data || 0);

  console.log('Processed unread notifications:', unreadNotifications);
  console.log('Processed unread count:', unreadCount);

  const handleCreateSession = () => {
    // In a real app, this would save to backend
    console.log('Session created successfully');
    setIsCreateSessionOpen(false);
    // Show success message or redirect
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };


  const { mutate: markOneAsRead } = useMarkNotificationAsRead({
    onSuccess: () => {
      refetchNotifications();
      refetchCount();
      toast({
        title: "Notification marked as read",
        description: "The notification has been marked as read.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Could not mark notification as read.",
        variant: "destructive",
      });
    },
  });

  const handleMarkAsRead = (notificationId: string) => {
    markOneAsRead({ id: notificationId });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <>
      <header className="px-4 py-6 bg-black border-b border-gray-800 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {currentUser?.name ? currentUser.name.split(' ')[0] : 'User'}
            </h1>
            <p className="mt-1 text-sm text-gray-400">Here's what's happening with your skill exchange today.</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick actions */}
            <div className="hidden md:flex space-x-2">
              <button
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black ml-2"
                onClick={() => setIsLogoutModalOpen(true)}
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>

            {/* Mobile quick action */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsCreateSessionOpen(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Create new session"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                className="relative p-2 text-gray-400 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6" />
                {/* Notification badge */}
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowNotifications(false)}
                  />
                  
                  <div className="absolute right-0 z-20 mt-2 w-80 origin-top-right rounded-md bg-gray-900 shadow-lg ring-1 ring-gray-700 focus:outline-none">
                    <div className="py-1 divide-y divide-gray-700">
                      <div className="px-4 py-2">
                        <h3 className="text-sm font-medium text-white">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {isLoadingNotifications ? (
                          <div className="px-4 py-3 text-center">
                            <p className="text-sm text-gray-400">Loading notifications...</p>
                          </div>
                        ) : unreadNotifications.length === 0 ? (
                          <div className="px-4 py-3 text-center">
                            <p className="text-sm text-gray-400">No unread notifications</p>
                          </div>
                        ) : (
                          unreadNotifications.map((notification) => (
                            <div 
                              key={notification._id} 
                              className="px-4 py-3 hover:bg-gray-800 bg-gray-800/50 border-b border-gray-700 last:border-b-0"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-white">{notification.title}</p>
                                  <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">{formatDate(notification.createdAt)}</p>
                                </div>
                                <button
                                  onClick={() => handleMarkAsRead(notification._id)}
                                  className="ml-2 p-1 text-gray-400 hover:text-green-400 transition-colors"
                                  title="Mark as read"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="px-4 py-2">
                        <a href="/notifications" className="text-sm font-medium text-primary hover:text-primary/80">
                          View all notifications
                        </a>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-red-500" />
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to logout? You will need to log in again to access your dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Session Modal */}
      <CreateSessionModal
        isOpen={isCreateSessionOpen}
        onClose={() => setIsCreateSessionOpen(false)}
        onSuccess={handleCreateSession}
      />
    </>
  );
};

export default Header;