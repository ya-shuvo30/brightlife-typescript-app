import type { Plan, CoreService, Hospital, Member } from '../types/business';
import type { AsyncState, ApiResponse } from '../types/api';

/**
 * Type-safe API utility functions with proper error handling
 * Demonstrates modern TypeScript patterns and error boundary integration
 */

// Type guards for runtime type checking
export const isApiResponse = <T>(obj: unknown): obj is ApiResponse<T> => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'data' in obj &&
    'success' in obj &&
    typeof (obj as Record<string, unknown>).success === 'boolean'
  );
};

export const isPlan = (obj: unknown): obj is Plan => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'price' in obj &&
    typeof (obj as Record<string, unknown>).id === 'string' &&
    typeof (obj as Record<string, unknown>).name === 'string' &&
    typeof (obj as Record<string, unknown>).price === 'number'
  );
};

export const isCoreService = (obj: unknown): obj is CoreService => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'description' in obj &&
    typeof (obj as Record<string, unknown>).id === 'string' &&
    typeof (obj as Record<string, unknown>).name === 'string' &&
    typeof (obj as Record<string, unknown>).description === 'string'
  );
};

/**
 * Generic API wrapper with comprehensive error handling
 */
export class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    };
  }

  /**
   * Generic GET request with type safety
   */
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: { ...this.defaultHeaders, ...headers }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        data,
        success: true,
        message: 'Request successful',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        data: null as T,
        success: false,
        timestamp: new Date().toISOString(),
        errors: [{
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }]
      };
    }
  }

  /**
   * Generic POST request with type safety
   */
  async post<T, U = unknown>(
    endpoint: string, 
    body: U, 
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { ...this.defaultHeaders, ...headers },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        data,
        success: true,
        message: 'Request successful',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        data: null as T,
        success: false,
        timestamp: new Date().toISOString(),
        errors: [{
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }]
      };
    }
  }
}

/**
 * Utility function to create async state
 */
export const createAsyncState = <T>(initialData: T | null = null): AsyncState<T> => ({
  data: initialData,
  loading: false,
  error: null
});

/**
 * Update async state with loading
 */
export const setAsyncLoading = <T>(state: AsyncState<T>): AsyncState<T> => ({
  ...state,
  loading: true,
  error: null
});

/**
 * Update async state with success
 */
export const setAsyncSuccess = <T>(_state: AsyncState<T>, data: T): AsyncState<T> => ({
  data,
  loading: false,
  error: null
});

/**
 * Update async state with error
 */
export const setAsyncError = <T>(state: AsyncState<T>, error: Error): AsyncState<T> => ({
  ...state,
  loading: false,
  error: error.message
});

/**
 * Format currency with proper localization
 */
export const formatCurrency = (
  amount: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Format date with proper localization
 */
export const formatDate = (
  date: Date | string, 
  options?: Intl.DateTimeFormatOptions,
  locale: string = 'en-US'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(dateObj);
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: readonly unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: readonly unknown[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Generate unique ID
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Deep clone utility with type preservation
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
};

/**
 * Safe array access with default value
 */
export const safeArrayAccess = <T>(
  array: readonly T[], 
  index: number, 
  defaultValue: T
): T => {
  return array[index] ?? defaultValue;
};

/**
 * Group array by key function
 */
export const groupBy = <T, K extends string | number | symbol>(
  array: readonly T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

/**
 * Filter plans by price range
 */
export const filterPlansByPrice = (
  plans: readonly Plan[], 
  minPrice: number, 
  maxPrice: number
): Plan[] => {
  return plans.filter(plan => plan.price >= minPrice && plan.price <= maxPrice);
};

/**
 * Search services by name or description
 */
export const searchServices = (
  services: readonly CoreService[], 
  query: string
): CoreService[] => {
  const lowercaseQuery = query.toLowerCase();
  return services.filter(service => 
    service.title.toLowerCase().includes(lowercaseQuery) ||
    service.description.toLowerCase().includes(lowercaseQuery)
  );
};

/**
 * Sort hospitals by rating
 */
export const sortHospitalsByRating = (hospitals: readonly Hospital[]): Hospital[] => {
  return [...hospitals].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
};

/**
 * Get featured members (verified members with high ratings)
 */
export const getFeaturedMembers = (members: readonly Member[]): Member[] => {
  return members.filter(member => member.verified && member.rating >= 4.5);
};
