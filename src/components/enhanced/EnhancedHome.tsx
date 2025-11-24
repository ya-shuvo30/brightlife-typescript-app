import React, { memo, useMemo, useCallback } from 'react';
import { useWindowSize, useIntersectionObserver } from '../../hooks/advanced';
import { LazyWrapper, ProgressiveImage } from '../shared/Loading';
import { withPerformanceMonitoring } from '../../utils/performance';
import type { SectionProps } from '../../types/components';
import logoImage from '../../assets/images/logo.png';

/**
 * Enhanced Home section with modern React patterns
 * Features React.memo, performance optimization, and lazy loading
 */

interface EnhancedHomeProps extends SectionProps {
  navigateTo: (page: string) => void;
  logoSrc?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

// Memoized logo component to prevent unnecessary re-renders
const HomeLogo = memo<{
  src: string;
  alt: string;
  className?: string;
}>(({ src, alt, className }) => {
  return (
    <ProgressiveImage
      src={src}
      alt={alt}
      className={className}
      placeholder="/placeholder-logo.png"
    />
  );
});

HomeLogo.displayName = 'HomeLogo';

// Memoized hero content
const HeroContent = memo<{
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick: () => void;
  isMobile: boolean;
}>(({ title, subtitle, buttonText, onButtonClick, isMobile }) => {
  const titleClasses = useMemo(() => 
    isMobile 
      ? "text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 font-heading"
      : "text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 font-heading",
    [isMobile]
  );

  return (
    <>
      <h1 className={titleClasses}>{title}</h1>
      <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 mb-10 font-body leading-relaxed">
        {subtitle}
      </p>
      <button 
        onClick={onButtonClick}
        className="btn-gold-gradient text-green-900 font-bold py-4 px-10 rounded-full text-lg shadow-xl hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-300"
        type="button"
        aria-label={buttonText}
      >
        {buttonText}
      </button>
    </>
  );
});

HeroContent.displayName = 'HeroContent';

// Optimized animated background
const AnimatedBackground = memo(() => {
  return (
    <div className="absolute inset-0 animated-gradient">
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

// Main enhanced home component
export const EnhancedHome: React.FC<EnhancedHomeProps> = memo(({
  navigateTo,
  logoSrc = logoImage,
  title = 'Your Future, Brighter.',
  subtitle = 'Bright Life Bangladesh offers premier health coverage and exclusive discounts to ensure your peace of mind.',
  buttonText = 'Become a Member',
  className = '',
  ...props
}) => {
  const { isMobile } = useWindowSize();
  const sectionRef = React.useRef<HTMLElement>(null);
  const entry = useIntersectionObserver(sectionRef as React.RefObject<Element>, { 
    threshold: 0.1,
    freezeOnceVisible: true 
  });
  
  // Memoized button click handler
  const handleButtonClick = useCallback(() => {
    navigateTo('Registration');
  }, [navigateTo]);

  // Optimize rendering based on visibility
  const isVisible = entry?.isIntersecting ?? false;

  const sectionClasses = useMemo(() => 
    `relative h-screen flex items-center justify-center text-white overflow-hidden ${className}`,
    [className]
  );

  const contentClasses = useMemo(() => 
    `relative z-10 text-center px-4 flex flex-col items-center transition-opacity duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`,
    [isVisible]
  );

  return (
    <LazyWrapper
      rootMargin="100px"
      fallback={
        <div className="h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-32 h-32 bg-white/20 rounded-full animate-pulse mx-auto mb-8" />
            <div className="w-64 h-8 bg-white/20 rounded animate-pulse mx-auto mb-4" />
            <div className="w-96 h-6 bg-white/20 rounded animate-pulse mx-auto" />
          </div>
        </div>
      }
    >
      <section 
        ref={sectionRef}
        id="home"
        className={sectionClasses}
        {...props.htmlProps}
      >
        <AnimatedBackground />
        
        <div className={contentClasses}>
          <HomeLogo
            src={logoSrc}
            alt="Bright Life Bangladesh Logo"
            className="h-28 w-28 md:h-36 md:w-36 mx-auto mb-8 rounded-full shadow-2xl bg-white/20 p-2 logo-animation"
          />
          
          <HeroContent
            title={title}
            subtitle={subtitle}
            buttonText={buttonText}
            onButtonClick={handleButtonClick}
            isMobile={isMobile}
          />
        </div>
      </section>
    </LazyWrapper>
  );
});

EnhancedHome.displayName = 'EnhancedHome';

// Alternative optimized section template
export const OptimizedSection = memo<{
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backgroundClass?: string;
  className?: string;
}>(({ 
  id, 
  title, 
  subtitle, 
  children, 
  backgroundClass = 'bg-white',
  className = ''
}) => {
  const sectionRef = React.useRef<HTMLElement>(null);
  const entry = useIntersectionObserver(sectionRef as React.RefObject<Element>, { 
    threshold: 0.2,
    freezeOnceVisible: true 
  });

  const isVisible = entry?.isIntersecting ?? false;

  const sectionClasses = useMemo(() => 
    `py-24 ${backgroundClass} ${className}`,
    [backgroundClass, className]
  );

  const contentClasses = useMemo(() => 
    `container mx-auto px-6 text-center transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`,
    [isVisible]
  );

  return (
    <LazyWrapper>
      <section 
        ref={sectionRef}
        id={id}
        className={sectionClasses}
      >
        <div className={contentClasses}>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 font-heading tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed font-body mb-16">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </section>
    </LazyWrapper>
  );
});

OptimizedSection.displayName = 'OptimizedSection';

// Apply performance monitoring to the main component
const EnhancedHomeWithPerformance = withPerformanceMonitoring(EnhancedHome);

export default EnhancedHomeWithPerformance;
