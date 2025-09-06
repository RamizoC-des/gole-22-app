import React from 'react';
import { User } from '../../types';

interface UserCardProps {
  user: User;
  onViewProfile: () => void;
}

const defaultCover = 'https://picsum.photos/seed/default-cover/800/300';

const UserCard: React.FC<UserCardProps> = ({ user, onViewProfile }) => {
  const { name, avatar, coverPhoto, community } = user;
  
  const communityColorClasses = {
    Women: 'bg-indigo-200 text-indigo-800',
    Youth: 'bg-blue-200 text-blue-800',
    PWD: 'bg-cyan-200 text-cyan-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-2">
      <div className="relative">
        <div 
          className="h-24 bg-cover bg-center" 
          style={{ backgroundImage: `url(${coverPhoto || defaultCover})` }}
        />
        <div className="absolute top-12 left-1/2 -translate-x-1/2">
          <img 
            src={avatar} 
            alt={name} 
            className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
          />
        </div>
      </div>
      <div className="pt-12 p-4 text-center">
        <h3 className="text-lg font-bold text-gole-dark">{name}</h3>
        <p className={`mt-1 px-2 py-0.5 text-xs font-semibold rounded-full inline-block ${communityColorClasses[community]}`}>
          {community}
        </p>
        <button 
          onClick={onViewProfile}
          className="mt-4 w-full bg-gole-blue hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default UserCard;