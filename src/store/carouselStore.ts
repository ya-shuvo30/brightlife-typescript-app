// carouselStore.ts - Zustand Store for Carousel State Management
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { CarouselState, CarouselActions } from '@/types/carousel';
import { carouselSlides, defaultCarouselConfig } from '@/data/carouselData';

interface CarouselStore extends CarouselState, CarouselActions {}

export const useCarouselStore = create<CarouselStore>()(
  immer((set) => ({
    // Initial State
    currentSlide: 0,
    slides: carouselSlides,
    isPlaying: true,
    isTransitioning: false,
    config: defaultCarouselConfig,
    totalSlides: carouselSlides.length,

    // Actions
    nextSlide: () => {
      set((state) => {
        if (state.isTransitioning) return;
        
        const nextIndex = state.config.infiniteLoop
          ? (state.currentSlide + 1) % state.totalSlides
          : Math.min(state.currentSlide + 1, state.totalSlides - 1);
        
        state.currentSlide = nextIndex;
        state.isTransitioning = true;
      });
    },

    prevSlide: () => {
      set((state) => {
        if (state.isTransitioning) return;
        
        const prevIndex = state.config.infiniteLoop
          ? state.currentSlide === 0 
            ? state.totalSlides - 1 
            : state.currentSlide - 1
          : Math.max(state.currentSlide - 1, 0);
        
        state.currentSlide = prevIndex;
        state.isTransitioning = true;
      });
    },

    goToSlide: (index: number) => {
      set((state) => {
        if (state.isTransitioning || index === state.currentSlide) return;
        
        if (index >= 0 && index < state.totalSlides) {
          state.currentSlide = index;
          state.isTransitioning = true;
        }
      });
    },

    toggleAutoPlay: () => {
      set((state) => {
        state.isPlaying = !state.isPlaying;
      });
    },

    pauseAutoPlay: () => {
      set((state) => {
        state.isPlaying = false;
      });
    },

    resumeAutoPlay: () => {
      set((state) => {
        state.isPlaying = true;
      });
    },

    setTransitioning: (isTransitioning: boolean) => {
      set((state) => {
        state.isTransitioning = isTransitioning;
      });
    }
  }))
);

// Selectors for performance optimization
export const useCurrentSlide = () => useCarouselStore((state) => state.currentSlide);
export const useSlides = () => useCarouselStore((state) => state.slides);
export const useIsPlaying = () => useCarouselStore((state) => state.isPlaying);
export const useCarouselConfig = () => useCarouselStore((state) => state.config);
export const useCarouselActions = () => useCarouselStore((state) => ({
  nextSlide: state.nextSlide,
  prevSlide: state.prevSlide,
  goToSlide: state.goToSlide,
  toggleAutoPlay: state.toggleAutoPlay,
  pauseAutoPlay: state.pauseAutoPlay,
  resumeAutoPlay: state.resumeAutoPlay,
  setTransitioning: state.setTransitioning
}));
