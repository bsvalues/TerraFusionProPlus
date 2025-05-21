// WebSocket client for real-time updates
import { useEffect, useState } from 'react';

type MessageHandler = (data: any) => void;
type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

// Message types for our application
export enum WebSocketMessageType {
  APPRAISAL_UPDATED = 'APPRAISAL_UPDATED',
  PROPERTY_UPDATED = 'PROPERTY_UPDATED',
  COMPARABLE_ADDED = 'COMPARABLE_ADDED',
  NOTIFICATION = 'NOTIFICATION',
}

interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
}

class WebSocketClient {
  private socket: WebSocket | null = null;
  private messageHandlers: Map<WebSocketMessageType, Set<MessageHandler>> = new Map();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000; // Start with 2 seconds delay
  
  // Status tracking
  private _status: ConnectionStatus = 'disconnected';
  private statusListeners: Set<(status: ConnectionStatus) => void> = new Set();

  constructor() {
    // Initialize message handler collections for each message type
    Object.values(WebSocketMessageType).forEach(type => {
      this.messageHandlers.set(type as WebSocketMessageType, new Set());
    });
  }

  get status(): ConnectionStatus {
    return this._status;
  }

  set status(newStatus: ConnectionStatus) {
    if (this._status !== newStatus) {
      this._status = newStatus;
      // Notify all status listeners
      this.statusListeners.forEach(listener => listener(newStatus));
    }
  }

  addStatusListener(listener: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.add(listener);
    // Return cleanup function
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    this.status = 'connecting';
    
    // Create WebSocket connection using the same host as the current page
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.status = 'connected';
        this.reconnectAttempts = 0;
      };
      
      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.status = 'disconnected';
        this.attemptReconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        // The socket will close automatically after an error, which will trigger onclose
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.status = 'disconnected';
      this.attemptReconnect();
    }
  }

  disconnect(): void {
    if (this.socket) {
      // Cancel any pending reconnect attempts
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
      
      this.socket.close();
      this.socket = null;
      this.status = 'disconnected';
    }
  }

  addMessageHandler(type: WebSocketMessageType, handler: MessageHandler): () => void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.add(handler);
    }
    
    // Return a function to remove this handler
    return () => {
      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }

  sendMessage(type: WebSocketMessageType, payload: any): boolean {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = { type, payload };
      this.socket.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message.payload);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });
    }
  }

  private attemptReconnect(): void {
    // Cancel any existing reconnection attempt
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Maximum reconnection attempts reached');
    }
  }
}

// Create a singleton instance
export const wsClient = new WebSocketClient();

// React hook for WebSocket message subscriptions
export function useWebSocketMessage<T = any>(
  type: WebSocketMessageType,
  initialValue?: T
): [T | undefined, ConnectionStatus] {
  const [data, setData] = useState<T | undefined>(initialValue);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(wsClient.status);
  
  useEffect(() => {
    // Connect WebSocket if not already connected
    if (wsClient.status !== 'connected' && wsClient.status !== 'connecting') {
      wsClient.connect();
    }
    
    // Subscribe to messages of this type
    const messageCleanup = wsClient.addMessageHandler(type, (newData: T) => {
      setData(newData);
    });
    
    // Subscribe to connection status updates
    const statusCleanup = wsClient.addStatusListener(setConnectionStatus);
    
    // Cleanup on component unmount
    return () => {
      messageCleanup();
      statusCleanup();
    };
  }, [type]);
  
  return [data, connectionStatus];
}

export default wsClient;