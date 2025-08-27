// Navigation and routing types

// Page identifiers for navigation
export type PageId = 
  | 'home'
  | 'aboutus' 
  | 'ourservices'
  | 'networkhospital'
  | 'supershop'
  | 'transportation'
  | 'valuedmembers'
  | 'registration'
  | 'contact'
  | 'insurancepartner'
  | 'customersupport'
  | 'termsandconditions'
  | 'privacypolicy'
  | 'returnandrefundpolicy';

// Navigation function type
export type NavigationFunction = (page: PageId) => void;

// Menu item structure
export interface MenuItem {
  readonly id: string;
  readonly label: string;
  readonly pageId: PageId;
  readonly icon?: string;
  readonly badge?: string;
  readonly disabled?: boolean;
  readonly children?: readonly MenuItem[];
}

// Dropdown menu state
export interface DropdownState {
  readonly isOpen: boolean;
  readonly activeItem?: string;
}

// Navigation state for complex routing
export interface NavigationState {
  readonly currentPage: PageId;
  readonly previousPage?: PageId;
  readonly breadcrumbs: readonly Breadcrumb[];
  readonly canGoBack: boolean;
  readonly canGoForward: boolean;
}

export interface Breadcrumb {
  readonly label: string;
  readonly pageId: PageId;
  readonly isActive: boolean;
}

// Scroll behavior configuration
export interface ScrollConfig {
  readonly behavior: ScrollBehavior;
  readonly block: ScrollLogicalPosition;
  readonly inline?: ScrollLogicalPosition;
}

// URL parameters for deep linking
export interface RouteParams {
  readonly section?: string;
  readonly id?: string;
  readonly category?: string;
  readonly [key: string]: string | undefined;
}

// Navigation guard types
export type NavigationGuard = (to: PageId, from?: PageId) => boolean | Promise<boolean>;

// Navigation hooks
export interface NavigationHooks {
  readonly beforeNavigate?: NavigationGuard;
  readonly afterNavigate?: (to: PageId, from?: PageId) => void;
  readonly onNavigationError?: (error: Error, to: PageId) => void;
}
