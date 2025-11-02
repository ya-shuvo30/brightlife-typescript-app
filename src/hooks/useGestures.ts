import { useRef, useCallback, useState } from 'react';

/**
 * Modern Gesture Handling System
 * Touch, mouse, and keyboard gesture recognition
 */

export interface Point {
  x: number;
  y: number;
}

export interface GestureState {
  isActive: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  deltaX: number;
  deltaY: number;
  distance: number;
  velocity: Point;
  direction: 'up' | 'down' | 'left' | 'right' | null;
  duration: number;
}

export interface SwipeConfig {
  threshold?: number;
  velocityThreshold?: number;
  directionalThreshold?: number;
  onSwipeStart?: (state: GestureState) => void;
  onSwipeMove?: (state: GestureState) => void;
  onSwipeEnd?: (state: GestureState) => void;
  onSwipe?: (direction: GestureState['direction'], state: GestureState) => void;
}

/**
 * Swipe gesture hook with advanced touch handling
 */
export const useSwipeGesture = (config: SwipeConfig = {}) => {
  const {
    threshold = 50,
    velocityThreshold = 0.3,
    directionalThreshold = 30,
    onSwipeStart,
    onSwipeMove,
    onSwipeEnd,
    onSwipe,
  } = config;

  const [gestureState, setGestureState] = useState<GestureState>({
    isActive: false,
    startPoint: null,
    currentPoint: null,
    deltaX: 0,
    deltaY: 0,
    distance: 0,
    velocity: { x: 0, y: 0 },
    direction: null,
    duration: 0,
  });

  const startTimeRef = useRef<number>(0);
  const lastPointRef = useRef<Point | null>(null);
  const lastTimeRef = useRef<number>(0);

  const calculateGestureState = useCallback((startPoint: Point, currentPoint: Point): GestureState => {
    const deltaX = currentPoint.x - startPoint.x;
    const deltaY = currentPoint.y - startPoint.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Date.now() - startTimeRef.current;

    // Calculate velocity
    let velocity = { x: 0, y: 0 };
    if (lastPointRef.current && lastTimeRef.current) {
      const timeDelta = Date.now() - lastTimeRef.current;
      if (timeDelta > 0) {
        velocity = {
          x: (currentPoint.x - lastPointRef.current.x) / timeDelta,
          y: (currentPoint.y - lastPointRef.current.y) / timeDelta,
        };
      }
    }

    // Determine direction
    let direction: GestureState['direction'] = null;
    if (distance > directionalThreshold) {
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);
      
      if (absDeltaX > absDeltaY) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }
    }

    return {
      isActive: true,
      startPoint,
      currentPoint,
      deltaX,
      deltaY,
      distance,
      velocity,
      direction,
      duration,
    };
  }, [directionalThreshold]);

  const handleStart = useCallback((point: Point) => {
    startTimeRef.current = Date.now();
    lastPointRef.current = point;
    lastTimeRef.current = Date.now();
    
    const newState: GestureState = {
      isActive: true,
      startPoint: point,
      currentPoint: point,
      deltaX: 0,
      deltaY: 0,
      distance: 0,
      velocity: { x: 0, y: 0 },
      direction: null,
      duration: 0,
    };
    
    setGestureState(newState);
    onSwipeStart?.(newState);
  }, [onSwipeStart]);

  const handleMove = useCallback((point: Point) => {
    if (!gestureState.startPoint) return;

    const newState = calculateGestureState(gestureState.startPoint, point);
    setGestureState(newState);
    onSwipeMove?.(newState);

    lastPointRef.current = point;
    lastTimeRef.current = Date.now();
  }, [gestureState.startPoint, calculateGestureState, onSwipeMove]);

  const handleEnd = useCallback(() => {
    if (!gestureState.isActive || !gestureState.startPoint || !gestureState.currentPoint) return;

    const finalState = { ...gestureState, isActive: false };
    setGestureState(finalState);
    onSwipeEnd?.(finalState);

    // Check if swipe threshold is met
    const { distance, velocity, direction } = finalState;
    const velocityMagnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    
    if (distance > threshold || velocityMagnitude > velocityThreshold) {
      onSwipe?.(direction, finalState);
    }

    // Reset refs
    lastPointRef.current = null;
    lastTimeRef.current = 0;
  }, [gestureState, threshold, velocityThreshold, onSwipeEnd, onSwipe]);

  const handlers = {
    onTouchStart: (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        handleStart({ x: touch.clientX, y: touch.clientY });
      }
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        handleMove({ x: touch.clientX, y: touch.clientY });
      }
    },
    onTouchEnd: () => {
      handleEnd();
    },
    onMouseDown: (e: React.MouseEvent) => {
      handleStart({ x: e.clientX, y: e.clientY });
    },
    onMouseMove: (e: React.MouseEvent) => {
      if (e.buttons === 1) { // Left mouse button pressed
        handleMove({ x: e.clientX, y: e.clientY });
      }
    },
    onMouseUp: () => {
      handleEnd();
    },
  };

  return {
    gestureState,
    handlers,
  };
};

