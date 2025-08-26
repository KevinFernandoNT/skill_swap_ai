import { useState, useEffect } from 'react';
import { User } from '../../types';
import SidebarDemo from '../ui/sidebar-demo-2';

interface SidebarProps {
  user?: User;
  isOpen: boolean;
  toggleSidebar: () => void;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  user: propUser, 
  isOpen, 
  toggleSidebar, 
  currentPage = 'dashboard',
  onNavigate 
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

  // Use prop user if provided, otherwise use current user from localStorage
  const user = propUser || currentUser;

  return (
    <div className="h-screen">
      <SidebarDemo 
        currentPage={currentPage}
        onNavigate={onNavigate}
        user={user}
      />
    </div>
  );
};

export default Sidebar;