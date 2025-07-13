import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Dashboard from '../dashboard/Dashboard';
import MessagesPage from '../messages/MessagesPage';
import SessionsPage from '../sessions/SessionsPage';
import SettingsPage from '../settings/SettingsPage';
import SkillsPage from '../skills/SkillsPage';
import ConnectPage from '../sessions/ConnectPage';
import ExchangeRequestsPage from '../exchange/ExchangeRequestsPage';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

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
    
    return () => {
      window.removeEventListener('navigateToTab', handleNavigateEvent as EventListener);
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
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans antialiased">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children || renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;