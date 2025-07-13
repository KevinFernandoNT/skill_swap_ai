import { useState, useEffect } from 'react';
import { User, NavItem } from '../../types';
import { Home, Calendar, Lightbulb, MessageCircle, Settings, Menu, X, Users, ArrowRightLeft } from 'lucide-react';
import UserProfile from '../ui/UserProfile';
import { Logo } from '../common/Logo';
import { LogoWhite } from '../common/LogoWhite';

interface SidebarProps {
  user?: User; // Make user prop optional
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

  // Get current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
    }
  }, []);

  // Use prop user if provided, otherwise use current user from localStorage
  const user = propUser || currentUser;

  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: 'Home', path: 'dashboard', isActive: currentPage === 'dashboard' },
    { name: 'Sessions', icon: 'Calendar', path: 'sessions', isActive: currentPage === 'sessions' },
    { name: 'My Skills', icon: 'Lightbulb', path: 'skills', isActive: currentPage === 'skills' },
    { name: 'Connect', icon: 'Users', path: 'connect', isActive: currentPage === 'connect' },
    { name: 'Exchange Requests', icon: 'ArrowRightLeft', path: 'exchange-requests', isActive: currentPage === 'exchange-requests' },
    { name: 'Messages', icon: 'MessageCircle', path: 'messages', isActive: currentPage === 'messages' },
    { name: 'Settings', icon: 'Settings', path: 'settings', isActive: currentPage === 'settings' }
  ];

  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className={className} />;
      case 'Calendar':
        return <Calendar className={className} />;
      case 'Lightbulb':
        return <Lightbulb className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'ArrowRightLeft':
        return <ArrowRightLeft className={className} />;
      case 'MessageCircle':
        return <MessageCircle className={className} />;
      case 'Settings':
        return <Settings className={className} />;
      default:
        return <Home className={className} />;
    }
  };

  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2 bg-black border-b border-gray-800">
        <h1 className="text-lg font-bold text-primary">SkillSwap</h1>
        <button
          className="p-2 text-gray-400 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={toggleSidebar}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-black border-r border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
            <LogoWhite/>
            <button
              className="p-1 text-gray-400 rounded-md hover:bg-gray-800 lg:hidden"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-4 py-5 border-b border-gray-800">
            <UserProfile user={user} />
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            <h2 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Main Menu
            </h2>
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group ${
                  item.isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-400 hover:bg-primary/5 hover:text-primary'
                }`}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {renderIcon(item.icon, `${
                  item.isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'
                } mr-3 h-5 w-5 flex-shrink-0`)}
                {item.name}
              </button>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-gray-800">
            <h2 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Support
            </h2>
            <button
              onClick={() => handleNavClick('help')}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-400 rounded-md hover:bg-primary/5 hover:text-primary"
            >
              <span className="mr-3 h-5 w-5 text-gray-400">?</span>
              Help Center
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;