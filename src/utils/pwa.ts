import { useEffect, useState } from 'react';

/**
 * PWA (Progressive Web App) Utilities
 * Provides service worker registration, installation prompts, and offline handling
 */

// Network Information API interface
interface NetworkInformation extends EventTarget {
  readonly effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  readonly downlink: number;
  readonly rtt: number;
}

// PWA Installation state
export interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  prompt: () => Promise<void>;
  dismiss: () => void;
}

// Service Worker registration state
export interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdating: boolean;
  hasUpdate: boolean;
  update: () => Promise<void>;
  registration?: ServiceWorkerRegistration;
}

// Network state
export interface NetworkState {
  isOnline: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

// PWA Installation Hook
export const usePWAInstall = (): PWAInstallState => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppMode = 'standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true;
      setIsInstalled(isInStandaloneMode || isInWebAppMode);
    };

    checkInstalled();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const prompt = async (): Promise<void> => {
    if (!installPrompt) return;

    try {
      const result = await installPrompt.prompt();
      console.log('PWA install prompt result:', result);
      
      if (result.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
  };

  const dismiss = (): void => {
    setInstallPrompt(null);
  };

  return {
    isInstallable: !!installPrompt && !isInstalled,
    isInstalled,
    prompt,
    dismiss
  };
};

// Service Worker Hook
export const useServiceWorker = (swPath: string = '/sw.js'): ServiceWorkerState => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isUpdating: false,
    hasUpdate: false,
    update: async () => {}
  });

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      setState(prev => ({ ...prev, isSupported: true }));

      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register(swPath);
          
          setState(prev => ({
            ...prev,
            isRegistered: true,
            registration,
            update: async () => {
              if (registration.waiting) {
                // Send message to waiting SW to skip waiting
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
              } else {
                // Check for updates
                await registration.update();
              }
            }
          }));

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              setState(prev => ({ ...prev, isUpdating: true }));
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setState(prev => ({
                    ...prev,
                    isUpdating: false,
                    hasUpdate: true
                  }));
                }
              });
            }
          });

          // Listen for controller change (update applied)
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          });

        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      };

      registerSW();
    }
  }, [swPath]);

  return state;
};

// Network State Hook
export const useNetworkState = (): NetworkState => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: navigator.onLine
  });

  useEffect(() => {
    const updateNetworkState = () => {
      const nav = navigator as { connection?: NetworkInformation; mozConnection?: NetworkInformation; webkitConnection?: NetworkInformation };
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
      
      setNetworkState({
        isOnline: navigator.onLine,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt
      });
    };

    const handleOnline = () => updateNetworkState();
    const handleOffline = () => updateNetworkState();
    const handleConnectionChange = () => updateNetworkState();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const nav = navigator as { connection?: NetworkInformation; mozConnection?: NetworkInformation; webkitConnection?: NetworkInformation };
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    // Initial state
    updateNetworkState();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return networkState;
};

// Offline Storage Hook
export const useOfflineStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadValue = async () => {
      try {
        // Try IndexedDB first, then localStorage
        if ('indexedDB' in window) {
          // IndexedDB implementation would go here
          // For now, fall back to localStorage
        }
        
        const stored = localStorage.getItem(key);
        if (stored) {
          setValue(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading offline data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadValue();
  }, [key]);

  const updateValue = (newValue: T) => {
    setValue(newValue);
    try {
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  return { value, setValue: updateValue, isLoading };
};

// PWA Utilities
export const pwaUtils = {
  // Generate PWA manifest
  generateManifest: (config: {
    name: string;
    shortName: string;
    description: string;
    themeColor: string;
    backgroundColor: string;
    startUrl?: string;
    display?: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
    orientation?: 'portrait' | 'landscape' | 'any';
    icons?: Array<{ src: string; sizes: string; type: string; purpose?: string }>;
  }) => ({
    name: config.name,
    short_name: config.shortName,
    description: config.description,
    start_url: config.startUrl || '/',
    display: config.display || 'standalone',
    orientation: config.orientation || 'portrait',
    theme_color: config.themeColor,
    background_color: config.backgroundColor,
    icons: config.icons || [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  }),

  // Check if PWA features are supported
  checkSupport: () => ({
    serviceWorker: 'serviceWorker' in navigator,
    webAppManifest: 'getInstalledRelatedApps' in navigator,
    notification: 'Notification' in window,
    badgeAPI: 'setAppBadge' in navigator,
    webShare: 'share' in navigator,
    backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
    pushAPI: 'serviceWorker' in navigator && 'PushManager' in window
  }),

  // Request notification permission
  requestNotificationPermission: async (): Promise<NotificationPermission> => {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  },

  // Show notification
  showNotification: async (title: string, options?: NotificationOptions): Promise<void> => {
    if ('serviceWorker' in navigator && 'Notification' in window && Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        badge: '/icons/badge-72x72.png',
        icon: '/icons/icon-192x192.png',
        ...options
      });
    }
  },

  // Web Share API
  share: async (data: { title?: string; text?: string; url?: string }): Promise<boolean> => {
    if ('share' in navigator) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Error sharing:', error);
        return false;
      }
    }
    return false;
  },

  // Set app badge (for supported browsers)
  setAppBadge: async (count?: number): Promise<void> => {
    const nav = navigator as { setAppBadge?: (count?: number) => Promise<void> };
    if (nav.setAppBadge) {
      try {
        await nav.setAppBadge(count);
      } catch (error) {
        console.error('Error setting app badge:', error);
      }
    }
  },

  // Clear app badge
  clearAppBadge: async (): Promise<void> => {
    const nav = navigator as { clearAppBadge?: () => Promise<void> };
    if (nav.clearAppBadge) {
      try {
        await nav.clearAppBadge();
      } catch (error) {
        console.error('Error clearing app badge:', error);
      }
    }
  }
};

// BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}
