// UI and component-specific types

// Theme configuration
export interface Theme {
  readonly colors: ThemeColors;
  readonly spacing: ThemeSpacing;
  readonly typography: ThemeTypography;
  readonly breakpoints: ThemeBreakpoints;
}

export interface ThemeColors {
  readonly primary: string;
  readonly secondary: string;
  readonly accent: string;
  readonly success: string;
  readonly warning: string;
  readonly error: string;
  readonly neutral: string;
  readonly background: string;
  readonly surface: string;
  readonly text: string;
}

export interface ThemeSpacing {
  readonly xs: string;
  readonly sm: string;
  readonly md: string;
  readonly lg: string;
  readonly xl: string;
  readonly xxl: string;
}

export interface ThemeTypography {
  readonly fontFamily: {
    readonly primary: string;
    readonly secondary: string;
    readonly mono: string;
  };
  readonly fontSize: {
    readonly xs: string;
    readonly sm: string;
    readonly base: string;
    readonly lg: string;
    readonly xl: string;
    readonly xxl: string;
  };
  readonly fontWeight: {
    readonly light: number;
    readonly normal: number;
    readonly medium: number;
    readonly semibold: number;
    readonly bold: number;
  };
}

export interface ThemeBreakpoints {
  readonly mobile: string;
  readonly tablet: string;
  readonly desktop: string;
  readonly wide: string;
}

// Button variants and sizes
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

// Icon types
export interface IconProps {
  readonly path: string;
  readonly className?: string;
  readonly size?: IconSize;
  readonly solid?: boolean;
  readonly color?: string;
}

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Modal and dialog types
export interface ModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly size?: ModalSize;
  readonly showCloseButton?: boolean;
  readonly children: React.ReactNode;
}

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Toast notification types
export interface ToastNotification {
  readonly id: string;
  readonly type: ToastType;
  readonly title: string;
  readonly message: string;
  readonly duration?: number;
  readonly persistent?: boolean;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Animation types
export type AnimationType = 'fade' | 'slide' | 'bounce' | 'zoom' | 'flip';
export type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'in' | 'out';

export interface AnimationConfig {
  readonly type: AnimationType;
  readonly direction?: AnimationDirection;
  readonly duration?: number;
  readonly delay?: number;
  readonly easing?: string;
}

// Responsive utilities
export type ResponsiveValue<T> = T | {
  readonly mobile?: T;
  readonly tablet?: T;
  readonly desktop?: T;
  readonly wide?: T;
};

// Layout types
export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

// Form input types
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'filled' | 'outline';

// Carousel types
export interface CarouselConfig {
  readonly autoPlay?: boolean;
  readonly interval?: number;
  readonly loop?: boolean;
  readonly showDots?: boolean;
  readonly showArrows?: boolean;
  readonly slidesToShow?: number;
  readonly slidesToScroll?: number;
}
