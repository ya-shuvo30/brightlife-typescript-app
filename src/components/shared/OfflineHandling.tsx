import React, { useState, useEffect } from 'react';
import { useNetworkState } from '../../utils/pwa';
import { useTranslation } from '../../hooks/useI18n';

/**
 * Offline Handling Components and Utilities
 * Provides comprehensive offline experience management
 */

// Offline banner component
export const OfflineBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isOnline } = useNetworkState();
  const { t } = useTranslation();
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOfflineMessage(true);
      setShowOnlineMessage(false);
    } else {
      setShowOfflineMessage(false);
      if (showOfflineMessage) {
        setShowOnlineMessage(true);
        // Hide online message after 3 seconds
        setTimeout(() => setShowOnlineMessage(false), 3000);
      }
    }
  }, [isOnline, showOfflineMessage]);

  if (showOfflineMessage) {
    return (
      <div className={`
        fixed top-0 left-0 right-0 z-50
        bg-red-600 text-white px-4 py-2
        text-center text-sm font-medium
        transform transition-transform duration-300
        ${className}
      `}>
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
          </svg>
          <span>{t('pwa.offline')}</span>
        </div>
      </div>
    );
  }

  if (showOnlineMessage) {
    return (
      <div className={`
        fixed top-0 left-0 right-0 z-50
        bg-green-600 text-white px-4 py-2
        text-center text-sm font-medium
        transform transition-transform duration-300
        ${className}
      `}>
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{t('pwa.online')}</span>
        </div>
      </div>
    );
  }

  return null;
};

// Network status indicator
export const NetworkStatus: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isOnline, effectiveType, downlink, rtt } = useNetworkState();

  const getConnectionQuality = () => {
    if (!isOnline) return 'offline';
    if (!effectiveType) return 'unknown';
    
    switch (effectiveType) {
      case 'slow-2g':
        return 'poor';
      case '2g':
        return 'fair';
      case '3g':
        return 'good';
      case '4g':
        return 'excellent';
      default:
        return 'unknown';
    }
  };

  const quality = getConnectionQuality();
  
  const statusColors = {
    offline: 'text-red-600',
    poor: 'text-red-500',
    fair: 'text-yellow-500',
    good: 'text-blue-500',
    excellent: 'text-green-500',
    unknown: 'text-gray-500'
  };

  const statusIcons = {
    offline: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    poor: (
      <div className="flex space-x-0.5">
        <div className="w-1 h-3 bg-current rounded-full"></div>
        <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
        <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
        <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
      </div>
    ),
    fair: (
      <div className="flex space-x-0.5">
        <div className="w-1 h-3 bg-current rounded-full"></div>
        <div className="w-1 h-3 bg-current rounded-full"></div>
        <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
        <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
      </div>
    ),
    good: (
      <div className="flex space-x-0.5">
        <div className="w-1 h-3 bg-current rounded-full"></div>
        <div className="w-1 h-3 bg-current rounded-full"></div>
        <div className="w-1 h-3 bg-current rounded-full"></div>
        <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
      </div>
    ),
    excellent: (
      <div className="flex space-x-0.5">
        <div className="w-1 h-3 bg-current rounded-full"></div>
        <div className="w-1 h-3 bg-current rounded-full"></div>
        <div className="w-1 h-3 bg-current rounded-full"></div>
        <div className="w-1 h-3 bg-current rounded-full"></div>
      </div>
    ),
    unknown: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    )
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${statusColors[quality]} flex items-center`}>
        {statusIcons[quality]}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {isOnline ? (
          <div className="flex flex-col">
            <span className="capitalize">{quality}</span>
            {downlink && (
              <span>{downlink.toFixed(1)} Mbps</span>
            )}
            {rtt && (
              <span>{rtt}ms</span>
            )}
          </div>
        ) : (
          <span>Offline</span>
        )}
      </div>
    </div>
  );
};

// Offline fallback component
interface OfflineFallbackProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const OfflineFallback: React.FC<OfflineFallbackProps> = ({
  children,
  fallback,
  className = ''
}) => {
  const { isOnline } = useNetworkState();
  const { t } = useTranslation();

  if (!isOnline) {
    return (
      <div className={`text-center py-8 ${className}`}>
        {fallback || (
          <div className="space-y-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('pwa.offline')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('errors.networkError')}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};
