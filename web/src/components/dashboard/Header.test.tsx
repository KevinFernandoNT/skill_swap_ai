import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from './Header';

// Mock the CreateSessionModal component
vi.mock('../sessions/CreateSessionModal', () => ({
  default: ({ isOpen, onClose, onSuccess }: any) => (
    isOpen ? (
      <div data-testid="create-session-modal">
        <button onClick={onClose}>Close Modal</button>
        <button onClick={onSuccess}>Create Session</button>
      </div>
    ) : null
  ),
}));

describe('Header', () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn().mockReturnValue(JSON.stringify({
        _id: 'current-user-id',
        name: 'Current User',
        email: 'current@example.com',
      })),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  it('should render welcome message with user name', () => {
    render(<Header />);

    expect(screen.getByText('Welcome back, Current')).toBeInTheDocument();
    expect(screen.getByText("Here's what's happening with your skill exchange today.")).toBeInTheDocument();
  });

  it('should render welcome message with "User" when no user data', () => {
    // Mock localStorage to return null
    const localStorageMock = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    render(<Header />);

    expect(screen.getByText('Welcome back, User')).toBeInTheDocument();
  });

  it('should render welcome message with "User" when user name is undefined', () => {
    // Mock localStorage to return user without name
    const localStorageMock = {
      getItem: vi.fn().mockReturnValue(JSON.stringify({
        _id: 'current-user-id',
        email: 'current@example.com',
      })),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    render(<Header />);

    expect(screen.getByText('Welcome back, User')).toBeInTheDocument();
  });

  it('should render connect button', () => {
    render(<Header />);

    const connectButton = screen.getByRole('button', { name: /connect/i });
    expect(connectButton).toBeInTheDocument();
    expect(connectButton).toHaveTextContent('Connect');
  });

  it('should render logout button', () => {
    render(<Header />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toHaveTextContent('Logout');
  });

  it('should open logout confirmation modal when logout button is clicked', () => {
    render(<Header />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to logout? You will need to log in again to access your dashboard.')).toBeInTheDocument();
  });

  it('should close logout modal when cancel is clicked', () => {
    render(<Header />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Confirm Logout')).not.toBeInTheDocument();
  });

  it('should handle logout when confirmed', () => {
    const mockClear = vi.fn();
    const mockLocation = { href: 'http://localhost:3000' };
    
    // Mock localStorage.clear
    const localStorageMock = {
      getItem: vi.fn().mockReturnValue(JSON.stringify({
        _id: 'current-user-id',
        name: 'Current User',
        email: 'current@example.com',
      })),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: mockClear,
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
    });

    render(<Header />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    const confirmButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(confirmButton);

    expect(mockClear).toHaveBeenCalled();
    expect(mockLocation.href).toBe('/login');
  });

  it('should render notifications button', () => {
    render(<Header />);

    const notificationsButton = screen.getByRole('button', { name: /notifications/i });
    expect(notificationsButton).toBeInTheDocument();
  });

  it('should show notification badge', () => {
    render(<Header />);

    const notificationBadge = screen.getByText('2');
    expect(notificationBadge).toBeInTheDocument();
  });

  it('should toggle notifications dropdown when notifications button is clicked', () => {
    render(<Header />);

    const notificationsButton = screen.getByRole('button', { name: /notifications/i });
    
    // Initially, notifications dropdown should not be visible
    expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
    
    // Click to open
    fireEvent.click(notificationsButton);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Sarah accepted your session request')).toBeInTheDocument();
    expect(screen.getByText('New feedback on your JavaScript session')).toBeInTheDocument();
    expect(screen.getByText('Reminder: Python session with Michael tomorrow')).toBeInTheDocument();
    
    // Click to close
    fireEvent.click(notificationsButton);
    expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
  });

  it('should render mobile create session button', () => {
    render(<Header />);

    const mobileCreateButton = screen.getByRole('button', { name: /create new session/i });
    expect(mobileCreateButton).toBeInTheDocument();
  });

  it('should open create session modal when mobile create button is clicked', () => {
    render(<Header />);

    const mobileCreateButton = screen.getByRole('button', { name: /create new session/i });
    fireEvent.click(mobileCreateButton);

    expect(screen.getByTestId('create-session-modal')).toBeInTheDocument();
  });

  it('should close create session modal when close is clicked', () => {
    render(<Header />);

    const mobileCreateButton = screen.getByRole('button', { name: /create new session/i });
    fireEvent.click(mobileCreateButton);

    const closeButton = screen.getByText('Close Modal');
    fireEvent.click(closeButton);

    expect(screen.queryByTestId('create-session-modal')).not.toBeInTheDocument();
  });

  it('should handle session creation', () => {
    render(<Header />);

    const mobileCreateButton = screen.getByRole('button', { name: /create new session/i });
    fireEvent.click(mobileCreateButton);

    const createButton = screen.getByText('Create Session');
    fireEvent.click(createButton);

    expect(screen.queryByTestId('create-session-modal')).not.toBeInTheDocument();
  });
}); 