import { useState, useEffect } from 'react';
import { Bell, Plus, LogOut } from 'lucide-react';
import CreateSessionModal from '../sessions/CreateSessionModal';
import NotificationsSheet from './NotificationsSheet';
import { Session } from '../../types';
import { useGetUnreadCount } from '../../hooks/useGetUnreadCount';
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

  // Fetch unread count for badge
  const { data: unreadCountResponse } = useGetUnreadCount();
  const unreadCount = unreadCountResponse?.data || 0;

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



  return (
    <>
      <header className="px-4 py-6 bg-background lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {currentUser?.name ? currentUser.name.split(' ')[0] : 'User'}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Here's what's happening with your skill exchange today.</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick actions */}
            <div className="hidden md:flex space-x-2">

            <button
                className="inline-flex items-center px-3 py-2  text-xs font-bold text-black bg-primary border border-border rounded-md  ml-2"
                onClick={() => setIsLogoutModalOpen(true)}
                aria-label="Logout"
              >
                Request a Demo
              </button>
              <button
                className="inline-flex items-center px-3 py-2  text-xs font-semibold text-black bg-primary border border-border rounded-md  ml-2"
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
                className="inline-flex  items-center px-3 py-2 text-sm font-bold text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                aria-label="Create new session"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Notifications */}
            <button 
              className="relative p-2 text-muted-foreground rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6" />
              {/* Notification badge */}
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-destructive rounded-full">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Sheet */}
      <NotificationsSheet 
        isOpen={showNotifications} 
        onOpenChange={setShowNotifications} 
      />

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
              className="text-black hover:text-black"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-black hover:text-black"
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