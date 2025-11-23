import { NextRequest, NextResponse } from 'next/server';

// In-memory store for recent notifications (last 5 minutes)
const notificationStore: Array<{
  id: string;
  type: string;
  title: string;
  message: string;
  linkCode?: string;
  data?: Record<string, any>;
  timestamp: string;
  read: boolean;
}> = [];

// Clean old notifications (older than 5 minutes)
function cleanOldNotifications() {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  const initialLength = notificationStore.length;
  
  for (let i = notificationStore.length - 1; i >= 0; i--) {
    const notifTime = new Date(notificationStore[i].timestamp).getTime();
    if (notifTime < fiveMinutesAgo) {
      notificationStore.splice(i, 1);
    }
  }
  
  if (notificationStore.length !== initialLength) {
    console.log(`🧹 Cleaned ${initialLength - notificationStore.length} old notifications`);
  }
}

// POST - Emit a new notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, message, linkCode, data } = body;

    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'Type, title, and message are required' },
        { status: 400 }
      );
    }

    // Clean old notifications first
    cleanOldNotifications();

    // Create notification
    const notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      linkCode,
      data: data || {},
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Add to store
    notificationStore.unshift(notification);

    console.log('🔔 Notification emitted:', notification);
    console.log('📊 Total notifications in store:', notificationStore.length);

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error('Error emitting notification:', error);
    return NextResponse.json(
      { error: 'Failed to emit notification' },
      { status: 500 }
    );
  }
}

// GET - Fetch recent notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since');

    // Clean old notifications
    cleanOldNotifications();

    let filteredNotifications = [...notificationStore];

    // Filter by timestamp if provided
    if (since) {
      const sinceDate = new Date(since);
      filteredNotifications = filteredNotifications.filter(
        (notif) => new Date(notif.timestamp) > sinceDate
      );
    }

    return NextResponse.json({
      notifications: filteredNotifications,
      count: filteredNotifications.length,
      total: notificationStore.length,
    });
  } catch (error) {
    console.error('Error fetching notifications from emit store:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}