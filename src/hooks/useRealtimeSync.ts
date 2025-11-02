import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Real-time Data Synchronization Hooks
 * Modern WebSocket and server-sent events integration
 */

export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  options?: {
    maxReconnectAttempts?: number;
    reconnectInterval?: number;
    heartbeatInterval?: number;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: Event) => void;
    onMessage?: (data: unknown) => void;
  };
}

export interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastMessage: unknown;
  reconnectCount: number;
}

/**
 * Advanced WebSocket hook with automatic reconnection and heartbeat
 */
export const useWebSocket = (config: WebSocketConfig) => {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    lastMessage: null,
    reconnectCount: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);

  const {
    maxReconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 30000,
    onConnect,
    onDisconnect,
    onError,
    onMessage,
  } = config.options || {};

  const sendMessage = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);

  const sendHeartbeat = useCallback(() => {
    sendMessage({ type: 'ping', timestamp: Date.now() });
  }, [sendMessage]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      wsRef.current = new WebSocket(config.url, config.protocols);

      wsRef.current.onopen = () => {
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
          reconnectCount: reconnectAttempts.current,
        }));

        reconnectAttempts.current = 0;
        onConnect?.();

        // Start heartbeat
        if (heartbeatInterval > 0) {
          heartbeatIntervalRef.current = setInterval(sendHeartbeat, heartbeatInterval);
        }
      };

      wsRef.current.onclose = () => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
        }));

        // Clear heartbeat
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }

        onDisconnect?.();

        // Attempt reconnection
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current.onerror = (error) => {
        setState(prev => ({
          ...prev,
          error: 'WebSocket connection error',
          isConnecting: false,
        }));

        onError?.(error);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setState(prev => ({ ...prev, lastMessage: data }));
          onMessage?.(data);
        } catch {
          setState(prev => ({ ...prev, lastMessage: event.data }));
          onMessage?.(event.data);
        }
      };
    } catch {
      setState(prev => ({
        ...prev,
        error: 'Failed to create WebSocket connection',
        isConnecting: false,
      }));
    }
  }, [config.url, config.protocols, maxReconnectAttempts, reconnectInterval, heartbeatInterval, onConnect, onDisconnect, onError, onMessage, sendHeartbeat]);

  const disconnect = useCallback(() => {
    // Clear timeouts and intervals
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Reset reconnect attempts
    reconnectAttempts.current = 0;

    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      lastMessage: null,
      reconnectCount: 0,
    });
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(connect, 100);
  }, [connect, disconnect]);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return {
    ...state,
    sendMessage,
    connect,
    disconnect,
    reconnect,
  };
};

/**
 * Server-Sent Events hook for real-time updates
 */
export interface SSEConfig {
  url: string;
  options?: EventSourceInit;
  onMessage?: (data: unknown) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
}

export const useServerSentEvents = (config: SSEConfig) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<unknown>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const { onMessage, onError, onOpen } = config;

  useEffect(() => {
    const eventSource = new EventSource(config.url, config.options);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
      onOpen?.();
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
        onMessage?.(data);
      } catch {
        setLastMessage(event.data);
        onMessage?.(event.data);
      }
    };

    eventSource.onerror = (event) => {
      setIsConnected(false);
      setError('SSE connection error');
      onError?.(event);
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    };
  }, [config.url, config.options, onMessage, onError, onOpen]);

  const close = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  return {
    isConnected,
    error,
    lastMessage,
    close,
  };
};

/**
 * Real-time data synchronization hook
 * Manages optimistic updates and conflict resolution
 */
export interface SyncConfig<T> {
  endpoint: string;
  initialData: T;
  syncInterval?: number;
  onSync?: (data: T) => void;
  onConflict?: (local: T, remote: T) => T;
  onError?: (error: Error) => void;
}

