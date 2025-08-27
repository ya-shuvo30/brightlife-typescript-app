import React, { useReducer, useCallback } from 'react';
import { SimpleFormContext } from './simpleFormHooks.js';
import type { SimpleFormContextType, SimpleFormState } from './simpleFormHooks.js';

/**
 * Simple Form Provider 
 * Demonstrates form state management patterns
 */

type SimpleFormAction =
  | { type: 'SET_VALUE'; field: string; value: unknown }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'SET_TOUCHED'; field: string; touched: boolean }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET' };

const simpleFormReducer = (state: SimpleFormState, action: SimpleFormAction): SimpleFormState => {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: '' }, // Clear error when value changes
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: { ...state.touched, [action.field]: action.touched },
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting,
      };
    case 'RESET':
      return {
        values: {},
        errors: {},
        touched: {},
        isSubmitting: false,
      };
    default:
      return state;
  }
};

// SimpleFormContextType and SimpleFormContext are imported from simpleFormHooks

interface SimpleFormProviderProps {
  children: React.ReactNode;
  initialValues?: Record<string, unknown>;
}

export const SimpleFormProvider: React.FC<SimpleFormProviderProps> = ({ 
  children, 
  initialValues = {} 
}) => {
  const [state, dispatch] = useReducer(simpleFormReducer, {
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  const setValue = useCallback((field: string, value: unknown) => {
    dispatch({ type: 'SET_VALUE', field, value });
  }, []);

  const setError = useCallback((field: string, error: string) => {
    dispatch({ type: 'SET_ERROR', field, error });
  }, []);

  const setTouched = useCallback((field: string, touched: boolean) => {
    dispatch({ type: 'SET_TOUCHED', field, touched });
  }, []);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', isSubmitting });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const value: SimpleFormContextType = {
    state,
    setValue,
    setError,
    setTouched,
    setSubmitting,
    reset,
  };

  return (
    <SimpleFormContext.Provider value={value}>
      {children}
    </SimpleFormContext.Provider>
  );
};
