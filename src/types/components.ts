// Component-specific prop interfaces
import type { ReactNode, HTMLAttributes } from 'react';
import type { Plan, CoreService, Hospital, Member, TeamMember, Partner } from './business';
import type { AsyncState } from './api';
import type { ButtonVariant, ButtonSize } from './ui';

// Common component props
export interface BaseComponentProps {
  readonly className?: string;
  readonly children?: ReactNode;
  readonly testId?: string;
}

// Layout components
export interface LayoutProps extends BaseComponentProps {
  readonly header?: ReactNode;
  readonly footer?: ReactNode;
  readonly sidebar?: ReactNode;
}

export interface SectionProps extends BaseComponentProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly id?: string;
  readonly fullWidth?: boolean;
  // HTML attributes can be spread separately
  readonly htmlProps?: HTMLAttributes<HTMLElement>;
}

// Navigation components
export interface NavbarProps extends BaseComponentProps {
  readonly logo?: string;
  readonly brand?: string;
  readonly sticky?: boolean;
  readonly transparent?: boolean;
  readonly onMenuToggle?: () => void;
}

export interface MenuItemProps extends BaseComponentProps {
  readonly href: string;
  readonly label: string;
  readonly active?: boolean;
  readonly external?: boolean;
  readonly icon?: string;
  readonly onClick?: () => void;
}

// Button components
export interface ButtonProps extends BaseComponentProps {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly loading?: boolean;
  readonly leftIcon?: string;
  readonly rightIcon?: string;
  readonly fullWidth?: boolean;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
  readonly type?: 'button' | 'submit' | 'reset';
}

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  readonly icon: string;
  readonly 'aria-label': string;
}

// Form components
export interface InputProps extends BaseComponentProps {
  readonly label?: string;
  readonly placeholder?: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly type?: 'text' | 'email' | 'tel' | 'password' | 'url' | 'search';
  readonly value?: string;
  readonly onChange?: (value: string) => void;
}

export interface TextareaProps extends Omit<InputProps, 'type'> {
  readonly rows?: number;
  readonly resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export interface SelectProps extends BaseComponentProps {
  readonly label?: string;
  readonly placeholder?: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly value?: string;
  readonly onChange?: (value: string) => void;
  readonly options: readonly SelectOption[];
}

export interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

// Card components
export interface CardProps extends BaseComponentProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly image?: string;
  readonly imageAlt?: string;
  readonly actions?: ReactNode;
  readonly hover?: boolean;
  readonly clickable?: boolean;
  readonly onClick?: () => void;
}

export interface PlanCardProps extends BaseComponentProps {
  readonly plan: Plan;
  readonly featured?: boolean;
  readonly onSelect?: (plan: Plan) => void;
}

export interface ServiceCardProps extends BaseComponentProps {
  readonly service: CoreService;
  readonly compact?: boolean;
  readonly onLearnMore?: (service: CoreService) => void;
}

export interface HospitalCardProps extends BaseComponentProps {
  readonly hospital: Hospital;
  readonly showDetails?: boolean;
  readonly onViewDetails?: (hospital: Hospital) => void;
}

export interface MemberCardProps extends BaseComponentProps {
  readonly member: Member;
  readonly showTestimonial?: boolean;
  readonly compact?: boolean;
}

export interface TeamCardProps extends BaseComponentProps {
  readonly member: TeamMember;
  readonly showBio?: boolean;
  readonly onContactMember?: (member: TeamMember) => void;
}

export interface PartnerCardProps extends BaseComponentProps {
  readonly partner: Partner;
  readonly size?: 'small' | 'medium' | 'large';
  readonly grayscale?: boolean;
}

// Statistics components
export interface StatCounterProps extends BaseComponentProps {
  readonly value: number;
  readonly label: string;
  readonly suffix?: string;
  readonly prefix?: string;
  readonly duration?: number;
  readonly separator?: string;
  readonly decimals?: number;
}

export interface StatsGridProps extends BaseComponentProps {
  readonly stats: readonly StatItem[];
  readonly columns?: 2 | 3 | 4;
  readonly animated?: boolean;
}

