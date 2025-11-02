// CarouselSlide.tsx - Individual Slide Component
import React from 'react';
import type { CarouselSlide as CarouselSlideType } from '@/types/carousel';
import { useLazyImage, useAnimationTrigger } from '@/hooks/useIntersectionObserver';
import Button from '@/components/ui/Button';

interface CarouselSlideProps {
  slide: CarouselSlideType;
  isActive: boolean;
  index: number;
  onButtonClick: (action: string) => void;
}

const CarouselSlide: React.FC<CarouselSlideProps> = ({
  slide,
  isActive,
  index,
  onButtonClick
}) => {
  const {
    ref: imageRef,
    imageSrc,
    isLoaded,
    isError,
    handleLoad,
    handleError
  } = useLazyImage(slide.image, { threshold: 0.1 });

  const { shouldAnimate } = useAnimationTrigger({
    threshold: 0.3
  });

  const handleButtonClick = () => {
    onButtonClick(slide.buttonAction);
  };

  return (
    <div
      className={`
        relative w-full h-full overflow-hidden
        transition-all duration-700 ease-in-out
        ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}
      aria-hidden={!isActive ? 'true' : 'false'}
    >
      {/* Background Image */}
      <div
        ref={imageRef as React.RefObject<HTMLDivElement>}
        className="absolute inset-0 w-full h-[500px] md:h-[400px] sm:h-[300px] max-w-[1920px] mx-auto"
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt={slide.imageAlt}
            className={`
              w-full h-[500px] md:h-[400px] sm:h-[300px] object-cover object-center transition-opacity duration-500
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
          />
        )}
        
        {/* Loading placeholder */}
        {!isLoaded && !isError && (
          <div className="w-full h-[500px] md:h-[400px] sm:h-[300px] bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
        
        {/* Error state */}
        {isError && (
          <div className="w-full h-[500px] md:h-[400px] sm:h-[300px] bg-gray-300 flex items-center justify-center">
            <div className="text-gray-600">Failed to load image</div>
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.backgroundGradient} opacity-75`} />

      {/* Content */}
      <div className="relative z-10 h-[500px] md:h-[400px] sm:h-[300px] flex items-center">
        <div className="container mx-auto px-4 lg:px-8 max-w-[1920px]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div
              className={`
                text-left space-y-6
                ${shouldAnimate ? 'animate-slide-in-left' : 'opacity-0'}
                ${slide.textColor}
              `}
            >
              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                {slide.title}
              </h1>

              {/* Subtitle */}
              {slide.subtitle && (
                <h2 className="text-lg md:text-xl lg:text-2xl font-medium opacity-90">
                  {slide.subtitle}
                </h2>
              )}

              {/* Description */}
              {slide.description && (
                <p className="text-base md:text-lg lg:text-xl opacity-80 leading-relaxed">
                  {slide.description}
                </p>
              )}

              {/* Features List */}
              {slide.features.length > 0 && (
                <ul className="space-y-3">
                  {slide.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className={`
                        flex items-center space-x-3 text-base md:text-lg
                        ${shouldAnimate ? 'animate-fade-in' : 'opacity-0'}
                      `}
                      style={{
                        animationDelay: shouldAnimate ? `${featureIndex * 100}ms` : '0ms'
                      }}
                    >
                      <svg
                        className="w-5 h-5 text-green-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Action Button */}
              <div
                className={`
                  pt-4
                  ${shouldAnimate ? 'animate-slide-in-up' : 'opacity-0'}
                `}
                style={{
                  animationDelay: shouldAnimate ? '600ms' : '0ms'
                }}
              >
                <Button
                  variant={slide.buttonVariant}
                  size="lg"
                  onClick={handleButtonClick}
                  className="shadow-xl"
                  aria-label={`${slide.buttonText} for slide ${index + 1}`}
                >
                  {slide.buttonText}
                </Button>
              </div>
            </div>

            {/* Right side - can be used for additional content or imagery */}
            <div
              className={`
                hidden lg:block
                ${shouldAnimate ? 'animate-slide-in-right' : 'opacity-0'}
              `}
            >
              {/* Additional content area - could include icons, graphics, etc. */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselSlide;
