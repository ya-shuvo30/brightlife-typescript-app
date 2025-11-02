// useIntersectionObserver.ts - Lazy Loading and Animation Triggers
import { useEffect, useRef, useState, useCallback } from 'react';
import type { IntersectionObserverOptions } from '@/types/carousel';

interface UseIntersectionObserverResult {
  isIntersecting: boolean;
  ref: React.RefObject<HTMLElement | null>;
  entry: IntersectionObserverEntry | null;
}

export const useIntersectionObserver = (
  options: IntersectionObserverOptions = {}
): UseIntersectionObserverResult => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    root = null
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<HTMLElement | null>(null);

  const updateEntry = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setEntry(entry);
    setIsIntersecting(entry.isIntersecting);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver) {
      return;
    }

    const observer = new window.IntersectionObserver(updateEntry, {
      threshold,
      rootMargin,
      root
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, root, updateEntry]);

  return {
    isIntersecting,
    ref,
    entry
  };
};

// Hook for lazy loading images
export const useLazyImage = (src: string, options: IntersectionObserverOptions = {}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { isIntersecting, ref } = useIntersectionObserver(options);

  useEffect(() => {
    if (isIntersecting && src && !imageSrc) {
      setImageSrc(src);
    }
  }, [isIntersecting, src, imageSrc]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsError(true);
    setIsLoaded(false);
  }, []);

  return {
    ref,
    imageSrc,
    isLoaded,
    isError,
    isIntersecting,
    handleLoad,
    handleError
  };
};

// Hook for animation triggers
export const useAnimationTrigger = (
  options: IntersectionObserverOptions = {}
) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.2,
    ...options
  });
  
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (isIntersecting && !hasTriggered) {
      setHasTriggered(true);
    }
  }, [isIntersecting, hasTriggered]);

  return {
    ref,
    isIntersecting,
    hasTriggered,
    shouldAnimate: hasTriggered
  };
};
