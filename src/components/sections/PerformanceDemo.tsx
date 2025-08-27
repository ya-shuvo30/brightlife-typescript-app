import React, { useState, useMemo } from 'react';
import { LazySection } from '../../utils/lazyLoading';
import { OptimizedImage, ProgressiveImage } from '../../utils/imageOptimization';
import { VirtualList, VirtualTable } from '../../utils/virtualScrolling';
import { useTrackedMemo } from '../../utils/memoizationHooks';
import { memoize, createMemoComponent } from '../../utils/memoization';
import '../../utils/virtualScrolling.css';

/**
 * Performance Optimization Demo Component
 * Demonstrates all performance optimization utilities in action
 */

// Sample data generators
const generateLargeDataset = memoize((size: number) => {
  console.log(`🔄 Generating dataset of ${size} items`);
  return Array.from({ length: size }, (_, index) => ({
    id: index,
    name: `Item ${index + 1}`,
    description: `Description for item ${index + 1}`,
    value: Math.random() * 1000,
    category: ['A', 'B', 'C'][index % 3],
    image: `https://picsum.photos/200/150?random=${index}`
  }));
});

const generateTableData = memoize((size: number) => {
  console.log(`📊 Generating table data of ${size} rows`);
  return Array.from({ length: size }, (_, index) => ({
    id: index,
    firstName: `First${index}`,
    lastName: `Last${index}`,
    email: `user${index}@example.com`,
    age: 20 + (index % 50),
    department: ['Engineering', 'Marketing', 'Sales', 'Support'][index % 4],
    salary: 50000 + (index % 100) * 1000,
    joinDate: new Date(2020 + (index % 4), index % 12, (index % 28) + 1).toLocaleDateString()
  }));
});

// Expensive computation example
const expensiveCalculation = memoize((numbers: number[]) => {
  console.log('🔥 Performing expensive calculation...');
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += numbers.reduce((sum, num) => sum + Math.sin(num), 0);
  }
  return result;
});

// Memoized components
const ExpensiveListItem = createMemoComponent<{
  item: { id: number; name: string; description: string; value: number; image: string };
  index: number;
}>(({ item, index }: {
  item: { id: number; name: string; description: string; value: number; image: string };
  index: number;
}) => (
  <div className="p-4 border-b border-gray-100 flex items-center space-x-4">
    <OptimizedImage
      src={item.image}
      alt={item.name}
      className="w-16 h-12 object-cover rounded"
      width={64}
      height={48}
    />
    <div className="flex-1">
      <h3 className="font-semibold text-gray-900">{item.name}</h3>
      <p className="text-sm text-gray-600">{item.description}</p>
      <p className="text-sm font-medium text-blue-600">${item.value.toFixed(2)}</p>
    </div>
    <div className="text-sm text-gray-500">#{index + 1}</div>
  </div>
));

const ImageGalleryItem = createMemoComponent<{
  src: string;
  index: number;
}>(({ src, index }) => (
  <div className="relative group">
    <ProgressiveImage
      src={src}
      alt={`Gallery image ${index + 1}`}
      className="w-full h-48 object-cover rounded-lg"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7m1uIRPBIsqHDI2QQfYjuKzt2qo="
    />
    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
      <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        Image {index + 1}
      </span>
    </div>
  </div>
));

