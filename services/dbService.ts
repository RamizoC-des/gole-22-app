import { MOCK_USERS, MOCK_POSTS, MOCK_SURVEYS } from '../constants';
import { User, Post, Survey, MockEmail } from '../types';

const DB_KEY = 'gole-kaab-db';

interface Database {
  users: { [key: string]: User };
  posts: Post[];
  surveys: Survey[];
  mockEmails: MockEmail[];
}

// Initialize the database in localStorage if it doesn't exist
export const initDB = () => {
  if (!localStorage.getItem(DB_KEY)) {
    console.log('Initializing database with mock data...');
    const initialData: Database = {
      users: MOCK_USERS,
      posts: MOCK_POSTS,
      surveys: MOCK_SURVEYS,
      mockEmails: [],
    };
    localStorage.setItem(DB_KEY, JSON.stringify(initialData));
  }
};

// Get the entire database from localStorage
export const getDB = (): Database => {
  const dbString = localStorage.getItem(DB_KEY);
  if (!dbString) {
    initDB();
    const newDbString = localStorage.getItem(DB_KEY);
    return JSON.parse(newDbString!);
  }
  return JSON.parse(dbString);
};

// Save the entire database to localStorage
export const saveDB = (db: Database) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};