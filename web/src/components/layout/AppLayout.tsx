import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Dashboard from '../dashboard/Dashboard';
import MessagesPage from '../messages/MessagesPage';
import SessionsPage from '../sessions/SessionsPage';
import SettingsPage from '../settings/SettingsPage';
import SkillsPage from '../skills/SkillsPage';
import ConnectPage from '../sessions/ConnectPage';
import ExchangeRequestsPage from '../exchange/ExchangeRequestsPage';
import ExchangeSessionsPage from '../exchange/ExchangeSessionsPage';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  // Listen for navigation events from child components
  useEffect(() => {
    const handleNavigateEvent = (event: CustomEvent) => {
      const { tab } = event.detail;
      setCurrentPage(tab);
    };

    window.addEventListener('navigateToTab', handleNavigateEvent as EventListener);
    const onUserUpdated = () => setCurrentUser(JSON.parse(localStorage.getItem('user') || 'null'));
    window.addEventListener('userUpdated', onUserUpdated as EventListener);
    
    return () => {
      window.removeEventListener('navigateToTab', handleNavigateEvent as EventListener);
      window.removeEventListener('userUpdated', onUserUpdated as EventListener);
    };
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'messages':
        return <MessagesPage />;
      case 'sessions':
        return <SessionsPage />;
      case 'skills':
        return <SkillsPage />;
      case 'connect':
        return <ConnectPage />;
      case 'exchange-requests':
        return <ExchangeRequestsPage />;
      case 'exchange-sessions':
        return <ExchangeSessionsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-open-sans antialiased">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={currentUser}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-background">
          {children || renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;