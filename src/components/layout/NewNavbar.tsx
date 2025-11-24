// Navbar.tsx - Navigation component with logo and menu
import React, { useState } from 'react';
import logo from '../../assets/images/logo.png';

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Company Name */}
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="BrightLife Logo"
              className="h-10 w-auto"
            />
            <div className="text-xl font-bold text-green-700">
              BrightLife Bangladesh Ltd.
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Home
            </button>
            
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              About Us
            </button>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Services
                <svg
                  className={`ml-1 h-4 w-4 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border">
                  <button
                    onClick={() => scrollToSection('health-coverage')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600"
                  >
                    Health Coverage
                  </button>
                  <button
                    onClick={() => scrollToSection('life-insurance')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600"
                  >
                    Life Insurance
                  </button>
                  <button
                    onClick={() => scrollToSection('discounts')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600"
                  >
                    Discounts
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Contact
            </button>

            <button
              onClick={() => scrollToSection('more')}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              More
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-green-600"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => scrollToSection('home')}
                className="text-left text-gray-700 hover:text-green-600 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-left text-gray-700 hover:text-green-600 font-medium"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection('health-coverage')}
                className="text-left text-gray-700 hover:text-green-600 font-medium pl-4"
              >
                Health Coverage
              </button>
              <button
                onClick={() => scrollToSection('life-insurance')}
                className="text-left text-gray-700 hover:text-green-600 font-medium pl-4"
              >
                Life Insurance
              </button>
              <button
                onClick={() => scrollToSection('discounts')}
                className="text-left text-gray-700 hover:text-green-600 font-medium pl-4"
              >
                Discounts
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-left text-gray-700 hover:text-green-600 font-medium"
              >
                Contact
              </button>
              <button
                onClick={() => scrollToSection('more')}
                className="text-left text-gray-700 hover:text-green-600 font-medium"
              >
                More
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;