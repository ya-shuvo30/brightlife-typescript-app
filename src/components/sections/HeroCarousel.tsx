// HeroCarousel.tsx - Hero Section with Carousel for Homepage
import React from 'react';
import Carousel from '@/components/carousel/Carousel';

const HeroCarousel: React.FC = () => {
  const handleSlideChange = (slideIndex: number) => {
    // Optional: Track slide changes for analytics
    console.log(`Slide changed to: ${slideIndex + 1}`);
  };

  const handleButtonClick = (action: string) => {
    // Handle button actions - scroll to sections
    try {
      let sectionId: string;
      
      switch (action) {
        case '/services':
          sectionId = 'ourservices';
          break;
        case '/registration':
          sectionId = 'registration';
          break;
        case '/contact':
          sectionId = 'contact';
          break;
        case '/aboutus':
          sectionId = 'aboutus';
          break;
        default:
          // If it's an external URL
          if (action.startsWith('http')) {
            window.open(action, '_blank', 'noopener,noreferrer');
            return;
          }
          sectionId = action.replace('/', '');
          break;
      }
      
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({
          behavior: 'smooth'
        });
      } else {
        // Fallback scroll to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Graceful fallback
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  return (
    <section 
      id="home" 
      className="relative w-full h-[500px] md:h-[400px] sm:h-[300px] max-w-[1920px] mx-auto overflow-hidden"
      aria-label="Bright Life Bangladesh Hero Section"
    >
      <Carousel
        className="w-full h-[500px] md:h-[400px] sm:h-[300px]"
        onSlideChange={handleSlideChange}
        onButtonClick={handleButtonClick}
      />
      
      {/* Optional: Brand Logo Overlay */}
      <div className="absolute top-4 left-4 z-40">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
          <img
            src="/src/assets/images/logo.png"
            alt="Bright Life Bangladesh Logo"
            className="h-12 w-auto opacity-80"
            loading="eager"
          />
        </div>
      </div>
      
      {/* Optional: Scroll Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-white/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
