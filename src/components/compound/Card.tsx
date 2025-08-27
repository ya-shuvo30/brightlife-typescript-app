import { forwardRef, createContext, useContext } from 'react';
import type { ReactNode, HTMLAttributes } from 'react';
import { useComponentStyle } from '../../design-system/hooks';
import type { ComponentSize } from '../../design-system/tokens';

/**
 * Card Compound Component
 * Implements compound component pattern with context sharing
 */

// Card Variants
export type CardVariant = 'default' | 'outlined' | 'elevated' | 'filled' | 'interactive';

// Card Context
interface CardContextType {
  variant: CardVariant;
  size: ComponentSize;
  disabled: boolean;
  interactive: boolean;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('Card compound components must be used within a Card component');
  }
  return context;
};

// Main Card Component Props
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: ComponentSize;
  disabled?: boolean;
  interactive?: boolean;
  children: ReactNode;
}

// Card Root Component
export const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  size = 'md',
  disabled = false,
  interactive = false,
  className,
  children,
  onClick,
  ...props
}, ref) => {
  const cardClasses = useComponentStyle('card', variant, size);
  
  const contextValue: CardContextType = {
    variant,
    size,
    disabled,
    interactive: interactive || !!onClick,
  };

  const combinedClasses = [
    cardClasses,
    'bg-white rounded-lg border shadow-sm transition-all duration-200',
    
    // Variant styles
    variant === 'outlined' && 'border-gray-200 shadow-none',
    variant === 'elevated' && 'border-0 shadow-lg',
    variant === 'filled' && 'bg-gray-50 border-gray-100',
    variant === 'interactive' && 'cursor-pointer hover:shadow-md',
    
    // Size styles
    size === 'xs' && 'p-2',
    size === 'sm' && 'p-3',
    size === 'md' && 'p-4',
    size === 'lg' && 'p-6',
    size === 'xl' && 'p-8',
    
    // Interactive styles
    (interactive || onClick) && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5',
    
    // Disabled styles
    disabled && 'opacity-60 cursor-not-allowed pointer-events-none',
    
    className,
  ].filter(Boolean).join(' ');

  return (
    <CardContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={combinedClasses}
        onClick={disabled ? undefined : onClick}
        {...(onClick && { role: 'button' })}
        tabIndex={onClick && !disabled ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        } : undefined}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
});

Card.displayName = 'Card';

// Card Header Component
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({
  className,
  children,
  ...props
}, ref) => {
  const { size } = useCardContext();
  
  const headerClasses = [
    'flex items-center justify-between',
    size === 'xs' && '-m-2 mb-2 p-2',
    size === 'sm' && '-m-3 mb-3 p-3',
    size === 'md' && '-m-4 mb-4 p-4',
    size === 'lg' && '-m-6 mb-6 p-6',
    size === 'xl' && '-m-8 mb-8 p-8',
    'border-b border-gray-100',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={headerClasses} {...props}>
      {children}
    </div>
  );
});

CardHeader.displayName = 'Card.Header';

// Card Title Component
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: ReactNode;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({
  as: Component = 'h3',
  className,
  children,
  ...props
}, ref) => {
  const { size } = useCardContext();
  
  const titleClasses = [
    'font-semibold text-gray-900',
    size === 'xs' && 'text-sm',
    size === 'sm' && 'text-base',
    size === 'md' && 'text-lg',
    size === 'lg' && 'text-xl',
    size === 'xl' && 'text-2xl',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component ref={ref} className={titleClasses} {...props}>
      {children}
    </Component>
  );
});

CardTitle.displayName = 'Card.Title';

// Card Subtitle Component
export interface CardSubtitleProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export const CardSubtitle = forwardRef<HTMLParagraphElement, CardSubtitleProps>(({
  className,
  children,
  ...props
}, ref) => {
  const { size } = useCardContext();
  
  const subtitleClasses = [
    'text-gray-600 mt-1',
    size === 'xs' && 'text-xs',
    size === 'sm' && 'text-sm',
    size === 'md' && 'text-sm',
    size === 'lg' && 'text-base',
    size === 'xl' && 'text-lg',
    className,
  ].filter(Boolean).join(' ');

  return (
    <p ref={ref} className={subtitleClasses} {...props}>
      {children}
    </p>
  );
});

CardSubtitle.displayName = 'Card.Subtitle';

// Card Content Component
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({
  className,
  children,
  ...props
}, ref) => {
  const contentClasses = [
    'text-gray-700',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={contentClasses} {...props}>
      {children}
    </div>
  );
});

CardContent.displayName = 'Card.Content';

// Card Footer Component
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({
  className,
  children,
  ...props
}, ref) => {
  const { size } = useCardContext();
  
  const footerClasses = [
    'flex items-center justify-end gap-2 pt-4',
    size === 'xs' && '-m-2 mt-2 p-2',
    size === 'sm' && '-m-3 mt-3 p-3',
    size === 'md' && '-m-4 mt-4 p-4',
    size === 'lg' && '-m-6 mt-6 p-6',
    size === 'xl' && '-m-8 mt-8 p-8',
    'border-t border-gray-100',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={footerClasses} {...props}>
      {children}
    </div>
  );
});

CardFooter.displayName = 'Card.Footer';

// Card Actions Component
export interface CardActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
}

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(({
  align = 'right',
  className,
  children,
  ...props
}, ref) => {
  const actionClasses = [
    'flex items-center gap-2 mt-4',
    align === 'left' && 'justify-start',
    align === 'center' && 'justify-center',
    align === 'right' && 'justify-end',
    align === 'between' && 'justify-between',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={actionClasses} {...props}>
      {children}
    </div>
  );
});

CardActions.displayName = 'Card.Actions';

// Export compound component with attached sub-components
const CompoundCard = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Content: CardContent,
  Footer: CardFooter,
  Actions: CardActions,
});

export default CompoundCard;
