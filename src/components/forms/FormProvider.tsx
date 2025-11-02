import React, { useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import { formReducer } from './formState';
import type { FormState, FieldValidator, FieldError } from './formState';
import { FormContext, type FormContextType } from './formContext';

/**
 * Form Context and Provider
 * Manages form state and provides form utilities
 */

// Initial form state
const initialFormState: FormState = {
  fields: {},
  isValid: true,
  isSubmitting: false,
  isSubmitted: false,
  errors: {},
  touchedFields: new Set(),
  dirtyFields: new Set(),
};

// Form provider props
export interface FormProviderProps {
  children: ReactNode;
  onSubmit?: (values: Record<string, unknown>) => void | Promise<void>;
  initialValues?: Record<string, unknown>;
}

// Form provider component
export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  onSubmit,
  initialValues = {},
}) => {
  const [state, dispatch] = useReducer(formReducer, {
    ...initialFormState,
    // Initialize with initial values if provided
    fields: Object.entries(initialValues).reduce((acc, [name, value]) => {
      acc[name] = {
        value,
        touched: false,
        dirty: false,
        validators: [],
        error: undefined,
      };
      return acc;
    }, {} as FormState['fields']),
  });

  // Field management
  const registerField = useCallback((name: string, validators: FieldValidator[], initialValue?: unknown) => {
    const value = initialValue !== undefined ? initialValue : initialValues[name] || '';
    dispatch({
      type: 'REGISTER_FIELD',
      payload: { name, validators, initialValue: value },
    });
  }, [initialValues]);

  const setValue = useCallback((name: string, value: unknown) => {
    dispatch({ type: 'SET_FIELD_VALUE', payload: { name, value } });
  }, []);

  const setError = useCallback((name: string, error: FieldError | null) => {
    dispatch({ type: 'SET_FIELD_ERROR', payload: { name, error } });
  }, []);

  const setTouched = useCallback((name: string, touched: boolean) => {
    dispatch({ type: 'SET_FIELD_TOUCHED', payload: { name, touched } });
  }, []);

  // Validation
  const validateField = useCallback((name: string) => {
    dispatch({ type: 'VALIDATE_FIELD', payload: { name } });
  }, []);

  const validateAllFields = useCallback(() => {
    dispatch({ type: 'VALIDATE_ALL_FIELDS' });
  }, []);

  // Form state
  const setSubmitting = useCallback((submitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', payload: submitting });
  }, []);

  const setSubmitted = useCallback((submitted: boolean) => {
    dispatch({ type: 'SET_SUBMITTED', payload: submitted });
  }, []);

  const reset = useCallback((newState?: Partial<FormState>) => {
    dispatch({ type: 'RESET_FORM', payload: newState });
  }, []);

  // Utilities
  const getFieldValue = useCallback((name: string) => {
    return state.fields[name]?.value;
  }, [state.fields]);

  const getFieldError = useCallback((name: string) => {
    return state.fields[name]?.error;
  }, [state.fields]);

  const isFieldTouched = useCallback((name: string) => {
    return state.fields[name]?.touched || false;
  }, [state.fields]);

  const isFieldDirty = useCallback((name: string) => {
    return state.fields[name]?.dirty || false;
  }, [state.fields]);

  const hasFieldError = useCallback((name: string) => {
    return !!state.fields[name]?.error;
  }, [state.fields]);

  // Form submission handler
  const handleSubmit = useCallback(async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    // Validate all fields before submission
    validateAllFields();

    // Wait for validation to complete
    const updatedState = { ...state };
    const hasErrors = Object.values(updatedState.fields).some(field => field.error);

    if (hasErrors) {
      return;
    }

    if (onSubmit) {
      setSubmitting(true);
      try {
        const values = Object.entries(updatedState.fields).reduce((acc, [name, field]) => {
          acc[name] = field.value;
          return acc;
        }, {} as Record<string, unknown>);

        await onSubmit(values);
        setSubmitted(true);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setSubmitting(false);
      }
    }
  }, [state, validateAllFields, onSubmit, setSubmitting, setSubmitted]);

  const contextValue: FormContextType = {
    state,
    registerField,
    setValue,
    setError,
    setTouched,
    validateField,
    validateAllFields,
    setSubmitting,
    setSubmitted,
    reset,
    getFieldValue,
    getFieldError,
    isFieldTouched,
    isFieldDirty,
    hasFieldError,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit} noValidate>
        {children}
      </form>
    </FormContext.Provider>
  );
};
