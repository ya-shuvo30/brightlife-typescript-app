import React from 'react';
import logo from '../../assets/images/logo.png';
import ImageCarousel from '../shared/ImageCarousel';

// Import the new carousel images
import coverpage from '../../assets/images/coverpage.jpg';
import transport from '../../assets/images/transport.jpg';
import bright2 from '../../assets/images/bright2.jpg';
import bright3 from '../../assets/images/bright3.jpg';

// Define the types for the component's props
interface HomeProps {
  navigateTo: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ navigateTo }) => {
    // Define carousel images with descriptions
    // Note: coverpage.jpg is set as the default home image (first in array)
    const carouselImages = [
        {
            src: coverpage,
            alt: "Bright Life Bangladesh Cover Page",
            title: "Your Health, Our Priority",
            description: "Comprehensive healthcare coverage for you and your family"
        },
        {
            src: transport,
            alt: "Transportation Services",
            title: "Emergency Transportation",
            description: "24/7 ambulance and medical transport services"
        },
        {
            src: bright2,
            alt: "Bright Life Services",
            title: "Quality Healthcare",
            description: "Access to premium medical facilities and specialists"
        },
        {
            src: bright3,
            alt: "Bright Life Community",
            title: "Community Care",
            description: "Building healthier communities together"
        }
    ];

    return (
        <section id="home" className="relative h-screen overflow-hidden">
            {/* Background carousel with enhanced features */}
            <div className="absolute inset-0">
                <ImageCarousel 
                    images={carouselImages}
                    autoSlide={true}
                    autoSlideInterval={6000}
                    showDots={true}
                    showArrows={true}
                    showThumbnails={true}
                    showPlayPause={true}
                    enableSwipe={true}
                    enableKeyboard={true}
                    initialIndex={0} // Explicitly set coverpage.jpg as default
                    height="h-full"
                    className="h-full"
                />
            </div>
            
            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>
            
            {/* Content overlay */}
            <div className="relative z-20 h-full flex items-center">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left side - Main content */}
                        <div className="text-white">
                            <div className="flex items-center mb-8">
                                <img 
                                    src={logo} 
                                    alt="Bright Life Bangladesh Logo" 
                                    className="h-20 w-20 md:h-24 md:w-24 rounded-full shadow-2xl bg-white/20 p-2 logo-animation mr-6"
                                />
                                <div>
                                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter font-heading">
                                        Bright Life <span className="text-red-400">Bangladesh Ltd.</span>
                                    </h1>
                                </div>
                            </div>
                            
                            <p className="text-lg md:text-xl text-gray-200 mb-8 font-body leading-relaxed max-w-2xl">
                                Bright Life Bangladesh offers premier health coverage and exclusive discounts to ensure your peace of mind.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => navigateTo('Registration')} 
                                    className="btn-gold-gradient text-green-900 font-bold py-4 px-8 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                >
                                    Become a Member
                                </button>
                                <button 
                                    onClick={() => navigateTo('About Us')} 
                                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-white/30 transition-all duration-300"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                        
                        {/* Right side - Feature highlights */}
                        <div className="text-white space-y-6 lg:pl-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-3 text-red-400">🏥 Hospital Network</h3>
                                <p className="text-gray-200">Access to 129+ premium hospitals nationwide</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;
