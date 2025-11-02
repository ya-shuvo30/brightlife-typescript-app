/**
 * Service Worker Implementation for BrightLife PWA
 * Provides caching, offline support, and background sync
 */

// Service Worker Cache Names
const CACHE_NAME = 'brightlife-v1';
const DYNAMIC_CACHE_NAME = 'brightlife-dynamic-v1';
const STATIC_CACHE_NAME = 'brightlife-static-v1';

// Cache duration (7 days for static assets, 1 day for dynamic)
const STATIC_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;
const DYNAMIC_CACHE_DURATION = 24 * 60 * 60 * 1000;

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/offline.html'
];

// Network-first resources (API calls)
const NETWORK_FIRST_PATTERNS = [
  /\/api\//,
  /\/auth\//,
  /\/user\//
];

// Cache-first resources (static assets)
const CACHE_FIRST_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /\.(?:css|js)$/,
  /\/static\//,
  /\/icons\//
];

// Stale-while-revalidate resources
const STALE_WHILE_REVALIDATE_PATTERNS = [
  /\/data\//,
  /\/content\//
];

/**
 * Service Worker Install Event
 * Cache static assets on installation
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

/**
 * Service Worker Activate Event
 * Clean up old caches and claim clients
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== STATIC_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Cache cleanup completed');
        return self.clients.claim(); // Take control of all clients
      })
  );
});

/**
 * Service Worker Fetch Event
 * Implement caching strategies based on request type
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (unless specifically allowed)
  if (url.origin !== self.location.origin && !isAllowedOrigin(url.origin)) {
    return;
  }

  event.respondWith(handleFetch(request));
});

/**
 * Handle fetch requests with appropriate caching strategy
 */
async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Network-first strategy (for API calls)
    if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
      return await networkFirst(request);
    }
    
    // Cache-first strategy (for static assets)
    if (CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
      return await cacheFirst(request);
    }
    
    // Stale-while-revalidate strategy (for dynamic content)
    if (STALE_WHILE_REVALIDATE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
      return await staleWhileRevalidate(request);
    }
    
    // Default: Cache-first for HTML pages
    if (request.headers.get('accept')?.includes('text/html')) {
      return await cacheFirst(request);
    }
    
    // Fallback to network
    return await fetch(request);
    
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    return await handleFetchError(request);
  }
}

/**
 * Network-first caching strategy
 * Try network first, fallback to cache
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache for:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * Cache-first caching strategy
 * Try cache first, fallback to network
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse && !isExpired(cachedResponse)) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    if (cachedResponse) {
      console.log('[SW] Network failed, serving stale cache for:', request.url);
      return cachedResponse;
    }
    throw error;
  }
}

/**
 * Stale-while-revalidate caching strategy
 * Serve from cache immediately, update cache in background
 */
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  // Start fetch in background
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch((error) => {
    console.log('[SW] Background fetch failed for:', request.url, error);
  });
  
  // Return cache immediately if available, otherwise wait for network
  return cachedResponse || await fetchPromise;
}

/**
 * Handle fetch errors (offline fallbacks)
 */
async function handleFetchError(request) {
  const url = new URL(request.url);
  
  // For HTML pages, serve offline page
  if (request.headers.get('accept')?.includes('text/html')) {
    const offlineResponse = await caches.match('/offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }
  }
  
  // For API calls, return structured error response
  if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return new Response(
      JSON.stringify({
        error: 'Network unavailable',
        message: 'Please check your internet connection and try again.',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  // For other resources, return a basic error response
  return new Response('Network error occurred', {
    status: 408,
    statusText: 'Request Timeout'
  });
}

/**
 * Check if a cached response is expired
 */
function isExpired(response) {
  const cached = response.headers.get('sw-cached-date');
  if (!cached) return false;
  
  const cachedDate = new Date(cached).getTime();
  const now = Date.now();
  const age = now - cachedDate;
  
  // Use different durations based on cache type
  const maxAge = response.url.includes('static') ? STATIC_CACHE_DURATION : DYNAMIC_CACHE_DURATION;
  
  return age > maxAge;
}

/**
 * Check if origin is allowed for cross-origin requests
 */
function isAllowedOrigin(origin) {
  const allowedOrigins = [
    'https://api.brightlife.com',
    'https://cdn.brightlife.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  return allowedOrigins.includes(origin);
}

/**
 * Background Sync Event
 * Handle background sync for offline actions
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(processOfflineActions());
  }
});

/**
 * Process offline actions queue
 */
async function processOfflineActions() {
  try {
    const queue = await getOfflineQueue();
    
    for (const action of queue) {
      try {
        await fetch(action.url, action.options);
        console.log('[SW] Offline action processed:', action.id);
        await removeFromOfflineQueue(action.id);
      } catch (error) {
        console.error('[SW] Failed to process offline action:', action.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] Failed to process offline actions:', error);
  }
}

/**
 * Get offline actions queue from IndexedDB
 */
async function getOfflineQueue() {
  // Simplified implementation - in production, use IndexedDB
  try {
    const stored = await caches.match('/offline-queue');
    if (stored) {
      return await stored.json();
    }
  } catch (error) {
    console.error('[SW] Failed to get offline queue:', error);
  }
  return [];
}

/**
 * Remove action from offline queue
 */
async function removeFromOfflineQueue(actionId) {
  try {
    const queue = await getOfflineQueue();
    const updatedQueue = queue.filter(action => action.id !== actionId);
    
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    await cache.put('/offline-queue', new Response(JSON.stringify(updatedQueue)));
  } catch (error) {
    console.error('[SW] Failed to remove from offline queue:', error);
  }
}

/**
 * Push Event Handler
 * Handle push notifications
 */
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: data.data,
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('[SW] Failed to show notification:', error);
  }
});

/**
 * Notification Click Handler
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();
  
  const clickAction = event.action || 'default';
  const notificationData = event.notification.data || {};
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // If app is already open, focus it
      const existingClient = clients.find(client => client.url.includes(self.location.origin));
      
      if (existingClient) {
        existingClient.focus();
        existingClient.postMessage({
          type: 'NOTIFICATION_CLICK',
          action: clickAction,
          data: notificationData
        });
        return;
      }
      
      // Otherwise open new window
      const targetUrl = notificationData.url || '/';
      return self.clients.openWindow(targetUrl);
    })
  );
});
