import React from 'react';

/**
 * Memoization Utilities and Higher-Order Components
 * Provides efficient re-render strategies and optimization patterns
 */

// Generic memoization utility
export const memoize = <Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  getKey?: (...args: Args) => string
): ((...args: Args) => Return) => {
  const cache = new Map<string, Return>();
  
  return (...args: Args): Return => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Debounced memoization for expensive calculations
export const memoizeWithDebounce = <Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  delay: number = 300,
  getKey?: (...args: Args) => string
): ((...args: Args) => Return | undefined) => {
  const cache = new Map<string, Return>();
  const timers = new Map<string, number>();
  
  return (...args: Args): Return | undefined => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    // Clear existing timer for this key
    const existingTimer = timers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    
    // Return cached result if available
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    // Set new timer
    const timer = setTimeout(() => {
      const result = fn(...args);
      cache.set(key, result);
      timers.delete(key);
    }, delay);
    
    timers.set(key, timer as unknown as number);
    return undefined; // Return undefined while computation is debounced
  };
};

// LRU Cache implementation
export class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value!);
      return value;
    }
    return undefined;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      // Update existing key
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Performance monitoring utilities
export const measurePerformance = <T extends unknown[], R>(
  fn: (...args: T) => R,
  name: string
) => {
  return (...args: T): R => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    if (import.meta.env.DEV) {
      console.log(`⚡ ${name} executed in ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  };
};

// Async performance measurement
export const measureAsyncPerformance = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  name: string
) => {
  return async (...args: T): Promise<R> => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    if (import.meta.env.DEV) {
      console.log(`⚡ ${name} (async) executed in ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  };
};

// React component memoization with custom comparison
export const createMemoComponent = <P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  const MemoizedComponent = React.memo(Component, propsAreEqual);
  MemoizedComponent.displayName = `Memo(${Component.displayName || Component.name || 'Component'})`;
  return MemoizedComponent;
};

// Shallow comparison function for props
export const shallowEqual = <T extends Record<string, unknown>>(
  obj1: T,
  obj2: T
): boolean => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

// Deep comparison function (limited depth for performance)
export const deepEqual = <T>(
  obj1: T,
  obj2: T,
  maxDepth: number = 3,
  currentDepth: number = 0
): boolean => {
  if (currentDepth >= maxDepth) {
    return obj1 === obj2;
  }

  if (obj1 === obj2) {
    return true;
  }

  if (obj1 == null || obj2 == null) {
    return obj1 === obj2;
  }

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1 as Record<string, unknown>);
  const keys2 = Object.keys(obj2 as Record<string, unknown>);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = (obj1 as Record<string, unknown>)[key];
    const val2 = (obj2 as Record<string, unknown>)[key];
    
    if (!deepEqual(val1, val2, maxDepth, currentDepth + 1)) {
      return false;
    }
  }

  return true;
};

// Selector memoization for state management
export const createSelector = <State, Selected>(
  selector: (state: State) => Selected,
  equalityFn: (a: Selected, b: Selected) => boolean = shallowEqual as (a: Selected, b: Selected) => boolean
) => {
  let lastState: State | undefined;
  let lastSelected: Selected;

  return (state: State): Selected => {
    if (lastState === undefined || lastState !== state) {
      const newSelected = selector(state);
      
      if (lastState === undefined || !equalityFn(lastSelected, newSelected)) {
        lastSelected = newSelected;
      }
      
      lastState = state;
    }
    
    return lastSelected;
  };
};

// Throttle utility for performance optimization
export const throttle = <T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
): ((...args: T) => void) => {
  let lastCall = 0;
  
  return (...args: T) => {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};

// Debounce utility for performance optimization
export const debounce = <T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
): ((...args: T) => void) => {
  let timeoutId: number;
  
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay) as unknown as number;
  };
};
