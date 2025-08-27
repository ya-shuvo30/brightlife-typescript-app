import React from 'react';
import type { LazySectionProps } from './lazyLoadingUtils';
import { useLazyLoad } from './lazyLoadingHooks';

/**
 * Lazy Loading Components
 * React components for efficient code splitting and lazy loading
 */

// Loading fallback component
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div 
        className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
        aria-label="Loading..."
      />
    </div>
  );
};

// Section loading fallback
export const SectionLoadingFallback: React.FC<{ height?: string }> = ({ 
  height = 'h-64' 
}) => (
  <div className={`${height} bg-gray-50 rounded-lg animate-pulse flex items-center justify-center`}>
    <LoadingSpinner size="lg" />
    <span className="ml-3 text-gray-500">Loading section...</span>
  </div>
);

// Lazy section wrapper
export const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback = <SectionLoadingFallback />,
  threshold = 0.1,
  className = ''
}) => {
  const { ref, isVisible } = useLazyLoad(threshold);

  return (
    <section ref={ref} className={className}>
      {isVisible ? children : fallback}
    </section>
  );
};
