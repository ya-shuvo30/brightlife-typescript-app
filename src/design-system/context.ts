import { createContext } from 'react';
import type { ComponentSize } from './tokens';

/**
 * Design System Context
 * Separated for Fast Refresh compatibility
 */

// Theme Configuration
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  fontSize: 'sm' | 'base' | 'lg';
  density: 'compact' | 'comfortable' | 'spacious';
  reducedMotion: boolean;
  highContrast: boolean;
}

// Context Interface
export interface DesignSystemContextType {
  theme: ThemeConfig;
  setMode: (mode: ThemeConfig['mode']) => void;
  setPrimaryColor: (color: ThemeConfig['primaryColor']) => void;
  setFontSize: (size: ThemeConfig['fontSize']) => void;
  setDensity: (density: ThemeConfig['density']) => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  resetTheme: () => void;
  
  // Utility functions
  getColor: (color: string) => string;
  getSpacing: (space: string) => string;
  getTypography: (key: string) => string;
  getFontWeight: (weight: string) => string;
  
  // Component helpers
  getComponentClasses: (component: string, variant?: string, size?: ComponentSize) => string;
  getCSSCustomProperties: () => Record<string, string>;
}

// Create Context
export const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);
