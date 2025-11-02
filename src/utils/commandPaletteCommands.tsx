import type { Command } from '../hooks/useCommandPalette';

/**
 * Default commands for the application
 */
export const createDefaultCommands = (navigateTo: (section: string) => void): Command[] => [
  // Navigation commands
  {
    id: 'nav-home',
    title: 'Go to Home',
    subtitle: 'Navigate to the home page',
    keywords: ['home', 'start', 'main'],
    group: 'Navigation',
    shortcut: '⌘H',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    action: () => navigateTo('home'),
  },
  {
    id: 'nav-services',
    title: 'View Our Services',
    subtitle: 'Explore our healthcare services',
    keywords: ['services', 'healthcare', 'plans'],
    group: 'Navigation',
    shortcut: '⌘S',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    action: () => navigateTo('ourservices'),
  },
  {
    id: 'nav-contact',
    title: 'Contact Us',
    subtitle: 'Get in touch with our team',
    keywords: ['contact', 'support', 'help'],
    group: 'Navigation',
    shortcut: '⌘C',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    action: () => navigateTo('contact'),
  },
  
  // Quick actions
  {
    id: 'action-register',
    title: 'Register Now',
    subtitle: 'Sign up for our services',
    keywords: ['register', 'signup', 'join'],
    group: 'Actions',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    action: () => navigateTo('registration'),
  },
  {
    id: 'action-toggle-theme',
    title: 'Toggle Theme',
    subtitle: 'Switch between light and dark mode',
    keywords: ['theme', 'dark', 'light', 'mode'],
    group: 'Settings',
    shortcut: '⌘D',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    action: () => {
      // Toggle theme logic would go here
      console.log('Toggle theme');
    },
  },
  
  // Search commands
  {
    id: 'search-hospitals',
    title: 'Find Network Hospitals',
    subtitle: 'Search for hospitals in our network',
    keywords: ['hospital', 'network', 'find', 'search'],
    group: 'Search',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2 0H5m2 0v-3.5a2 2 0 011.5-1.95l.5-.1m7 0l.5.1a2 2 0 011.5 1.95V21m-8 0h8" />
      </svg>
    ),
    action: () => navigateTo('networkhospital'),
  },
  {
    id: 'nav-about',
    title: 'About Us',
    subtitle: 'Learn more about our company',
    keywords: ['about', 'company', 'team'],
    group: 'Navigation',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    action: () => navigateTo('aboutus'),
  },
  {
    id: 'nav-transport',
    title: 'Transportation',
    subtitle: 'Emergency transportation services',
    keywords: ['transport', 'emergency', 'ambulance'],
    group: 'Services',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
      </svg>
    ),
    action: () => navigateTo('transportation'),
  },
];