/**
 * Pinch/Zoom gesture hook
 */
export interface PinchConfig {
  onPinchStart?: (scale: number) => void;
  onPinchMove?: (scale: number, delta: number) => void;
  onPinchEnd?: (scale: number) => void;
  minScale?: number;
  maxScale?: number;
}

export const usePinchGesture = (config: PinchConfig = {}) => {
  const { onPinchStart, onPinchMove, onPinchEnd, minScale = 0.5, maxScale = 3 } = config;
  
  const [scale, setScale] = useState(1);
  const [isPinching, setIsPinching] = useState(false);
  
  const initialDistanceRef = useRef<number>(0);
  const initialScaleRef = useRef<number>(1);

  const getDistance = useCallback((touch1: React.Touch, touch2: React.Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setIsPinching(true);
      initialDistanceRef.current = getDistance(e.touches[0], e.touches[1]);
      initialScaleRef.current = scale;
      onPinchStart?.(scale);
    }
  }, [scale, getDistance, onPinchStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && isPinching) {
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scaleChange = currentDistance / initialDistanceRef.current;
      const newScale = Math.max(minScale, Math.min(maxScale, initialScaleRef.current * scaleChange));
      
      setScale(newScale);
      onPinchMove?.(newScale, newScale - scale);
    }
  }, [isPinching, scale, getDistance, minScale, maxScale, onPinchMove]);

  const handleTouchEnd = useCallback(() => {
    if (isPinching) {
      setIsPinching(false);
      onPinchEnd?.(scale);
    }
  }, [isPinching, scale, onPinchEnd]);

  const handlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  const resetScale = useCallback(() => {
    setScale(1);
  }, []);

  return {
    scale,
    isPinching,
    handlers,
    resetScale,
    setScale,
  };
};

/**
 * Long press gesture hook
 */
export interface LongPressConfig {
  threshold?: number;
  onLongPress?: () => void;
  onLongPressStart?: () => void;
  onLongPressEnd?: () => void;
}

export const useLongPress = (config: LongPressConfig = {}) => {
  const { threshold = 500, onLongPress, onLongPressStart, onLongPressEnd } = config;
  
  const [isLongPressing, setIsLongPressing] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsLongPressing(false);
    
    timeoutRef.current = window.setTimeout(() => {
      setIsLongPressing(true);
      onLongPressStart?.();
      onLongPress?.();
    }, threshold);
  }, [threshold, onLongPress, onLongPressStart]);

  const end = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isLongPressing) {
      onLongPressEnd?.();
    }
    
    setIsLongPressing(false);
  }, [isLongPressing, onLongPressEnd]);

  const handlers = {
    onMouseDown: start,
    onMouseUp: end,
    onMouseLeave: end,
    onTouchStart: start,
    onTouchEnd: end,
  };

  return {
    isLongPressing,
    handlers,
  };
};

/**
 * Drag gesture hook with constraints
 */
