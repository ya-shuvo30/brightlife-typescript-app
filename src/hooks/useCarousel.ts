// useCarousel.ts - Main Carousel Logic Hook
import { useEffect, useRef, useCallback } from 'react';
import { useCarouselStore, useIsPlaying, useCarouselConfig } from '@/store/carouselStore';

export const useCarousel = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPlaying = useIsPlaying();
  const config = useCarouselConfig();
  
  // Get stable references to actions
  const nextSlide = useCarouselStore(state => state.nextSlide);
  const setTransitioning = useCarouselStore(state => state.setTransitioning);

  // Handle transition completion
  const handleTransitionEnd = useCallback(() => {
    setTransitioning(false);
  }, [setTransitioning]);

  // Auto-play effect - using stable action references
  useEffect(() => {
    if (isPlaying && config.autoPlayInterval > 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, config.autoPlayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, config.autoPlayInterval, nextSlide]);

  return {
    handleTransitionEnd
  };
};

// Hook for pause on hover functionality
export const usePauseOnHover = () => {
  const config = useCarouselConfig();
  const pauseAutoPlay = useCarouselStore(state => state.pauseAutoPlay);
  const resumeAutoPlay = useCarouselStore(state => state.resumeAutoPlay);

  const handleMouseEnter = useCallback(() => {
    if (config.pauseOnHover) {
      pauseAutoPlay();
    }
  }, [config.pauseOnHover, pauseAutoPlay]);

  const handleMouseLeave = useCallback(() => {
    if (config.pauseOnHover) {
      resumeAutoPlay();
    }
  }, [config.pauseOnHover, resumeAutoPlay]);

  return {
    handleMouseEnter,
    handleMouseLeave
  };
};

// Hook for keyboard navigation
export const useKeyboardNavigation = () => {
  const config = useCarouselConfig();
  const nextSlide = useCarouselStore(state => state.nextSlide);
  const prevSlide = useCarouselStore(state => state.prevSlide);

  useEffect(() => {
    if (!config.enableKeyboard) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextSlide();
          break;
        case ' ': // Space bar
          event.preventDefault();
          nextSlide();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [config.enableKeyboard, nextSlide, prevSlide]);
};