export const useDataSync = <T extends Record<string, unknown>>(config: SyncConfig<T>) => {
  const [data, setData] = useState<T>(config.initialData);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Partial<T>>({});
  const [conflicts, setConflicts] = useState<Array<{ local: T; remote: T }>>([]);

  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdatesRef = useRef<Partial<T>>({});

  const { syncInterval = 30000, onSync, onConflict, onError } = config;

  const syncData = useCallback(async () => {
    if (isSyncing) return;

    setIsSyncing(true);

    try {
      // Send pending changes
      if (Object.keys(pendingChanges).length > 0) {
        await fetch(`${config.endpoint}/sync`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pendingChanges),
        });
        setPendingChanges({});
      }

      // Fetch latest data
      const response = await fetch(`${config.endpoint}/latest`);
      const remoteData: T = await response.json();

      // Check for conflicts
      const hasLocalChanges = Object.keys(pendingUpdatesRef.current).length > 0;
      if (hasLocalChanges && onConflict) {
        const resolvedData = onConflict(data, remoteData);
        setData(resolvedData);
        setConflicts(prev => [...prev, { local: data, remote: remoteData }]);
      } else {
        setData(remoteData);
      }

      setLastSynced(new Date());
      onSync?.(remoteData);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Sync failed'));
    } finally {
      setIsSyncing(false);
    }
  }, [data, pendingChanges, config.endpoint, onSync, onConflict, onError, isSyncing]);

  const updateData = useCallback((updates: Partial<T>) => {
    // Optimistic update
    setData(prev => ({ ...prev, ...updates }));
    
    // Track pending changes
    setPendingChanges(prev => ({ ...prev, ...updates }));
    pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...updates };

    // Debounced sync
    if (syncIntervalRef.current) {
      clearTimeout(syncIntervalRef.current);
    }
    syncIntervalRef.current = setTimeout(syncData, 1000);
  }, [syncData]);

  const forceSync = useCallback(() => {
    syncData();
  }, [syncData]);

  const resolveConflict = useCallback((index: number, resolution: T) => {
    setData(resolution);
    setConflicts(prev => prev.filter((_, i) => i !== index));
  }, []);

  useEffect(() => {
    // Initial sync
    syncData();

    // Set up periodic sync
    const interval = setInterval(syncData, syncInterval);

    return () => {
      clearInterval(interval);
      if (syncIntervalRef.current) {
        clearTimeout(syncIntervalRef.current);
      }
    };
  }, [syncData, syncInterval]);

  return {
    data,
    isSyncing,
    lastSynced,
    pendingChanges,
    conflicts,
    updateData,
    forceSync,
    resolveConflict,
  };
};

/**
 * Real-time collaboration hook
 * Manages collaborative editing with operational transforms
 */
export interface CollaborationConfig {
  documentId: string;
  userId: string;
  websocketUrl: string;
  onUserJoin?: (user: CollaborationUser) => void;
  onUserLeave?: (userId: string) => void;
  onCursorUpdate?: (userId: string, cursor: CursorPosition) => void;
}

export interface CollaborationUser {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: CursorPosition;
}

export interface CursorPosition {
  line: number;
  column: number;
  selection?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

export const useCollaboration = (config: CollaborationConfig) => {
  const [users, setUsers] = useState<CollaborationUser[]>([]);

  const websocket = useWebSocket({
    url: config.websocketUrl,
    options: {
      onConnect: () => {
        // Join document room
        sendMessage({
          type: 'join',
          documentId: config.documentId,
          userId: config.userId,
        });
      },
      onDisconnect: () => {},
      onMessage: (data: unknown) => {
        const message = data as {
          type: string;
          userId?: string;
          user?: CollaborationUser;
          cursor?: CursorPosition;
        };

        switch (message.type) {
          case 'user-joined':
            if (message.user) {
              setUsers(prev => [...prev.filter(u => u.id !== message.user!.id), message.user!]);
              config.onUserJoin?.(message.user);
            }
            break;
          case 'user-left':
            if (message.userId) {
              setUsers(prev => prev.filter(u => u.id !== message.userId));
              config.onUserLeave?.(message.userId);
            }
            break;
          case 'cursor-update':
            if (message.userId && message.cursor) {
              setUsers(prev => 
                prev.map(u => 
                  u.id === message.userId 
                    ? { ...u, cursor: message.cursor }
                    : u
                )
              );
              config.onCursorUpdate?.(message.userId, message.cursor);
            }
            break;
        }
      },
    },
  });

  const { sendMessage } = websocket;

  const updateCursor = useCallback((cursor: CursorPosition) => {
    sendMessage({
      type: 'cursor-update',
      documentId: config.documentId,
      userId: config.userId,
      cursor,
    });
  }, [sendMessage, config.documentId, config.userId]);

  const sendEdit = useCallback((operation: {
    type: 'insert' | 'delete' | 'replace';
    position: { line: number; column: number };
    content?: string;
    length?: number;
  }) => {
    sendMessage({
      type: 'edit',
      documentId: config.documentId,
      userId: config.userId,
      operation,
      timestamp: Date.now(),
    });
  }, [sendMessage, config.documentId, config.userId]);

  return {
    users,
    updateCursor,
    sendEdit,
    ...websocket,
  };
};
