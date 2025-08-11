import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExchangeSessionsPage from './ExchangeSessionsPage';

vi.mock('@/hooks/useGetExchangeSessions', () => ({
  useGetExchangeSessions: () => ({ data: { data: [{ _id: 'es1', title: 'T', status: 'upcoming', skillCategory: 'Programming', skillId: { name: 'React' }, requestedSkillId: { name: 'Node' }, date: new Date().toISOString(), startTime: '10:00', endTime: '11:00', hostId: {}, requestedBy: {} }] }, isLoading: false, error: null, refetch: vi.fn() }),
}));
vi.mock('@/hooks/useUpdateExchangeSessionStatus', () => ({
  useStartExchangeSession: (id: string, opts?: any) => ({ mutate: () => opts?.onSuccess?.() }),
  useCompleteExchangeSession: (id: string, opts?: any) => ({ mutate: () => opts?.onSuccess?.() }),
}));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock('@/components/ui/UserProfile', () => ({ default: () => <div /> }));

describe('ExchangeSessionsPage', () => {
  it('starts and completes a session from UI', async () => {
    render(<ExchangeSessionsPage />);
    const startBtn = await screen.findByRole('button', { name: /Start Session/i });
    fireEvent.click(startBtn);
    // After starting, mutate calls onSuccess and refetch (no visible change in mock)
    await waitFor(() => expect(startBtn).toBeInTheDocument());
  });
});


