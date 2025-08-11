import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SettingsPage from './SettingsPage';
import * as useAuth from '@/hooks/useAuth';

vi.mock('@/hooks/useAuth', () => ({
  useCurrentUser: vi.fn().mockReturnValue({ data: { name: 'Jane', email: 'jane@example.com', location: 'Seattle', avatar: '' }, refetch: vi.fn().mockResolvedValue({ data: { name: 'Jane Updated', email: 'jane@example.com', location: 'Seattle', avatar: '' } }) }),
  useUpdateProfile: vi.fn().mockReturnValue({ mutate: vi.fn((form: FormData) => {}) }),
  useChangePassword: vi.fn().mockReturnValue({ mutate: vi.fn() }),
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    // Reset localStorage mocks from setup
    localStorage.getItem = vi.fn().mockReturnValue(null);
    localStorage.setItem = vi.fn();
  });

  it('updates profile and preserves tokens + dispatches userUpdated', async () => {
    const setItemSpy = vi.spyOn(localStorage, 'setItem');
    localStorage.getItem = vi.fn((key: string) => {
      if (key === 'token') return 'access-token';
      if (key === 'stream_chat_token') return 'stream-token';
      return null as any;
    }) as any;

    const dispatched: any[] = [];
    const originalDispatch = window.dispatchEvent.bind(window);
    vi.spyOn(window, 'dispatchEvent').mockImplementation((event: any) => {
      dispatched.push(event);
      return originalDispatch(event);
    });

    render(<SettingsPage />);

    // Basic form present
    const nameInput = await screen.findByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: 'Jane Updated' } });

    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      // userUpdated dispatched
      expect(dispatched.some(d => d?.type === 'userUpdated')).toBe(true);
      // tokens preserved
      expect(setItemSpy).toHaveBeenCalledWith('token', 'access-token');
      expect(setItemSpy).toHaveBeenCalledWith('stream_chat_token', 'stream-token');
      // user replaced
      const userCalls = (setItemSpy.mock.calls as any[]).filter((c: any[]) => c[0] === 'user');
      expect(userCalls.length).toBeGreaterThan(0);
    });
  });
});


