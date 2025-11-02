/**
 * Form State Management
 * Centralized form state with validation
 */

export interface FieldError {
  message: string;
  type: 'required' | 'pattern' | 'min' | 'max' | 'minLength' | 'maxLength' | 'custom';
}

export interface FormField<T = unknown> {
  value: T;
  error?: FieldError;
  touched: boolean;
  dirty: boolean;
  validators: FieldValidator<T>[];
}

export interface FieldValidator<T = unknown> {
  validate: (value: T) => FieldError | null;
  trigger?: 'onChange' | 'onBlur' | 'onSubmit';
}

export interface FormState {
  fields: Record<string, FormField>;
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: Record<string, FieldError>;
  touchedFields: Set<string>;
  dirtyFields: Set<string>;
}

// Form Actions
export type FormAction = 
  | { type: 'SET_FIELD_VALUE'; payload: { name: string; value: unknown } }
  | { type: 'SET_FIELD_ERROR'; payload: { name: string; error: FieldError | null } }
  | { type: 'SET_FIELD_TOUCHED'; payload: { name: string; touched: boolean } }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_SUBMITTED'; payload: boolean }
  | { type: 'VALIDATE_FIELD'; payload: { name: string } }
  | { type: 'VALIDATE_ALL_FIELDS' }
  | { type: 'RESET_FORM'; payload?: Partial<FormState> }
  | { type: 'REGISTER_FIELD'; payload: { name: string; validators: FieldValidator[]; initialValue?: unknown } };

// Built-in validators
export const validators = {
  required: (message = 'This field is required'): FieldValidator => ({
    validate: (value) => {
      if (value === null || value === undefined || value === '' || 
          (Array.isArray(value) && value.length === 0)) {
        return { message, type: 'required' };
      }
      return null;
    },
    trigger: 'onBlur',
  }),

  email: (message = 'Please enter a valid email address'): FieldValidator<string> => ({
    validate: (value) => {
      if (!value) return null;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { message, type: 'pattern' };
      }
      return null;
    },
    trigger: 'onBlur',
  }),

  minLength: (min: number, message?: string): FieldValidator<string> => ({
    validate: (value) => {
      if (!value) return null;
      if (value.length < min) {
        return {
          message: message || `Must be at least ${min} characters`,
          type: 'minLength',
        };
      }
      return null;
    },
    trigger: 'onBlur',
  }),

  maxLength: (max: number, message?: string): FieldValidator<string> => ({
    validate: (value) => {
      if (!value) return null;
      if (value.length > max) {
        return {
          message: message || `Must be no more than ${max} characters`,
          type: 'maxLength',
        };
      }
      return null;
    },
    trigger: 'onChange',
  }),

  pattern: (regex: RegExp, message = 'Invalid format'): FieldValidator<string> => ({
    validate: (value) => {
      if (!value) return null;
      if (!regex.test(value)) {
        return { message, type: 'pattern' };
      }
      return null;
    },
    trigger: 'onBlur',
  }),

  min: (minimum: number, message?: string): FieldValidator<string | number> => ({
    validate: (value) => {
      if (value === null || value === undefined || value === '') return null;
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < minimum) {
        return {
          message: message || `Must be at least ${minimum}`,
          type: 'min',
        };
      }
      return null;
    },
    trigger: 'onBlur',
  }),

  max: (maximum: number, message?: string): FieldValidator<string | number> => ({
    validate: (value) => {
      if (value === null || value === undefined || value === '') return null;
      const numValue = Number(value);
      if (isNaN(numValue) || numValue > maximum) {
        return {
          message: message || `Must be no more than ${maximum}`,
          type: 'max',
        };
      }
      return null;
    },
    trigger: 'onBlur',
  }),

  custom: <T>(validatorFn: (value: T) => string | null): FieldValidator<T> => ({
    validate: (value) => {
      const result = validatorFn(value);
      if (result) {
        return { message: result, type: 'custom' };
      }
      return null;
    },
    trigger: 'onBlur',
  }),
};

