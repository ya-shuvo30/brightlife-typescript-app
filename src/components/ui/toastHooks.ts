import React, { useContext, useCallback } from 'react';

/**
 * Toast Hooks
 * Separated for Fast Refresh compatibility
 */

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

// Context will be created in Toast.tsx
export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Convenience hook for common toast types
export const useToastHelpers = () => {
  const { addToast } = useToast();

  const showSuccess = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({ type: 'success', title, message, ...options });
  }, [addToast]);

  const showError = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({ type: 'error', title, message, duration: 8000, ...options });
  }, [addToast]);

  const showWarning = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({ type: 'warning', title, message, ...options });
  }, [addToast]);

  const showInfo = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({ type: 'info', title, message, ...options });
  }, [addToast]);

  return { showSuccess, showError, showWarning, showInfo };
};
