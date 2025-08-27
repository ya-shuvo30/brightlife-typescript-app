import { useState, useEffect } from 'react';
import { useNetworkState } from '../utils/pwa';

/**
 * Offline Action Management Hooks
 * Separated for Fast Refresh compatibility
 */

// Offline queue manager for actions
class OfflineActionQueue {
  private queue: Array<{ id: string; action: () => Promise<void>; timestamp: number }> = [];
  private isProcessing = false;

  addAction(id: string, action: () => Promise<void>) {
    this.queue.push({
      id,
      action,
      timestamp: Date.now()
    });
    
    // Store in localStorage for persistence
    this.saveQueue();
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) break;
      
      try {
        await item.action();
        console.log(`✅ Offline action ${item.id} processed successfully`);
      } catch (error) {
        console.error(`❌ Failed to process offline action ${item.id}:`, error);
        // Optionally re-queue failed actions
        this.queue.unshift(item);
        break;
      }
    }
    
    this.isProcessing = false;
    this.saveQueue();
  }

  private saveQueue() {
    try {
      localStorage.setItem('offline-action-queue', JSON.stringify(
        this.queue.map(item => ({
          id: item.id,
          timestamp: item.timestamp
          // Note: Functions can't be serialized, so we'd need a different approach
          // for persistent queuing (like storing action types and parameters)
        }))
      ));
    } catch (error) {
      console.warn('Failed to save offline queue:', error);
    }
  }

  getQueueSize() {
    return this.queue.length;
  }

  clearQueue() {
    this.queue = [];
    this.saveQueue();
  }
}

// Offline action queue hook
export const useOfflineActions = () => {
  const [queue] = useState(() => new OfflineActionQueue());
  const { isOnline } = useNetworkState();

  useEffect(() => {
    if (isOnline) {
      queue.processQueue();
    }
  }, [isOnline, queue]);

  return {
    addAction: (id: string, action: () => Promise<void>) => queue.addAction(id, action),
    queueSize: queue.getQueueSize(),
    clearQueue: () => queue.clearQueue()
  };
};
