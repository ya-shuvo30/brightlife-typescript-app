import React from 'react';
import type { SkeletonProps } from '../../types/components';

/**
 * Modern skeleton loading components for progressive loading states
 * Provides smooth loading experiences while content is being fetched
 */

interface SkeletonBaseProps {
  className?: string;
  animate?: boolean;
}

// Base skeleton component
export const Skeleton: React.FC<SkeletonProps & SkeletonBaseProps> = ({ 
  width = '100%',
  height = '1rem',
  className = '',
  animate = true 
}) => {
  const animationClass = animate ? 'animate-pulse' : '';
  const skeletonRef = React.useRef<HTMLDivElement>(null);
  
  // Set CSS custom properties using ref to avoid inline style warnings
  React.useLayoutEffect(() => {
    if (skeletonRef.current) {
      const element = skeletonRef.current;
      element.style.setProperty('--skeleton-width', 
        typeof width === 'number' ? `${width}px` : width);
      element.style.setProperty('--skeleton-height', 
        typeof height === 'number' ? `${height}px` : height);
    }
  }, [width, height]);
  
  return (
    <div
      ref={skeletonRef}
      className={`bg-gray-200 rounded skeleton-dimensions ${animationClass} ${className}`}
      aria-label="Loading..."
      role="status"
    />
  );
};

// Text skeleton
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          height="1rem"
          width={index === lines - 1 ? '75%' : '100%'}
        />
      ))}
    </div>
  );
};

// Avatar skeleton
export const SkeletonAvatar: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-gray-200 rounded-full animate-pulse ${className}`}
      aria-label="Loading avatar..."
      role="status"
    />
  );
};

// Card skeleton
export const SkeletonCard: React.FC<{
  showImage?: boolean;
  showAvatar?: boolean;
  className?: string;
}> = ({ showImage = true, showAvatar = false, className = '' }) => {
  return (
    <div className={`border border-gray-200 rounded-lg p-4 space-y-4 ${className}`}>
      {showImage && (
        <Skeleton height="200px" className="rounded-md" />
      )}
      
      <div className="space-y-3">
        {showAvatar && (
          <div className="flex items-center space-x-3">
            <SkeletonAvatar size="md" />
            <div className="flex-1 space-y-2">
              <Skeleton height="1rem" width="40%" />
              <Skeleton height="0.75rem" width="60%" />
            </div>
          </div>
        )}
        
        <Skeleton height="1.5rem" width="80%" />
        <SkeletonText lines={2} />
        
        <div className="flex space-x-2">
          <Skeleton height="2rem" width="80px" />
          <Skeleton height="2rem" width="80px" />
        </div>
      </div>
    </div>
  );
};

// Button skeleton
export const SkeletonButton: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-16',
    md: 'h-10 w-20',
    lg: 'h-12 w-24',
  };

  return (
    <Skeleton
      className={`${sizeClasses[size]} rounded-md ${className}`}
    />
  );
};

// Table skeleton
export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={`header-${index}`} height="2rem" className="flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex space-x-4">
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} height="1.5rem" className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

// List skeleton
export const SkeletonList: React.FC<{
  items?: number;
  showImage?: boolean;
  className?: string;
}> = ({ items = 3, showImage = false, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
          {showImage && <SkeletonAvatar size="md" />}
          <div className="flex-1 space-y-2">
            <Skeleton height="1.25rem" width="60%" />
            <Skeleton height="1rem" width="90%" />
          </div>
          <SkeletonButton size="sm" />
        </div>
      ))}
    </div>
  );
};

// Navigation skeleton
export const SkeletonNavbar: React.FC<{
  showLogo?: boolean;
  menuItems?: number;
  className?: string;
}> = ({ showLogo = true, menuItems = 5, className = '' }) => {
  return (
    <div className={`flex items-center justify-between p-4 border-b border-gray-200 ${className}`}>
      {showLogo && <Skeleton height="2rem" width="120px" />}
      
      <div className="flex items-center space-x-6">
        {Array.from({ length: menuItems }, (_, index) => (
          <Skeleton key={index} height="1.5rem" width="60px" />
        ))}
      </div>
      
      <SkeletonButton size="md" />
    </div>
  );
};

// Stats skeleton
export const SkeletonStats: React.FC<{
  items?: number;
  className?: string;
}> = ({ items = 4, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className="text-center space-y-3">
          <Skeleton height="3rem" width="60%" className="mx-auto" />
          <Skeleton height="1rem" width="80%" className="mx-auto" />
        </div>
      ))}
    </div>
  );
};

// Form skeleton
export const SkeletonForm: React.FC<{
  fields?: number;
  showSubmitButton?: boolean;
  className?: string;
}> = ({ fields = 4, showSubmitButton = true, className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }, (_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton height="1rem" width="25%" />
          <Skeleton height="2.5rem" width="100%" />
        </div>
      ))}
      
      {showSubmitButton && (
        <div className="pt-4">
          <SkeletonButton size="lg" className="w-full" />
        </div>
      )}
    </div>
  );
};
