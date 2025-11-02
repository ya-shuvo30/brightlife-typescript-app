import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Performance monitoring hooks with TypeScript
 * Demonstrates advanced patterns for measuring and optimizing React performance
 */

// Performance metric types
interface PerformanceMetric {
  readonly name: string;
  readonly value: number;
  readonly timestamp: number;
  readonly unit: 'ms' | 'bytes' | 'count';
}

interface RenderMetrics {
  readonly renderCount: number;
  readonly averageRenderTime: number;
  readonly lastRenderTime: number;
  readonly slowRenders: number;
}

interface MemoryMetrics {
  readonly usedJSHeapSize: number;
  readonly totalJSHeapSize: number;
  readonly jsHeapSizeLimit: number;
}

interface MemoryInfo {
  readonly usedJSHeapSize: number;
  readonly totalJSHeapSize: number;
  readonly jsHeapSizeLimit: number;
}

/**
 * Hook for measuring component render performance
 * Tracks render count, timing, and identifies slow renders
 */
export function useRenderMetrics(componentName: string, slowRenderThreshold = 16): RenderMetrics {
  const renderCount = useRef<number>(0);
  const renderTimes = useRef<number[]>([]);
  const slowRenders = useRef<number>(0);
  const startTime = useRef<number>(0);
  
  const [metrics, setMetrics] = useState<RenderMetrics>({
    renderCount: 0,
    averageRenderTime: 0,
    lastRenderTime: 0,
    slowRenders: 0
  });

  // Mark render start
  useEffect(() => {
    startTime.current = performance.now();
  });

  // Calculate render metrics after each render
  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    
    renderCount.current += 1;
    renderTimes.current.push(renderTime);
    
    // Keep only last 100 render times for memory efficiency
    if (renderTimes.current.length > 100) {
      renderTimes.current = renderTimes.current.slice(-100);
    }
    
    // Check for slow render
    if (renderTime > slowRenderThreshold) {
      slowRenders.current += 1;
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
    
    // Calculate average render time
    const totalTime = renderTimes.current.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / renderTimes.current.length;
    
    setMetrics({
      renderCount: renderCount.current,
      averageRenderTime: averageTime,
      lastRenderTime: renderTime,
      slowRenders: slowRenders.current
    });
  }, [slowRenderThreshold, componentName]);

  return metrics;
}

/**
 * Hook for monitoring memory usage
 * Provides heap size information and memory leak detection
 */