export const PerformanceDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'table' | 'images' | 'calculations'>('list');
  const [listSize, setListSize] = useState(10000);
  const [calculationInput, setCalculationInput] = useState([1, 2, 3, 4, 5]);

  // Memoized data generation
  const listData = useTrackedMemo(
    () => generateLargeDataset(listSize),
    [listSize],
    'listData'
  );

  const tableData = useTrackedMemo(
    () => generateTableData(5000),
    [],
    'tableData'
  );

  const imageUrls = useTrackedMemo(
    () => Array.from({ length: 50 }, (_, i) => `https://picsum.photos/300/200?random=${i + 100}`),
    [],
    'imageUrls'
  );

  // Stable references and change detection
  const calculationInputString = JSON.stringify(calculationInput);
  const [lastInputString, setLastInputString] = useState(calculationInputString);
  const hasInputChanged = calculationInputString !== lastInputString;
  
  // Update last input string when calculation completes
  React.useEffect(() => {
    setLastInputString(calculationInputString);
  }, [calculationInputString]);
  
  // Expensive calculation with memoization
  const calculationResult = useMemo(() => {
    if (calculationInput.length === 0) return 0;
    return expensiveCalculation(calculationInput);
  }, [calculationInput]);

  // Table columns configuration
  const tableColumns = useMemo(() => [
    { key: 'id' as const, header: 'ID', width: 80 },
    { key: 'firstName' as const, header: 'First Name', width: 120 },
    { key: 'lastName' as const, header: 'Last Name', width: 120 },
    { key: 'email' as const, header: 'Email', width: 200 },
    { key: 'age' as const, header: 'Age', width: 80 },
    { key: 'department' as const, header: 'Department', width: 120 },
    { 
      key: 'salary' as const, 
      header: 'Salary', 
      width: 120,
      render: (value: unknown) => `$${(value as number).toLocaleString()}`
    },
    { key: 'joinDate' as const, header: 'Join Date', width: 120 }
  ], []);

  const renderTabs = () => (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
      {[
        { id: 'list', label: 'Virtual List' },
        { id: 'table', label: 'Virtual Table' },
        { id: 'images', label: 'Lazy Images' },
        { id: 'calculations', label: 'Memoized Calc' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as typeof activeTab)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Performance Optimization Demo
        </h1>
        <p className="text-gray-600">
          Demonstrating lazy loading, virtual scrolling, image optimization, and memoization strategies
        </p>
      </div>

      {renderTabs()}

      {/* Virtual List Demo */}
      {activeTab === 'list' && (
        <LazySection>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Virtual Scrolling List</h2>
              <div className="flex items-center space-x-2">
                <label htmlFor="list-size-select" className="text-sm text-gray-600">Items:</label>
                <select
                  id="list-size-select"
                  title="Select number of items in the list"
                  value={listSize}
                  onChange={(e) => setListSize(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={1000}>1,000</option>
                  <option value={5000}>5,000</option>
                  <option value={10000}>10,000</option>
                  <option value={50000}>50,000</option>
                </select>
              </div>
            </div>
            
            <VirtualList
              items={listData}
              itemHeight={80}
              containerHeight={400}
              renderItem={(item, index) => (
                <ExpensiveListItem item={item} index={index} />
              )}
              className="border border-gray-200 rounded-lg"
            />
            
            <p className="text-sm text-gray-500 mt-2">
              ✨ Only visible items are rendered ({listData.length} total items)
            </p>
          </div>
        </LazySection>
      )}

      {/* Virtual Table Demo */}
      {activeTab === 'table' && (
        <LazySection>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Virtual Scrolling Table</h2>
            
            <VirtualTable
              data={tableData}
              columns={tableColumns}
              rowHeight={50}
              containerHeight={400}
              containerWidth={800}
              className="rounded-lg"
            />
            
            <p className="text-sm text-gray-500 mt-2">
              📊 Table with {tableData.length} rows - only visible rows are rendered
            </p>
          </div>
        </LazySection>
      )}

      {/* Lazy Image Loading Demo */}
      {activeTab === 'images' && (
        <LazySection>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Lazy Loading Image Gallery</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {imageUrls.map((url, index) => (
                <ImageGalleryItem key={url} src={url} index={index} />
              ))}
            </div>
            
            <p className="text-sm text-gray-500 mt-2">
              🖼️ Images load progressively as they enter the viewport
            </p>
          </div>
        </LazySection>
      )}

      {/* Memoized Calculations Demo */}
      {activeTab === 'calculations' && (
        <LazySection>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Memoized Expensive Calculations</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Input Numbers (comma-separated):
                </label>
                <input
                  type="text"
                  value={calculationInput.join(', ')}
                  onChange={(e) => {
                    const numbers = e.target.value
                      .split(',')
                      .map(n => parseFloat(n.trim()))
                      .filter(n => !isNaN(n));
                    setCalculationInput(numbers);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1, 2, 3, 4, 5"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Calculation Result:</span>
                  <span className="text-lg font-mono">{calculationResult.toFixed(6)}</span>
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  {hasInputChanged ? (
                    <span className="text-orange-600">🔄 Input changed - will recalculate</span>
                  ) : (
                    <span className="text-green-600">✅ Using memoized result</span>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                💡 This expensive calculation is memoized - identical inputs return cached results
              </p>
            </div>
          </div>
        </LazySection>
      )}

      {/* Performance Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Performance Optimization Features Demonstrated:
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>🚀 <strong>Virtual Scrolling:</strong> Only render visible items in large lists and tables</li>
          <li>🔄 <strong>Lazy Loading:</strong> Sections and images load when they enter the viewport</li>
          <li>🖼️ <strong>Progressive Images:</strong> Show blur placeholders while images load</li>
          <li>💾 <strong>Memoization:</strong> Cache expensive calculations and component renders</li>
          <li>📊 <strong>Performance Tracking:</strong> Monitor render times and computation costs</li>
          <li>🎯 <strong>Stable References:</strong> Prevent unnecessary re-renders with stable object references</li>
        </ul>
      </div>
    </div>
  );
};
