import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { Command } from '../../hooks/useCommandPalette';
import { useCommandSearch } from '../../hooks/useCommandPalette';

/**
 * Command Palette Component
 * Modern command-driven interface for quick actions and navigation
 */

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
  placeholder?: string;
  maxResults?: number;
  className?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
  placeholder = 'Type a command or search...',
  maxResults = 10,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredCommands = useCommandSearch(commands, query, maxResults);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      // Focus the input after a small delay to ensure modal is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Update selected index when filtered commands change
  useEffect(() => {
    if (selectedIndex >= filteredCommands.length) {
      setSelectedIndex(Math.max(0, filteredCommands.length - 1));
    }
  }, [filteredCommands.length, selectedIndex]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          event.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    },
    [filteredCommands, selectedIndex, onClose]
  );

  // Handle command selection
  const handleCommandSelect = useCallback(
    (command: Command) => {
      command.action();
      onClose();
    },
    [onClose]
  );

  // Group commands by group property
  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, Command[]> = {};
    
    filteredCommands.forEach(command => {
      const group = command.group || 'General';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(command);
    });

    return groups;
  }, [filteredCommands]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />
      
      {/* Command palette */}
      <div className="flex min-h-full items-start justify-center p-4 text-center sm:p-0">
        <div className="relative mt-16 w-full max-w-2xl transform rounded-xl bg-white shadow-2xl transition-all">
          <div className={`command-palette ${className}`}>
            {/* Search input */}
            <div className="flex items-center border-b border-gray-200 px-4 py-4">
              <svg
                className="h-5 w-5 text-gray-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 border-0 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0"
                autoComplete="off"
                spellCheck="false"
              />
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">ESC</span>
              </kbd>
            </div>

            {/* Command list */}
            <div className="max-h-96 overflow-y-auto py-2">
              {filteredCommands.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  No commands found for "{query}"
                </div>
              ) : (
                <ul ref={listRef} className="divide-y divide-gray-100">
                  {Object.entries(groupedCommands).map(([groupName, groupCommands]) => (
                    <li key={groupName}>
                      {Object.keys(groupedCommands).length > 1 && (
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {groupName}
                        </div>
                      )}
                      {groupCommands.map((command) => {
                        const globalIndex = filteredCommands.indexOf(command);
                        const isSelected = globalIndex === selectedIndex;
                        
                        return (
                          <button
                            key={command.id}
                            onClick={() => handleCommandSelect(command)}
                            className={`
                              w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none
                              ${isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''}
                              transition-colors duration-150
                            `}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {command.icon && (
                                  <div className="flex-shrink-0 text-gray-400">
                                    {command.icon}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900">
                                    {command.title}
                                  </div>
                                  {command.subtitle && (
                                    <div className="text-xs text-gray-500 truncate">
                                      {command.subtitle}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {command.shortcut && (
                                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-50">
                                  {command.shortcut}
                                </kbd>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
              <div className="flex items-center justify-between">
                <span>Navigate with ↑↓ • Select with ↵ • Close with ESC</span>
                <span className="hidden sm:inline">
                  {filteredCommands.length} of {commands.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CommandPalette;
