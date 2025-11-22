'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll, isConnected } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'click':
        return '🔗';
      case 'milestone':
        return '🎉';
      case 'expiring':
        return '⏰';
      case 'expired':
        return '⚠️';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'click':
        return 'from-blue-50 to-blue-100 border-blue-300';
      case 'milestone':
        return 'from-green-50 to-green-100 border-green-300';
      case 'expiring':
        return 'from-orange-50 to-orange-100 border-orange-300';
      case 'expired':
        return 'from-red-50 to-red-100 border-red-300';
      default:
        return 'from-gray-50 to-gray-100 border-gray-300';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
        aria-label="Notifications"
      >
        <Bell className={`h-6 w-6 ${unreadCount > 0 ? 'text-indigo-600 animate-pulse-soft' : 'text-gray-600'} group-hover:scale-110 transition-transform`} />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-scale-in border-2 border-white shadow-lg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {/* Connection Status Indicator */}
        <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'} border border-white`}></span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border-2 border-gray-200 z-[9999] animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-white" />
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white font-semibold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2 mt-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
              <span className="text-xs text-white/80">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-1">No notifications yet</p>
                <p className="text-sm text-gray-500">We'll notify you when something happens</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-all cursor-pointer ${
                      !notification.read ? 'bg-indigo-50/50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className={`flex gap-3 p-3 rounded-xl bg-gradient-to-r ${getNotificationColor(notification.type)} border-2`}>
                      <div className="flex-shrink-0 text-2xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-gray-900 text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
                        
                        {/* Additional Data */}
                        {notification.data && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {notification.data.location && (
                              <span className="px-2 py-1 bg-white/60 backdrop-blur-sm rounded-md text-xs font-medium text-gray-700">
                                📍 {notification.data.location}
                              </span>
                            )}
                            {notification.data.device && (
                              <span className="px-2 py-1 bg-white/60 backdrop-blur-sm rounded-md text-xs font-medium text-gray-700">
                                {notification.data.device}
                              </span>
                            )}
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {notifications.length > 0 && (
            <div className="p-3 bg-gray-50 border-t-2 border-gray-200 flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                  className="flex-1 px-4 py-2 bg-white border-2 border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-all text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Mark all read
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearAll();
                }}
                className="flex-1 px-4 py-2 bg-white border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-all text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
