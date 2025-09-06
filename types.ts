export enum Language {
  EN = 'en',
  SW = 'sw',
  SO = 'so',
}

export type User = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverPhoto: string;
  community: 'Youth' | 'Women' | 'PWD';
  bio: string;
  location?: string;
  interests?: string[];
  socialLinks: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    email?: string;
    phone?: string;
  };
  isConfirmed?: boolean;
  confirmationCode?: string;
};

export type Comment = {
  id: string;
  user: User;
  content: string;
  isAI?: boolean;
};

export type PollOption = {
  id: string;
  text: string;
  votes: string[]; // Array of user IDs who voted
};

export type Post = {
  id:string;
  user: User;
  type: 'text' | 'image' | 'report' | 'poll';
  content: string;
  pollOptions?: PollOption[];
  imageUrl?: string;
  comments: Comment[];
  likes: string[]; // Array of user IDs who liked
  shares: number;
  createdAt: string;
};

export type NewPost = {
  type: 'text' | 'image' | 'poll';
  content: string;
  imageUrl?: string;
  pollOptions?: string[];
}

export type TranslatedStrings = {
  [key: string]: {
    [lang in Language]: string;
  };
};

export type StatCardData = {
  titleKey: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export type ParticipationData = {
  name: string;
  Youth: number;
  Women: number;
  PWD: number;
}

export type SurveyOption = {
  id: string;
  text: string;
  votes: number;
};

export type Survey = {
  id: string;
  title: string;
  question: string;
  options: SurveyOption[];
  createdBy: string; // user id
};

export type MockEmail = {
  id: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
};