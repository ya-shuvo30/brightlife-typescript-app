import { useContext, useMemo, useCallback } from 'react';
import { AppContext, type AppContextType } from './context';

/**
 * Custom hooks for accessing app context
 * Separated for Fast Refresh compatibility
 */

// Custom hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Specific hooks for common use cases
export const useUser = () => {
  const { state } = useAppContext();
  return useMemo(() => state.user, [state.user]);
};

export const usePlans = () => {
  const { state } = useAppContext();
  return useMemo(() => state.plans, [state.plans]);
};

export const useUI = () => {
  const { state } = useAppContext();
  return useMemo(() => state.ui, [state.ui]);
};

export const useNavigation = () => {
  const { state } = useAppContext();
  return useMemo(() => state.navigation, [state.navigation]);
};

// Async action hook
export const useAsyncActions = () => {
  const { actions } = useAppContext();
  
  const loadPlansWithNotification = useCallback(async () => {
    try {
      await actions.loadPlans();
      actions.addNotification({
        type: 'success',
        title: 'Plans Loaded',
        message: 'Health plans have been loaded successfully',
      });
    } catch {
      actions.addNotification({
        type: 'error',
        title: 'Loading Failed',
        message: 'Failed to load health plans. Please try again.',
      });
    }
  }, [actions]);

  return useMemo(() => ({
    loadPlansWithNotification,
  }), [loadPlansWithNotification]);
};
