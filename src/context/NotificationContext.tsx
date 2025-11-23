'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';

export interface Notification {
  id: string;
  type: 'click' | 'success' | 'warning' | 'milestone' | 'expiring' | 'error' | 'info';
  title: string;
  message: string;
  linkCode?: string;
  data?: Record<string, any>;
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const lastCheckRef = useRef<Date>(new Date());
  const seenNotificationIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Set connected status
    setIsConnected(true);
    console.log('🔔 Notification system initialized - Polling every 3 seconds');

    // Function to fetch new notifications
    const fetchNotifications = async () => {
      try {
        const sinceTime = lastCheckRef.current.toISOString();
        console.log('📡 Polling for notifications since:', sinceTime);
        
        const response = await fetch(`/api/notifications?since=${sinceTime}`);
        
        if (!response.ok) {
          console.error('❌ Failed to fetch notifications:', response.status);
          return;
        }

        const data = await response.json();
        console.log('📊 API Response:', { count: data.count, total: data.notifications?.length || 0 });
        
        if (data.notifications && data.notifications.length > 0) {
          // Filter out notifications we've already seen
          const newNotifications = data.notifications.filter(
            (notif: Notification) => !seenNotificationIds.current.has(notif.id)
          );

          if (newNotifications.length > 0) {
            console.log('🔔 NEW NOTIFICATIONS FOUND:', newNotifications.length);
            console.log('Notifications:', newNotifications);
            
            // Add new notifications
            setNotifications((prev) => [...newNotifications, ...prev]);

            // Mark as seen
            newNotifications.forEach((notif: Notification) => {
              seenNotificationIds.current.add(notif.id);
            });

            // Show toast for the most recent one
            const latestNotif = newNotifications[0];
            console.log('🎉 Showing notification:', latestNotif.message);
            
            // Play notification sound
            try {
              const audio = new Audio('/notification.mp3');
              audio.volume = 0.5;
              audio.play().catch(e => console.log('Audio play failed:', e));
            } catch (error) {
              console.log('Audio not available');
            }

            // Show browser notification if permitted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(latestNotif.title, {
                body: latestNotif.message,
                icon: '/favicon.svg',
              });
            } else if ('Notification' in window && Notification.permission === 'default') {
              // Request permission
              Notification.requestPermission();
            }
          } else {
            console.log('ℹ️ No new notifications (all already seen)');
          }
        } else {
          console.log('ℹ️ No notifications in time window');
        }

        // Update last check time
        lastCheckRef.current = new Date();
      } catch (error) {
        console.error('❌ Error fetching notifications:', error);
        setIsConnected(false);
      }
    };

    // Initial fetch
    console.log('🚀 Running initial notification check...');
    fetchNotifications();
    
    // Poll every 3 seconds for real-time feel
    const interval = setInterval(fetchNotifications, 3000); 
    console.log('✅ Notification polling started (every 3 seconds)');
    
    return () => {
      clearInterval(interval);
      console.log('🔕 Notification polling stopped');
    };
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    seenNotificationIds.current.add(newNotification.id);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        isConnected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
