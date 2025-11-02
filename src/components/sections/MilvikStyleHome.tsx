// MilvikStyleHome.tsx - MILVIK-inspired homepage design for Bright Life Bangladesh
import React from 'react';

const MilvikStyleHome: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Top Banner */}
      <div className="bg-blue-600 text-white text-center py-3">
        <p className="text-sm md:text-base">
          আমাদের স্বাস্থ্য পরিকল্পনা আরও ভাল হয়েছে - নতুন মূল্যে আরও সুবিধা!{' '}
          <button 
            onClick={() => scrollToSection('registration')}
            className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded-md ml-2 text-sm font-semibold transition-colors"
          >
            এখানে ক্লিক করুন
          </button>
        </p>
      </div>

      {/* Main Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div>
            {/* Bright Life Logo Badge */}
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-l-lg font-bold">
                BRIGHT LIFE
              </div>
              <div className="bg-orange-500 text-white px-4 py-2 rounded-r-lg font-bold">
                হেলথ
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-blue-900 mb-8 leading-tight">
              নতুন যুগের<br />
              <span className="text-blue-700">স্বাস্থ্য প্ল্যান</span>
            </h1>

            {/* Feature Icons Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              
              {/* 24/7 Telecaller */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-blue-900">২৪/৭</p>
                <p className="text-xs text-gray-600">টেলিকলার</p>
              </div>

              {/* 500+ Network Hospitals */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-blue-900">৫০০+টিকোনাইট</p>
                <p className="text-xs text-gray-600">নেটওয়ার্ক হাসপাতাল</p>
              </div>

              {/* Emergency & ICU Services */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-blue-900">জরুরি, আইসিইউ ও ডাক্তার</p>
                <p className="text-xs text-gray-600">ডিজিটাল কভারেজ</p>
              </div>

              {/* Cashless Coverage */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-blue-900">ক্যাশলেস</p>
                <p className="text-xs text-gray-600">কভারেজ</p>
              </div>
            </div>

            {/* Partner Logos */}
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-4 text-center">সহযোগী পেমেন্ট কোম্পানি</p>
              <div className="flex justify-center items-center space-x-3 flex-wrap gap-2">
                <div className="w-14 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">বিকাশ</span>
                </div>
                <div className="w-14 h-10 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">নগদ</span>
                </div>
                <div className="w-14 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">রকেট</span>
                </div>
                <div className="w-14 h-10 bg-gradient-to-r from-blue-700 to-blue-900 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div className="w-14 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">MC</span>
                </div>
                <div className="w-14 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">DBBL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Family Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="/src/assets/images/coverpage.jpg"
                alt="Happy family with Bright Life health coverage"
                className="w-full h-auto object-cover"
                loading="eager"
              />
              {/* Overlay for better text visibility if needed */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                <img
                  src="/src/assets/images/logo.png"
                  alt="Bright Life Logo"
                  className="h-8 w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                আরও জানতে কলব্যাক নিন
              </h2>
              <p className="text-blue-100">
                আমাদের বিশেষজ্ঞরা আপনাকে সাহায্য করতে প্রস্তুত
              </p>
            </div>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              কল পান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilvikStyleHome;