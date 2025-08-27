import { createContext } from 'react';
import type { FormState, FieldValidator, FieldError } from './formState';

/**
 * Form Context
 * Separated for Fast Refresh compatibility
 */

// Form context interface
export interface FormContextType {
  state: FormState;
  
  // Field management
  registerField: (name: string, validators: FieldValidator[], initialValue?: unknown) => void;
  setValue: (name: string, value: unknown) => void;
  setError: (name: string, error: FieldError | null) => void;
  setTouched: (name: string, touched: boolean) => void;
  
  // Validation
  validateField: (name: string) => void;
  validateAllFields: () => void;
  
  // Form state
  setSubmitting: (submitting: boolean) => void;
  setSubmitted: (submitted: boolean) => void;
  reset: (newState?: Partial<FormState>) => void;
  
  // Utilities
  getFieldValue: (name: string) => unknown;
  getFieldError: (name: string) => FieldError | undefined;
  isFieldTouched: (name: string) => boolean;
  isFieldDirty: (name: string) => boolean;
  hasFieldError: (name: string) => boolean;
}

// Form context
export const FormContext = createContext<FormContextType | undefined>(undefined);
