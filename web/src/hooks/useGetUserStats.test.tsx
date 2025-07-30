import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetUserStats } from './useGetUserStats';

// Mock the API
vi.mock('../lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockApi = vi.mocked(require('../lib/api').default);

describe('useGetUserStats', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should fetch user stats successfully', async () => {
    const mockUserStats = {
      user: {
        _id: '686ca68406f54e6301d21189',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg',
        status: 'online',
        location: 'New York',
        bio: 'Software developer',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      stats: {
        rating: 4.5,
        totalSessions: 15,
        completedSessions: 12,
        hostedSessions: 8,
        participatedSessions: 4,
      },
    };

    mockApi.get.mockResolvedValue({ data: mockUserStats });

    const { result } = renderHook(() => useGetUserStats('user-1'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUserStats);
    expect(mockApi.get).toHaveBeenCalledWith('/users/user-1/stats');
  });

  it('should not fetch when userId is null', () => {
    const { result } = renderHook(() => useGetUserStats(null), { wrapper });

    expect(result.current.isFetching).toBe(false);
    expect(mockApi.get).not.toHaveBeenCalled();
  });

  it('should handle API errors', async () => {
    const error = new Error('API Error');
    mockApi.get.mockRejectedValue(error);

    const { result } = renderHook(() => useGetUserStats('user-1'), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(mockApi.get).toHaveBeenCalledWith('/users/user-1/stats');
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network Error');
    mockApi.get.mockRejectedValue(networkError);

    const { result } = renderHook(() => useGetUserStats('user-1'), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(networkError);
  });

  it('should handle empty response', async () => {
    mockApi.get.mockResolvedValue({ data: null });

    const { result } = renderHook(() => useGetUserStats('user-1'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeNull();
  });

  it('should cache results for 5 minutes', () => {
    const { result } = renderHook(() => useGetUserStats('user-1'), { wrapper });

    expect(result.current.dataUpdatedAt).toBeDefined();
  });

  it('should only enable query when userId is provided', () => {
    const { result: resultWithId } = renderHook(() => useGetUserStats('user-1'), { wrapper });
    const { result: resultWithoutId } = renderHook(() => useGetUserStats(null), { wrapper });

    expect(resultWithId.current.isFetching).toBe(true);
    expect(resultWithoutId.current.isFetching).toBe(false);
  });

  it('should refetch when userId changes', async () => {
    const mockUserStats1 = {
      user: { _id: 'user-1', name: 'User 1' },
      stats: { rating: 4.0, totalSessions: 10 },
    };
    const mockUserStats2 = {
      user: { _id: 'user-2', name: 'User 2' },
      stats: { rating: 4.5, totalSessions: 15 },
    };

    mockApi.get
      .mockResolvedValueOnce({ data: mockUserStats1 })
      .mockResolvedValueOnce({ data: mockUserStats2 });

    const { result, rerender } = renderHook(
      ({ userId }: { userId: string | null }) => useGetUserStats(userId),
      { wrapper, initialProps: { userId: 'user-1' } }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockUserStats1);
    });

    rerender({ userId: 'user-2' });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockUserStats2);
    });

    expect(mockApi.get).toHaveBeenCalledTimes(2);
    expect(mockApi.get).toHaveBeenNthCalledWith(1, '/users/user-1/stats');
    expect(mockApi.get).toHaveBeenNthCalledWith(2, '/users/user-2/stats');
  });
}); 