import React, { useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import { colors, typography, spacing } from './tokens';
import type { ComponentSize } from './tokens';
import { DesignSystemContext } from './context';
import type { ThemeConfig, DesignSystemContextType } from './context';

/**
 * Design System Provider
 * Provides theme context and utilities throughout the application
 */

// Default Theme
const defaultTheme: ThemeConfig = {
  mode: 'light',
  primaryColor: 'primary',
  fontSize: 'base',
  density: 'comfortable',
  reducedMotion: false,
  highContrast: false,
};

// Theme Actions
type ThemeAction =
  | { type: 'SET_MODE'; payload: ThemeConfig['mode'] }
  | { type: 'SET_PRIMARY_COLOR'; payload: ThemeConfig['primaryColor'] }
  | { type: 'SET_FONT_SIZE'; payload: ThemeConfig['fontSize'] }
  | { type: 'SET_DENSITY'; payload: ThemeConfig['density'] }
  | { type: 'TOGGLE_REDUCED_MOTION' }
  | { type: 'TOGGLE_HIGH_CONTRAST' }
  | { type: 'RESET_THEME' };

// Theme Reducer
const themeReducer = (state: ThemeConfig, action: ThemeAction): ThemeConfig => {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_PRIMARY_COLOR':
      return { ...state, primaryColor: action.payload };
    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.payload };
    case 'SET_DENSITY':
      return { ...state, density: action.payload };
    case 'TOGGLE_REDUCED_MOTION':
      return { ...state, reducedMotion: !state.reducedMotion };
    case 'TOGGLE_HIGH_CONTRAST':
      return { ...state, highContrast: !state.highContrast };
    case 'RESET_THEME':
      return defaultTheme;
    default:
      return state;
  }
};

// Provider Props
interface DesignSystemProviderProps {
  children: ReactNode;
  initialTheme?: Partial<ThemeConfig>;
}

// Provider Component
export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({
  children,
  initialTheme = {},
}) => {
  const [theme, dispatch] = useReducer(themeReducer, {
    ...defaultTheme,
    ...initialTheme,
  });

  // Action Creators
  const setMode = (mode: ThemeConfig['mode']) => 
    dispatch({ type: 'SET_MODE', payload: mode });
  
  const setPrimaryColor = (color: ThemeConfig['primaryColor']) => 
    dispatch({ type: 'SET_PRIMARY_COLOR', payload: color });
  
  const setFontSize = (size: ThemeConfig['fontSize']) => 
    dispatch({ type: 'SET_FONT_SIZE', payload: size });
  
  const setDensity = (density: ThemeConfig['density']) => 
    dispatch({ type: 'SET_DENSITY', payload: density });
  
  const toggleReducedMotion = () => 
    dispatch({ type: 'TOGGLE_REDUCED_MOTION' });
  
  const toggleHighContrast = () => 
    dispatch({ type: 'TOGGLE_HIGH_CONTRAST' });
  
  const resetTheme = () => 
    dispatch({ type: 'RESET_THEME' });

  // Utility Functions
  const getColor = (color: string): string => {
    // Parse color strings like "primary.500" or "red.600"
    const [colorKey, shade] = color.split('.');
    
    if (colorKey in colors && shade) {
      const colorObj = colors[colorKey as keyof typeof colors];
      if (typeof colorObj === 'object' && shade in colorObj) {
        return (colorObj as Record<string, string>)[shade];
      }
    }
    
    // Fallback to direct color value
    return color;
  };
  
  const getSpacing = (space: string): string => {
    return (spacing as Record<string, string>)[space] || space;
  };
  
  const getTypography = (key: string): string => {
    return (typography.fontSize as Record<string, string>)[key] || key;
  };
  
  const getFontWeight = (weight: string): string => {
    return (typography.fontWeight as Record<string, string>)[weight] || weight;
  };

  // Component Class Generator
  const getComponentClasses = (
    component: string, 
    variant: string = 'default', 
    size: ComponentSize = 'md'
  ): string => {
    const baseClasses = `ds-${component}`;
    const variantClasses = `ds-${component}--${variant}`;
    const sizeClasses = `ds-${component}--${size}`;
    const densityClasses = `ds-density--${theme.density}`;
    const modeClasses = `ds-mode--${theme.mode}`;
    
    return [
      baseClasses,
      variantClasses,
      sizeClasses,
      densityClasses,
      modeClasses,
      theme.reducedMotion && 'ds-reduced-motion',
      theme.highContrast && 'ds-high-contrast',
    ].filter(Boolean).join(' ');
  };

  // CSS Custom Properties Generator
  const getCSSCustomProperties = useCallback((): Record<string, string> => {
    const primaryColorObj = colors[theme.primaryColor];
    const properties: Record<string, string> = {};
    
    // Add primary color variants
    if (typeof primaryColorObj === 'object') {
      Object.entries(primaryColorObj).forEach(([shade, value]) => {
        properties[`--color-primary-${shade}`] = value;
      });
    }
    
    // Add theme-specific properties
    properties['--font-size-base'] = typography.fontSize[theme.fontSize];
    properties['--spacing-unit'] = theme.density === 'compact' ? '0.75rem' : 
                                   theme.density === 'spacious' ? '1.25rem' : '1rem';
    
    return properties;
  }, [theme]);

  // Create context value
  const contextValue: DesignSystemContextType = {
    theme,
    setMode,
    setPrimaryColor,
    setFontSize,
    setDensity,
    toggleReducedMotion,
    toggleHighContrast,
    resetTheme,
    getColor,
    getSpacing,
    getTypography,
    getFontWeight,
    getComponentClasses,
    getCSSCustomProperties,
  };

  // Apply CSS custom properties to the root
  React.useEffect(() => {
    const root = document.documentElement;
    const properties = getCSSCustomProperties();
    
    Object.entries(properties).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Apply theme classes to body
    document.body.className = [
      document.body.className.replace(/ds-\w+/g, '').trim(),
      `ds-mode--${theme.mode}`,
      `ds-density--${theme.density}`,
      theme.reducedMotion && 'ds-reduced-motion',
      theme.highContrast && 'ds-high-contrast',
    ].filter(Boolean).join(' ');
  }, [theme, getCSSCustomProperties]);

  // Handle system preferences
  React.useEffect(() => {
    if (theme.mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        document.body.classList.toggle('ds-mode--dark', mediaQuery.matches);
        document.body.classList.toggle('ds-mode--light', !mediaQuery.matches);
      };
      
      handleChange();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme.mode]);

  // Handle reduced motion preference
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      if (mediaQuery.matches) {
        dispatch({ type: 'TOGGLE_REDUCED_MOTION' });
      }
    };
    
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <DesignSystemContext.Provider value={contextValue}>
      {children}
    </DesignSystemContext.Provider>
  );
};
