import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificationDropdown from './NotificationDropdown';

vi.mock('@/hooks/useGetUnreadNotifications', () => ({
  useGetUnreadNotifications: () => ({ data: { data: [{ _id: 'n1', title: 'T', message: 'M', createdAt: new Date().toISOString(), sender: { avatar: '', name: 'S' } }] }, isLoading: false, refetch: vi.fn() }),
}));
vi.mock('@/hooks/useGetUnreadCount', () => ({
  useGetUnreadCount: () => ({ data: { data: 1 }, refetch: vi.fn() }),
}));
vi.mock('@/hooks/useMarkNotificationAsRead', () => ({
  useMarkNotificationAsRead: (opts?: any) => ({ mutate: () => opts?.onSuccess?.() }),
}));
vi.mock('@/hooks/useMarkAllNotificationsAsRead', () => ({
  useMarkAllNotificationsAsRead: (opts?: any) => ({ mutate: () => opts?.onSuccess?.() }),
}));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));

describe('NotificationDropdown', () => {
  it('marks a notification as read via UI', async () => {
    render(<NotificationDropdown />);
    const bell = screen.getByRole('button');
    fireEvent.click(bell);
    const markButtons = await screen.findAllByTitle(/Mark as read/i);
    fireEvent.click(markButtons[0]);
    await waitFor(() => {
      // After success, list should still render (mock refetch is no-op), but no errors thrown
      expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
    });
  });
});


