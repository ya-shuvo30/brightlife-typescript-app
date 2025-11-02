// useSwipeGesture.ts - Touch/Swipe Gesture Support for Mobile
import { useRef, useCallback } from 'react';
import type { SwipeGesture } from '@/types/carousel';
import { useCarouselStore, useCarouselConfig } from '@/store/carouselStore';

interface UseSwipeGestureOptions {
  threshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
}

export const useSwipeGesture = (options: UseSwipeGestureOptions = {}) => {
  const { threshold = 50, preventDefaultTouchmoveEvent = false } = options;
  const config = useCarouselConfig();
  const nextSlide = useCarouselStore(state => state.nextSlide);
  const prevSlide = useCarouselStore(state => state.prevSlide);
  
  const gestureRef = useRef<SwipeGesture>({
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    direction: null,
    threshold
  });

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (!config.enableSwipe) return;
    
    const touch = event.touches[0];
    gestureRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      deltaX: 0,
      deltaY: 0,
      direction: null,
      threshold
    };
  }, [config.enableSwipe, threshold]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (!config.enableSwipe) return;
    
    if (preventDefaultTouchmoveEvent) {
      event.preventDefault();
    }
    
    const touch = event.touches[0];
    const gesture = gestureRef.current;
    
    gesture.deltaX = touch.clientX - gesture.startX;
    gesture.deltaY = touch.clientY - gesture.startY;
    
    // Determine swipe direction
    const absX = Math.abs(gesture.deltaX);
    const absY = Math.abs(gesture.deltaY);
    
    if (absX > absY && absX > threshold) {
      gesture.direction = gesture.deltaX > 0 ? 'right' : 'left';
    }
  }, [config.enableSwipe, preventDefaultTouchmoveEvent, threshold]);

  const handleTouchEnd = useCallback(() => {
    if (!config.enableSwipe) return;
    
    const gesture = gestureRef.current;
    
    // Only trigger navigation for horizontal swipes
    if (gesture.direction === 'left' && Math.abs(gesture.deltaX) > threshold) {
      nextSlide();
    } else if (gesture.direction === 'right' && Math.abs(gesture.deltaX) > threshold) {
      prevSlide();
    }
    
    // Reset gesture
    gestureRef.current = {
      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
      direction: null,
      threshold
    };
  }, [config.enableSwipe, threshold, nextSlide, prevSlide]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    gesture: gestureRef.current
  };
};

// Hook for mouse drag support (desktop)
export const useMouseDrag = (options: UseSwipeGestureOptions = {}) => {
  const { threshold = 50 } = options;
  const config = useCarouselConfig();
  const nextSlide = useCarouselStore(state => state.nextSlide);
  const prevSlide = useCarouselStore(state => state.prevSlide);
  
  const isDragging = useRef(false);
  const startX = useRef(0);
  const deltaX = useRef(0);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (!config.enableSwipe) return;
    
    isDragging.current = true;
    startX.current = event.clientX;
    deltaX.current = 0;
    
    // Prevent text selection during drag
    event.preventDefault();
  }, [config.enableSwipe]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!config.enableSwipe || !isDragging.current) return;
    
    deltaX.current = event.clientX - startX.current;
  }, [config.enableSwipe]);

  const handleMouseUp = useCallback(() => {
    if (!config.enableSwipe || !isDragging.current) return;
    
    isDragging.current = false;
    
    if (Math.abs(deltaX.current) > threshold) {
      if (deltaX.current < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    
    deltaX.current = 0;
  }, [config.enableSwipe, threshold, nextSlide, prevSlide]);

  const handleMouseLeave = useCallback(() => {
    isDragging.current = false;
    deltaX.current = 0;
  }, []);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    isDragging: isDragging.current
  };
};
