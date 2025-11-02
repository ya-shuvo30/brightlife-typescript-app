import React, { useState, useRef, useMemo, useCallback } from 'react';
import styles from './virtualScrolling.module.css';

/**
 * Virtual Scrolling Components for Large Data Sets
 * Optimizes rendering performance for long lists
 * 
 * IMPORTANT: Inline styles are used throughout this component for performance reasons:
 * 1. Dynamic calculations (transforms, positions) change on every scroll
 * 2. CSS-in-JS would cause unnecessary re-renders and style recalculations  
 * 3. Static CSS cannot handle runtime-calculated values like translateY(${offsetY}px)
 * 4. Virtual scrolling requires pixel-perfect positioning for smooth performance
 * 
 * These inline styles are essential for:
 * - Smooth 60fps scrolling
 * - Efficient DOM manipulation
 * - Dynamic viewport calculations
 * - Minimal render cycles
 */

export interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
}

export interface VirtualGridProps<T> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  containerWidth: number;
  containerHeight: number;
  columnsCount: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
}

// Virtual List Component
export const VirtualList = <T,>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = '',
  onScroll
}: VirtualScrollProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const visibleRange = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    const start = Math.max(0, visibleStart - overscan);
    const end = Math.min(items.length - 1, visibleEnd + overscan);

    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange.start, visibleRange.end]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);
  }, [onScroll]);

  return (
    <div
      ref={scrollElementRef}
      className={`${styles.virtualList} ${className}`}
      /* 🎯 PERFORMANCE: Dynamic height - calculated at runtime */
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div
        className={styles.virtualListContainer}
        /* 🎯 PERFORMANCE: Total scrollable area - must be calculated dynamically */
        style={{ height: totalHeight }}
      >
        <div
          className={styles.virtualListItemsContainer}
          /* 🎯 PERFORMANCE: Transform for smooth scrolling - changes on every scroll event */
          style={{ transform: `translateY(${offsetY}px)` }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.start + index}
              /* 🎯 PERFORMANCE: Item height - ensures consistent spacing */
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Virtual Grid Component
export const VirtualGrid = <T,>({
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  columnsCount,
  renderItem,
  overscan = 5,
  className = '',
  onScroll
}: VirtualGridProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const rowsCount = Math.ceil(items.length / columnsCount);

  const visibleRange = useMemo(() => {
    const visibleRowStart = Math.floor(scrollTop / itemHeight);
    const visibleRowEnd = Math.min(
      visibleRowStart + Math.ceil(containerHeight / itemHeight),
      rowsCount - 1
    );

    const visibleColStart = Math.floor(scrollLeft / itemWidth);
    const visibleColEnd = Math.min(
      visibleColStart + Math.ceil(containerWidth / itemWidth),
      columnsCount - 1
    );

    const rowStart = Math.max(0, visibleRowStart - overscan);
    const rowEnd = Math.min(rowsCount - 1, visibleRowEnd + overscan);
    const colStart = Math.max(0, visibleColStart - overscan);
    const colEnd = Math.min(columnsCount - 1, visibleColEnd + overscan);

    return { rowStart, rowEnd, colStart, colEnd };
  }, [scrollTop, scrollLeft, itemHeight, itemWidth, containerHeight, containerWidth, rowsCount, columnsCount, overscan]);

  const visibleItems = useMemo(() => {
    const result: Array<{ item: T; index: number; row: number; col: number }> = [];
    
    for (let row = visibleRange.rowStart; row <= visibleRange.rowEnd; row++) {
      for (let col = visibleRange.colStart; col <= visibleRange.colEnd; col++) {
        const index = row * columnsCount + col;
        if (index < items.length) {
          result.push({
            item: items[index],
            index,
            row,
            col
          });
        }
      }
    }
    
    return result;
  }, [items, visibleRange, columnsCount]);

  const totalHeight = rowsCount * itemHeight;
  const totalWidth = columnsCount * itemWidth;
  const offsetY = visibleRange.rowStart * itemHeight;
  const offsetX = visibleRange.colStart * itemWidth;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    const newScrollLeft = e.currentTarget.scrollLeft;
    setScrollTop(newScrollTop);
    setScrollLeft(newScrollLeft);
    onScroll?.(newScrollTop, newScrollLeft);
  }, [onScroll]);

  return (
    <div
      ref={scrollElementRef}
      className={`${styles.virtualGrid} ${className}`}
      /* 🎯 PERFORMANCE: Container dimensions - calculated at runtime */
      style={{ 
        height: containerHeight,
        width: containerWidth 
      }}
      onScroll={handleScroll}
    >
      <div
        className={styles.virtualGridContainer}
        /* 🎯 PERFORMANCE: Total grid size - must be dynamically calculated */
        style={{
          height: totalHeight,
          width: totalWidth
        }}
      >
        <div
          className={styles.virtualGridItemsContainer}
          /* 🎯 PERFORMANCE: 2D transform for smooth bi-directional scrolling */
          style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
        >
          {visibleItems.map(({ item, index, row, col }) => (
            <div
              key={index}
              className={styles.virtualGridItem}
              /* 🎯 PERFORMANCE: Absolute positioning for grid items - calculated per item */
              style={{
                left: (col - visibleRange.colStart) * itemWidth,
                top: (row - visibleRange.rowStart) * itemHeight,
                width: itemWidth,
                height: itemHeight
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Virtual Table Component
export interface VirtualTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    header: string;
    width: number;
    render?: (value: T[keyof T], item: T, index: number) => React.ReactNode;
  }>;
  rowHeight: number;
  containerHeight: number;
  containerWidth: number;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
}

export const VirtualTable = <T extends Record<string, unknown>>({
  data,
  columns,
  rowHeight,
  containerHeight,
  containerWidth,
  overscan = 5,
  className = '',
  onScroll
}: VirtualTableProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const visibleRange = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / rowHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / rowHeight),
      data.length - 1
    );

    const start = Math.max(0, visibleStart - overscan);
    const end = Math.min(data.length - 1, visibleEnd + overscan);

    return { start, end };
  }, [scrollTop, rowHeight, containerHeight, data.length, overscan]);

  const visibleData = useMemo(() => {
    return data.slice(visibleRange.start, visibleRange.end + 1);
  }, [data, visibleRange.start, visibleRange.end]);

  const totalHeight = data.length * rowHeight;
  const offsetY = visibleRange.start * rowHeight;
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);
  }, [onScroll]);

  return (
    <div
      className={`${styles.virtualTable} ${className}`}
      /* 🎯 PERFORMANCE: Table container dimensions */
      style={{
        height: containerHeight,
        width: containerWidth
      }}
    >
      {/* Header */}
      <div className={styles.virtualTableHeader}>
        {columns.map((column) => (
          <div
            key={String(column.key)}
            className={styles.headerCell}
            /* 🎯 PERFORMANCE: Column width - dynamically set per column */
            style={{ width: column.width }}
          >
            {column.header}
          </div>
        ))}
      </div>

      {/* Scrollable Body */}
      <div
        ref={scrollElementRef}
        className={styles.scrollableBody}
        /* 🎯 PERFORMANCE: Scrollable area height calculation */
        style={{ height: containerHeight - 49 }}
        onScroll={handleScroll}
      >
        <div
          className={styles.virtualContainer}
          /* 🎯 PERFORMANCE: Virtual scrolling area dimensions */
          style={{
            height: totalHeight,
            width: totalWidth
          }}
        >
          <div
            className={styles.itemsContainer}
            /* 🎯 PERFORMANCE: Vertical transform for smooth table scrolling */
            style={{ transform: `translateY(${offsetY}px)` }}
          >
            {visibleData.map((item, index) => (
              <div
                key={visibleRange.start + index}
                className={`${styles.virtualRow} ${
                  (visibleRange.start + index) % 2 === 0 
                    ? styles.virtualRowEven 
                    : styles.virtualRowOdd
                }`}
                /* 🎯 PERFORMANCE: Row height consistency */
                style={{ height: rowHeight }}
              >
                {columns.map((column) => (
                  <div
                    key={String(column.key)}
                    className={styles.virtualCell}
                    /* 🎯 PERFORMANCE: Cell width matching header columns */
                    style={{ width: column.width }}
                  >
                    {column.render 
                      ? column.render(item[column.key], item, visibleRange.start + index)
                      : String(item[column.key])
                    }
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
