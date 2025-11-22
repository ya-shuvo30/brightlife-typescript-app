import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopBar from './components/layout/TopBar.tsx';
import Navbar from './components/layout/Navbar.tsx';
import SimpleCarousel from './components/carousel/SimpleCarousel.tsx';
import AboutUs from './components/sections/AboutUs.tsx';
import OurServices from './components/sections/OurServices.tsx';
import NetworkHospital from './components/sections/NetworkHospital.tsx';
import SuperShop from './components/sections/SuperShop.tsx';
import Transportation from './components/sections/Transportation.tsx';
import ValuedMembers from './components/sections/ValuedMembers.tsx';
import Registration from './components/sections/Registration.tsx';
import Contact from './components/sections/Contact.tsx';
import InsurancePartner from './components/sections/InsurancePartner.tsx';
import CustomerSupport from './components/sections/CustomerSupport.tsx';
import TermsAndConditions from './components/sections/TermsAndConditions.tsx';
import PrivacyPolicy from './components/sections/PrivacyPolicy.tsx';
import ReturnAndRefundPolicy from './components/sections/ReturnAndRefundPolicy.tsx';
import CallbackCTA from './components/sections/CallbackCTA.tsx';
import Payment from './components/sections/Payment.tsx';
import Footer from './components/layout/Footer.tsx';
import { ErrorBoundary } from './components/shared/ErrorBoundary.tsx';
import { carouselSlides } from './data/newCarouselData.ts';
import MembershipFormSteps from './components/forms/membership/MembershipFormSteps.tsx';

// TypeScript interface for navigation function
interface NavigationFunction {
  (page: string): void;
}

// TypeScript interface for callback form data
interface CallbackFormData {
  name: string;
  phone: string;
  email: string;
  preferredTime: string;
  message: string;
}

/**
 * Enhanced App component with TypeScript best practices
 * Features error boundaries, type-safe navigation, and demonstration components
 */
function App(): React.ReactElement {
  // Type-safe navigation function with error handling
  const navigateTo: NavigationFunction = React.useCallback((page: string) => {
    try {
      const sectionId = page.toLowerCase();
      const section = document.getElementById(sectionId);
      
      if (section) {
        section.scrollIntoView({
          behavior: 'smooth'
        });
      } else {
        // Fallback for sections that might have different IDs
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Graceful fallback for navigation errors
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  // Callback request handler
  const handleCallbackRequest = React.useCallback((data: CallbackFormData) => {
    console.log('Callback request received:', data);
    // In production, you would send this to your backend API
    // Example: await fetch('/api/callback-request', { method: 'POST', body: JSON.stringify(data) });
  }, []);

  return (
    <BrowserRouter>
      <ErrorBoundary
        onError={(error, errorInfo) => {
          // In production, you would log this to an error reporting service
          console.error('App Error:', error, errorInfo);
        }}
      >
        <Routes>
          {/* Membership Form Route */}
          <Route path="/membership-form" element={<MembershipFormSteps />} />
          
          {/* Main Application Route */}
          <Route path="/" element={
            <div className="min-h-screen bg-gray-50">
              {/* Top Bar/Announcement Bar */}
              <TopBar />
              
              <Navbar navigateTo={navigateTo} />
              
              {/* Main application content */}
              <main className="relative pt-20 sm:pt-24 md:pt-32">
                {/* New Hero Carousel - Natural image sizes without padding */}
                <section id="home" className="relative">
                  <div className="w-full">
                    <SimpleCarousel
                      slides={carouselSlides}
                      autoplay={true}
                      autoplayDelay={6000}
                    />
                  </div>
                </section>
                
                {/* Call-to-Action Section for Callback - Positioned after hero */}
                <CallbackCTA onCallbackRequest={handleCallbackRequest} />
                
                {/* All original sections below remain unchanged */}
                <AboutUs />
                <OurServices />
                <NetworkHospital />
                <SuperShop />
                <Transportation />
                <ValuedMembers />
                <Registration />
                <Payment />
                <Contact />
                <InsurancePartner />
                <CustomerSupport />
                <TermsAndConditions />
                <PrivacyPolicy />
                <ReturnAndRefundPolicy />
              </main>
              
              <Footer navigateTo={navigateTo} />
            </div>
          } />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
