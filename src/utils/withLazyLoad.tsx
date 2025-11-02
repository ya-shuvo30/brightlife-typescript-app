import React, { Suspense } from 'react';
import type { ComponentType } from 'react';
import type { LazyLoadOptions } from './lazyLoadingUtils';
import { LoadingSpinner } from './lazyLoading';

/**
 * Higher-Order Component for Lazy Loading
 * Separated for Fast Refresh compatibility
 */

export function withLazyLoad<P extends Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyLoadOptions = {}
) {
  const {
    fallback: Fallback = LoadingSpinner,
    errorFallback: ErrorFallback,
    delay = 0
  } = options;

  const LazyComponent = React.lazy(() => {
    if (delay > 0) {
      return new Promise<{ default: ComponentType<P> }>(resolve => {
        setTimeout(() => {
          importFn().then(resolve);
        }, delay);
      });
    }
    return importFn();
  });

  return React.forwardRef<HTMLElement, P>((props, ref) => {
    const [error, setError] = React.useState<Error | null>(null);
    const [retryKey, setRetryKey] = React.useState(0);

    const retry = React.useCallback(() => {
      setError(null);
      setRetryKey(prev => prev + 1);
    }, []);

    if (error && ErrorFallback) {
      return <ErrorFallback error={error} retry={retry} />;
    }

    return (
      <Suspense fallback={<Fallback />}>
        <LazyComponent key={retryKey} {...props} ref={ref} />
      </Suspense>
    );
  });
}
