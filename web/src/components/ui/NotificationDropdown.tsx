import React, { useState } from 'react';
import { Bell, Check, X, Loader2 } from 'lucide-react';
import { Notification } from '../../types';
import { useGetUnreadNotifications } from '../../hooks/useGetUnreadNotifications';
import { useGetUnreadCount } from '../../hooks/useGetUnreadCount';
import { useMarkNotificationAsRead } from '../../hooks/useMarkNotificationAsRead';
import { useMarkAllNotificationsAsRead } from '../../hooks/useMarkAllNotificationsAsRead';
import { useToast } from '../../hooks/use-toast';

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Fetch unread notifications and count
  const { data: unreadNotificationsResponse, isLoading: isLoadingNotifications, refetch: refetchNotifications } = useGetUnreadNotifications();
  const { data: unreadCountResponse, refetch: refetchCount } = useGetUnreadCount();
  
  const unreadNotifications: Notification[] = unreadNotificationsResponse?.data || [];
  const unreadCount: number = unreadCountResponse?.data || 0;

  // Mark notification as read
  const { mutate: markAsRead } = useMarkNotificationAsRead({
    onSuccess: () => {
      refetchNotifications();
      refetchCount();
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

  // Mark all notifications as read
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead({
    onSuccess: () => {
      refetchNotifications();
      refetchCount();
      toast({
        title: "Success",
        description: "All notifications marked as read.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Could not mark all notifications as read.",
        variant: "destructive",
      });
    },
  });

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead({ id: notificationId });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead({});
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h3 className="text-white font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary hover:text-primary/80"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoadingNotifications ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : unreadNotifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No unread notifications</p>
              </div>
            ) : (
              unreadNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className="p-4 border-b border-gray-800 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {notification.sender && (
                          <img
                            src={notification.sender.avatar}
                            alt={notification.sender.name}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <h4 className="text-white font-medium text-sm">
                          {notification.title}
                        </h4>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        {notification.message}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {unreadNotifications.length > 0 && (
            <div className="p-4 border-t border-gray-800">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationDropdown; 