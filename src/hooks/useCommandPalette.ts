import React, { useEffect } from 'react';

/**
 * Command Palette Hooks
 * Separated for Fast Refresh compatibility
 */

export interface Command {
  id: string;
  title: string;
  subtitle?: string;
  keywords: string[];
  icon?: React.ReactNode;
  action: () => void;
  group?: string;
  shortcut?: string;
}

/**
 * Custom hook for command palette keyboard shortcuts
 */
export const useCommandPalette = (onToggle: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open command palette
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        onToggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);
};

/**
 * Command search and filtering logic
 */
export const useCommandSearch = (commands: Command[], query: string, maxResults: number) => {
  return React.useMemo(() => {
    if (!query.trim()) {
      return commands.slice(0, maxResults);
    }

    const searchTerm = query.toLowerCase();
    const filtered = commands.filter(command => {
      return (
        command.title.toLowerCase().includes(searchTerm) ||
        command.subtitle?.toLowerCase().includes(searchTerm) ||
        command.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
      );
    });

    // Sort by relevance (exact matches first)
    return filtered
      .sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        const aExactMatch = aTitle.startsWith(searchTerm) ? 0 : 1;
        const bExactMatch = bTitle.startsWith(searchTerm) ? 0 : 1;
        return aExactMatch - bExactMatch;
      })
      .slice(0, maxResults);
  }, [commands, query, maxResults]);
};
