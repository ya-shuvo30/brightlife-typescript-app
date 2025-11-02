import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

/**
 * Theme-related hooks
 * Separated for Fast Refresh compatibility
 */

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme persistence hook
export const useThemePersistence = () => {
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('brightlife-theme', theme);
    } catch (error) {
      console.warn('Failed to store theme in localStorage:', error);
    }
  }, [theme]);

  return { theme, setTheme };
};

// Theme transition hook
export const useThemeTransition = (duration: number = 300) => {
  const { resolvedTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), duration);
    return () => clearTimeout(timer);
  }, [resolvedTheme, duration]);

  return isTransitioning;
};

// Theme-aware media query hook
export const useThemeAwareMediaQuery = (query: string) => {
  const { resolvedTheme } = useTheme();
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query, resolvedTheme]);

  return matches;
};