export function useMemoryMonitor(interval = 5000): MemoryMetrics | null {
  const [memoryMetrics, setMemoryMetrics] = useState<MemoryMetrics | null>(null);

  useEffect(() => {
    // Check if performance.memory is available (Chrome/Edge)
    if (!('memory' in performance)) {
      console.warn('Memory monitoring not available in this browser');
      return;
    }

    const updateMemoryMetrics = () => {
      const memory = (performance as { memory?: MemoryInfo }).memory;
      if (memory) {
        setMemoryMetrics({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        });
      }
    };

    // Initial measurement
    updateMemoryMetrics();

    // Set up interval for periodic measurements
    const intervalId = setInterval(updateMemoryMetrics, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return memoryMetrics;
}

/**
 * Hook for measuring custom performance metrics
 * Generic hook for tracking any performance-related measurements
 */
export function usePerformanceTracker<T extends string>(): {
  readonly metrics: ReadonlyArray<PerformanceMetric>;
  readonly startMeasurement: (name: T) => void;
  readonly endMeasurement: (name: T) => number;
  readonly recordMetric: (name: T, value: number, unit?: PerformanceMetric['unit']) => void;
} {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const activeMarks = useRef<Map<T, number>>(new Map());

  const startMeasurement = useCallback((name: T) => {
    activeMarks.current.set(name, performance.now());
  }, []);

  const endMeasurement = useCallback((name: T): number => {
    const startTime = activeMarks.current.get(name);
    if (!startTime) {
      console.warn(`No start mark found for measurement: ${name}`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    
    activeMarks.current.delete(name);
    
    const metric: PerformanceMetric = {
      name,
      value: duration,
      timestamp: endTime,
      unit: 'ms'
    };

    setMetrics(prev => [...prev.slice(-99), metric]); // Keep last 100 metrics
    
    return duration;
  }, []);

  const recordMetric = useCallback((
    name: T, 
    value: number, 
    unit: PerformanceMetric['unit'] = 'count'
  ) => {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: performance.now(),
      unit
    };

    setMetrics(prev => [...prev.slice(-99), metric]);
  }, []);

  return {
    metrics,
    startMeasurement,
    endMeasurement,
    recordMetric
  };
}

/**
 * Hook for throttling expensive operations
 * Prevents excessive function calls with TypeScript safety
 */
export function useThrottledCallback<TArgs extends readonly unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number
): (...args: TArgs) => void {
  const lastRun = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return useCallback((...args: TArgs) => {
    const now = Date.now();
    
    if (now - lastRun.current >= delay) {
      // Execute immediately if enough time has passed
      lastRun.current = now;
      callback(...args);
    } else {
      // Schedule for later execution
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      const remainingTime = delay - (now - lastRun.current);
      timeoutRef.current = setTimeout(() => {
        lastRun.current = Date.now();
        callback(...args);
      }, remainingTime);
    }
  }, [callback, delay]);
}

/**
 * Hook for measuring component visibility performance
 * Tracks how long components are visible and intersection ratios
 */
export function useVisibilityMetrics(
  elementRef: React.RefObject<Element>
): {
  readonly isVisible: boolean;
  readonly visibilityRatio: number;
  readonly totalVisibleTime: number;
  readonly visibilityCount: number;
} {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [visibilityRatio, setVisibilityRatio] = useState<number>(0);
  const [totalVisibleTime, setTotalVisibleTime] = useState<number>(0);
  const [visibilityCount, setVisibilityCount] = useState<number>(0);
  
  const visibilityStartTime = useRef<number | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const nowVisible = entry.isIntersecting;
        const ratio = entry.intersectionRatio;
        
        setVisibilityRatio(ratio);
        
        if (nowVisible && !isVisible) {
          // Became visible
          setIsVisible(true);
          setVisibilityCount(prev => prev + 1);
          visibilityStartTime.current = performance.now();
        } else if (!nowVisible && isVisible) {
          // Became hidden
          setIsVisible(false);
          
          if (visibilityStartTime.current) {
            const visibleDuration = performance.now() - visibilityStartTime.current;
            setTotalVisibleTime(prev => prev + visibleDuration);
            visibilityStartTime.current = null;
          }
        }
      },
      {
        threshold: [0, 0.1, 0.5, 0.75, 1.0] // Multiple thresholds for detailed tracking
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      
      // Add any remaining visible time
      if (visibilityStartTime.current && isVisible) {
        const remainingTime = performance.now() - visibilityStartTime.current;
        setTotalVisibleTime(prev => prev + remainingTime);
      }
    };
  }, [elementRef, isVisible]);

  return {
    isVisible,
    visibilityRatio,
    totalVisibleTime,
    visibilityCount
  };
}

/**
 * Development-only performance debugging hook
 * Logs performance metrics to console in development mode
 */
export function usePerformanceDebugger(
  componentName: string,
  enabled: boolean = import.meta.env.DEV
): void {
  const renderMetrics = useRenderMetrics(componentName);
  const memoryMetrics = useMemoryMonitor();

  useEffect(() => {
    if (!enabled) return;

    const logMetrics = () => {
      console.group(`🔍 Performance Debug: ${componentName}`);
      
      console.log('📊 Render Metrics:', {
        renders: renderMetrics.renderCount,
        avgTime: `${renderMetrics.averageRenderTime.toFixed(2)}ms`,
        lastRender: `${renderMetrics.lastRenderTime.toFixed(2)}ms`,
        slowRenders: renderMetrics.slowRenders
      });
      
      if (memoryMetrics) {
        const usedMB = (memoryMetrics.usedJSHeapSize / 1024 / 1024).toFixed(2);
        const totalMB = (memoryMetrics.totalJSHeapSize / 1024 / 1024).toFixed(2);
        const limitMB = (memoryMetrics.jsHeapSizeLimit / 1024 / 1024).toFixed(2);
        
        console.log('💾 Memory Metrics:', {
          used: `${usedMB}MB`,
          total: `${totalMB}MB`,
          limit: `${limitMB}MB`,
          usage: `${((memoryMetrics.usedJSHeapSize / memoryMetrics.jsHeapSizeLimit) * 100).toFixed(1)}%`
        });
      }
      
      console.groupEnd();
    };

    // Log metrics every 10 seconds in development
    const interval = setInterval(logMetrics, 10000);
    
    return () => clearInterval(interval);
  }, [componentName, enabled, renderMetrics, memoryMetrics]);
}
