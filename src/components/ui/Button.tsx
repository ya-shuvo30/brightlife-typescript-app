import React, { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

/**
 * Enhanced Button Component
 * Features: Accessibility, loading states, variants, sizes, animations
 */

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'danger' 
  | 'warning'
  | 'outline' 
  | 'ghost'
  | 'link';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animation?: 'none' | 'pulse' | 'bounce' | 'glow';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  rounded = 'md',
  animation = 'none',
  disabled,
  className = '',
  ...props
}, ref) => {
  const getVariantClasses = () => {
    const variants = {
      primary: 'bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 focus:ring-green-500',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-700 focus:ring-gray-500',
      outline: 'bg-transparent hover:bg-green-50 text-green-700 border-green-600 hover:border-green-700 focus:ring-green-500',
      ghost: 'bg-transparent hover:bg-green-50 text-green-700 border-transparent hover:border-green-200 focus:ring-green-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 focus:ring-red-500',
      success: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 hover:border-emerald-700 focus:ring-emerald-500',
      warning: 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500 hover:border-yellow-600 focus:ring-yellow-400',
      link: 'bg-transparent hover:bg-transparent text-green-600 hover:text-green-700 border-transparent hover:border-transparent focus:ring-green-500 underline',
    };
    return variants[variant];
  };

  const getSizeClasses = () => {
    const sizes = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    };
    return sizes[size];
  };

  const getRoundedClasses = () => {
    const roundedMap = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };
    return roundedMap[rounded];
  };

  const getAnimationClasses = () => {
    const animations = {
      none: '',
      pulse: 'animate-pulse-subtle',
      bounce: 'hover:animate-bounce-in',
      glow: 'hover-glow',
    };
    return animations[animation];
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-medium
        border transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        btn-enhanced hover-lift focus-ring
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${getRoundedClasses()}
        ${getAnimationClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...(loading && { 'aria-busy': 'true' })}
      {...(isDisabled && { 'aria-disabled': 'true' })}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            className="opacity-25"
          />
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            className="opacity-75"
          />
        </svg>
      )}
      
      {!loading && leftIcon && (
        <span className="mr-2" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      
      <span>
        {loading && loadingText ? loadingText : children}
      </span>
      
      {!loading && rightIcon && (
        <span className="ml-2" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

// Icon Button variant
export const IconButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'leftIcon' | 'rightIcon'> & {
  icon: React.ReactNode;
  'aria-label': string;
}>(({ icon, className = '', ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={`!p-2 ${className}`}
      {...props}
    >
      {icon}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

// Button group component
export const ButtonGroup: React.FC<{
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}> = ({ children, orientation = 'horizontal', className = '' }) => {
  const orientationClasses = orientation === 'horizontal' 
    ? 'flex-row' 
    : 'flex-col';

  return (
    <div 
      className={`inline-flex ${orientationClasses} ${className}`} 
      role="group"
    >
      {children}
    </div>
  );
};