export interface DragConfig {
  onDragStart?: (point: Point) => void;
  onDragMove?: (point: Point, delta: Point) => void;
  onDragEnd?: (point: Point) => void;
  bounds?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  axis?: 'x' | 'y' | 'both';
  grid?: number;
}

export const useDrag = (config: DragConfig = {}) => {
  const { onDragStart, onDragMove, onDragEnd, bounds, axis = 'both', grid } = config;
  
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
  
  const startPointRef = useRef<Point>({ x: 0, y: 0 });
  const initialPositionRef = useRef<Point>({ x: 0, y: 0 });

  const constrainPoint = useCallback((point: Point): Point => {
    let { x, y } = point;

    // Apply axis constraints
    if (axis === 'x') y = initialPositionRef.current.y;
    if (axis === 'y') x = initialPositionRef.current.x;

    // Apply bounds constraints
    if (bounds) {
      if (bounds.left !== undefined) x = Math.max(x, bounds.left);
      if (bounds.right !== undefined) x = Math.min(x, bounds.right);
      if (bounds.top !== undefined) y = Math.max(y, bounds.top);
      if (bounds.bottom !== undefined) y = Math.min(y, bounds.bottom);
    }

    // Apply grid constraints
    if (grid) {
      x = Math.round(x / grid) * grid;
      y = Math.round(y / grid) * grid;
    }

    return { x, y };
  }, [axis, bounds, grid]);

  const handleStart = useCallback((point: Point) => {
    setIsDragging(true);
    startPointRef.current = point;
    initialPositionRef.current = position;
    onDragStart?.(point);
  }, [position, onDragStart]);

  const handleMove = useCallback((point: Point) => {
    if (!isDragging) return;

    const deltaX = point.x - startPointRef.current.x;
    const deltaY = point.y - startPointRef.current.y;
    
    const newPosition = constrainPoint({
      x: initialPositionRef.current.x + deltaX,
      y: initialPositionRef.current.y + deltaY,
    });

    setPosition(newPosition);
    onDragMove?.(newPosition, { x: deltaX, y: deltaY });
  }, [isDragging, constrainPoint, onDragMove]);

  const handleEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd?.(position);
    }
  }, [isDragging, position, onDragEnd]);

  const handlers = {
    onMouseDown: (e: React.MouseEvent) => {
      handleStart({ x: e.clientX, y: e.clientY });
    },
    onMouseMove: (e: React.MouseEvent) => {
      if (isDragging) {
        handleMove({ x: e.clientX, y: e.clientY });
      }
    },
    onMouseUp: handleEnd,
    onTouchStart: (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        handleStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        handleMove({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    },
    onTouchEnd: handleEnd,
  };

  const setPositionManually = useCallback((newPosition: Point) => {
    setPosition(constrainPoint(newPosition));
  }, [constrainPoint]);

  return {
    isDragging,
    position,
    handlers,
    setPosition: setPositionManually,
  };
};

/**
 * Multi-touch gesture recognition hook
 */
export interface MultiTouchConfig {
  onTouch?: (touches: React.Touch[]) => void;
  onGesture?: (gestureType: 'pinch' | 'rotate' | 'pan', data: unknown) => void;
}

export const useMultiTouch = (config: MultiTouchConfig = {}) => {
  const [activeTouches, setActiveTouches] = useState<React.Touch[]>([]);
  const { onTouch, onGesture } = config;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touches = Array.from(e.touches);
    setActiveTouches(touches);
    onTouch?.(touches);
  }, [onTouch]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touches = Array.from(e.touches);
    setActiveTouches(touches);
    onTouch?.(touches);

    // Detect gestures based on touch count
    if (touches.length === 2) {
      // Could implement pinch/rotate detection here
      onGesture?.('pinch', { touches });
    } else if (touches.length === 1) {
      onGesture?.('pan', { touches });
    }
  }, [onTouch, onGesture]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touches = Array.from(e.touches);
    setActiveTouches(touches);
    onTouch?.(touches);
  }, [onTouch]);

  const handlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return {
    activeTouches,
    touchCount: activeTouches.length,
    handlers,
  };
};
