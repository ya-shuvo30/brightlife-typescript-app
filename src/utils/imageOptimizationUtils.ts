import React from 'react';

/**
 * Image Optimization Hooks and Utilities
 * Separated for Fast Refresh compatibility
 */

// Image preloader hook
export const useImagePreloader = (imageSrcs: string[]) => {
  const [loadedImages, setLoadedImages] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(false);

  const preloadImages = React.useCallback(() => {
    setIsLoading(true);
    const promises = imageSrcs.map(src => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(src);
        img.src = src;
      });
    });

    Promise.allSettled(promises).then(results => {
      const loaded = new Set<string>();
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          loaded.add(imageSrcs[index]);
        }
      });
      setLoadedImages(loaded);
      setIsLoading(false);
    });
  }, [imageSrcs]);

  React.useEffect(() => {
    if (imageSrcs.length > 0) {
      preloadImages();
    }
  }, [imageSrcs, preloadImages]);

  return { loadedImages, isLoading, preloadImages };
};

// Utility function to generate srcSet for different densities
export const generateSrcSet = (baseSrc: string, densities: number[] = [1, 1.5, 2, 3]): string => {
  return densities
    .map(density => {
      const densitySrc = baseSrc.replace(/(\.[^.]+)$/, `@${density}x$1`);
      return `${densitySrc} ${density}x`;
    })
    .join(', ');
};

// Utility function to generate responsive sizes
export const generateSizes = (breakpoints: Array<{ minWidth?: number; maxWidth?: number; size: string }>): string => {
  return breakpoints
    .map(bp => {
      if (bp.minWidth && bp.maxWidth) {
        return `(min-width: ${bp.minWidth}px) and (max-width: ${bp.maxWidth}px) ${bp.size}`;
      } else if (bp.minWidth) {
        return `(min-width: ${bp.minWidth}px) ${bp.size}`;
      } else if (bp.maxWidth) {
        return `(max-width: ${bp.maxWidth}px) ${bp.size}`;
      }
      return bp.size;
    })
    .join(', ');
};
