import React from 'react';
import { logLazyLoadPerformance } from './lazyLoadingUtils';

/**
 * Lazy Loading Hooks
 * Custom hooks for lazy loading functionality
 */

// Hook for lazy loading with intersection observer
export const useLazyLoad = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || hasLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, hasLoaded]);

  return { ref, isVisible, hasLoaded };
};

// Performance monitoring hook
export const useLazyLoadPerformance = (componentName: string) => {
  const startTime = React.useRef<number>(Date.now());
  
  React.useEffect(() => {
    logLazyLoadPerformance(componentName, startTime.current);
  }, [componentName]);
};
