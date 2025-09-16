// carouselData.ts - Carousel Data for Bright Life Bangladesh
import type { CarouselSlide, CarouselConfig } from '@/types/carousel';

// Import the specific images from assets
import Slide01 from '@/assets/images/Slide-01.png';
import Slide02 from '@/assets/images/Slide-02 (1).png';
import CoverPage from '@/assets/images/coverpage.jpg';

export const carouselSlides: CarouselSlide[] = [
  {
    id: 'slide-1',
    title: 'ব্রাইট লাইফের সাথে থাকলে সুরক্ষা পাবেন নিশ্চিতে',
    subtitle: 'আপনার পরিবারের জন্য সম্পূর্ণ স্বাস্থ্য সুরক্ষা',
    description: 'সাশ্রয়ী মূল্যে সর্বোচ্চ স্বাস্থ্যসেবা এবং জীবন বীমা সুবিধা',
    features: [
      'Hospital Coverage - হাসপাতাল কভারেজ',
      'Life Insurance - জীবন বীমা',
      'Supermarket Discounts - সুপারমার্কেট ছাড়',
      'Network Discounts - নেটওয়ার্ক ছাড়',
      'Hotel Discounts - হোটেল ছাড়',
      'Travel Benefits - ভ্রমণ সুবিধা'
    ],
    buttonText: 'বিস্তারিত দেখুন',
    buttonAction: '/services',
    image: Slide01,
    imageAlt: 'Bright Life Health Coverage Services',
    backgroundGradient: 'from-blue-100 via-blue-200 to-blue-300',
    textColor: 'text-blue-900',
    buttonVariant: 'primary'
  },
  {
    id: 'slide-2',
    title: 'ব্রাইট কার্ড ব্যবহার করে পরিবার পরিজন নিয়ে সুরক্ষায় থাকুন',
    subtitle: 'পরিবারিক সুরক্ষা এবং সুখী জীবনের নিশ্চয়তা',
    description: 'একটি কার্ডে সব ধরনের স্বাস্থ্যসেবা এবং জীবনযাত্রার সুবিধা',
    features: [
      'Family Protection - পারিবারিক সুরক্ষা',
      'Happy Life - সুখী জীবন',
      'Comprehensive Healthcare - ব্যাপক স্বাস্থ্যসেবা',
      'Emergency Support - জরুরি সহায়তা',
      'Cashless Treatment - নগদহীন চিকিৎসা',
      '24/7 Customer Service - ২৪/৭ গ্রাহক সেবা'
    ],
    buttonText: 'Become a Member',
    buttonAction: '/registration',
    image: Slide02,
    imageAlt: 'Bright Life Family Protection Card',
    backgroundGradient: 'from-green-100 via-green-200 to-green-300',
    textColor: 'text-green-900',
    buttonVariant: 'success'
  },
  {
    id: 'slide-3',
    title: 'Bright Life-Bangladesh Ltd.',
    subtitle: 'YOUR SAVING PARTNER',
    description: 'বাংলাদেশের সবচেয়ে বিশ্বস্ত স্বাস্থ্য ও জীবন বীমা সেবা প্রদানকারী',
    features: [
      'www.brightlifebd.com',
      '📞 +880 1700-000000',
      '📧 info@brightlifebd.com',
      '📍 Dhaka, Bangladesh',
      '🏥 300+ Partner Hospitals',
      '👥 10,000+ Happy Members'
    ],
    buttonText: 'Contact Us',
    buttonAction: '/contact',
    image: CoverPage,
    imageAlt: 'Bright Life Bangladesh Contact Information',
    backgroundGradient: 'from-gray-700 via-gray-800 to-gray-900',
    textColor: 'text-white',
    buttonVariant: 'outline'
  }
];

export const defaultCarouselConfig: CarouselConfig = {
  autoPlayInterval: 5000, // 5 seconds
  transitionDuration: 500, // 0.5 seconds
  pauseOnHover: true,
  enableSwipe: true,
  enableKeyboard: true,
  showArrows: true,
  showDots: true,
  infiniteLoop: true
};

// Brand colors extracted from Bright Life branding
export const brandColors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
};
