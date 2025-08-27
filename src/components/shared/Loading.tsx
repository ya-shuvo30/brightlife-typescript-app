import React, { Suspense } from 'react';
import type { LoadingProps } from '../../types/components';
import { SkeletonCard, SkeletonText, SkeletonList } from './Skeleton';

/**
 * Modern loading components with Suspense boundaries
 * Provides progressive loading experiences with proper error handling
 */

// Enhanced loading spinner
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
        aria-label="Loading..."
        role="status"
      />
    </div>
  );
};

// Progressive loading with fallbacks
export const ProgressiveLoader: React.FC<LoadingProps & {
  type?: 'spinner' | 'skeleton' | 'pulse';
  variant?: 'card' | 'list' | 'text' | 'minimal';
}> = ({ 
  size = 'md',
  type = 'skeleton',
  variant = 'minimal',
  className = ''
}) => {
  if (type === 'spinner') {
    const spinnerSize = size as 'sm' | 'md' | 'lg';
    return <LoadingSpinner size={spinnerSize} className={className} />;
  }

  if (type === 'skeleton') {
    switch (variant) {
      case 'card':
        return <SkeletonCard className={className} />;
      case 'list':
        return <SkeletonList className={className} />;
      case 'text':
        return <SkeletonText className={className} />;
      default:
        return <SkeletonText lines={1} className={className} />;
    }
  }

  // Pulse variant
  return (
    <div className={`bg-gray-200 animate-pulse rounded-md h-4 w-full ${className}`} />
  );
};

// Suspense wrapper with custom fallback
export const SuspenseWrapper: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  variant?: 'card' | 'list' | 'text' | 'spinner';
  className?: string;
}> = ({ 
  children, 
  fallback, 
  variant = 'spinner',
  className = ''
}) => {
  const getDefaultFallback = () => {
    if (variant === 'spinner') {
      return <LoadingSpinner size="md" />;
    }
    const loaderVariant = variant as 'card' | 'list' | 'text' | 'minimal';
    return <ProgressiveLoader type="skeleton" variant={loaderVariant} />;
  };

  const defaultFallback = fallback || getDefaultFallback();

  return (
    <Suspense fallback={
      <div className={`min-h-[200px] flex items-center justify-center ${className}`}>
        {defaultFallback}
      </div>
    }>
      {children}
    </Suspense>
  );
};

// Loading boundary with error recovery
export const LoadingBoundary: React.FC<{
  children: React.ReactNode;
  loading: boolean;
  error?: Error | null;
  onRetry?: () => void;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  className?: string;
}> = ({
  children,
  loading,
  error,
  onRetry,
  loadingComponent,
  errorComponent,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        {loadingComponent || <LoadingSpinner size="lg" />}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
        {errorComponent || (
          <>
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">
              {error.message || 'An unexpected error occurred'}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

// Skeleton loading states for specific components
export const SectionSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`py-16 space-y-8 ${className}`}>
    <div className="text-center space-y-4">
      <div className="w-64 h-8 bg-gray-200 animate-pulse rounded mx-auto" />
      <div className="w-96 h-6 bg-gray-200 animate-pulse rounded mx-auto" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }, (_, i) => (
        <SkeletonCard key={i} showImage />
      ))}
    </div>
  </div>
);

export const NavbarSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`h-16 border-b border-gray-200 flex items-center justify-between px-6 ${className}`}>
    <div className="w-32 h-8 bg-gray-200 animate-pulse rounded" />
    <div className="flex space-x-6">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="w-16 h-6 bg-gray-200 animate-pulse rounded" />
      ))}
    </div>
    <div className="w-24 h-8 bg-gray-200 animate-pulse rounded" />
  </div>
);

// Lazy loading wrapper with intersection observer
export const LazyWrapper: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}> = ({ 
  children, 
  fallback,
  rootMargin = '50px',
  threshold = 0.1,
  className = ''
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold, hasLoaded]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : (fallback || <SectionSkeleton />)}
    </div>
  );
};

// Progressive image loading
export const ProgressiveImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}> = ({ 
  src, 
  alt, 
  className = '',
  placeholder,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {!isLoaded && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}>
          {placeholder && (
            <img
              src={placeholder}
              alt=""
              className="w-full h-full object-cover opacity-50"
            />
          )}
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};
