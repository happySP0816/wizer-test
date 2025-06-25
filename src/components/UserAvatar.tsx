import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './components/ui/avatar';
import { UserRoundIcon } from './icons';

interface UserAvatarProps {
  user?: {
    image?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md', 
  className = '' 
}) => {
  // Get user info from session storage if not provided
  const getUserInfo = () => {
    if (user) return user;
    
    try {
      const userData = sessionStorage.getItem('userData');
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error parsing user data from session storage:', error);
    }
    
    return null;
  };

  const userInfo = getUserInfo();
  const avatarUrl = userInfo?.image;
  const userName = userInfo?.name || userInfo?.firstName || userInfo?.lastName || 'User';
  
  // Generate initials from name
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {avatarUrl ? (
        <AvatarImage 
          src={avatarUrl} 
          alt={userName}
          onError={(e) => {
            // Hide the image on error to show fallback
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      ) : null}
      <AvatarFallback className="bg-indigo-500/25 text-indigo-500">
        {avatarUrl ? (
          // Show initials if image fails to load
          <span className="text-sm font-medium">
            {getInitials(userName)}
          </span>
        ) : (
          // Show user icon if no image provided
          <UserRoundIcon size={iconSizes[size]} />
        )}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar; 