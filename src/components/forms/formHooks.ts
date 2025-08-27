import React, { useContext, useCallback } from 'react';
import { FormContext } from './formContext';
import type { FieldValidator } from './formState';

/**
 * Form Hooks
 * Separated for Fast Refresh compatibility
 */

// Hook to use form context
export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

// Hook for individual field management
export const useField = (name: string, validators: FieldValidator[] = [], initialValue?: unknown) => {
  const {
    state,
    registerField,
    setValue,
    setTouched,
    validateField,
    getFieldValue,
    getFieldError,
    isFieldTouched,
    isFieldDirty,
    hasFieldError,
  } = useForm();

  // Register field on mount
  React.useEffect(() => {
    registerField(name, validators, initialValue);
  }, [name, validators, initialValue, registerField]);

  const field = state.fields[name];
  const value = getFieldValue(name) || '';
  const error = getFieldError(name);
  const touched = isFieldTouched(name);
  const dirty = isFieldDirty(name);
  const hasError = hasFieldError(name);

  const handleChange = useCallback((newValue: unknown) => {
    setValue(name, newValue);
  }, [name, setValue]);

  const handleBlur = useCallback(() => {
    setTouched(name, true);
  }, [name, setTouched]);

  const handleFocus = useCallback(() => {
    // Optional: implement focus handling
  }, []);

  const validate = useCallback(() => {
    validateField(name);
  }, [name, validateField]);

  return {
    value,
    error,
    touched,
    dirty,
    hasError,
    field,
    
    // Handlers
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    validate,
    
    // Props for input components
    inputProps: {
      value: value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        handleChange(e.target.value);
      },
      onBlur: handleBlur,
      onFocus: handleFocus,
      'aria-invalid': hasError,
      'aria-describedby': hasError ? `${name}-error` : undefined,
    },
  };
};
