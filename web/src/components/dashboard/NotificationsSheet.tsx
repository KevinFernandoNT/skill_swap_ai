import React from 'react';
import { Bell, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Notification } from '../../types';
import { useGetUnreadNotifications } from '../../hooks/useGetUnreadNotifications';
import { useGetUnreadCount } from '../../hooks/useGetUnreadCount';
import { useMarkNotificationAsRead } from '../../hooks/useMarkNotificationAsRead';
import { useMarkAllNotificationsAsRead } from '../../hooks/useMarkAllNotificationsAsRead';
import { useToast } from '../../hooks/use-toast';

interface NotificationsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationsSheet: React.FC<NotificationsSheetProps> = ({ isOpen, onOpenChange }) => {
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
        description:
          error?.response?.data?.message ||
          "Could not mark all notifications as read.",
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
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-sm">
            <Bell className="w-4 h-4" />
            Notifications
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-destructive rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </SheetTitle>
        
        </SheetHeader>

        <div className="flex-1 flex flex-col">
          {/* Mark All as Read Button */}
          {unreadCount > 0 && (
            <div className="mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="w-full text-xs"
              >
                <Check className="w-3 h-3 mr-2" />
                Mark all as read
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 flex flex-col">
            {isLoadingNotifications ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading notifications...</span>
              </div>
            ) : unreadNotifications.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <Bell className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-sm font-medium text-foreground mb-2">No notifications</h3>
                <p className="text-sm text-muted-foreground text-center">
                  You're all caught up! Check back later for new updates.
                </p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto">
                {unreadNotifications.map((notification) => (
                  <div 
                    key={notification._id} 
                    className="bg-card border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-xs font-semibold text-foreground mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="ml-2 h-6 w-6 p-0"
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </SheetContent>
    </Sheet>
  );
};

export default NotificationsSheet;
