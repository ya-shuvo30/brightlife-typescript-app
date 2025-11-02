import React from 'react';
import { useLocale, useTranslation } from '../../hooks/useI18n';
import type { Locale } from '../../contexts/I18nContext';

/**
 * Language Selector Component
 * Provides UI for switching between available locales
 */

interface LanguageSelectorProps {
  className?: string;
  showFlag?: boolean;
  variant?: 'dropdown' | 'buttons' | 'compact';
}

// Language configurations
const languageConfig: Record<Locale, { name: string; nativeName: string; flag: string }> = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' }
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  showFlag = true,
  variant = 'dropdown'
}) => {
  const { locale, setLocale, availableLocales } = useLocale();
  const { t } = useTranslation();

  const handleLocaleChange = async (newLocale: Locale) => {
    await setLocale(newLocale);
  };

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={locale}
          onChange={(e) => handleLocaleChange(e.target.value as Locale)}
          className="
            appearance-none bg-white dark:bg-gray-800 
            border border-gray-300 dark:border-gray-600 
            rounded-md px-3 py-2 pr-8
            text-sm text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500
            cursor-pointer
          "
          aria-label="Select language"
        >
          {availableLocales.map((loc) => (
            <option key={loc} value={loc}>
              {showFlag ? `${languageConfig[loc].flag} ` : ''}
              {languageConfig[loc].nativeName}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
          {t('common.language')}:
        </span>
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {availableLocales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={`
                px-3 py-1 rounded-md text-xs font-medium transition-all duration-200
                ${locale === loc
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }
              `}
              aria-label={`Switch to ${languageConfig[loc].name}`}
            >
              {showFlag ? `${languageConfig[loc].flag} ` : ''}
              {languageConfig[loc].nativeName}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Compact variant
  return (
    <div className={`relative ${className}`}>
      <button
        className="
          flex items-center space-x-2 px-3 py-2
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-600
          rounded-md text-sm
          text-gray-900 dark:text-white
          hover:bg-gray-50 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors duration-200
        "
        aria-label={`Current language: ${languageConfig[locale].name}`}
      >
        {showFlag && <span>{languageConfig[locale].flag}</span>}
        <span>{locale.toUpperCase()}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
};

// Mini language flag component
export const LanguageFlag: React.FC<{ locale: Locale; className?: string }> = ({ 
  locale, 
  className = '' 
}) => (
  <span className={`inline-block ${className}`} title={languageConfig[locale].name}>
    {languageConfig[locale].flag}
  </span>
);

// Language name component
export const LanguageName: React.FC<{ 
  locale: Locale; 
  variant?: 'native' | 'english'; 
  className?: string 
}> = ({ 
  locale, 
  variant = 'native', 
  className = '' 
}) => (
  <span className={className}>
    {variant === 'native' ? languageConfig[locale].nativeName : languageConfig[locale].name}
  </span>
);
