import React from 'react';

/**
 * Simple Form Hook  
 * Separated for Fast Refresh compatibility
 */

interface SimpleFormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

interface SimpleFormContextType {
  state: SimpleFormState;
  setValue: (field: string, value: unknown) => void;
  setError: (field: string, error: string) => void;
  setTouched: (field: string, touched: boolean) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  reset: () => void;
}

const SimpleFormContext = React.createContext<SimpleFormContextType | null>(null);

export const useSimpleForm = (): SimpleFormContextType => {
  const context = React.useContext(SimpleFormContext);
  if (!context) {
    throw new Error('useSimpleForm must be used within a SimpleFormProvider');
  }
  return context;
};

export { SimpleFormContext };
export type { SimpleFormContextType, SimpleFormState };
