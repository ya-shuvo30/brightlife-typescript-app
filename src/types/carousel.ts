// carousel.ts - Carousel Type Definitions for Bright Life Bangladesh
export interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  features: string[];
  buttonText: string;
  buttonAction: string;
  image: string;
  imageAlt: string;
  backgroundGradient: string;
  textColor: string;
  buttonVariant: 'primary' | 'secondary' | 'success' | 'outline';
  isActive?: boolean;
}

export interface CarouselConfig {
  autoPlayInterval: number;
  transitionDuration: number;
  pauseOnHover: boolean;
  enableSwipe: boolean;
  enableKeyboard: boolean;
  showArrows: boolean;
  showDots: boolean;
  infiniteLoop: boolean;
}

export interface CarouselState {
  currentSlide: number;
  slides: CarouselSlide[];
  isPlaying: boolean;
  isTransitioning: boolean;
  config: CarouselConfig;
  totalSlides: number;
}

export interface SwipeGesture {
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  threshold: number;
}

export interface CarouselActions {
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  toggleAutoPlay: () => void;
  pauseAutoPlay: () => void;
  resumeAutoPlay: () => void;
  setTransitioning: (isTransitioning: boolean) => void;
}

// Button variants for Bright Life branding
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

// Intersection Observer options for lazy loading
export interface IntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}
