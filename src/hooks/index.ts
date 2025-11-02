import { useState, useEffect, useRef, useCallback } from 'react';
import type { UseAsyncReturn, UseToggleReturn, UseLocalStorageReturn } from '../types/components';

// Re-export advanced hooks
export * from './advanced';
export * from './performance';

/**
 * Custom hook for handling async operations with proper TypeScript typing
 * Provides loading states, error handling, and cancellation support
 */
export function useAsync<T, TArgs extends readonly unknown[] = []>(
  asyncFunction: (...args: TArgs) => Promise<T>
): UseAsyncReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const cancelRef = useRef<boolean>(false);

  const execute = useCallback(
    async (...args: TArgs): Promise<T> => {
      setLoading(true);
      setError(null);
      cancelRef.current = false;

      try {
        const result = await asyncFunction(...args);
        
        if (!cancelRef.current) {
          setData(result);
          setLoading(false);
        }
        
        return result;
      } catch (err) {
        if (!cancelRef.current) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          setLoading(false);
        }
        throw err;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    cancelRef.current = true;
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  return {
    data,
    loading,
    error,
    execute: execute as (...args: readonly unknown[]) => Promise<T>,
    reset
  };
}

/**
 * Simple toggle hook with TypeScript support
 * Provides boolean state management with utility functions
 */
export function useToggle(initialValue = false): UseToggleReturn {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse
  };
}

/**
 * LocalStorage hook with TypeScript generics and error handling
 * Provides persistent state management with proper serialization
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue
  };
}

/**
 * Debounced value hook for performance optimization
 * Delays updating the value until after a specified delay
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Previous value hook for comparing state changes
 * Returns the previous value of a state variable
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

/**
 * Intersection Observer hook for element visibility detection
 * Useful for animations, lazy loading, and analytics
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    
    if (!element) return;

    observerRef.current = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [elementRef, options]);

  return isIntersecting;
}

/**
 * Media query hook for responsive design
 * Returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}
