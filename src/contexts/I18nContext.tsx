import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

/**
 * Internationalization (i18n) System
 * Provides translation support and locale management
 */

export type Locale = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja' | 'ko' | 'zh';

export interface Translation {
  [key: string]: string | Translation;
}

export interface TranslationFiles {
  [locale: string]: Translation;
}

export interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  translations: Translation;
  isLoading: boolean;
  availableLocales: Locale[];
}

// Default locale
const DEFAULT_LOCALE: Locale = 'en';

// Storage key for locale preference
const LOCALE_STORAGE_KEY = 'brightlife-locale';

// Create context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Translation loading cache
const translationCache = new Map<Locale, Translation>();

// Default translations (fallback)
const defaultTranslations: TranslationFiles = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout'
    },
    navigation: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      contact: 'Contact',
      blog: 'Blog'
    },
    theme: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      toggle: 'Toggle theme'
    },
    pwa: {
      install: 'Install App',
      update: 'Update Available',
      offline: 'You are offline',
      online: 'You are back online'
    },
    errors: {
      notFound: 'Page not found',
      serverError: 'Server error',
      networkError: 'Network error',
      tryAgain: 'Please try again'
    }
  },
  es: {
    common: {
      loading: 'Cargando...',
      error: 'Error',
      retry: 'Reintentar',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      close: 'Cerrar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      settings: 'Configuración',
      profile: 'Perfil',
      logout: 'Cerrar sesión'
    },
    navigation: {
      home: 'Inicio',
      about: 'Acerca de',
      services: 'Servicios',
      contact: 'Contacto',
      blog: 'Blog'
    },
    theme: {
      light: 'Claro',
      dark: 'Oscuro',
      system: 'Sistema',
      toggle: 'Cambiar tema'
    },
    pwa: {
      install: 'Instalar App',
      update: 'Actualización Disponible',
      offline: 'Estás sin conexión',
      online: 'Ya tienes conexión'
    },
    errors: {
      notFound: 'Página no encontrada',
      serverError: 'Error del servidor',
      networkError: 'Error de red',
      tryAgain: 'Inténtalo de nuevo'
    }
  }
};

// Get browser locale
const getBrowserLocale = (): Locale => {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  
  const language = navigator.language.toLowerCase();
  const supportedLocales: Locale[] = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'];
  
  // Check exact match first
  const exactMatch = supportedLocales.find(locale => language === locale);
  if (exactMatch) return exactMatch;
  
  // Check language code (first part)
  const languageCode = language.split('-')[0] as Locale;
  const codeMatch = supportedLocales.find(locale => locale === languageCode);
  if (codeMatch) return codeMatch;
  
  return DEFAULT_LOCALE;
};

// Get stored locale
const getStoredLocale = (): Locale => {
  if (typeof localStorage === 'undefined') return getBrowserLocale();
  
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && Object.keys(defaultTranslations).includes(stored)) {
      return stored as Locale;
    }
  } catch (error) {
    console.warn('Failed to read locale from localStorage:', error);
  }
  
  return getBrowserLocale();
};

// Store locale
const storeLocale = (locale: Locale): void => {
  if (typeof localStorage === 'undefined') return;
  
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (error) {
    console.warn('Failed to store locale in localStorage:', error);
  }
};

// Load translations dynamically
const loadTranslations = async (locale: Locale): Promise<Translation> => {
  // Check cache first
  if (translationCache.has(locale)) {
    return translationCache.get(locale)!;
  }

  try {
    // Try to load from external file
    const response = await fetch(`/locales/${locale}.json`);
    if (response.ok) {
      const translations = await response.json();
      translationCache.set(locale, translations);
      return translations;
    }
  } catch (error) {
    console.warn(`Failed to load translations for ${locale}:`, error);
  }

  // Fallback to default translations
  const fallback = defaultTranslations[locale] || defaultTranslations[DEFAULT_LOCALE];
  translationCache.set(locale, fallback);
  return fallback;
};

// Translation function
const translate = (
  translations: Translation,
  key: string,
  params?: Record<string, string | number>
): string => {
  const keys = key.split('.');
  let value: string | Translation = translations;

  // Navigate through nested keys
  for (const k of keys) {
    if (typeof value === 'object' && value !== null && k in value) {
      value = value[k];
    } else {
      // Key not found, return the key itself as fallback
      return key;
    }
  }

  // Ensure we have a string
  if (typeof value !== 'string') {
    return key;
  }

  // Replace parameters
  if (params) {
    let result = value;
    Object.entries(params).forEach(([param, val]) => {
      result = result.replace(new RegExp(`{{${param}}}`, 'g'), String(val));
    });
    return result;
  }

  return value;
};

// I18n Provider Props
interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
  availableLocales?: Locale[];
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  defaultLocale = DEFAULT_LOCALE,
  availableLocales = ['en', 'es']
}) => {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [translations, setTranslations] = useState<Translation>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load initial locale and translations
  useEffect(() => {
    const initializeI18n = async () => {
      const storedLocale = getStoredLocale();
      const initialLocale = availableLocales.includes(storedLocale) ? storedLocale : defaultLocale;
      
      setLocaleState(initialLocale);
      
      try {
        const loadedTranslations = await loadTranslations(initialLocale);
        setTranslations(loadedTranslations);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        setTranslations(defaultTranslations[defaultLocale]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeI18n();
  }, [defaultLocale, availableLocales]);

  // Set locale function
  const setLocale = async (newLocale: Locale) => {
    if (newLocale === locale) return;

    setIsLoading(true);
    
    try {
      const newTranslations = await loadTranslations(newLocale);
      setLocaleState(newLocale);
      setTranslations(newTranslations);
      storeLocale(newLocale);
      
      // Update document language
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLocale;
      }
    } catch (error) {
      console.error('Failed to change locale:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    return translate(translations, key, params);
  };

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    translations,
    isLoading,
    availableLocales
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export { I18nContext };
