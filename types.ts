
export enum ViewMode {
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  VOICE = 'voice',
  SCENARIOS = 'scenarios',
  PRICING = 'pricing',
  EBOOKS = 'ebooks',
  COURSES = 'courses',
  YOUTUBE = 'youtube',
  ADMIN = 'admin'
}

export type Language = 'pt' | 'en' | 'es';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  timestamp: Date;
}

export interface Scenario {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: string;
  isPremium: boolean;
}

export interface EBook {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  price: string;
  image: string;
}

export interface Course {
  id: string;
  title: Record<Language, string>;
  modules: number;
  duration: string;
  image: string;
  isLocked: boolean;
}
