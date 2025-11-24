// HomePage.tsx - Main homepage component with all sections
import React from 'react';
import NewNavbar from '../components/layout/NewNavbar';
import SimpleCarousel from '../components/carousel/SimpleCarousel';
import WhoWeAre from '../components/sections/WhoWeAre';
import { carouselSlides } from '../data/newCarouselData';
import logo from '../assets/images/logo.png';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <NewNavbar />

      {/* Hero Section with Carousel */}
      <section id="home" className="relative">
        <SimpleCarousel
          slides={carouselSlides}
          autoplay={true}
          autoplayDelay={6000}
        />
      </section>

      {/* Who We Are Section */}
      <WhoWeAre />

      {/* Additional Sections - Placeholders for future content */}
      
      {/* Services Section */}
      <section id="health-coverage" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            <div className="bg-green-50 rounded-lg p-8">
              <div className="text-green-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Health Coverage</h3>
              <p className="text-gray-600">Comprehensive medical insurance covering hospitalization, outpatient care, and emergency services.</p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-8">
              <div className="text-yellow-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Life Insurance</h3>
              <p className="text-gray-600">Secure your family's financial future with our flexible life insurance policies and investment options.</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-8">
              <div className="text-orange-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Discount Programs</h3>
              <p className="text-gray-600">Exclusive member discounts on healthcare services, pharmacy, and wellness programs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Get In Touch</h2>
            <p className="text-lg text-gray-600 mb-8">
              Ready to secure your family's health and future? Contact us today to learn more about our insurance plans and services.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Call Us</h3>
                <p className="text-green-600 font-semibold text-lg">+880-XXX-XXXX</p>
                <p className="text-gray-600">Mon-Fri: 9AM-6PM</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Email Us</h3>
                <p className="text-green-600 font-semibold">info@brightlifebangladesh.com</p>
                <p className="text-gray-600">We'll respond within 24 hours</p>
              </div>
            </div>

            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300">
              Request Free Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <img
              src={logo}
              alt="BrightLife Logo"
              className="h-8 w-auto mr-3"
            />
            <span className="text-xl font-bold">BrightLife Bangladesh Ltd.</span>
          </div>
          <p className="text-gray-400 mb-4">
            Providing quality healthcare and insurance solutions for a brighter future.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <button className="hover:text-green-400 transition-colors">Privacy Policy</button>
            <button className="hover:text-green-400 transition-colors">Terms of Service</button>
            <button className="hover:text-green-400 transition-colors">Contact</button>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            © 2024 BrightLife Bangladesh Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;