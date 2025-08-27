import React from 'react';

/**
 * Image Optimization Components
 * Provides lazy loading, progressive loading, and responsive images
 */

// Image loading states
type ImageLoadState = 'loading' | 'loaded' | 'error';

// Progressive image component with lazy loading
export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  blurDataURL?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  placeholder,
  blurDataURL,
  priority = false,
  sizes,
  fill = false,
  className = '',
  onLoad,
  onError,
  ...props
}) => {
  const [loadState, setLoadState] = React.useState<ImageLoadState>('loading');
  const [currentSrc, setCurrentSrc] = React.useState(blurDataURL || placeholder || '');
  const imgRef = React.useRef<HTMLImageElement>(null);

  // Intersection observer for lazy loading
  const [isInView, setIsInView] = React.useState(priority);

  React.useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const img = imgRef.current;
    if (img) {
      observer.observe(img);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Load the actual image when in view
  React.useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.onload = () => {
      setCurrentSrc(src);
      setLoadState('loaded');
      onLoad?.();
    };
    img.onerror = () => {
      setLoadState('error');
      onError?.();
    };
    img.src = src;
    if (sizes) img.sizes = sizes;
  }, [isInView, src, sizes, onLoad, onError]);

  const imageClasses = `
    transition-all duration-300 ease-in-out
    ${loadState === 'loading' ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
    ${loadState === 'error' ? 'bg-gray-200' : ''}
    ${fill ? 'absolute inset-0 w-full h-full object-cover' : ''}
    ${className}
  `;

  const containerClasses = fill ? 'relative overflow-hidden' : '';

  const imageElement = (
    <img
      ref={imgRef}
      src={currentSrc || placeholder}
      alt={alt}
      className={imageClasses}
      {...props}
    />
  );

  if (fill) {
    return <div className={containerClasses}>{imageElement}</div>;
  }

  return imageElement;
};

// Progressive JPEG component
export const ProgressiveImage: React.FC<OptimizedImageProps & { 
  lowQualitySrc?: string;
}> = ({
  src,
  lowQualitySrc,
  alt,
  className = '',
  ...props
}) => {
  const [highQualityLoaded, setHighQualityLoaded] = React.useState(false);
  const [currentSrc, setCurrentSrc] = React.useState(lowQualitySrc || src);

  React.useEffect(() => {
    if (!lowQualitySrc) return;

    const img = new Image();
    img.onload = () => {
      setCurrentSrc(src);
      setHighQualityLoaded(true);
    };
    img.src = src;
  }, [src, lowQualitySrc]);

  return (
    <OptimizedImage
      src={currentSrc}
      alt={alt}
      className={`
        ${className}
        ${!highQualityLoaded && lowQualitySrc ? 'filter blur-sm' : ''}
        transition-all duration-500
      `}
      {...props}
    />
  );
};

// Responsive image with multiple sources
interface ResponsiveImageSource {
  srcSet: string;
  media?: string;
  sizes?: string;
  type?: string;
}

export interface ResponsiveImageProps extends OptimizedImageProps {
  sources?: ResponsiveImageSource[];
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  sources = [],
  src,
  alt,
  className = '',
  ...props
}) => {
  return (
    <picture className={className}>
      {sources.map((source, index) => (
        <source
          key={index}
          srcSet={source.srcSet}
          media={source.media}
          sizes={source.sizes}
          type={source.type}
        />
      ))}
      <OptimizedImage
        src={src}
        alt={alt}
        {...props}
      />
    </picture>
  );
};
