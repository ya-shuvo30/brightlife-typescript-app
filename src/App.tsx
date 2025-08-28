import React from 'react';
import Navbar from './components/layout/Navbar.tsx';
import Home from './components/sections/Home.tsx';
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
import Footer from './components/layout/Footer.tsx';
import { ErrorBoundary } from './components/shared/ErrorBoundary.tsx';

// TypeScript interface for navigation function
interface NavigationFunction {
  (page: string): void;
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

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // In production, you would log this to an error reporting service
        console.error('App Error:', error, errorInfo);
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <Navbar navigateTo={navigateTo} />
        
        {/* Main application content */}
        <main className="relative">
          <Home navigateTo={navigateTo} />
          <AboutUs />
          <OurServices />
          <NetworkHospital />
          <SuperShop />
          <Transportation />
          <ValuedMembers />
          <Registration />
          <Contact />
          <InsurancePartner />
          <CustomerSupport />
          <TermsAndConditions />
          <PrivacyPolicy />
          <ReturnAndRefundPolicy />
        </main>
        
        <Footer navigateTo={navigateTo} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
