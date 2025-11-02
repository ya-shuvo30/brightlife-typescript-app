import React, { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * Theme Management System
 * Provides dark/light theme support with system preference detection
 */

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext };

// Theme storage key
const THEME_STORAGE_KEY = 'brightlife-theme';

// Get system theme preference
const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Get stored theme from localStorage
const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored as Theme;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }
  return 'system';
};

// Store theme in localStorage
const storeTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to store theme in localStorage:', error);
  }
};

// Resolve theme based on preference and system setting
const resolveTheme = (theme: Theme, systemTheme: ResolvedTheme): ResolvedTheme => {
  return theme === 'system' ? systemTheme : theme;
};

// Apply theme to document
const applyTheme = (resolvedTheme: ResolvedTheme): void => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  const isDark = resolvedTheme === 'dark';
  
  // Update class for Tailwind CSS
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', isDark ? '#1f2937' : '#ffffff');
  }
  
  // Update color-scheme for native UI elements
  root.style.colorScheme = resolvedTheme;
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  attribute?: string;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  enableSystem = true
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from storage
  useEffect(() => {
    const storedTheme = getStoredTheme();
    const currentSystemTheme = getSystemTheme();
    
    setThemeState(storedTheme);
    setSystemTheme(currentSystemTheme);
    setIsInitialized(true);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [enableSystem]);

  // Apply theme when it changes
  const resolvedTheme = resolveTheme(theme, systemTheme);
  
  useEffect(() => {
    if (!isInitialized) return;
    applyTheme(resolvedTheme);
  }, [resolvedTheme, isInitialized]);

  // Set theme function
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    storeTheme(newTheme);
  };

  // Toggle between light and dark (ignores system)
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    systemTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
