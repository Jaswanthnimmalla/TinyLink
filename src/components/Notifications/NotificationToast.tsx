'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNotifications, Notification } from '@/context/NotificationContext';

export default function NotificationToast() {
  const { notifications } = useNotifications();
  const [visibleToasts, setVisibleToasts] = useState<Notification[]>([]);

  useEffect(() => {
    // Show only the last 3 unread notifications as toasts
    const recentUnread = notifications
      .filter(n => !n.read)
      .slice(0, 3);
    
    setVisibleToasts(recentUnread);

    // Auto-dismiss toasts after 5 seconds
    const timer = setTimeout(() => {
      setVisibleToasts([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notifications]);

  const dismissToast = (id: string) => {
    setVisibleToasts(prev => prev.filter(t => t.id !== id));
  };

  const getToastColor = (type: string) => {
    switch (type) {
      case 'click':
        return 'from-blue-500 to-blue-600';
      case 'milestone':
        return 'from-green-500 to-green-600';
      case 'expiring':
        return 'from-orange-500 to-orange-600';
      case 'expired':
        return 'from-red-500 to-red-600';
      default:
        return 'from-indigo-500 to-purple-600';
    }
  };

  const getToastIcon = (type: string) => {
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

  if (visibleToasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[10000] space-y-3">
      {visibleToasts.map((toast, index) => (
        <div
          key={toast.id}
          className="animate-slide-in-right"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`w-96 max-w-[calc(100vw-2rem)] bg-gradient-to-r ${getToastColor(toast.type)} rounded-2xl shadow-2xl border-4 border-white overflow-hidden`}>
            <div className="p-4 text-white">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 text-3xl">
                  {getToastIcon(toast.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-lg mb-1">{toast.title}</h4>
                  <p className="text-sm text-white/90 mb-2">{toast.message}</p>

                  {/* Data Badges */}
                  {toast.data && (
                    <div className="flex flex-wrap gap-2">
                      {toast.data.country && (
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-xs font-medium">
                          📍 {toast.data.city}, {toast.data.country}
                        </span>
                      )}
                      {toast.data.device && (
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-xs font-medium">
                          📱 {toast.data.device}
                        </span>
                      )}
                      {toast.data.browser && (
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-xs font-medium">
                          🌐 {toast.data.browser}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="flex-shrink-0 text-white hover:bg-white/20 rounded-lg p-1 transition-all"
                  aria-label="Dismiss"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full animate-progress-bar"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
