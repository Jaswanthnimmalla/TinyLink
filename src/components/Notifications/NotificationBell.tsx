'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Trash2, Search, Filter, CheckCheck, Clock, TrendingUp } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

type FilterType = 'all' | 'unread' | 'click' | 'success' | 'warning';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showFilters, setShowFilters] = useState(false);
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

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.linkCode?.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    let matchesType = true;
    if (filterType === 'unread') {
      matchesType = !notification.read;
    } else if (filterType !== 'all') {
      matchesType = notification.type === filterType;
    }

    return matchesSearch && matchesType;
  });

  // Statistics
  const stats = {
    total: notifications.length,
    unread: unreadCount,
    clicks: notifications.filter(n => n.type === 'click').length,
    today: notifications.filter(n => {
      const notifDate = new Date(n.timestamp);
      const today = new Date();
      return notifDate.toDateString() === today.toDateString();
    }).length,
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'click': return '🔗';
      case 'success': return '✅';
      case 'warning': return '🗑️';
      case 'milestone': return '🎉';
      case 'expiring': return '⏰';
      case 'error': return '❌';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'click': return 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300';
      case 'success': return 'from-green-50 to-green-100 border-green-200 hover:border-green-300';
      case 'warning': return 'from-orange-50 to-orange-100 border-orange-200 hover:border-orange-300';
      case 'milestone': return 'from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300';
      case 'expiring': return 'from-yellow-50 to-yellow-100 border-yellow-200 hover:border-yellow-300';
      case 'error': return 'from-red-50 to-red-100 border-red-200 hover:border-red-300';
      default: return 'from-gray-50 to-gray-100 border-gray-200 hover:border-gray-300';
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'click': return 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200';
      case 'success': return 'bg-gradient-to-br from-green-500 to-green-600 shadow-green-200';
      case 'warning': return 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-200';
      case 'milestone': return 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-200';
      case 'expiring': return 'bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-yellow-200';
      case 'error': return 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-200';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-600 shadow-gray-200';
    }
  };

  const getAccentColor = (type: string) => {
    switch (type) {
      case 'click': return 'bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700';
      case 'success': return 'bg-gradient-to-b from-green-500 via-green-600 to-green-700';
      case 'warning': return 'bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700';
      case 'milestone': return 'bg-gradient-to-b from-purple-500 via-purple-600 to-purple-700';
      case 'expiring': return 'bg-gradient-to-b from-yellow-500 via-yellow-600 to-yellow-700';
      case 'error': return 'bg-gradient-to-b from-red-500 via-red-600 to-red-700';
      default: return 'bg-gradient-to-b from-gray-500 via-gray-600 to-gray-700';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button - Enhanced */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-xl hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group"
        aria-label="Notifications"
      >
        <div className="relative">
          <Bell className={`h-6 w-6 transition-all duration-300 ${
            unreadCount > 0 
              ? 'text-indigo-600 animate-bounce-subtle' 
              : 'text-gray-600 group-hover:text-indigo-600'
          }`} />
          
          {/* Animated Ring */}
          {unreadCount > 0 && (
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping"></div>
            </div>
          )}
          
          {/* Enhanced Badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-sm animate-pulse"></div>
                <span className="relative flex items-center justify-center h-6 w-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white text-xs font-bold shadow-lg border-2 border-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              </div>
            </div>
          )}

          {/* Connection Indicator */}
          <span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white shadow-sm ${
            isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`}></span>
        </div>
      </button>

      {/* Dropdown Panel - Pro Level */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[480px] max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 z-[9999] animate-scale-in overflow-hidden">
          {/* Gradient Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            <div className="relative">
              {/* Title Bar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Notifications</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                      <span className="text-xs text-white/80">
                        {isConnected ? 'Live · Updates every 10s' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 group"
                >
                  <X className="h-4 w-4 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Total', value: stats.total, icon: Bell, bg: 'bg-white/20', text: 'text-white' },
                  { label: 'Unread', value: stats.unread, icon: Clock, bg: 'bg-yellow-400/30', text: 'text-yellow-100' },
                  { label: 'Clicks', value: stats.clicks, icon: TrendingUp, bg: 'bg-blue-400/30', text: 'text-blue-100' },
                  { label: 'Today', value: stats.today, icon: CheckCheck, bg: 'bg-green-400/30', text: 'text-green-100' },
                ].map((stat, idx) => (
                  <div key={idx} className={`${stat.bg} backdrop-blur-sm rounded-xl p-3 hover:scale-105 transition-all duration-200 cursor-default`}>
                    <div className="flex items-center justify-between mb-1">
                      <stat.icon className="h-3.5 w-3.5 text-white/90" />
                      <span className={`text-lg font-bold ${stat.text}`}>{stat.value}</span>
                    </div>
                    <p className="text-xs text-white/80 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { type: 'all', label: 'All', count: notifications.length },
                { type: 'unread', label: 'Unread', count: stats.unread },
                { type: 'click', label: 'Clicks', count: stats.clicks },
                { type: 'success', label: 'Success', count: notifications.filter(n => n.type === 'success').length },
                { type: 'warning', label: 'Warnings', count: notifications.filter(n => n.type === 'warning').length },
              ].map((filter) => (
                <button
                  key={filter.type}
                  onClick={() => setFilterType(filter.type as FilterType)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    filterType === filter.type
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {filter.label} {filter.count > 0 && (
                    <span className={`ml-1 ${filterType === filter.type ? 'text-white/80' : 'text-gray-400'}`}>
                      ({filter.count})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[500px] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Bell className="h-10 w-10 text-indigo-400" />
                </div>
                <p className="text-gray-900 font-semibold mb-2 text-lg">
                  {searchQuery ? 'No results found' : 'All caught up!'}
                </p>
                <p className="text-sm text-gray-500">
                  {searchQuery 
                    ? 'Try adjusting your search or filters' 
                    : "You're all set. New notifications will appear here."}
                </p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {filteredNotifications.map((notification, idx) => (
                  <div
                    key={notification.id}
                    className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                      !notification.read ? 'bg-gradient-to-br ' + getNotificationColor(notification.type) : 'bg-white border-gray-200 hover:border-gray-300'
                    } hover:shadow-lg hover:scale-[1.01] cursor-pointer animate-fade-in-up`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    {/* Gradient Accent Line */}
                    {!notification.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: getAccentColor(notification.type) }}></div>
                    )}

                    <div className="p-4 pl-5">
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 h-12 w-12 rounded-xl ${getIconBgColor(notification.type)} flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-bold text-gray-900 text-base leading-tight">
                              {notification.title}
                            </h4>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
                                  title="Mark as read"
                                >
                                  <Check className="h-3.5 w-3.5 text-green-600" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-red-600" />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                            {notification.message}
                          </p>

                          {/* Data Tags */}
                          {notification.data && Object.keys(notification.data).length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {notification.data.location && (
                                <span className="px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700 border border-gray-200 shadow-sm">
                                  📍 {notification.data.location}
                                </span>
                              )}
                              {notification.data.device && (
                                <span className="px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700 border border-gray-200 shadow-sm">
                                  {notification.data.device}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                            </p>
                            
                            {!notification.read && (
                              <div className="flex items-center gap-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
                                <span className="text-xs font-semibold text-indigo-600">New</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {notifications.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200/50">
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-200 hover:shadow-xl hover:scale-105"
                  >
                    <CheckCheck className="h-4 w-4" />
                    Mark all read ({unreadCount})
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Clear all notifications?')) {
                      clearAll();
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-200 hover:shadow-xl hover:scale-105"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear all ({notifications.length})
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
