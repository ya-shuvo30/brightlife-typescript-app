import React, { useState, useEffect, useCallback, useRef } from 'react';
import Icon from './Icon';

// TypeScript interfaces for carousel functionality
interface CarouselImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  showThumbnails?: boolean;
  showPlayPause?: boolean;
  enableSwipe?: boolean;
  enableKeyboard?: boolean;
  className?: string;
  height?: string;
  initialIndex?: number; // Add initialIndex prop for setting default slide
}

/**
 * Enhanced Interactive Image Carousel Component with TypeScript
 * Features: Auto-slide, touch/swipe navigation, keyboard controls, play/pause, thumbnails
 * Fully responsive for desktop and mobile devices
 */
const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  autoSlide = true,
  autoSlideInterval = 5000,
  showDots = true,
  showArrows = true,
  showThumbnails = false,
  showPlayPause = true,
  enableSwipe = true,
  enableKeyboard = true,
  className = '',
  height = 'h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px]',
  initialIndex = 0 // Default to first slide (coverpage.jpg)
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoSlide);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>(new Array(images.length).fill(false));
  const carouselRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Enhanced navigation functions with useCallback for performance
  const nextSlide = useCallback((): void => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, images.length]);

  const prevSlide = useCallback((): void => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, images.length]);

  const goToSlide = useCallback((index: number): void => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, currentIndex]);

  const togglePlayPause = useCallback((): void => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Auto-slide functionality with play/pause control
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [isPlaying, autoSlideInterval, images.length, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case ' ':
          event.preventDefault();
          togglePlayPause();
          break;
        case 'Home':
          goToSlide(0);
          break;
        case 'End':
          goToSlide(images.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboard, prevSlide, nextSlide, togglePlayPause, goToSlide, images.length]);

  // Touch/Swipe handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enableSwipe) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, [enableSwipe]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enableSwipe) return;
    setTouchEnd(e.targetTouches[0].clientX);
  }, [enableSwipe]);

  const handleTouchEnd = useCallback(() => {
    if (!enableSwipe || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  }, [enableSwipe, touchStart, touchEnd, nextSlide, prevSlide]);

  // Image loading handler
  const handleImageLoad = useCallback((index: number) => {
    setImageLoaded(prev => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  }, []);

  // Preload adjacent images for smoother transitions
  useEffect(() => {
    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
    };

    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const nextIndex = (currentIndex + 1) % images.length;

    if (images[prevIndex]) preloadImage(images[prevIndex].src);
    if (images[nextIndex]) preloadImage(images[nextIndex].src);
  }, [currentIndex, images]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div 
      ref={carouselRef}
      className={`relative w-full ${height} overflow-hidden rounded-lg shadow-2xl group ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Image carousel"
      tabIndex={0}
    >
      {/* Image container */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-500 ease-in-out transform ${
              index === currentIndex 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
              onLoad={() => handleImageLoad(index)}
            />
            
            {/* Loading skeleton */}
            {!imageLoaded[index] && (
              <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Image overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            
            {/* Image title and description */}
            {(image.title || image.description) && (
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white z-10">
                {image.title && (
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 drop-shadow-lg">
                    {image.title}
                  </h3>
                )}
                {image.description && (
                  <p className="text-xs sm:text-sm md:text-base opacity-90 drop-shadow-md line-clamp-2">
                    {image.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows - Enhanced for mobile */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-200 group/btn disabled:opacity-50 z-20 touch-manipulation"
            aria-label="Previous image"
          >
            <Icon 
              path="M15.75 19.5L8.25 12l7.5-7.5" 
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover/btn:text-red-200 transition-colors" 
            />
          </button>
          
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-200 group/btn disabled:opacity-50 z-20 touch-manipulation"
            aria-label="Next image"
          >
            <Icon 
              path="M8.25 4.5l7.5 7.5-7.5 7.5" 
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover/btn:text-red-200 transition-colors" 
            />
          </button>
        </>
      )}

      {/* Play/Pause button */}
      {showPlayPause && images.length > 1 && (
        <button
          onClick={togglePlayPause}
          className="absolute top-4 left-4 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200 z-20 touch-manipulation"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          <Icon 
            path={isPlaying ? "M6 19h4V5H6v14zm8-14v14h4V5h-4z" : "M8 5v14l11-7z"} 
            className="w-4 h-4 text-white" 
          />
        </button>
      )}

      {/* Enhanced dot indicators */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 disabled:opacity-50 touch-manipulation ${
                index === currentIndex
                  ? 'bg-white scale-125 shadow-lg ring-2 ring-white/50'
                  : 'bg-white/50 hover:bg-white/70 active:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails (mobile-friendly) */}
      {showThumbnails && images.length > 1 && (
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 overflow-x-auto max-w-full px-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`flex-shrink-0 w-12 h-8 sm:w-16 sm:h-10 md:w-20 md:h-12 rounded overflow-hidden transition-all duration-200 ${
                index === currentIndex
                  ? 'ring-2 ring-white scale-110 opacity-100'
                  : 'opacity-70 hover:opacity-90'
              }`}
            >
              <img
                src={image.src}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
          <div 
            className="h-full bg-red-500 transition-all linear"
            style={{
              width: `${((currentIndex + 1) / images.length) * 100}%`,
              transitionDuration: `${autoSlideInterval}ms`
            } as React.CSSProperties}
          />
        </div>
      )}

      {/* Touch/swipe indicator for mobile */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-xs z-10 sm:hidden">
        Swipe to navigate
      </div>
    </div>
  );
};

export default ImageCarousel;
