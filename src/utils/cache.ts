/**
 * Cache Utilities for Offline Data Management
 * Provides utilities for caching API responses and managing offline data
 */

export interface CacheItem<T = unknown> {
  data: T;
  timestamp: number;
  expiryTime?: number;
}

export class CacheUtils {
  private static readonly CACHE_NAME = 'brightlife-data-cache';
  private static readonly DEFAULT_TTL = 1000 * 60 * 30; // 30 minutes

  /**
   * Store data in cache with optional TTL
   */
  static async setCache<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiryTime: ttl ? Date.now() + ttl : Date.now() + this.DEFAULT_TTL
      };

      if ('caches' in window) {
        const cache = await caches.open(this.CACHE_NAME);
        const response = new Response(JSON.stringify(cacheItem), {
          headers: { 'Content-Type': 'application/json' }
        });
        await cache.put(key, response);
      } else {
        // Fallback to localStorage
        localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
      }
    } catch (error) {
      console.warn('Failed to set cache:', error);
    }
  }

  /**
   * Retrieve data from cache if not expired
   */
  static async getCache<T>(key: string): Promise<T | null> {
    try {
      let cacheItem: CacheItem<T> | null = null;

      if ('caches' in window) {
        const cache = await caches.open(this.CACHE_NAME);
        const response = await cache.match(key);
        if (response) {
          cacheItem = await response.json();
        }
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          cacheItem = JSON.parse(stored);
        }
      }

      if (!cacheItem) return null;

      // Check if expired
      if (cacheItem.expiryTime && Date.now() > cacheItem.expiryTime) {
        await this.removeCache(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Failed to get cache:', error);
      return null;
    }
  }

  /**
   * Remove specific cache entry
   */
  static async removeCache(key: string): Promise<void> {
    try {
      if ('caches' in window) {
        const cache = await caches.open(this.CACHE_NAME);
        await cache.delete(key);
      } else {
        localStorage.removeItem(`cache_${key}`);
      }
    } catch (error) {
      console.warn('Failed to remove cache:', error);
    }
  }

  /**
   * Clear all cache entries
   */
  static async clearCache(): Promise<void> {
    try {
      if ('caches' in window) {
        await caches.delete(this.CACHE_NAME);
      } else {
        // Remove all cache items from localStorage
        const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'));
        keys.forEach(key => localStorage.removeItem(key));
      }
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  /**
   * Get cache size and statistics
   */
  static async getCacheStats(): Promise<{
    itemCount: number;
    totalSize: number;
    oldestItem: number | null;
    newestItem: number | null;
  }> {
    try {
      let itemCount = 0;
      let totalSize = 0;
      let oldestItem: number | null = null;
      let newestItem: number | null = null;

      if ('caches' in window) {
        const cache = await caches.open(this.CACHE_NAME);
        const keys = await cache.keys();
        itemCount = keys.length;

        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            const text = await response.text();
            totalSize += text.length;

            try {
              const cacheItem: CacheItem = JSON.parse(text);
              if (!oldestItem || cacheItem.timestamp < oldestItem) {
                oldestItem = cacheItem.timestamp;
              }
              if (!newestItem || cacheItem.timestamp > newestItem) {
                newestItem = cacheItem.timestamp;
              }
            } catch {
              // Skip invalid cache items
            }
          }
        }
      } else {
        // Fallback to localStorage
        const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'));
        itemCount = keys.length;

        keys.forEach(key => {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += value.length;
            try {
              const cacheItem: CacheItem = JSON.parse(value);
              if (!oldestItem || cacheItem.timestamp < oldestItem) {
                oldestItem = cacheItem.timestamp;
              }
              if (!newestItem || cacheItem.timestamp > newestItem) {
                newestItem = cacheItem.timestamp;
              }
            } catch {
              // Skip invalid cache items
            }
          }
        });
      }

      return {
        itemCount,
        totalSize,
        oldestItem,
        newestItem
      };
    } catch (error) {
      console.warn('Failed to get cache stats:', error);
      return {
        itemCount: 0,
        totalSize: 0,
        oldestItem: null,
        newestItem: null
      };
    }
  }

  /**
   * Cleanup expired cache entries
   */
  static async cleanupExpiredCache(): Promise<number> {
    try {
      let cleanedCount = 0;

      if ('caches' in window) {
        const cache = await caches.open(this.CACHE_NAME);
        const keys = await cache.keys();

        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            try {
              const cacheItem: CacheItem = await response.json();
              if (cacheItem.expiryTime && Date.now() > cacheItem.expiryTime) {
                await cache.delete(request);
                cleanedCount++;
              }
            } catch {
              // Remove invalid cache items
              await cache.delete(request);
              cleanedCount++;
            }
          }
        }
      } else {
        // Fallback to localStorage
        const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'));
        
        keys.forEach(key => {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              const cacheItem: CacheItem = JSON.parse(value);
              if (cacheItem.expiryTime && Date.now() > cacheItem.expiryTime) {
                localStorage.removeItem(key);
                cleanedCount++;
              }
            } catch {
              // Remove invalid cache items
              localStorage.removeItem(key);
              cleanedCount++;
            }
          }
        });
      }

      return cleanedCount;
    } catch (error) {
      console.warn('Failed to cleanup expired cache:', error);
      return 0;
    }
  }
}
