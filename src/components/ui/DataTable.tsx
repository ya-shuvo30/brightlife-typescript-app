import React, { useState, useMemo, useCallback } from 'react';

// TypeScript interfaces for the DataTable component
export interface Column<T> {
  id: string;
  header: string;
  accessor: keyof T;
  sortable?: boolean;
  filterable?: boolean;
  cell?: (value: unknown, row: T, index: number) => React.ReactNode;
  width?: string;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  selectable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  initialSortBy?: keyof T;
  initialSortDirection?: 'asc' | 'desc';
  className?: string;
  searchable?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

const DataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  pageSize = 10,
  selectable = false,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  onSelectionChange,
  initialSortBy,
  initialSortDirection = 'asc',
  className = '',
  searchable = true,
}: DataTableProps<T>): React.ReactElement => {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof T | null>(initialSortBy || null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [globalFilter, setGlobalFilter] = useState('');

  // Handle sorting
  const handleSort = useCallback((columnId: keyof T) => {
    if (sortBy === columnId) {
      setSortDirection(prev => 
        prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'
      );
      if (sortDirection === 'desc') {
        setSortBy(null);
      }
    } else {
      setSortBy(columnId);
      setSortDirection('asc');
    }
  }, [sortBy, sortDirection]);

  // Handle row selection
  const handleRowSelect = useCallback((index: number, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (checked) {
      newSelectedRows.add(index);
    } else {
      newSelectedRows.delete(index);
    }
    setSelectedRows(newSelectedRows);
    
    if (onSelectionChange) {
      // We'll need to calculate selected data in the component where this is called
      const selectedData = Array.from(newSelectedRows).map(i => data[i]);
      onSelectionChange(selectedData);
    }
  }, [selectedRows, onSelectionChange, data]);

  // Handle select all
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allIndices = new Set(data.map((_, index) => index));
      setSelectedRows(allIndices);
      if (onSelectionChange) {
        onSelectionChange(data);
      }
    } else {
      setSelectedRows(new Set());
      if (onSelectionChange) {
        onSelectionChange([]);
      }
    }
  }, [onSelectionChange, data]);

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply global filter
    if (globalFilter) {
      filtered = filtered.filter(row =>
        columns.some(column => {
          const value = row[column.accessor];
          return String(value).toLowerCase().includes(globalFilter.toLowerCase());
        })
      );
    }

    return filtered;
  }, [data, globalFilter, columns]);

  // Sort data
  const filteredAndSortedData = useMemo(() => {
    if (!sortBy || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let comparison = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime();
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, sortBy, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredAndSortedData.slice(startIndex, endIndex);

  // Reset page when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredAndSortedData.length]);

  const isAllSelected = selectedRows.size === filteredAndSortedData.length && filteredAndSortedData.length > 0;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < filteredAndSortedData.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-label="Loading data">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Search and Filters */}
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="global-search" className="sr-only">
                Search all columns
              </label>
              <input
                id="global-search"
                type="text"
                placeholder="Search all columns..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search all columns"
              />
            </div>
            {filteredAndSortedData.length > 0 && (
              <div className="text-sm text-gray-600 flex items-center">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedData.length)} of {filteredAndSortedData.length} entries
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="table">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${column.className || ''}`}
                  onClick={column.sortable ? () => handleSort(column.accessor) : undefined}
                  role="columnheader"
                  {...(sortBy === column.accessor && sortDirection === 'asc' 
                    ? { 'aria-sort': 'ascending' as const }
                    : sortBy === column.accessor && sortDirection === 'desc'
                    ? { 'aria-sort': 'descending' as const }
                    : { 'aria-sort': 'none' as const }
                  )}
                >
                    <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="ml-2">
                        {sortBy === column.accessor ? (
                          sortDirection === 'asc' ? (
                            <span aria-hidden="true">↑</span>
                          ) : (
                            <span aria-hidden="true">↓</span>
                          )
                        ) : (
                          <span className="text-gray-400" aria-hidden="true">↕</span>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      className="h-12 w-12 text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const actualIndex = startIndex + index;
                const isSelected = selectedRows.has(actualIndex);
                
                return (
                  <tr
                    key={actualIndex}
                    className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''} ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                    onClick={onRowClick ? () => onRowClick(row, actualIndex) : undefined}
                    role="row"
                  >
                    {selectable && (
                      <td className="px-6 py-4 whitespace-nowrap w-12">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelect(actualIndex, e.target.checked);
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          aria-label={`Select row ${actualIndex + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((column) => {
                      const cellValue = row[column.accessor];
                      
                      return (
                        <td
                          key={column.id}
                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ''}`}
                          role="cell"
                        >
                          {column.cell ? column.cell(cellValue, row, actualIndex) : String(cellValue)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Go to first page"
              >
                First
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Go to previous page"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Go to next page"
              >
                Next
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Go to last page"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
