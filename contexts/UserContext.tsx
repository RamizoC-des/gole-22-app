import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';

interface UserContextType {
  users: { [key: string]: User };
  currentUser: User;
  updateUser: (updatedUser: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_DATA_SESSION_KEY = 'gole-kaab-users';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<{ [key: string]: User }>(() => {
    try {
      const storedUsers = sessionStorage.getItem(USER_DATA_SESSION_KEY);
      if (storedUsers) {
        return JSON.parse(storedUsers);
      }
    } catch (error) {
      console.error("Could not parse user data from sessionStorage", error);
    }
    return MOCK_USERS;
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(USER_DATA_SESSION_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Could not save user data to sessionStorage", error);
    }
  }, [users]);

  const updateUser = (updatedUser: User) => {
    setUsers(prevUsers => {
      const newUsers = { ...prevUsers };
      const userKey = Object.keys(newUsers).find(key => newUsers[key].id === updatedUser.id);
      if (userKey) {
        newUsers[userKey] = updatedUser;
      }
      return newUsers;
    });
  };
  
  const currentUser = users.currentUser;

  return (
    <UserContext.Provider value={{ users, currentUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
