import React, { useRef } from 'react';
import { useRenderMetrics, useMemoryMonitor, usePerformanceTracker, useVisibilityMetrics } from '../../hooks/performance';
import { useAsync } from '../../hooks';

/**
 * Performance showcase component demonstrating TypeScript performance monitoring
 * Shows real-time metrics and optimization techniques
 */

interface PerformanceShowcaseProps {
  readonly title: string;
  readonly simulateSlowRender?: boolean;
}

// Simulate expensive computation
const expensiveComputation = (iterations: number): number => {
  let result = 0;
  for (let i = 0; i < iterations; i++) {
    result += Math.sin(i) * Math.cos(i);
  }
  return result;
};

// Mock async operation for performance tracking
const mockApiCall = async (delay: number): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return `Data loaded after ${delay}ms`;
};

export const PerformanceShowcase: React.FC<PerformanceShowcaseProps> = ({ 
  title, 
  simulateSlowRender = false 
}) => {
  const componentRef = useRef<HTMLDivElement>(null);
  
  // Performance monitoring hooks
  const renderMetrics = useRenderMetrics('PerformanceShowcase');
  const memoryMetrics = useMemoryMonitor(3000); // Check every 3 seconds
  const performanceTracker = usePerformanceTracker<'api-call' | 'computation' | 'render'>();
  const visibilityMetrics = useVisibilityMetrics(componentRef as React.RefObject<Element>);
  
  // Async operation with performance tracking
  const { data: apiData, loading, execute: loadData } = useAsync(async () => {
    performanceTracker.startMeasurement('api-call');
    const result = await mockApiCall(Math.random() * 1000 + 500);
    performanceTracker.endMeasurement('api-call');
    return result;
  });

  // Simulate slow render if requested
  if (simulateSlowRender) {
    performanceTracker.startMeasurement('computation');
    expensiveComputation(100000); // Expensive operation
    performanceTracker.endMeasurement('computation');
  }

  // Handle load data with performance tracking
  const handleLoadData = () => {
    performanceTracker.recordMetric('api-call', 1, 'count');
    loadData().catch(console.error);
  };

  // Format memory metrics for display
  const formatMemory = (bytes: number): string => {
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  };

  // Format time metrics
  const formatTime = (ms: number): string => {
    return `${ms.toFixed(2)}ms`;
  };

  // Get performance status color
  const getPerformanceColor = (avgRenderTime: number): string => {
    if (avgRenderTime < 16) return 'text-green-600';
    if (avgRenderTime < 33) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div ref={componentRef} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">
          Real-time performance monitoring with TypeScript
        </p>
      </div>

      {/* Render Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Render Metrics</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Renders:</span>
              <span className="font-mono text-blue-900">{renderMetrics.renderCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Avg Time:</span>
              <span className={`font-mono ${getPerformanceColor(renderMetrics.averageRenderTime)}`}>
                {formatTime(renderMetrics.averageRenderTime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Last Render:</span>
              <span className="font-mono text-blue-900">
                {formatTime(renderMetrics.lastRenderTime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Slow Renders:</span>
              <span className="font-mono text-red-600">{renderMetrics.slowRenders}</span>
            </div>
          </div>
        </div>

        {/* Memory Metrics */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-900 mb-2">Memory Usage</h4>
          {memoryMetrics ? (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Used:</span>
                <span className="font-mono text-green-900">
                  {formatMemory(memoryMetrics.usedJSHeapSize)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Total:</span>
                <span className="font-mono text-green-900">
                  {formatMemory(memoryMetrics.totalJSHeapSize)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Limit:</span>
                <span className="font-mono text-green-900">
                  {formatMemory(memoryMetrics.jsHeapSizeLimit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Usage:</span>
                <span className="font-mono text-green-900">
                  {((memoryMetrics.usedJSHeapSize / memoryMetrics.jsHeapSizeLimit) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Memory monitoring not available
            </div>
          )}
        </div>

        {/* Visibility Metrics */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-purple-900 mb-2">Visibility</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-purple-700">Visible:</span>
              <span className={`font-mono ${visibilityMetrics.isVisible ? 'text-green-600' : 'text-red-600'}`}>
                {visibilityMetrics.isVisible ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">Ratio:</span>
              <span className="font-mono text-purple-900">
                {(visibilityMetrics.visibilityRatio * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">Total Time:</span>
              <span className="font-mono text-purple-900">
                {formatTime(visibilityMetrics.totalVisibleTime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">View Count:</span>
              <span className="font-mono text-purple-900">
                {visibilityMetrics.visibilityCount}
              </span>
            </div>
          </div>
        </div>

        {/* Custom Metrics */}
        <div className="bg-orange-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-orange-900 mb-2">Custom Metrics</h4>
          <div className="space-y-1 text-sm">
            {performanceTracker.metrics.slice(-4).map((metric, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-orange-700 truncate">{metric.name}:</span>
                <span className="font-mono text-orange-900">
                  {metric.value.toFixed(1)}{metric.unit}
                </span>
              </div>
            ))}
            {performanceTracker.metrics.length === 0 && (
              <div className="text-sm text-gray-500">No metrics recorded</div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Controls */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleLoadData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Test API Call'}
          </button>
          
          <button
            onClick={() => {
              performanceTracker.startMeasurement('computation');
              expensiveComputation(50000);
              performanceTracker.endMeasurement('computation');
            }}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            Run Computation
          </button>
          
          <button
            onClick={() => performanceTracker.recordMetric('api-call', Math.random() * 100, 'ms')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Record Metric
          </button>
        </div>
        
        {apiData && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">
              <strong>API Response:</strong> {apiData}
            </p>
          </div>
        )}
      </div>

      {/* Performance Tips */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">💡 Performance Tips</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Aim for render times under 16ms (60 FPS)</li>
          <li>• Monitor memory usage to prevent leaks</li>
          <li>• Use intersection observer for visibility tracking</li>
          <li>• Implement error boundaries for graceful degradation</li>
          <li>• Leverage TypeScript for compile-time optimizations</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceShowcase;
