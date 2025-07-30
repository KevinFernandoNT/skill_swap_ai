import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserProfileModal from './UserProfileModal';
import { User } from '../../types';
import { useGetUserStats } from '../../hooks/useGetUserStats';

// Mock the useGetUserStats hook
vi.mock('../../hooks/useGetUserStats');

const mockUser: User = {
  _id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg',
  skills: [
    {
      _id: 'skill-1',
      name: 'JavaScript',
      category: 'Programming',
      proficiency: 85,
      type: 'teaching',
      agenda: [],
    },
    {
      _id: 'skill-2',
      name: 'React',
      category: 'Programming',
      proficiency: 70,
      type: 'learning',
      agenda: [],
    },
  ],
  status: 'online',
  bio: 'Software developer with 5 years of experience',
  location: 'New York',
};

const mockUserStats = {
  user: {
    _id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
    status: 'online',
    location: 'New York',
    bio: 'Software developer with 5 years of experience',
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

describe('UserProfileModal', () => {
  const mockOnClose = vi.fn();
  const mockUseGetUserStats = vi.mocked(useGetUserStats);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGetUserStats.mockReturnValue({
      data: mockUserStats,
      isLoading: false,
    } as any);
  });

  it('should not render when isOpen is false', () => {
    render(
      <UserProfileModal
        user={mockUser}
        isOpen={false}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText('User Profile')).not.toBeInTheDocument();
  });

  it('should not render when user is null', () => {
    render(
      <UserProfileModal
        user={null}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText('User Profile')).not.toBeInTheDocument();
  });

  it('should render user profile when open', () => {
    render(
      <UserProfileModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
  });

  it('should display user avatar', () => {
    render(
      <UserProfileModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('should display user bio when available', () => {
    render(
      <UserProfileModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Software developer with 5 years of experience')).toBeInTheDocument();
  });

  it('should display teaching skills', () => {
    render(
      <UserProfileModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Skills that John Doe can teach')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Programming')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('should display learning skills', () => {
    render(
      <UserProfileModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Skills that John Doe wants to learn')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('should display user statistics', () => {
    render(
      <UserProfileModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('should show loading state for statistics', () => {
    mockUseGetUserStats.mockReturnValue({
      data: null,
      isLoading: true,
    } as any);

    render(
      <UserProfileModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Check for loading spinners
    const loadingSpinners = screen.getAllByRole('status');
    expect(loadingSpinners.length).toBeGreaterThan(0);
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <UserProfileModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', () => {
    render(
      <UserProfileModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const backdrop = screen.getByRole('presentation');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should handle user without bio', () => {
    const userWithoutBio = { ...mockUser, bio: undefined };
    mockUseGetUserStats.mockReturnValue({
      data: { ...mockUserStats, user: { ...mockUserStats.user, bio: undefined } },
      isLoading: false,
    } as any);

    render(
      <UserProfileModal
        user={userWithoutBio}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText('About')).not.toBeInTheDocument();
  });

  it('should handle user without location', () => {
    const userWithoutLocation = { ...mockUser, location: undefined };

    render(
      <UserProfileModal
        user={userWithoutLocation}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText('New York')).not.toBeInTheDocument();
  });

  it('should handle user without skills', () => {
    const userWithoutSkills = { ...mockUser, skills: [] };

    render(
      <UserProfileModal
        user={userWithoutSkills}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('No teaching skills listed yet.')).toBeInTheDocument();
    expect(screen.getByText('No learning goals listed yet.')).toBeInTheDocument();
  });

  it('should handle user with only teaching skills', () => {
    const userWithOnlyTeaching = {
      ...mockUser,
      skills: [mockUser.skills[0]], // Only JavaScript (teaching)
    };

    render(
      <UserProfileModal
        user={userWithOnlyTeaching}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('No learning goals listed yet.')).toBeInTheDocument();
  });

  it('should handle user with only learning skills', () => {
    const userWithOnlyLearning = {
      ...mockUser,
      skills: [mockUser.skills[1]], // Only React (learning)
    };

    render(
      <UserProfileModal
        user={userWithOnlyLearning}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('No teaching skills listed yet.')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });
}); 