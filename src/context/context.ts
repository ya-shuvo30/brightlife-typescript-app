import { createContext } from 'react';
import type { AppState, AppAction, UserProfile, UserPreferences, Notification } from './types.js';

/**
 * App Context Definition
 * Separated for Fast Refresh compatibility
 */

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    setUser: (user: UserProfile) => void;
    logout: () => void;
    updatePreferences: (preferences: Partial<UserPreferences>) => void;
    loadPlans: () => Promise<void>;
    setTheme: (theme: 'light' | 'dark') => void;
    toggleSidebar: () => void;
    setLoading: (loading: boolean) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    removeNotification: (id: string) => void;
    markNotificationAsRead: (id: string) => void;
    navigateTo: (section: string) => void;
    goBack: () => void;
  };
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
