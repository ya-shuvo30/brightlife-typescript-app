import React, { useState } from 'react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { useToastHelpers } from '../ui/toastHooks';
import { ToastProvider } from '../ui/Toast';

const UIShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError, showWarning, showInfo } = useToastHelpers();

  const handleLoadingTest = async () => {
    setIsLoading(true);
    showInfo('Loading started...');
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      showSuccess('Loading completed!');
    }, 2000);
  };

  const showToastExamples = () => {
    showSuccess('Success! Everything worked perfectly.');
    setTimeout(() => showError('Error! Something went wrong.'), 500);
    setTimeout(() => showWarning('Warning! Please check your input.'), 1000);
    setTimeout(() => showInfo('Info: This is just a notification.'), 1500);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center slide-in">
            UI/UX Enhancement Showcase
          </h1>

          {/* Button Variants Section */}
          <section className="bg-white rounded-lg shadow-lg p-6 mb-8 hover-lift">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Button Components</h2>
            
            <div className="space-y-6">
              {/* Primary Buttons */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-700">Primary Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" size="sm">Small Primary</Button>
                  <Button variant="primary" size="md">Medium Primary</Button>
                  <Button variant="primary" size="lg">Large Primary</Button>
                  <Button variant="primary" size="md" rounded="full">Rounded Primary</Button>
                  <Button 
                    variant="primary" 
                    size="md" 
                    loading={isLoading}
                    onClick={handleLoadingTest}
                  >
                    {isLoading ? 'Loading...' : 'Test Loading'}
                  </Button>
                </div>
              </div>

              {/* Secondary Buttons */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-700">Secondary Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="secondary" size="md">Secondary</Button>
                  <Button variant="outline" size="md">Outline</Button>
                  <Button variant="ghost" size="md">Ghost</Button>
                  <Button variant="link" size="md">Link</Button>
                </div>
              </div>

              {/* State Variants */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-700">Special States</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="success" size="md" leftIcon="✓">Success</Button>
                  <Button variant="warning" size="md" rightIcon="⚠">Warning</Button>
                  <Button variant="danger" size="md">Danger</Button>
                  <Button variant="primary" size="md" disabled>Disabled</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Modal Section */}
          <section className="bg-white rounded-lg shadow-lg p-6 mb-8 hover-lift">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Modal Components</h2>
            
            <div className="space-y-4">
              <Button 
                variant="primary" 
                onClick={() => setIsModalOpen(true)}
              >
                Open Modal
              </Button>
              
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Example Modal"
                size="md"
              >
                <div className="space-y-4">
                  <p className="text-gray-600">
                    This is an example modal with focus management, keyboard navigation, 
                    and accessibility features.
                  </p>
                  
                  <div className="space-y-3">
                    <Button variant="primary" size="sm" fullWidth>
                      Primary Action
                    </Button>
                    <Button variant="secondary" size="sm" fullWidth>
                      Secondary Action
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Press ESC to close or click outside the modal.
                  </p>
                </div>
              </Modal>
            </div>
          </section>

          {/* Toast Notifications Section */}
          <section className="bg-white rounded-lg shadow-lg p-6 mb-8 hover-lift">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Toast Notifications</h2>
            
            <div className="space-y-4">
              <Button 
                variant="secondary" 
                onClick={showToastExamples}
              >
                Show All Toast Types
              </Button>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="success" 
                  size="sm" 
                  onClick={() => showSuccess('Success message!')}
                >
                  Success Toast
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => showError('Error message!')}
                >
                  Error Toast
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => showWarning('Warning message!')}
                >
                  Warning Toast
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => showInfo('Info message!')}
                >
                  Info Toast
                </Button>
              </div>
            </div>
          </section>

          {/* Animation Examples */}
          <section className="bg-white rounded-lg shadow-lg p-6 mb-8 hover-lift">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Animations & Effects</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg hover-scale text-center">
                <h3 className="font-medium mb-2">Hover Scale</h3>
                <p className="text-sm text-gray-600">Hover over this card</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover-lift text-center">
                <h3 className="font-medium mb-2">Hover Lift</h3>
                <p className="text-sm text-gray-600">Gentle lift on hover</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover-glow text-center">
                <h3 className="font-medium mb-2">Hover Glow</h3>
                <p className="text-sm text-gray-600">Glowing effect on hover</p>
              </div>
            </div>
          </section>

          {/* Accessibility Features */}
          <section className="bg-white rounded-lg shadow-lg p-6 hover-lift">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Accessibility Features</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Keyboard Navigation</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tab through interactive elements</li>
                    <li>• Enter/Space to activate buttons</li>
                    <li>• ESC to close modals</li>
                    <li>• Focus indicators on all elements</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">ARIA Compliance</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Proper role attributes</li>
                    <li>• Live regions for announcements</li>
                    <li>• Descriptive labels and descriptions</li>
                    <li>• Focus management in modals</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  All components are designed with accessibility in mind, following WCAG 2.1 guidelines 
                  for keyboard navigation, screen readers, and focus management.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ToastProvider>
  );
};

export default UIShowcase;
