import React, { forwardRef } from 'react';

// Input variants and sizes
export type InputVariant = 'default' | 'filled' | 'outline';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'tel' 
  | 'url' 
  | 'search';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loading?: boolean;
}

// Input styling utilities
const getInputStyles = (
  variant: InputVariant,
  size: InputSize,
  hasError: boolean
): string => {
  const baseStyles = `
    relative w-full border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    placeholder:text-gray-400
  `;

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  // Variant styles
  const variantStyles = {
    default: hasError
      ? 'border-red-300 bg-white focus:border-red-500 focus:ring-red-200'
      : 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-blue-200',
    
    filled: hasError
      ? 'border-red-300 bg-gray-50 focus:border-red-500 focus:ring-red-200 focus:bg-white'
      : 'border-gray-200 bg-gray-50 hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-blue-200',
    
    outline: hasError
      ? 'border-2 border-red-300 bg-transparent focus:border-red-500 focus:ring-red-200'
      : 'border-2 border-gray-300 bg-transparent hover:border-gray-400 focus:border-blue-500 focus:ring-blue-200',
  };

  return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
};

const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  size = 'md',
  label,
  error,
  helperText,
  required = false,
  fullWidth = false,
  startIcon,
  endIcon,
  loading = false,
  className = '',
  disabled = false,
  type = 'text',
  ...props
}, ref) => {
  const hasError = Boolean(error);
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputStyles = getInputStyles(variant, size, hasError);

  return (
    <div className={`${fullWidth ? 'w-full' : 'w-auto'}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {startIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {startIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled || loading}
          className={`
            ${inputStyles}
            ${startIcon ? 'pl-10' : ''}
            ${endIcon || loading ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        
        {(endIcon || loading) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
            ) : (
              endIcon
            )}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className="mt-1">
          {error ? (
            <p className="text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {error}
            </p>
          ) : (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
