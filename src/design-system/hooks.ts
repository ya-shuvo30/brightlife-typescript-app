import React, { useContext } from 'react';
import { DesignSystemContext } from './context';
import type { ComponentSize } from './tokens';

/**
 * Design System Hooks
 * Separated for Fast Refresh compatibility
 */

// Hook to use Design System
export const useDesignSystem = () => {
  const context = useContext(DesignSystemContext);
  if (!context) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
};

// Utility hook for component styling
export const useComponentStyle = (
  component: string,
  variant?: string,
  size?: ComponentSize,
  additionalClasses?: string
) => {
  const { getComponentClasses } = useDesignSystem();
  
  return React.useMemo(() => {
    const baseClasses = getComponentClasses(component, variant, size);
    return additionalClasses ? `${baseClasses} ${additionalClasses}` : baseClasses;
  }, [component, variant, size, additionalClasses, getComponentClasses]);
};

// Hook for theme utilities
export const useThemeUtils = () => {
  const { getColor, getSpacing, getTypography, getFontWeight } = useDesignSystem();
  
  return {
    getColor,
    getSpacing,
    getTypography,
    getFontWeight,
  };
};

// Hook for responsive values
export const useResponsiveValue = <T>(values: {
  base: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}) => {
  const [currentValue, setCurrentValue] = React.useState<T>(values.base);
  
  React.useEffect(() => {
    const updateValue = () => {
      const width = window.innerWidth;
      
      if (width >= 1536 && values['2xl']) {
        setCurrentValue(values['2xl']);
      } else if (width >= 1280 && values.xl) {
        setCurrentValue(values.xl);
      } else if (width >= 1024 && values.lg) {
        setCurrentValue(values.lg);
      } else if (width >= 768 && values.md) {
        setCurrentValue(values.md);
      } else if (width >= 640 && values.sm) {
        setCurrentValue(values.sm);
      } else {
        setCurrentValue(values.base);
      }
    };
    
    updateValue();
    window.addEventListener('resize', updateValue);
    return () => window.removeEventListener('resize', updateValue);
  }, [values]);
  
  return currentValue;
};
