import React, { useState, useEffect } from 'react';
import Icon from '../shared/Icon.tsx';
import logo from '../../assets/images/logo.png';

// Define the types for the component's props
interface NavbarProps {
  navigateTo: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ navigateTo }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
    const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
    const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavigate = (section: string) => {
        navigateTo(section);
        setIsAboutDropdownOpen(false);
        setIsServicesDropdownOpen(false);
        setIsMoreDropdownOpen(false);
        setIsMenuOpen(false);
    };

    // Dynamic classes based on scroll state with custom green theme
    const navClasses = isScrolled 
        ? 'bg-white shadow-lg' 
        : 'bg-[#B0CE88] backdrop-blur-sm';
    const textClasses = isScrolled 
        ? 'text-gray-700' 
        : 'text-white font-semibold';
    const hoverTextClasses = isScrolled 
        ? 'hover:text-green-600' 
        : 'hover:text-white/80';
    const logoColor1 = isScrolled ? 'text-green-700' : 'text-white';
    const logoColor2 = isScrolled ? 'text-green-500' : 'text-green-100';

    return (
        <header className={`fixed top-10 left-0 right-0 z-40 transition-colors duration-300 ${navClasses}`}>
            <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Enhanced Logo Section with Image and Text */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <img 
                        src={logo} 
                        alt="Bright Life Bangladesh Logo" 
                        className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-lg p-1 transition-all duration-300 ${isScrolled ? 'bg-green-50 border-2 border-green-600' : 'bg-white border-2 border-white/80'}`}
                    />
                    <div className="flex flex-col">
                        <a href="#" onClick={() => handleNavigate('Home')} className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight font-heading">
                            <span className={logoColor1}>Bright</span>
                            <span className={logoColor2}>Life</span>
                        </a>
                        <span className={`text-xs md:text-sm font-medium ${isScrolled ? 'text-gray-600' : 'text-white/95'}`}>
                            Bangladesh Ltd.
                        </span>
                    </div>
                </div>
                <div className={`hidden md:flex items-center space-x-6 font-medium ${textClasses}`}>
                    <a href="#" onClick={() => handleNavigate('Home')} className={`${hoverTextClasses} transition-colors`}>Home</a>
                    <div className="relative">
                        <button onClick={() => {
                            setIsAboutDropdownOpen(!isAboutDropdownOpen);
                            setIsServicesDropdownOpen(false);
                            setIsMoreDropdownOpen(false);
                        }} className={`flex items-center ${hoverTextClasses} transition-colors`}>
                            About Us <Icon path="M19.5 8.25l-7.5 7.5-7.5-7.5" className="w-4 h-4 ml-1" solid />
                        </button>
                        {isAboutDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20">
                                <a href="#" onClick={() => handleNavigate('AboutUs')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Overview</a>
                                <a href="#" onClick={() => handleNavigate('OurTeam')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Our Team</a>
                                <a href="#" onClick={() => handleNavigate('OurPartners')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Our Partners</a>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <button onClick={() => {
                            setIsServicesDropdownOpen(!isServicesDropdownOpen);
                            setIsAboutDropdownOpen(false);
                            setIsMoreDropdownOpen(false);
                        }} className={`flex items-center ${hoverTextClasses} transition-colors`}>
                            Services <Icon path="M19.5 8.25l-7.5 7.5-7.5-7.5" className="w-4 h-4 ml-1" solid />
                        </button>
                        {isServicesDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20">
                                <a href="#" onClick={() => handleNavigate('OurServices')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Plans & Pricing</a>
                                <a href="#" onClick={() => handleNavigate('NetworkHospital')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Network Hospitals</a>
                                <a href="#" onClick={() => handleNavigate('SuperShop')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Super Shops</a>
                                <a href="#" onClick={() => handleNavigate('Transportation')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Transportation</a>
                            </div>
                        )}
                    </div>
                    <a href="#" onClick={() => handleNavigate('Contact')} className={`${hoverTextClasses} transition-colors`}>Contact</a>
                    <div className="relative">
                        <button onClick={() => {
                            setIsMoreDropdownOpen(!isMoreDropdownOpen);
                            setIsAboutDropdownOpen(false);
                            setIsServicesDropdownOpen(false);
                        }} className={`flex items-center ${hoverTextClasses} transition-colors`}>
                            More <Icon path="M19.5 8.25l-7.5 7.5-7.5-7.5" className="w-4 h-4 ml-1" solid />
                        </button>
                        {isMoreDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20">
                                <a href="#" onClick={() => handleNavigate('ValuedMembers')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Valued Members</a>
                                <a href="#" onClick={() => handleNavigate('Registration')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Registration</a>
                                <a href="#" onClick={() => handleNavigate('Payment')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Payment</a>
                                <a href="#" onClick={() => handleNavigate('InsurancePartner')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Insurance Partner</a>
                                <a href="#" onClick={() => handleNavigate('CustomerSupport')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Customer Support</a>
                                <a href="#" onClick={() => handleNavigate('TermsAndConditions')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Terms & Conditions</a>
                                <a href="#" onClick={() => handleNavigate('PrivacyPolicy')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Privacy Policy</a>
                                <a href="#" onClick={() => handleNavigate('ReturnAndRefundPolicy')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Return & Refund Policy</a>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Mobile menu button */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`md:hidden ${textClasses}`}
                    aria-label="Toggle mobile menu"
                >
                    <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" className="w-6 h-6" />
                </button>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
                        <div className="px-6 py-4 space-y-4">
                            <a href="#" onClick={() => handleNavigate('Home')} className="block text-lg text-gray-700 hover:text-green-600 transition-colors">Home</a>
                            <a href="#" onClick={() => handleNavigate('AboutUs')} className="block text-lg text-gray-700 hover:text-green-600 transition-colors">About Us</a>
                            <a href="#" onClick={() => handleNavigate('OurServices')} className="block text-lg text-gray-700 hover:text-green-600 transition-colors">Services</a>
                            <a href="#" onClick={() => handleNavigate('Contact')} className="block text-lg text-gray-700 hover:text-green-600 transition-colors">Contact</a>
                            <div className="pt-4 border-t border-gray-200 space-y-2">
                                <a href="#" onClick={() => handleNavigate('ValuedMembers')} className="block text-base text-gray-600 hover:text-green-600 transition-colors">Valued Members</a>
                                <a href="#" onClick={() => handleNavigate('Registration')} className="block text-base text-gray-600 hover:text-green-600 transition-colors">Registration</a>
                                <a href="#" onClick={() => handleNavigate('Payment')} className="block text-base text-gray-600 hover:text-green-600 transition-colors">Payment</a>
                                <a href="#" onClick={() => handleNavigate('InsurancePartner')} className="block text-base text-gray-600 hover:text-green-600 transition-colors">Insurance Partner</a>
                                <a href="#" onClick={() => handleNavigate('CustomerSupport')} className="block text-base text-gray-600 hover:text-green-600 transition-colors">Customer Support</a>
                                <a href="#" onClick={() => handleNavigate('TermsAndConditions')} className="block text-base text-gray-600 hover:text-green-600 transition-colors">Terms & Conditions</a>
                                <a href="#" onClick={() => handleNavigate('PrivacyPolicy')} className="block text-base text-gray-600 hover:text-green-600 transition-colors">Privacy Policy</a>
                                <a href="#" onClick={() => handleNavigate('ReturnAndRefundPolicy')} className="block text-base text-gray-600 hover:text-green-600 transition-colors">Return & Refund Policy</a>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;