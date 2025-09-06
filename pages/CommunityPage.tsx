
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { User } from '../types';
import UserCard from '../components/Dashboard/UserCard';
import ProfileModal from '../components/Dashboard/ProfileModal';

const CommunityPage: React.FC = () => {
  const { users } = useData();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };
  
  // Filter out the AI bot from the list of users to display
  const communityUsers = Object.values(users).filter(user => user.id !== 'ai');

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gole-dark">Our Community</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {communityUsers.map(user => (
            <UserCard key={user.id} user={user} onViewProfile={() => handleViewProfile(user)} />
          ))}
        </div>
      </div>
      {selectedUser && (
        <ProfileModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default CommunityPage;
