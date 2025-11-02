import React, { Suspense, lazy, memo, useCallback } from 'react';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { AppProvider, useAppContext } from '../../context';
import { SuspenseWrapper, LoadingSpinner } from '../shared/Loading';
import { useWindowSize } from '../../hooks/advanced';

/**
 * Modern React App component with enhanced patterns
 * Features: Error boundaries, Suspense, lazy loading, context, memoization
 */

// Lazy load components for better performance
const LazyNavbar = lazy(() => import('../layout/Navbar'));
const LazyHome = lazy(() => import('../sections/Home'));
const LazyAboutUs = lazy(() => import('../sections/AboutUs'));
const LazyOurServices = lazy(() => import('../sections/OurServices'));
const LazyNetworkHospital = lazy(() => import('../sections/NetworkHospital'));
const LazyFooter = lazy(() => import('../layout/Footer'));

// Enhanced type-safe navigation interface
interface NavigationFunction {
  (page: string): void;
}

// Main app content component
const AppContent: React.FC = memo(() => {
  const { actions, state } = useAppContext();
  const { isMobile } = useWindowSize();

  // Optimized navigation handler with context integration
  const navigateTo: NavigationFunction = useCallback((page: string) => {
    try {
      actions.navigateTo(page);
      
      const sectionId = page.toLowerCase();
      const section = document.getElementById(sectionId);
      
      if (section) {
        const scrollOptions: ScrollIntoViewOptions = {
          behavior: 'smooth',
          block: 'start'
        };
        section.scrollIntoView(scrollOptions);
      } else {
        console.warn(`Section with ID "${sectionId}" not found.`);
        
        // Fallback: scroll to top if section not found
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    } catch (error) {
      console.error('Navigation error:', error);
      actions.addNotification({
        type: 'error',
        title: 'Navigation Error',
        message: 'Failed to navigate to the requested section'
      });
      
      // Graceful fallback for navigation errors
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [actions]);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Production error logging
        console.error('App Error:', error, errorInfo);
        actions.addNotification({
          type: 'error',
          title: 'Application Error',
          message: 'An unexpected error occurred. Please refresh the page.'
        });
      }}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Enhanced Navbar with Suspense */}
        <SuspenseWrapper 
          variant="spinner"
          fallback={<LoadingSpinner size="sm" className="h-16" />}
        >
          <LazyNavbar navigateTo={navigateTo} />
        </SuspenseWrapper>
        
        <main className="relative">
          {/* Home Section with Progressive Loading */}
          <SuspenseWrapper 
            variant="card"
            className="h-screen"
          >
            <LazyHome navigateTo={navigateTo} />
          </SuspenseWrapper>
          
          {/* About Section with Lazy Loading */}
          <SuspenseWrapper variant="card">
            <LazyAboutUs />
          </SuspenseWrapper>
          
          {/* Services Section */}
          <SuspenseWrapper variant="list">
            <LazyOurServices />
          </SuspenseWrapper>
          
          {/* TypeScript Demo Section */}
          <section id="typescript-demo" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  🚀 Modern React TypeScript Enhancement
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Experience our enhanced TypeScript implementation featuring React.memo, 
                  Suspense boundaries, custom hooks, and performance-optimized components.
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Performance indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl font-bold text-green-600">✅</div>
                    <div className="text-sm text-gray-600">React.memo</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl font-bold text-blue-600">⚡</div>
                    <div className="text-sm text-gray-600">Lazy Loading</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl font-bold text-purple-600">🎯</div>
                    <div className="text-sm text-gray-600">Context API</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-2xl font-bold text-orange-600">🔧</div>
                    <div className="text-sm text-gray-600">Custom Hooks</div>
                  </div>
                </div>

                {/* Device information */}
                {isMobile && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <span className="text-blue-800">📱 Mobile-optimized experience detected</span>
                  </div>
                )}

                {/* Context state display */}
                <div className="bg-white rounded-lg p-6 shadow">
                  <h3 className="text-lg font-semibold mb-4">Application State</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Current Section:</span>{' '}
                      <span className="text-blue-600">{state.navigation.currentSection}</span>
                    </div>
                    <div>
                      <span className="font-medium">Theme:</span>{' '}
                      <span className="text-purple-600">{state.ui.theme}</span>
                    </div>
                    <div>
                      <span className="font-medium">Notifications:</span>{' '}
                      <span className="text-green-600">{state.ui.notifications.length} active</span>
                    </div>
                    <div>
                      <span className="font-medium">History:</span>{' '}
                      <span className="text-orange-600">{state.navigation.history.length} items</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Network Hospital Section */}
          <SuspenseWrapper variant="card">
            <LazyNetworkHospital />
          </SuspenseWrapper>
        </main>
        
        {/* Enhanced Footer with Suspense */}
        <SuspenseWrapper variant="text">
          <LazyFooter navigateTo={navigateTo} />
        </SuspenseWrapper>
      </div>
    </ErrorBoundary>
  );
});

AppContent.displayName = 'AppContent';

// Main App component with Provider
const ModernApp: React.FC = () => {
  return (
    <AppProvider>
      <ErrorBoundary
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We're sorry, but something unexpected happened.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reload Application
              </button>
            </div>
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <AppContent />
        </Suspense>
      </ErrorBoundary>
    </AppProvider>
  );
};

export default ModernApp;
