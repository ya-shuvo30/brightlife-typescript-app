// Utility types and helper types

// Make all properties optional recursively
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Make all properties required recursively
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Pick properties by value type
export type PickByValueType<T, U> = Pick<T, {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T]>;

// Omit properties by value type
export type OmitByValueType<T, U> = Pick<T, {
  [K in keyof T]: T[K] extends U ? never : K;
}[keyof T]>;

// Extract function parameter types
export type ExtractFunctionParams<T> = T extends (...args: infer P) => unknown ? P : never;

// Create a type with all properties as optional except specified keys
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Create a union of all possible dot-notation paths through an object
export type Paths<T> = T extends object ? {
  [K in keyof T]: K extends string
    ? T[K] extends object
      ? `${K}` | `${K}.${Paths<T[K]>}`
      : `${K}`
    : never;
}[keyof T] : never;

// Get the type at a specific path
export type PathValue<T, P extends Paths<T>> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Paths<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

// Environment configuration
export interface Environment {
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly API_BASE_URL: string;
  readonly APP_VERSION: string;
  readonly BUILD_TIME: string;
  readonly FEATURE_FLAGS: FeatureFlags;
}

export interface FeatureFlags {
  readonly ENABLE_ANALYTICS: boolean;
  readonly ENABLE_CHAT_SUPPORT: boolean;
  readonly ENABLE_DARK_MODE: boolean;
  readonly ENABLE_OFFLINE_MODE: boolean;
  readonly BETA_FEATURES: boolean;
}

// Generic event handler types
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Generic callback types
export type Callback<T = void> = () => T;
export type AsyncCallback<T = void> = () => Promise<T>;

// Generic predicate types
export type Predicate<T> = (value: T) => boolean;
export type AsyncPredicate<T> = (value: T) => Promise<boolean>;

// Generic transformer types
export type Transformer<T, U> = (value: T) => U;
export type AsyncTransformer<T, U> = (value: T) => Promise<U>;

// Validation types
export interface ValidationRule<T> {
  readonly name: string;
  readonly validator: Predicate<T>;
  readonly message: string;
}

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
}

// Error types
export interface AppError extends Error {
  readonly code: string;
  readonly context?: Record<string, unknown>;
  readonly timestamp: string;
}

// Logger types
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  readonly level: LogLevel;
  readonly message: string;
  readonly timestamp: string;
  readonly context?: Record<string, unknown>;
}

// Performance monitoring
export interface PerformanceMetrics {
  readonly loadTime: number;
  readonly renderTime: number;
  readonly interactionTime: number;
  readonly memoryUsage?: number;
}

// Feature detection
export interface BrowserCapabilities {
  readonly supportsWebP: boolean;
  readonly supportsIntersectionObserver: boolean;
  readonly supportsLocalStorage: boolean;
  readonly supportsServiceWorker: boolean;
  readonly isTouchDevice: boolean;
  readonly isRetina: boolean;
}