export interface StatItem {
  readonly value: number;
  readonly label: string;
  readonly suffix?: string;
  readonly prefix?: string;
  readonly icon?: string;
}

// Modal components
export interface ComponentModalProps extends BaseComponentProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly size?: 'small' | 'medium' | 'large' | 'full';
  readonly closable?: boolean;
  readonly maskClosable?: boolean;
  readonly actions?: ReactNode;
}

export interface ConfirmModalProps extends Omit<ComponentModalProps, 'children'> {
  readonly message: string;
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly onConfirm: () => void;
  readonly loading?: boolean;
  readonly type?: 'info' | 'warning' | 'error' | 'success';
}

// Loading components
export interface LoadingProps extends BaseComponentProps {
  readonly size?: 'small' | 'medium' | 'large';
  readonly text?: string;
  readonly overlay?: boolean;
}

export interface SkeletonProps extends BaseComponentProps {
  readonly width?: string | number;
  readonly height?: string | number;
  readonly circle?: boolean;
  readonly lines?: number;
  readonly animated?: boolean;
}

// Error components
export interface ErrorBoundaryProps extends BaseComponentProps {
  readonly fallback?: ReactNode;
  readonly onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface ErrorMessageProps extends BaseComponentProps {
  readonly error: Error | string;
  readonly retry?: () => void;
  readonly showDetails?: boolean;
}

// Data display components
export interface ListProps<T> extends BaseComponentProps {
  readonly items: readonly T[];
  readonly renderItem: (item: T, index: number) => ReactNode;
  readonly loading?: boolean;
  readonly empty?: ReactNode;
  readonly error?: string;
  readonly keyExtractor?: (item: T, index: number) => string;
}

export interface PaginationProps extends BaseComponentProps {
  readonly current: number;
  readonly total: number;
  readonly pageSize: number;
  readonly showSizeChanger?: boolean;
  readonly showQuickJumper?: boolean;
  readonly showTotal?: boolean;
  readonly onChange: (page: number, pageSize?: number) => void;
}

// Search components
export interface SearchProps extends BaseComponentProps {
  readonly placeholder?: string;
  readonly value?: string;
  readonly loading?: boolean;
  readonly onSearch: (query: string) => void;
  readonly onClear?: () => void;
  readonly suggestions?: readonly SearchSuggestion[];
}

export interface SearchSuggestion {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly category?: string;
}

// Filter components
export interface FilterProps extends BaseComponentProps {
  readonly filters: readonly FilterOption[];
  readonly activeFilters: readonly string[];
  readonly onChange: (filters: readonly string[]) => void;
  readonly clearable?: boolean;
}

export interface FilterOption {
  readonly key: string;
  readonly label: string;
  readonly count?: number;
  readonly disabled?: boolean;
}

// Carousel components
export interface CarouselProps extends BaseComponentProps {
  readonly autoplay?: boolean;
  readonly interval?: number;
  readonly showDots?: boolean;
  readonly showArrows?: boolean;
  readonly infinite?: boolean;
  readonly slidesToShow?: number;
  readonly slidesToScroll?: number;
}

// Async data components
export interface AsyncDataProps<T> extends BaseComponentProps {
  readonly state: AsyncState<T>;
  readonly onRetry?: () => void;
  readonly loadingComponent?: ReactNode;
  readonly errorComponent?: ReactNode;
  readonly emptyComponent?: ReactNode;
}

// Form validation
export interface FormErrors {
  readonly [field: string]: string | undefined;
}

export interface ComponentFormState<T> {
  readonly values: T;
  readonly errors: FormErrors;
  readonly touched: Readonly<Record<keyof T, boolean>>;
  readonly isSubmitting: boolean;
  readonly isValid: boolean;
}

// Hook return types
export interface UseToggleReturn {
  readonly value: boolean;
  readonly toggle: () => void;
  readonly setTrue: () => void;
  readonly setFalse: () => void;
}

export interface UseAsyncReturn<T> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: Error | null;
  readonly execute: (...args: readonly unknown[]) => Promise<T>;
  readonly reset: () => void;
}

export interface UseLocalStorageReturn<T> {
  readonly value: T;
  readonly setValue: (value: T | ((prev: T) => T)) => void;
  readonly removeValue: () => void;
}
