// NewCarousel.tsx - Enhanced carousel component using Swiper
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

interface CarouselSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}

interface NewCarouselProps {
  slides: CarouselSlide[];
  autoplay?: boolean;
  autoplayDelay?: number;
  height?: string;
}

const NewCarousel: React.FC<NewCarouselProps> = ({
  slides,
  autoplay = true,
  autoplayDelay = 5000,
  height = '500px'
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  const handleSlideChange = (swiper: SwiperType) => {
    // Optional: Add any custom logic when slide changes
    console.log('Slide changed to:', swiper.activeIndex);
  };

  return (
    <div className={`relative w-full ${height === '500px' ? 'h-[500px]' : 'h-screen'}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          el: '.swiper-pagination-custom',
          clickable: true,
          bulletClass: 'swiper-pagination-bullet-custom',
          bulletActiveClass: 'swiper-pagination-bullet-active-custom',
        }}
        autoplay={autoplay ? {
          delay: autoplayDelay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        } : false}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative">
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            {/* Content Overlay */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white px-4 max-w-4xl mx-auto">
                {/* Subtitle */}
                <p className="text-lg md:text-xl font-medium mb-2 text-yellow-300">
                  {slide.subtitle}
                </p>
                
                {/* Main Title */}
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  {slide.title}
                </h1>
                
                {/* Description */}
                <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
                  {slide.description}
                </p>
                
                {/* Call to Action Button */}
                {slide.buttonText && (
                  <button
                    onClick={() => {
                      if (slide.buttonLink) {
                        window.location.href = slide.buttonLink;
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 transform hover:scale-105"
                  >
                    {slide.buttonText}
                  </button>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <div className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-3 cursor-pointer transition-all duration-300 group">
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
      </div>

      <div className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-3 cursor-pointer transition-all duration-300 group">
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
      </div>

      {/* Custom Pagination Dots */}
      <div className="swiper-pagination-custom absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2"></div>
    </div>
  );
};

export default NewCarousel;