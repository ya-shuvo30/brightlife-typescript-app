import { useContext } from 'react';
import { I18nContext } from '../contexts/I18nContext';
import type { Locale } from '../contexts/I18nContext';

/**
 * Internationalization Hooks
 * Separated for Fast Refresh compatibility
 */

// Main i18n hook
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Translation hook
export const useTranslation = () => {
  const { t, locale, isLoading } = useI18n();
  return { t, locale, isLoading };
};

// Locale management hook
export const useLocale = () => {
  const { locale, setLocale, availableLocales } = useI18n();
  return { locale, setLocale, availableLocales };
};

// Format utilities hook
export const useFormatters = () => {
  const { locale } = useI18n();

  const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(locale, options).format(value);
  };

  const formatCurrency = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(value);
  };

  const formatDate = (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  };

  const formatTime = (date: Date | string | number) => {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  const formatDateTime = (date: Date | string | number) => {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  const formatRelativeTime = (date: Date | string | number) => {
    const now = new Date();
    const targetDate = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const diffInSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(diffInSeconds, 'second');
    } else if (Math.abs(diffInSeconds) < 3600) {
      return rtf.format(Math.floor(diffInSeconds / 60), 'minute');
    } else if (Math.abs(diffInSeconds) < 86400) {
      return rtf.format(Math.floor(diffInSeconds / 3600), 'hour');
    } else if (Math.abs(diffInSeconds) < 2592000) {
      return rtf.format(Math.floor(diffInSeconds / 86400), 'day');
    } else if (Math.abs(diffInSeconds) < 31536000) {
      return rtf.format(Math.floor(diffInSeconds / 2592000), 'month');
    } else {
      return rtf.format(Math.floor(diffInSeconds / 31536000), 'year');
    }
  };

  const formatList = (items: string[], options?: Intl.ListFormatOptions) => {
    return new Intl.ListFormat(locale, options).format(items);
  };

  return {
    formatNumber,
    formatCurrency,
    formatDate,
    formatTime,
    formatDateTime,
    formatRelativeTime,
    formatList
  };
};

// Pluralization hook
export const usePlural = () => {
  const { locale } = useI18n();

  const getPlural = (count: number, options: {
    zero?: string;
    one?: string;
    two?: string;
    few?: string;
    many?: string;
    other: string;
  }) => {
    const pr = new Intl.PluralRules(locale);
    const rule = pr.select(count);

    switch (rule) {
      case 'zero':
        return options.zero || options.other;
      case 'one':
        return options.one || options.other;
      case 'two':
        return options.two || options.other;
      case 'few':
        return options.few || options.other;
      case 'many':
        return options.many || options.other;
      default:
        return options.other;
    }
  };

  return { getPlural };
};

// RTL (Right-to-Left) support hook
export const useRTL = () => {
  const { locale } = useI18n();

  const rtlLocales: Locale[] = []; // Add RTL locales as needed
  const isRTL = rtlLocales.includes(locale);

  return {
    isRTL,
    direction: isRTL ? 'rtl' : 'ltr',
    textAlign: isRTL ? 'right' : 'left'
  };
};
