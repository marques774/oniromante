export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DailyInsights {
  motivation: string;
  luckyNumber: number;
  luckyColor: string;
  wordOfDay: string;
  wordMeaning: string;
}

export enum Mood {
  Amazing = 'amazing',
  Good = 'good',
  Neutral = 'neutral',
  Bad = 'bad',
  Awful = 'awful'
}

export enum SleepQuality {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  Terrible = 'terrible'
}

export interface UserStatus {
  date: string; // ISO date string YYYY-MM-DD
  mood?: Mood;
  sleep?: SleepQuality;
  sleepNotes?: string;
}

export interface DreamAnalysis {
  spiritual: string;
  psychological: string;
  cultural: string;
  ritual: {
    title: string;
    steps: string[];
    duration?: 'quick' | 'deep';
  };
  dailyTheme: string;
  emotionalAlert: string;
  emotionsList?: {
    name: string;
    intensity: number; // 0-10
    meaning: string;
  }[];
  emotionalBalanceTip?: string;
}

export type ArtStyle = 'fantasy' | 'surreal' | 'watercolor' | 'cyberpunk' | 'minimalist' | 'oil';

export interface DreamEntry {
  id: string;
  date: string;
  originalText?: string;
  title: string;
  summary: string;
  characters: string[];
  places: string[];
  emotions: string[];
  symbols: string[];
  notes?: string;
  analysis?: DreamAnalysis;
  imageUrl?: string;
  imageStyle?: ArtStyle;
  socialCaption?: string;
  isNightmare?: boolean;
}

export interface SymbolDefinition {
  name: string;
  meaning: string;
  psychological?: string;
  spiritual?: string;
  cultural?: string;
  advice?: string;
}

export interface NightEnergy {
  message: string;
  breathing: string;
  intention: string;
  theme: 'stars' | 'moon' | 'void' | 'calm';
}

export interface LucidProgress {
  date: string;
  realityChecks: number; // count
  didMeditate: boolean;
  didJournal: boolean;
}
