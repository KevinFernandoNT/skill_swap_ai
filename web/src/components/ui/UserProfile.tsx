import { User } from '../../types';

interface UserProfileProps {
  user: User;
  showEmail?: boolean;
  onClick?: () => void;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  showEmail = true, 
  onClick,
  className = ""
}) => {
  return (
    <div 
      className={`flex items-center space-x-3 ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={user?.avatar}
          alt={user?.name}
          className="h-10 w-10 rounded-full object-cover"
        />
       
      </div>
      <div>
        <p className="text-sm font-medium text-white">{user?.name}</p>
        {showEmail && (
          <p className="text-xs text-gray-400">{user?.email}</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;