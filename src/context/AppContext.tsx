import React, { useReducer, useMemo } from 'react';
import type { Plan } from '../types/business';
import { AppContext } from './context';
import type { AppState, AppAction, UserProfile, UserPreferences, Notification } from './types';

/**
 * Modern state management with Context and useReducer
 * Provides centralized state for the application with performance optimization
 */

// Initial state
const initialState: AppState = {
  user: {
    isAuthenticated: false,
    profile: null,
    preferences: {
      language: 'en',
      currency: 'USD',
      notifications: true,
      theme: 'light',
    },
  },
  plans: {
    data: null,
    loading: false,
    error: null,
  },
  ui: {
    theme: 'light',
    sidebarOpen: false,
    loading: false,
    notifications: [],
  },
  navigation: {
    currentSection: 'home',
    history: [],
  },
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: true,
          profile: action.payload,
        },
      };

    case 'LOGOUT':
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: false,
          profile: null,
        },
      };

    case 'SET_USER_PREFERENCES':
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ...action.payload,
          },
        },
      };

    case 'SET_PLANS_LOADING':
      return {
        ...state,
        plans: {
          ...state.plans,
          loading: true,
          error: null,
        },
      };

    case 'SET_PLANS_SUCCESS':
      return {
        ...state,
        plans: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };

    case 'SET_PLANS_ERROR':
      return {
        ...state,
        plans: {
          ...state.plans,
          loading: false,
          error: action.payload,
        },
      };

    case 'SET_THEME':
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: action.payload,
        },
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            theme: action.payload,
          },
        },
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen,
        },
      };

    case 'SET_LOADING':
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: action.payload,
        },
      };

    case 'ADD_NOTIFICATION': {
      const newNotification: Notification = {
        ...action.payload,
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        read: false,
      };
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [newNotification, ...state.ui.notifications].slice(0, 10), // Keep max 10 notifications
        },
      };
    }

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(n => n.id !== action.payload),
        },
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.map(n =>
            n.id === action.payload ? { ...n, read: true } : n
          ),
        },
      };

    case 'NAVIGATE_TO':
      return {
        ...state,
        navigation: {
          currentSection: action.payload,
          history: [action.payload, ...state.navigation.history].slice(0, 20), // Keep max 20 history items
        },
      };

    case 'GO_BACK':
      return {
        ...state,
        navigation: {
          ...state.navigation,
          currentSection: state.navigation.history[0] || state.navigation.currentSection,
          history: state.navigation.history.slice(1),
        },
      };

    default:
      return state;
  }
}

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Memoized action creators
  const actions = useMemo(() => ({
    setUser: (user: UserProfile) => dispatch({ type: 'SET_USER', payload: user }),
    
    logout: () => dispatch({ type: 'LOGOUT' }),
    
    updatePreferences: (preferences: Partial<UserPreferences>) => 
      dispatch({ type: 'SET_USER_PREFERENCES', payload: preferences }),
    
    loadPlans: async () => {
      dispatch({ type: 'SET_PLANS_LOADING' });
      try {
        // Mock API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockPlans: Plan[] = [
          {
            id: 'basic',
            name: 'Basic Plan',
            price: 50,
            duration: '12 months',
            features: ['Basic coverage', 'Emergency support'],
            featured: false,
            category: 'bronze' as const,
            benefits: {
              teleConsultation: true,
              hospitalDiscount: 10,
              medicineDiscount: 5,
              shopDiscount: 0,
              cashback: 0,
              lifeCoverage: { accidental: 10000, natural: 5000 }
            }
          }
        ];
        dispatch({ type: 'SET_PLANS_SUCCESS', payload: mockPlans });
      } catch {
        dispatch({ type: 'SET_PLANS_ERROR', payload: 'Failed to load plans' });
      }
    },
    
    setTheme: (theme: 'light' | 'dark') => dispatch({ type: 'SET_THEME', payload: theme }),
    
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) =>
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    
    removeNotification: (id: string) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    
    markNotificationAsRead: (id: string) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id }),
    
    navigateTo: (section: string) => {
      dispatch({ type: 'NAVIGATE_TO', payload: section });
      // Smooth scroll to section
      const element = document.getElementById(section.toLowerCase());
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    
    goBack: () => dispatch({ type: 'GO_BACK' }),
  }), []);

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    actions,
  }), [state, actions]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
