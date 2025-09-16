// TopBar.tsx - Contact Information Top Bar
import React, { useState } from 'react';

interface TopBarProps {
  phoneNumber?: string;
  email?: string;
  isClosable?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  phoneNumber = "+880-1234-567890",
  email = "info@brightlifebangladesh.com",
  isClosable = true
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-green-600 text-white py-2 px-4 text-sm relative">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left side - Empty spacer */}
        <div className="flex-1"></div>

        {/* Center - Phone Number and Email */}
        <div className="flex items-center space-x-6">
          {/* Phone Number */}
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="font-medium">{phoneNumber}</span>
          </div>
          
          {/* Email Address */}
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{email}</span>
          </div>
        </div>

        {/* Right side spacer to balance the layout when close button exists */}
        <div className="flex-1 flex justify-end">
          {/* Close button */}
          {isClosable && (
            <button
              onClick={() => setIsVisible(false)}
              className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-green-700 transition-colors"
              aria-label="Close contact bar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;