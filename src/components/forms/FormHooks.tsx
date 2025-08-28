import React, { useContext } from 'react';
import { FormContext, type FormContextType } from './FormContext';
import type { FieldValidator } from './formState';

// Hook to use form context
export const useForm = (): FormContextType => {
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

  const handleChange = (newValue: unknown) => {
    setValue(name, newValue);
    validateField(name);
  };

  const handleBlur = () => {
    setTouched(name, true);
    validateField(name);
  };

  const handleFocus = () => {
    setTouched(name, true);
  };

  return {
    field,
    value,
    error,
    touched,
    dirty,
    hasError,
    handleChange,
    handleBlur,
    handleFocus,
    setValue: (newValue: unknown) => setValue(name, newValue),
    setTouched: (isTouched: boolean) => setTouched(name, isTouched),
    validate: () => validateField(name),
  };
};
