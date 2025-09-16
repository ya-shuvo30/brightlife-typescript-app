// Carousel.tsx - Main Carousel Component
import React from 'react';
import { useCarousel, usePauseOnHover, useKeyboardNavigation } from '@/hooks/useCarousel';
import { useSwipeGesture, useMouseDrag } from '@/hooks/useSwipeGesture';
import { useCurrentSlide, useSlides, useIsPlaying, useCarouselStore, useCarouselConfig } from '@/store/carouselStore';
import CarouselSlide from './CarouselSlide';

interface CarouselProps {
  className?: string;
  onSlideChange?: (slideIndex: number) => void;
  onButtonClick?: (action: string) => void;
}

const Carousel: React.FC<CarouselProps> = ({
  className = '',
  onSlideChange,
  onButtonClick
}) => {
  const currentSlide = useCurrentSlide();
  const slides = useSlides();
  const isPlaying = useIsPlaying();
  const config = useCarouselConfig();
  
  // Get stable action references
  const nextSlide = useCarouselStore(state => state.nextSlide);
  const prevSlide = useCarouselStore(state => state.prevSlide);
  const goToSlide = useCarouselStore(state => state.goToSlide);
  const toggleAutoPlay = useCarouselStore(state => state.toggleAutoPlay);

  // Custom hooks
  const { handleTransitionEnd } = useCarousel();
  const { handleMouseEnter, handleMouseLeave } = usePauseOnHover();
  useKeyboardNavigation();

  // Touch and mouse gesture support
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useSwipeGesture({ threshold: 50 });

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave: handleDragLeave
  } = useMouseDrag({ threshold: 50 });

  // Handle slide navigation
  const handlePrevSlide = () => {
    prevSlide();
    onSlideChange?.(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  const handleNextSlide = () => {
    nextSlide();
    onSlideChange?.((currentSlide + 1) % slides.length);
  };

  const handleGoToSlide = (index: number) => {
    goToSlide(index);
    onSlideChange?.(index);
  };

  const handleButtonClick = (action: string) => {
    onButtonClick?.(action);
  };

  const handleMouseEvents = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: () => {
      handleMouseLeave();
      handleDragLeave();
    }
  };

  return (
    <div
      className={`relative w-full h-[500px] md:h-[400px] sm:h-[300px] max-w-[1920px] mx-auto overflow-hidden ${className}`}
      {...handleMouseEvents}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      role="region"
      aria-label="Image carousel"
      aria-live="polite"
    >
      {/* Slides Container */}
      <div
        className="relative w-full h-full"
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`
              absolute inset-0 w-full h-full
              transition-transform duration-700 ease-in-out
              ${index === currentSlide ? 'translate-x-0' : 
                index < currentSlide ? '-translate-x-full' : 'translate-x-full'}
            `}
          >
            <CarouselSlide
              slide={slide}
              isActive={index === currentSlide}
              index={index}
              onButtonClick={handleButtonClick}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {config.showArrows && (
        <>
          <button
            type="button"
            className="
              absolute top-1/2 left-4 -translate-y-1/2 z-30
              bg-white/20 hover:bg-white/30 backdrop-blur-sm
              text-white p-3 rounded-full transition-all duration-200
              hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            onClick={handlePrevSlide}
            aria-label="Previous slide"
            disabled={!config.infiniteLoop && currentSlide === 0}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            type="button"
            className="
              absolute top-1/2 right-4 -translate-y-1/2 z-30
              bg-white/20 hover:bg-white/30 backdrop-blur-sm
              text-white p-3 rounded-full transition-all duration-200
              hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            onClick={handleNextSlide}
            aria-label="Next slide"
            disabled={!config.infiniteLoop && currentSlide === slides.length - 1}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {config.showDots && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`
                  w-3 h-3 rounded-full transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-white/50
                  ${index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                  }
                `}
                onClick={() => handleGoToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Auto-play Controls */}
      <div className="absolute top-6 right-6 z-30">
        <button
          type="button"
          className="
            bg-white/20 hover:bg-white/30 backdrop-blur-sm
            text-white p-2 rounded-full transition-all duration-200
            hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50
          "
          onClick={toggleAutoPlay}
          aria-label={isPlaying ? 'Pause autoplay' : 'Start autoplay'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-6 right-6 z-30">
        <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
