import type { Plan } from '../types/business';
import type { AsyncState } from '../types/api';

/**
 * Context Types
 * Separated for better organization and Fast Refresh compatibility
 */

export interface AppState {
  user: {
    isAuthenticated: boolean;
    profile: UserProfile | null;
    preferences: UserPreferences;
  };
  plans: AsyncState<Plan[]>;
  ui: {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    loading: boolean;
    notifications: Notification[];
  };
  navigation: {
    currentSection: string;
    history: string[];
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  membershipType?: string;
}

export interface UserPreferences {
  language: 'en' | 'bn';
  currency: 'USD' | 'BDT';
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

// Action types
export type AppAction =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'SET_USER_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'SET_PLANS_LOADING' }
  | { type: 'SET_PLANS_SUCCESS'; payload: Plan[] }
  | { type: 'SET_PLANS_ERROR'; payload: string }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp' | 'read'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'NAVIGATE_TO'; payload: string }
  | { type: 'GO_BACK' };
