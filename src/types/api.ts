// API and data fetching types

// Generic API response wrapper
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T;
  readonly message?: string;
  readonly timestamp: string;
  readonly errors?: ApiError[];
}

// API Error structure
export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
}

// Loading states for async operations
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Generic async state for components
export interface AsyncState<T> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly lastUpdated?: string;
}

// Pagination interface
export interface Pagination {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly hasNext: boolean;
  readonly hasPrev: boolean;
}

// Paginated response wrapper
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  readonly pagination: Pagination;
}

// Search and filter types
export interface SearchParams {
  readonly query?: string;
  readonly category?: string;
  readonly location?: string;
  readonly sortBy?: SortField;
  readonly sortOrder?: SortOrder;
  readonly page?: number;
  readonly limit?: number;
}

export type SortField = 'name' | 'date' | 'rating' | 'price' | 'distance';
export type SortOrder = 'asc' | 'desc';

// Form submission states
export interface FormState<T> {
  readonly values: T;
  readonly errors: Record<keyof T, string>;
  readonly touched: Record<keyof T, boolean>;
  readonly isValid: boolean;
  readonly isSubmitting: boolean;
}

// API endpoints configuration
export interface ApiEndpoints {
  readonly plans: string;
  readonly hospitals: string;
  readonly members: string;
  readonly registration: string;
  readonly contact: string;
  readonly testimonials: string;
}

// HTTP methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Request configuration
export interface RequestConfig {
  readonly method: HttpMethod;
  readonly headers?: Record<string, string>;
  readonly body?: unknown;
  readonly timeout?: number;
}
