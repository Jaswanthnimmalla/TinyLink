'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Layout/Navbar';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { BarChart3, TrendingUp, MousePointerClick, Link2, Calendar, Activity, Zap, PieChart, ExternalLink, Copy, Trash2, Filter, SortAsc, X, Share2, QrCode } from 'lucide-react';

export default function StatisticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter & Sort state
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, mostClicks, leastClicks
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Copy state
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/links');
      if (!res.ok) throw new Error('Failed to fetch statistics');
      const links = await res.json();
      
      // Calculate statistics
      const totalLinks = links.length;
      const totalClicks = links.reduce((sum: number, link: any) => sum + link.clicks, 0);
      const avgClicks = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : 0;
      const mostClicked = links.sort((a: any, b: any) => b.clicks - a.clicks)[0];
      const recentLinks = links.slice(0, 5);
      
      // Get top 5 links for bar chart
      const topLinks = [...links].sort((a: any, b: any) => b.clicks - a.clicks).slice(0, 5);
      
      // Calculate active vs inactive for pie chart
      const activeLinks = links.filter((l: any) => l.clicks > 0).length;
      const inactiveLinks = totalLinks - activeLinks;
      
      setStats({
        totalLinks,
        totalClicks,
        avgClicks,
        mostClicked,
        recentLinks,
        allLinks: links,
        topLinks,
        activeLinks,
        inactiveLinks
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get bar height percentage
  const getBarHeight = (clicks: number, maxClicks: number) => {
    return maxClicks > 0 ? (clicks / maxClicks) * 100 : 0;
  };

  // Filter and sort links
  const getFilteredAndSortedLinks = () => {
    if (!stats?.recentLinks) return [];
    
    let filtered = [...stats.recentLinks];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((link: any) =>
        link.code.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'mostClicks':
        filtered.sort((a: any, b: any) => b.clicks - a.clicks);
        break;
      case 'leastClicks':
        filtered.sort((a: any, b: any) => a.clicks - b.clicks);
        break;
      case 'newest':
      default:
        filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    
    return filtered;
  };

  // Copy link to clipboard
  const handleCopy = async (code: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shortUrl = `${baseUrl}/${code}`;
    await navigator.clipboard.writeText(shortUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  // Delete link
  const handleDelete = async (code: string) => {
    if (!confirm(`Are you sure you want to delete the link "${code}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete link');
      }

      await fetchStats(); // Refresh data
      setShowModal(false); // Close modal if open
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete link');
    }
  };

  // Open modal with link details
  const handleViewDetails = (link: any) => {
    setSelectedLink(link);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedLink(null);
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const filteredLinks = getFilteredAndSortedLinks();

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl relative z-10 py-6 sm:py-8">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 animate-fade-in-up">
          <span className="gradient-text">Comprehensive analytics</span>
          <span className="text-gray-700"> for </span>
          <span className="gradient-text">all your links</span>
        </h2>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-500 mt-4">Loading statistics...</p>
          </div>
        ) : error ? (
          <div className="glass rounded-xl p-8 border-2 border-red-200 text-center">
            <div className="text-red-600 text-xl font-semibold mb-2">Error Loading Statistics</div>
            <div className="text-gray-600">{error}</div>
          </div>
        ) : (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 animate-scale-in">
              <div className="glass rounded-xl sm:rounded-2xl p-6 border-2 border-indigo-200 hover:border-indigo-300 shadow-lg hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-indigo-300">
                    <Link2 className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">Total</span>
                </div>
                <div className="text-4xl font-extrabold text-gray-900 mb-1">{stats?.totalLinks || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Total Links</div>
              </div>

              <div className="glass rounded-xl sm:rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-purple-300">
                    <MousePointerClick className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">Clicks</span>
                </div>
                <div className="text-4xl font-extrabold text-gray-900 mb-1">{stats?.totalClicks || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Total Clicks</div>
              </div>

              <div className="glass rounded-xl sm:rounded-2xl p-6 border-2 border-pink-200 hover:border-pink-300 shadow-lg hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-pink-300">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-3 py-1 rounded-full border border-pink-200">Average</span>
                </div>
                <div className="text-4xl font-extrabold text-gray-900 mb-1">{stats?.avgClicks || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Avg Clicks/Link</div>
              </div>

              <div className="glass rounded-xl sm:rounded-2xl p-6 border-2 border-green-200 hover:border-green-300 shadow-lg hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-green-300">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full border border-green-200">Active</span>
                </div>
                <div className="text-4xl font-extrabold text-gray-900 mb-1">
                  {stats?.allLinks.filter((l: any) => l.clicks > 0).length || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">Active Links</div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Bar Chart - Top 5 Links */}
              <div className="glass rounded-xl sm:rounded-2xl p-6 md:p-8 border-2 border-indigo-200/50 hover:border-indigo-300 shadow-lg hover:shadow-2xl transition-all animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-indigo-300">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Top 5 Links by Clicks</h2>
                </div>
                <div className="space-y-4">
                  {stats?.topLinks?.map((link: any, index: number) => {
                    const maxClicks = stats.topLinks[0]?.clicks || 1;
                    const barHeight = getBarHeight(link.clicks, maxClicks);
                    const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-violet-500'];
                    return (
                      <div key={link.code} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <code className="font-mono font-semibold text-gray-700 truncate max-w-[150px]">/{link.code}</code>
                          <span className="font-bold text-gray-900">{link.clicks} clicks</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-8 border-2 border-gray-300 overflow-hidden">
                          <div 
                            className={`h-full ${colors[index]} rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3`}
                            style={{ width: `${barHeight}%` }}
                          >
                            {barHeight > 20 && (
                              <span className="text-white text-xs font-bold">{link.clicks}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pie Chart - Active vs Inactive */}
              <div className="glass rounded-xl sm:rounded-2xl p-6 md:p-8 border-2 border-purple-200/50 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-purple-300">
                    <PieChart className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Link Activity Status</h2>
                </div>
                <div className="flex flex-col items-center">
                  {/* Simple Pie Chart using CSS */}
                  <div className="relative w-48 h-48 mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="20"/>
                      {/* Active links segment */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="none" 
                        stroke="url(#activeGradient)" 
                        strokeWidth="20"
                        strokeDasharray={`${(stats.activeLinks / stats.totalLinks) * 251.2} 251.2`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#EC4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-extrabold text-gray-900">
                          {stats.totalLinks > 0 ? Math.round((stats.activeLinks / stats.totalLinks) * 100) : 0}%
                        </div>
                        <div className="text-xs text-gray-600 font-medium">Active</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="space-y-3 w-full">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        <span className="font-semibold text-gray-700">Active Links</span>
                      </div>
                      <span className="font-bold text-gray-900">{stats.activeLinks}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                        <span className="font-semibold text-gray-700">Inactive Links</span>
                      </div>
                      <span className="font-bold text-gray-900">{stats.inactiveLinks}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Chart - Clicks Trend */}
            <div className="glass rounded-xl sm:rounded-2xl p-6 md:p-8 mb-8 border-2 border-pink-200/50 hover:border-pink-300 shadow-lg hover:shadow-2xl transition-all animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-pink-300">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Performance Trend</h2>
              </div>
              
              {/* Simple Line Chart */}
              <div className="relative overflow-hidden">
                <div className="h-64 flex items-end justify-between gap-2 border-b-2 border-l-2 border-gray-300 p-4 sm:p-6 pt-8">
                  {stats?.recentLinks?.map((link: any, index: number) => {
                    const maxClicks = Math.max(...stats.recentLinks.map((l: any) => l.clicks), 1);
                    const height = (link.clicks / maxClicks) * 100;
                    const barColors = [
                      'from-blue-500 to-blue-600',
                      'from-slate-500 to-slate-600',
                      'from-teal-500 to-teal-600',
                      'from-indigo-500 to-indigo-600',
                      'from-cyan-600 to-cyan-700'
                    ];
                    const dotColors = [
                      'from-blue-600 to-blue-700',
                      'from-slate-600 to-slate-700',
                      'from-teal-600 to-teal-700',
                      'from-indigo-600 to-indigo-700',
                      'from-cyan-700 to-cyan-800'
                    ];
                    const textColors = [
                      'text-blue-700',
                      'text-slate-700',
                      'text-teal-700',
                      'text-indigo-700',
                      'text-cyan-800'
                    ];
                    return (
                      <div key={link.code} className="flex-1 flex flex-col items-center justify-end group">
                        {/* Line point */}
                        <div className="relative w-full flex items-end justify-center h-48">
                          <div 
                            className="w-full flex flex-col items-center justify-end transition-all duration-500"
                            style={{ height: `${height}%` }}
                          >
                            <div className={`w-4 h-4 bg-gradient-to-br ${dotColors[index % 5]} rounded-full border-2 border-white shadow-lg mb-1 group-hover:scale-150 transition-transform`}></div>
                            <div className={`w-2 bg-gradient-to-t ${barColors[index % 5]} flex-1 rounded-t-sm`}></div>
                          </div>
                        </div>
                        {/* Label */}
                        <div className="mt-2 text-center">
                          <div className="text-xs font-mono text-gray-600 truncate max-w-[60px]" title={link.code}>
                            {link.code.substring(0, 6)}
                          </div>
                          <div className={`text-xs font-bold ${textColors[index % 5]}`}>{link.clicks}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                Recent Links Performance
              </div>
            </div>

            {/* Top Performer */}
            {stats?.mostClicked && (
              <div className="glass rounded-xl sm:rounded-2xl p-6 md:p-8 mb-8 border-2 border-yellow-200/50 hover:border-yellow-300 shadow-lg hover:shadow-2xl transition-all animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-yellow-300">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Top Performer</h2>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 sm:p-6 border-2 border-yellow-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <code className="text-lg font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200">
                        /{stats.mostClicked.code}
                      </code>
                      <p className="text-sm text-gray-600 mt-2 truncate">{stats.mostClicked.url}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MousePointerClick className="h-5 w-5 text-purple-600" />
                      <span className="text-3xl font-extrabold text-gray-900">{stats.mostClicked.clicks}</span>
                      <span className="text-sm text-gray-600">clicks</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="glass rounded-xl sm:rounded-2xl p-6 md:p-8 border-2 border-indigo-200/50 hover:border-indigo-300 shadow-lg hover:shadow-2xl transition-all animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-indigo-300">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Links</h2>
              </div>
              
              {/* Enhanced Filter & Sort Controls */}
              <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by code or URL..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-10 bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-sm"
                  />
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                
                {/* Sort & Filter Row */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <SortAsc className="h-4 w-4 text-gray-600" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="mostClicks">Most Clicks</option>
                      <option value="leastClicks">Least Clicks</option>
                    </select>
                  </div>
                  
                  {/* Results Count */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
                    <span className="text-sm font-semibold text-indigo-700">
                      {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'}
                    </span>
                  </div>
                  
                  {/* Clear Filters */}
                  {(searchQuery || sortBy !== 'newest') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSortBy('newest');
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-all text-sm font-medium"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                {filteredLinks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Link2 className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">No links found</p>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  filteredLinks.map((link: any, index: number) => {
                    const bgColors = [
                      'bg-gradient-to-r from-blue-500 to-blue-600',
                      'bg-gradient-to-r from-slate-500 to-slate-600',
                      'bg-gradient-to-r from-teal-500 to-teal-600',
                      'bg-gradient-to-r from-indigo-500 to-indigo-600',
                      'bg-gradient-to-r from-cyan-600 to-cyan-700'
                    ];
                    return (
                      <div 
                        key={link.code}
                        className={`rounded-lg p-4 ${bgColors[index % 5]} shadow-lg hover:shadow-xl transition-all group relative`}
                      >
                        {/* Main Content - Clickable */}
                        <div 
                          className="cursor-pointer"
                          onClick={() => handleViewDetails(link)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <code className="text-sm font-mono font-bold px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm text-gray-900 shadow-sm">
                                /{link.code}
                              </code>
                              <p className="text-xs sm:text-sm text-white font-medium mt-2 truncate">{link.url}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm">
                                <MousePointerClick className="h-4 w-4 text-gray-700" />
                                <span className="font-bold text-gray-900">{link.clicks}</span>
                              </div>
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm">
                                <Calendar className="h-4 w-4 text-gray-700" />
                                <span className="font-semibold text-gray-900">{new Date(link.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(link.code);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white rounded-lg transition-all text-xs font-semibold text-gray-900 shadow-sm hover:shadow-md"
                            title="Copy Link"
                          >
                            {copiedCode === link.code ? (
                              <>
                                <span className="text-green-600">✓</span>
                                <span className="text-green-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                          
                          <a
                            href={`/code/${link.code}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white rounded-lg transition-all text-xs font-semibold text-gray-900 shadow-sm hover:shadow-md"
                            title="View Analytics"
                          >
                            <BarChart3 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Analytics</span>
                          </a>
                          
                          <a
                            href={`${baseUrl}/${link.code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white rounded-lg transition-all text-xs font-semibold text-gray-900 shadow-sm hover:shadow-md"
                            title="Open Link"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Open</span>
                          </a>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(link.code);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 rounded-lg transition-all text-xs font-semibold text-red-700 shadow-sm hover:shadow-md ml-auto"
                            title="Delete Link"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </>
        )}
      </div>
      
      {/* Detailed Link Modal */}
      {showModal && selectedLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in-up">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative glass rounded-2xl shadow-rainbow-glow max-w-2xl w-full p-8 border-4 border-transparent animate-scale-in max-h-[90vh] overflow-y-auto"
               style={{ 
                 backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #667eea, #764ba2, #ec4899, #f093fb)',
                 backgroundOrigin: 'padding-box, border-box',
                 backgroundClip: 'padding-box, border-box'
               }}>
            {/* Header */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-gray-200">
              <div>
                <h2 className="text-2xl font-bold gradient-text-vibrant flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                  Link Details
                </h2>
                <code className="text-sm font-mono font-bold px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 border-2 border-indigo-300">
                  /{selectedLink.code}
                </code>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-red-300 hover:scale-110"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Short URL */}
            <div className="mb-6">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2 block">Short URL</label>
              <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                <a 
                  href={`${baseUrl}/${selectedLink.code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-indigo-600 font-mono font-bold hover:text-indigo-700 transition-colors break-all"
                >
                  {baseUrl}/{selectedLink.code}
                </a>
                <button
                  onClick={() => handleCopy(selectedLink.code)}
                  className="p-2 bg-white border-2 border-indigo-300 rounded-lg hover:bg-indigo-50 transition-all"
                >
                  {copiedCode === selectedLink.code ? (
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  ) : (
                    <Copy className="h-4 w-4 text-indigo-600" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Original URL */}
            <div className="mb-6">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2 block">Original URL</label>
              <div className="p-4 bg-white rounded-xl border-2 border-gray-300">
                <a 
                  href={selectedLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-indigo-600 transition-colors break-all text-sm flex items-center gap-2"
                >
                  {selectedLink.url}
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                </a>
              </div>
            </div>
            
            {/* Statistics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-300">
                <div className="flex items-center gap-2 mb-2">
                  <MousePointerClick className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-bold text-blue-700 uppercase">Clicks</span>
                </div>
                <div className="text-3xl font-extrabold text-blue-900">{selectedLink.clicks}</div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-300">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-bold text-purple-700 uppercase">Created</span>
                </div>
                <div className="text-lg font-bold text-purple-900">
                  {new Date(selectedLink.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
              
              <div className="col-span-2 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-300">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-bold text-green-700 uppercase">Last Clicked</span>
                </div>
                <div className="text-lg font-bold text-green-900">
                  {selectedLink.lastClickedAt
                    ? new Date(selectedLink.lastClickedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Never'}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href={`/code/${selectedLink.code}`}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all border-2 border-white/20"
              >
                <BarChart3 className="h-5 w-5" />
                View Full Analytics
              </a>
              
              <button
                onClick={() => {
                  handleDelete(selectedLink.code);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-bold hover:shadow-lg transition-all border-2 border-white/20"
              >
                <Trash2 className="h-5 w-5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
