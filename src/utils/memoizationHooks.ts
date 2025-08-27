import { useMemo, useCallback, useRef, useEffect } from 'react';
import type { DependencyList } from 'react';
import { shallowEqual, deepEqual, LRUCache } from './memoization';

/**
 * React-specific memoization hooks for efficient re-render strategies
 */

// Enhanced useMemo with performance tracking
export const useTrackedMemo = <T>(
  factory: () => T,
  deps: DependencyList,
  name?: string
): T => {
  return useMemo(() => {
    if (import.meta.env.DEV && name) {
      const start = performance.now();
      const result = factory();
      const end = performance.now();
      console.log(`📊 useMemo(${name}) computed in ${(end - start).toFixed(2)}ms`);
      return result;
    }
    return factory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [factory, name, ...deps]);
};

// Enhanced useCallback with performance tracking
export const useTrackedCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: DependencyList,
  name?: string
): T => {
  return useCallback((...args: Parameters<T>) => {
    if (import.meta.env.DEV && name) {
      const start = performance.now();
      const result = callback(...args);
      const end = performance.now();
      console.log(`📊 useCallback(${name}) executed in ${(end - start).toFixed(2)}ms`);
      return result;
    }
    return callback(...args);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, name, ...deps]) as T;
};

// Memoization with shallow comparison
export const useShallowMemo = <T extends Record<string, unknown>>(
  factory: () => T,
  deps: DependencyList
): T => {
  const ref = useRef<{ deps: DependencyList; value: T } | null>(null);
  
  if (!ref.current || !shallowEqual(ref.current.deps as unknown as Record<string, unknown>, deps as unknown as Record<string, unknown>)) {
    ref.current = {
      deps,
      value: factory()
    };
  }
  
  return ref.current.value;
};

// Memoization with deep comparison (limited depth)
export const useDeepMemo = <T>(
  factory: () => T,
  deps: DependencyList,
  maxDepth: number = 3
): T => {
  const ref = useRef<{ deps: DependencyList; value: T } | null>(null);
  
  if (!ref.current || !deepEqual(ref.current.deps, deps, maxDepth)) {
    ref.current = {
      deps,
      value: factory()
    };
  }
  
  return ref.current.value;
};

// Persistent LRU cache hook
export const useLRUCache = <K, V>(maxSize: number = 100) => {
  const cache = useRef<LRUCache<K, V> | null>(null);
  
  if (!cache.current) {
    cache.current = new LRUCache<K, V>(maxSize);
  }
  
  return cache.current;
};

// Memoized expensive computation with cache
export const useExpensiveComputation = <Args extends readonly unknown[], Result>(
  computeFn: (...args: Args) => Result,
  args: Args,
  cacheSize: number = 50
): Result => {
  const cache = useLRUCache<string, Result>(cacheSize);
  const key = JSON.stringify(args);
  
  return useMemo(() => {
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }
    
    const start = performance.now();
    const result = computeFn(...args);
    const end = performance.now();
    
    if (import.meta.env.DEV) {
      console.log(`💡 Expensive computation took ${(end - start).toFixed(2)}ms`);
    }
    
    cache.set(key, result);
    return result;
  }, [cache, key, computeFn, args]);
};

// Debounced state update hook
export const useDebouncedCallback = <T extends readonly unknown[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  const timeoutRef = useRef<number | undefined>(undefined);
  
  const debouncedCallback = useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay) as unknown as number;
    },
    [callback, delay]
  );
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return debouncedCallback;
};

// Throttled callback hook
export const useThrottledCallback = <T extends readonly unknown[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  const lastCall = useRef<number>(0);
  
  return useCallback(
    (...args: T) => {
      const now = Date.now();
      
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  );
};

// Previous value comparison hook
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// Changed detection hook
export const useChanged = <T extends Record<string, unknown>>(
  value: T, 
  equalityFn = shallowEqual
): boolean => {
  const previous = usePrevious(value);
  
  if (previous === undefined) {
    return true;
  }
  
  return !equalityFn(previous, value);
};

// Stable reference hook for objects/arrays
export const useStableReference = <T extends Record<string, unknown> | unknown[]>(
  value: T,
  equalityFn = shallowEqual
): T => {
  const ref = useRef<T>(value);
  
  if (!equalityFn(ref.current as Record<string, unknown>, value as Record<string, unknown>)) {
    ref.current = value;
  }
  
  return ref.current;
};

// Memoized selector hook
export const useSelector = <State, Selected extends Record<string, unknown>>(
  selector: (state: State) => Selected,
  state: State,
  equalityFn = shallowEqual
): Selected => {
  const lastState = useRef<State | undefined>(undefined);
  const lastSelected = useRef<Selected | undefined>(undefined);
  
  if (lastState.current !== state) {
    const newSelected = selector(state);
    
    if (
      lastState.current === undefined ||
      lastSelected.current === undefined ||
      !equalityFn(lastSelected.current, newSelected)
    ) {
      lastSelected.current = newSelected;
    }
    
    lastState.current = state;
  }
  
  return lastSelected.current!;
};

// Performance monitoring hook
export const usePerformanceMonitor = (name: string, dependencies: DependencyList) => {
  const renderCount = useRef(0);
  const startTime = useRef<number | undefined>(undefined);
  
  renderCount.current++;
  
  useEffect(() => {
    if (startTime.current) {
      const renderTime = performance.now() - startTime.current;
      console.log(
        `📈 ${name} render #${renderCount.current} took ${renderTime.toFixed(2)}ms`
      );
    }
  });
  
  useEffect(() => {
    startTime.current = performance.now();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, ...dependencies]);
  
  return {
    renderCount: renderCount.current,
    logRender: () => {
      console.log(`🔄 ${name} rendered ${renderCount.current} times`);
    }
  };
};
