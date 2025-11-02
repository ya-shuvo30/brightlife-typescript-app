import React, { memo } from 'react';

/**
 * Performance monitoring utilities for React components
 * Provides render time tracking and performance optimization tools
 */

// Performance monitoring wrapper
export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const WrappedComponent = memo((props: P) => {
    const renderStart = React.useRef<number>(0);
    
    React.useEffect(() => {
      renderStart.current = performance.now();
    });

    React.useLayoutEffect(() => {
      if (renderStart.current) {
        const renderTime = performance.now() - renderStart.current;
        if (renderTime > 16) { // Log slow renders (>16ms for 60fps)
          console.warn(`Slow render detected: ${Component.displayName || Component.name} took ${renderTime.toFixed(2)}ms`);
        }
      }
    });

    return <Component {...props} />;
  });

  WrappedComponent.displayName = `withPerformanceMonitoring(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Performance metrics hook
export const useRenderPerformance = (componentName: string) => {
  const renderStart = React.useRef<number>(0);
  const [renderMetrics, setRenderMetrics] = React.useState({
    renderCount: 0,
    averageRenderTime: 0,
    lastRenderTime: 0,
    slowRenders: 0
  });

  React.useEffect(() => {
    renderStart.current = performance.now();
  });

  React.useLayoutEffect(() => {
    if (renderStart.current) {
      const renderTime = performance.now() - renderStart.current;
      
      setRenderMetrics(prev => {
        const newRenderCount = prev.renderCount + 1;
        const newAverageRenderTime = ((prev.averageRenderTime * prev.renderCount) + renderTime) / newRenderCount;
        const newSlowRenders = renderTime > 16 ? prev.slowRenders + 1 : prev.slowRenders;
        
        if (renderTime > 16) {
          console.warn(`Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
        }
        
        return {
          renderCount: newRenderCount,
          averageRenderTime: newAverageRenderTime,
          lastRenderTime: renderTime,
          slowRenders: newSlowRenders
        };
      });
    }
  }, [componentName]);

  return renderMetrics;
};
