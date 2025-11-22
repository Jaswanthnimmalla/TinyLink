import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

// Extend global to include io
declare global {
  var io: SocketIOServer | undefined;
}

// Global socket server instance
let io: SocketIOServer | null = null;

export interface NotificationData {
  type: 'click' | 'milestone' | 'expiring' | 'info';
  title: string;
  message: string;
  linkCode?: string;
  data?: Record<string, any>;
}

/**
 * Initialize Socket.io server
 * Should be called once when the server starts
 */
export function initSocketServer(httpServer: HTTPServer) {
  if (io) return io;

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

/**
 * Get the Socket.io server instance
 */
export function getSocketServer(): SocketIOServer | null {
  return global.io || null;
}

/**
 * Emit a notification to all connected clients
 */
export function emitNotification(notification: NotificationData) {
  const io = getSocketServer();
  
  if (!io) {
    console.warn('Socket.io server not initialized. Notification not sent.');
    return;
  }

  const notificationWithId = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...notification,
    timestamp: new Date().toISOString(),
    read: false,
  };

  // Emit to all connected clients
  io.emit('notification', notificationWithId);
  
  console.log('Notification emitted:', notificationWithId);
}

/**
 * Emit a notification to a specific user
 * (Future enhancement for multi-user support)
 */
export function emitNotificationToUser(userId: string, notification: NotificationData) {
  const io = getSocketServer();
  
  if (!io) {
    console.warn('Socket.io server not initialized. Notification not sent.');
    return;
  }

  const notificationWithId = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...notification,
    timestamp: new Date().toISOString(),
    read: false,
  };

  // Emit to specific user's room
  io.to(`user-${userId}`).emit('notification', notificationWithId);
  
  console.log('Notification emitted to user:', userId, notificationWithId);
}