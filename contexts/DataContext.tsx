import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Post, Survey, Comment, NewPost, MockEmail } from '../types';
import { getDB, saveDB } from '../services/dbService';

type LoginResult = 'success' | 'not_confirmed' | 'failed';

interface DataContextType {
  users: { [key: string]: User };
  currentUser: User;
  posts: Post[];
  surveys: Survey[];
  mockEmails: MockEmail[];
  getMockEmailsFor: (email: string) => MockEmail[];
  updateUser: (updatedUser: User) => void;
  addComment: (postId: string, comment: Comment) => void;
  toggleLike: (postId: string, userId: string) => void;
  addSurvey: (survey: Survey) => void;
  addPost: (post: NewPost) => void;
  signUpUser: (details: { name: string; email: string; community: 'Youth' | 'Women' | 'PWD' }) => string;
  loginUser: (email: string) => LoginResult;
  confirmUser: (email: string, code: string) => boolean;
  resendConfirmationCode: (email: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<{ [key: string]: User } | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [surveys, setSurveys] = useState<Survey[] | null>(null);
  const [mockEmails, setMockEmails] = useState<MockEmail[] | null>(null);

  useEffect(() => {
    const db = getDB();
    setUsers(db.users);
    setPosts(db.posts);
    setSurveys(db.surveys);
    setMockEmails(db.mockEmails || []);
  }, []);

  const saveData = (newData: Partial<{ users: { [key: string]: User }, posts: Post[], surveys: Survey[], mockEmails: MockEmail[] }>) => {
    const currentDB = getDB();
    const newDB = { ...currentDB, ...newData };
    saveDB(newDB);
  };
  
  const updateUser = (updatedUser: User) => {
    setUsers(prevUsers => {
      if (!prevUsers) return null;
      const newUsers = { ...prevUsers };
      // Also update the currentUser key if that's the user being updated
      if (updatedUser.id === newUsers.currentUser.id) {
          newUsers.currentUser = updatedUser;
      }
      const userKey = Object.keys(newUsers).find(key => newUsers[key].id === updatedUser.id);
      if (userKey) {
        newUsers[userKey] = updatedUser;
        saveData({ users: newUsers });
      }
      return newUsers;
    });
  };

  const addComment = (postId: string, comment: Comment) => {
      setPosts(prevPosts => {
          if (!prevPosts) return null;
          const newPosts = prevPosts.map(p => {
              if (p.id === postId) {
                  return { ...p, comments: [...p.comments, comment] };
              }
              return p;
          });
          saveData({ posts: newPosts });
          return newPosts;
      });
  };

  const toggleLike = (postId: string, userId: string) => {
      setPosts(prevPosts => {
          if (!prevPosts) return null;
          const newPosts = prevPosts.map(p => {
              if (p.id === postId) {
                  const isLiked = p.likes.includes(userId);
                  const newLikes = isLiked
                      ? p.likes.filter(id => id !== userId)
                      : [...p.likes, userId];
                  return { ...p, likes: newLikes };
              }
              return p;
          });
          saveData({ posts: newPosts });
          return newPosts;
      });
  };

  const addSurvey = (survey: Survey) => {
      setSurveys(prevSurveys => {
          if (!prevSurveys) return null;
          const newSurveys = [survey, ...prevSurveys];
          saveData({ surveys: newSurveys });
          return newSurveys;
      });
  };

  const addPost = (newPostData: NewPost) => {
      setPosts(prevPosts => {
          if (!prevPosts || !users) return null;
          
          const post: Post = {
              id: `p${Date.now()}`,
              user: users.currentUser,
              type: newPostData.type,
              content: newPostData.content,
              imageUrl: newPostData.imageUrl,
              pollOptions: newPostData.pollOptions?.map((opt, i) => ({ id: `o${i}`, text: opt, votes: [] })),
              createdAt: 'Just now',
              likes: [],
              shares: 0,
              comments: [],
          };
          
          const newPosts = [post, ...prevPosts];
          saveData({ posts: newPosts });
          return newPosts;
      });
  };
  
  const signUpUser = (details: { name: string; email: string; community: 'Youth' | 'Women' | 'PWD' }): string => {
    if (!users || !mockEmails) {
      console.error("Data not loaded, can't sign up user.");
      return '';
    }

    const code = generateCode();
    const newId = `u${Date.now()}`;
    const username = details.name.toLowerCase().replace(/\s/g, '_') + Math.floor(Math.random() * 100);

    const newUser: User = {
      id: newId,
      name: details.name,
      username: username,
      avatar: `https://picsum.photos/seed/${newId}/100/100`,
      coverPhoto: `https://picsum.photos/seed/${newId}-cover/800/300`,
      community: details.community,
      bio: `A new member of the Gole Kaab ${details.community} community.`,
      socialLinks: { email: details.email },
      isConfirmed: false,
      confirmationCode: code,
    };

    const newEmail: MockEmail = {
      id: `m${Date.now()}`,
      to: details.email,
      subject: `Your Gole Kaab Confirmation Code`,
      body: `Hello,\n\nYour confirmation code is: ${code}\n\nEnter this code to complete your registration.`,
      timestamp: new Date().toISOString(),
    };

    const newUsers = { ...users, [newId]: newUser };
    const newMockEmails = [newEmail, ...mockEmails];

    setUsers(newUsers);
    setMockEmails(newMockEmails);

    saveData({ users: newUsers, mockEmails: newMockEmails });
    
    return details.email;
  };

  const loginUser = (email: string): LoginResult => {
    if (!users) return 'failed';
    
    const userToLogin = Object.values(users).find(u => u.socialLinks.email === email);

    if (userToLogin) {
        if (!userToLogin.isConfirmed) {
            return 'not_confirmed';
        }
        setUsers(prevUsers => {
            if (!prevUsers) return null;
            const newUsers = { ...prevUsers, currentUser: userToLogin };
            saveData({ users: newUsers });
            return newUsers;
        });
        return 'success';
    }
    return 'failed';
  };

  const confirmUser = (email: string, code: string): boolean => {
    const db = getDB();
    const userToConfirm = Object.values(db.users).find(u => u.socialLinks.email === email);

    if (userToConfirm && userToConfirm.confirmationCode === code) {
      userToConfirm.isConfirmed = true;
      delete userToConfirm.confirmationCode;

      const userKey = Object.keys(db.users).find(key => db.users[key].id === userToConfirm.id);
      if (userKey) {
        const newUsers = {
          ...db.users,
          [userKey]: userToConfirm,
          currentUser: userToConfirm,
        };
        setUsers(newUsers);
        saveData({ users: newUsers });
        return true;
      }
    }
    return false;
  };
  
  const resendConfirmationCode = (email: string) => {
    if (!users || !mockEmails) return;

    const userToUpdateKey = Object.keys(users).find(key => users[key].socialLinks.email === email);
    if (!userToUpdateKey) return;

    const userToUpdate = users[userToUpdateKey];
    
    const newCode = generateCode();
    
    const updatedUser = { ...userToUpdate, confirmationCode: newCode };
    const newUsers = { ...users, [userToUpdateKey]: updatedUser };
    
    const newEmail: MockEmail = {
        id: `m${Date.now()}`,
        to: email,
        subject: `Your New Gole Kaab Confirmation Code`,
        body: `Hello,\n\nYour new confirmation code is: ${newCode}\n\nEnter this code to complete your registration.`,
        timestamp: new Date().toISOString(),
    };
    
    const newMockEmails = [newEmail, ...mockEmails];

    setUsers(newUsers);
    setMockEmails(newMockEmails);
    saveData({ users: newUsers, mockEmails: newMockEmails });

    console.log(`A new confirmation code (${newCode}) has been sent to ${email}.`);
  };
  
  const getMockEmailsFor = (email: string): MockEmail[] => {
    return (mockEmails || []).filter(m => m.to === email);
  };

  if (!users || !posts || !surveys || !mockEmails) {
     return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-gole-blue border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  const value: DataContextType = {
      users,
      currentUser: users.currentUser,
      posts,
      surveys,
      mockEmails,
      getMockEmailsFor,
      updateUser,
      addComment,
      toggleLike,
      addSurvey,
      addPost,
      signUpUser,
      loginUser,
      confirmUser,
      resendConfirmationCode,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};