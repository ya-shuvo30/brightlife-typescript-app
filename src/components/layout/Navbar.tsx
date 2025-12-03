import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../shared/Icon.tsx';
import logo from '../../assets/images/logo.png';

// Define the types for the component's props
interface NavbarProps {
  navigateTo: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ navigateTo }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
    const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
    const [isMediaDropdownOpen, setIsMediaDropdownOpen] = useState(false);
    const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeAllDropdowns = () => {
        setIsAboutDropdownOpen(false);
        setIsServicesDropdownOpen(false);
        setIsMediaDropdownOpen(false);
        setIsMoreDropdownOpen(false);
        setIsLoginDropdownOpen(false);
    };

    const handleNavigate = (section: string) => {
        navigateTo(section);
        closeAllDropdowns();
        setIsMenuOpen(false);
    };

    const handleAuthNavigate = (path: string) => {
        navigate(path);
        closeAllDropdowns();
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
                            setIsMediaDropdownOpen(false);
                            setIsMoreDropdownOpen(false);
                            setIsLoginDropdownOpen(false);
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
                            setIsMediaDropdownOpen(false);
                            setIsMoreDropdownOpen(false);
                            setIsLoginDropdownOpen(false);
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
                    <div className="relative">
                        <button onClick={() => {
                            setIsMediaDropdownOpen(!isMediaDropdownOpen);
                            setIsAboutDropdownOpen(false);
                            setIsServicesDropdownOpen(false);
                            setIsMoreDropdownOpen(false);
                            setIsLoginDropdownOpen(false);
                        }} className={`flex items-center ${hoverTextClasses} transition-colors`}>
                            Media <Icon path="M19.5 8.25l-7.5 7.5-7.5-7.5" className="w-4 h-4 ml-1" solid />
                        </button>
                        {isMediaDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20">
                                <a href="#" onClick={() => handleNavigate('NewsAndEvents')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">News & Events</a>
                                <a href="#" onClick={() => handleNavigate('PhotosAndVideos')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Photos & Videos</a>
                            </div>
                        )}
                    </div>
                    <a href="#" onClick={() => handleNavigate('Contact')} className={`${hoverTextClasses} transition-colors`}>Contact</a>
                    <div className="relative">
                        <button onClick={() => {
                            setIsMoreDropdownOpen(!isMoreDropdownOpen);
                            setIsAboutDropdownOpen(false);
                            setIsServicesDropdownOpen(false);
                            setIsMediaDropdownOpen(false);
                            setIsLoginDropdownOpen(false);
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
                    {/* Login Dropdown */}
                    <div className="relative">
                        <button onClick={() => {
                            setIsLoginDropdownOpen(!isLoginDropdownOpen);
                            setIsAboutDropdownOpen(false);
                            setIsServicesDropdownOpen(false);
                            setIsMediaDropdownOpen(false);
                            setIsMoreDropdownOpen(false);
                        }} className={`flex items-center px-4 py-2 rounded-lg ${isScrolled ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white text-green-700 hover:bg-green-50'} transition-colors font-semibold`}>
                            <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" className="w-5 h-5 mr-2" />
                            Login <Icon path="M19.5 8.25l-7.5 7.5-7.5-7.5" className="w-4 h-4 ml-1" solid />
                        </button>
                        {isLoginDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20">
                                <button onClick={() => handleAuthNavigate('/member-login')} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center transition-colors">
                                    <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" className="w-5 h-5 mr-2" />
                                    Member Login
                                </button>
                                <button onClick={() => handleAuthNavigate('/agent-login')} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center transition-colors border-t border-gray-100">
                                    <Icon path="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" className="w-5 h-5 mr-2" />
                                    Agent Login
                                </button>
                                <button onClick={() => handleAuthNavigate('/agent-signup')} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center transition-colors border-t border-gray-100 rounded-b-lg">
                                    <Icon path="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" className="w-5 h-5 mr-2" />
                                    Agent Signup
                                </button>
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
                            <a href="#" onClick={() => handleNavigate('NewsAndEvents')} className="block text-lg text-gray-700 hover:text-green-600 transition-colors">News & Events</a>
                            <a href="#" onClick={() => handleNavigate('PhotosAndVideos')} className="block text-lg text-gray-700 hover:text-green-600 transition-colors">Photos & Videos</a>
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
                            {/* Login Section for Mobile */}
                            <div className="pt-4 border-t border-gray-200 space-y-2">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Account</p>
                                <button onClick={() => handleAuthNavigate('/member-login')} className="w-full flex items-center text-left text-base text-green-700 hover:text-green-800 font-medium transition-colors py-2">
                                    <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" className="w-5 h-5 mr-2" />
                                    Member Login
                                </button>
                                <button onClick={() => handleAuthNavigate('/agent-login')} className="w-full flex items-center text-left text-base text-green-700 hover:text-green-800 font-medium transition-colors py-2">
                                    <Icon path="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" className="w-5 h-5 mr-2" />
                                    Agent Login
                                </button>
                                <button onClick={() => handleAuthNavigate('/agent-signup')} className="w-full flex items-center text-left text-base text-green-700 hover:text-green-800 font-medium transition-colors py-2">
                                    <Icon path="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" className="w-5 h-5 mr-2" />
                                    Agent Signup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;