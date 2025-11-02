import type React from 'react';
import type { ComponentType } from 'react';

/**
 * Lazy Loading Types and Utilities
 * Separated from components for Fast Refresh compatibility
 */

// Types
export interface LazyLoadOptions {
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  delay?: number;
}

export interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  className?: string;
}

// Utility functions
export const preloadComponent = (importFn: () => Promise<{ default: ComponentType<unknown> }>) => {
  const componentImport = importFn();
  return componentImport;
};

export const preloadOnHover = (importFn: () => Promise<{ default: ComponentType<unknown> }>) => {
  let preloaded = false;
  
  return {
    onMouseEnter: () => {
      if (!preloaded) {
        preloadComponent(importFn);
        preloaded = true;
      }
    }
  };
};

// Performance monitoring
export const logLazyLoadPerformance = (componentName: string, startTime: number) => {
  const loadTime = Date.now() - startTime;
  
  // In production, you would send this to your analytics service
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.log(`🚀 ${componentName} lazy loaded in ${loadTime}ms`);
  }
};
