import { Server } from 'socket.io';
import { NextRequest } from 'next/server';

// Store the Socket.io server instance
let io: Server | null = null;

export function GET(req: NextRequest) {
  // This is a workaround for Next.js API routes
  // In production, you'd use a custom server
  
  if (!io) {
    console.log('🚀 Initializing Socket.io server...');
    
    // Note: This is a simplified version
    // For production, use a custom server.ts file
    const res = new Response('Socket.io endpoint - use WebSocket connection', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    
    return res;
  }

  return new Response('Socket.io running', { status: 200 });
}

// Helper function to emit notifications
export function emitNotification(data: {
  type: 'click' | 'milestone' | 'expiring' | 'expired';
  linkCode: string;
  message: string;
  data?: any;
}) {
  if (io) {
    io.emit('notification', {
      id: `${Date.now()}-${Math.random()}`,
      ...data,
      createdAt: new Date(),
      read: false,
    });
  }
}
