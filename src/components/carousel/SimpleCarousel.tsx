// SimpleCarousel.tsx - Simple carousel without external dependencies
import React, { useState, useEffect, useCallback } from 'react';

interface CarouselSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}

interface SimpleCarouselProps {
  slides: CarouselSlide[];
  autoplay?: boolean;
  autoplayDelay?: number;
}

const SimpleCarousel: React.FC<SimpleCarouselProps> = ({
  slides,
  autoplay = true,
  autoplayDelay = 6000,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const interval = setInterval(nextSlide, autoplayDelay);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide, autoplayDelay, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [prevSlide, nextSlide, isPlaying]);

  if (slides.length === 0) {
    return <div className="h-auto min-h-[400px] bg-gray-200 flex items-center justify-center">No slides available</div>;
  }

  return (
    <div 
      className="relative w-full overflow-hidden bg-transparent min-h-[300px] carousel-natural-container"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(autoplay)}
    >
      {/* Slides Container */}
      <div className="w-full h-auto relative">
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`${index === currentSlide ? 'block' : 'hidden'} w-full h-auto transition-opacity duration-500`}
          >
            {/* Natural Image Display */}
            <img
              src={slide.image}
              alt={slide.title || `Slide ${index + 1}`}
              className="carousel-natural-image w-full h-auto"
              onError={(e) => {
                console.error(`Failed to load image: ${slide.image}`);
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => {
                console.log(`Successfully loaded image: ${slide.image}`);
              }}
            />
            
            {/* Only show overlay and content if there's actual text content */}
            {(slide.title || slide.subtitle || slide.description || slide.buttonText) && (
              <>
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                {/* Content Overlay */}
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="text-center text-white px-4 max-w-4xl mx-auto">
                    {/* Subtitle */}
                    {slide.subtitle && (
                      <p className="text-lg md:text-xl font-medium mb-2 text-yellow-300 animate-fade-in-up">
                        {slide.subtitle}
                      </p>
                    )}
                    
                    {/* Main Title */}
                    {slide.title && (
                      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight animate-fade-in-up delay-200">
                        {slide.title}
                      </h1>
                    )}
                    
                    {/* Description */}
                    {slide.description && (
                      <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto animate-fade-in-up delay-400">
                        {slide.description}
                      </p>
                    )}
                    
                    {/* Call to Action Button */}
                    {slide.buttonText && (
                      <button
                        onClick={() => {
                          if (slide.buttonLink) {
                            if (slide.buttonLink.startsWith('#')) {
                              const element = document.querySelector(slide.buttonLink);
                              element?.scrollIntoView({ behavior: 'smooth' });
                            } else {
                              window.location.href = slide.buttonLink;
                            }
                          }
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-600"
                      >
                        {slide.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-3 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 text-white group-hover:text-green-400"
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
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-3 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 text-white group-hover:text-green-400"
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

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-green-500 scale-125'
                : 'bg-white bg-opacity-50 hover:bg-opacity-80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-4 right-4 z-20 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-2 transition-all duration-300"
        aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        {isPlaying ? (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default SimpleCarousel;