// Form reducer
export const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'REGISTER_FIELD': {
      const { name, validators: fieldValidators, initialValue = '' } = action.payload;
      return {
        ...state,
        fields: {
          ...state.fields,
          [name]: {
            value: initialValue,
            touched: false,
            dirty: false,
            validators: fieldValidators,
            error: undefined,
          },
        },
      };
    }

    case 'SET_FIELD_VALUE': {
      const { name, value } = action.payload;
      const field = state.fields[name];
      if (!field) return state;

      const newDirtyFields = new Set(state.dirtyFields);
      newDirtyFields.add(name);

      // Validate on change if any validator has onChange trigger
      const onChangeValidators = field.validators.filter(v => v.trigger === 'onChange');
      let error = field.error;
      
      if (onChangeValidators.length > 0) {
        for (const validator of onChangeValidators) {
          const validationResult = validator.validate(value);
          if (validationResult) {
            error = validationResult;
            break;
          }
        }
        if (!error && onChangeValidators.length > 0) {
          error = undefined;
        }
      }

      const updatedFields = {
        ...state.fields,
        [name]: {
          ...field,
          value,
          dirty: true,
          error,
        },
      };

      return {
        ...state,
        fields: updatedFields,
        dirtyFields: newDirtyFields,
        errors: {
          ...state.errors,
          [name]: error || state.errors[name],
        },
        isValid: Object.values(updatedFields).every(f => !f.error),
      };
    }

    case 'SET_FIELD_TOUCHED': {
      const { name, touched } = action.payload;
      const field = state.fields[name];
      if (!field) return state;

      const newTouchedFields = new Set(state.touchedFields);
      if (touched) {
        newTouchedFields.add(name);
      } else {
        newTouchedFields.delete(name);
      }

      // Validate on blur
      let error = field.error;
      if (touched) {
        for (const validator of field.validators) {
          const validationResult = validator.validate(field.value);
          if (validationResult) {
            error = validationResult;
            break;
          }
        }
        if (!error) {
          error = undefined;
        }
      }

      const updatedFields = {
        ...state.fields,
        [name]: {
          ...field,
          touched,
          error,
        },
      };

      return {
        ...state,
        fields: updatedFields,
        touchedFields: newTouchedFields,
        errors: {
          ...state.errors,
          [name]: error || state.errors[name],
        },
        isValid: Object.values(updatedFields).every(f => !f.error),
      };
    }

    case 'SET_FIELD_ERROR': {
      const { name, error } = action.payload;
      const field = state.fields[name];
      if (!field) return state;

      const updatedFields = {
        ...state.fields,
        [name]: {
          ...field,
          error: error || undefined,
        },
      };

      return {
        ...state,
        fields: updatedFields,
        errors: {
          ...state.errors,
          [name]: error || state.errors[name],
        },
        isValid: Object.values(updatedFields).every(f => !f.error),
      };
    }

    case 'VALIDATE_FIELD': {
      const { name } = action.payload;
      const field = state.fields[name];
      if (!field) return state;

      let error: FieldError | undefined;
      for (const validator of field.validators) {
        const validationResult = validator.validate(field.value);
        if (validationResult) {
          error = validationResult;
          break;
        }
      }

      const updatedFields = {
        ...state.fields,
        [name]: {
          ...field,
          error,
        },
      };

      return {
        ...state,
        fields: updatedFields,
        errors: {
          ...state.errors,
          [name]: error || state.errors[name],
        },
        isValid: Object.values(updatedFields).every(f => !f.error),
      };
    }

    case 'VALIDATE_ALL_FIELDS': {
      const updatedFields = { ...state.fields };
      const errors: Record<string, FieldError> = {};

      Object.entries(state.fields).forEach(([name, field]) => {
        let fieldError: FieldError | undefined;
        for (const validator of field.validators) {
          const validationResult = validator.validate(field.value);
          if (validationResult) {
            fieldError = validationResult;
            break;
          }
        }
        
        updatedFields[name] = {
          ...field,
          error: fieldError,
          touched: true,
        };
        
        if (fieldError) {
          errors[name] = fieldError;
        }
      });

      return {
        ...state,
        fields: updatedFields,
        errors,
        touchedFields: new Set(Object.keys(state.fields)),
        isValid: Object.keys(errors).length === 0,
      };
    }

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case 'SET_SUBMITTED':
      return {
        ...state,
        isSubmitted: action.payload,
      };

    case 'RESET_FORM':
      return {
        fields: {},
        isValid: true,
        isSubmitting: false,
        isSubmitted: false,
        errors: {},
        touchedFields: new Set(),
        dirtyFields: new Set(),
        ...action.payload,
      };

    default:
      return state;
  }
};
