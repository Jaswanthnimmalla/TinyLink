'use client';

import { useState, useEffect } from 'react';
import { Link as LinkType } from '@/types';
import Navbar from '@/components/Layout/Navbar';
import SearchBar from '@/components/Dashboard/SearchBar';
import { Trash2, ExternalLink, BarChart3, Plus, TrendingUp, MousePointerClick, Link2, Calendar, Filter, X, SlidersHorizontal, CheckSquare, Square, Download, Archive } from 'lucide-react';
import Link from 'next/link';
import CopyButton from '@/components/UI/CopyButton';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<LinkType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Advanced Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minClicks: '',
    maxClicks: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'newest', // newest, oldest, mostClicks, leastClicks
    status: 'all' // all, active, inactive
  });

  // Bulk selection state
  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Hover tooltip state
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Fetch links
  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/links');
      if (!res.ok) throw new Error('Failed to fetch links');
      const data = await res.json();
      setLinks(data);
      setFilteredLinks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...links];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (link) =>
          link.code.toLowerCase().includes(query) ||
          link.url.toLowerCase().includes(query)
      );
    }

    // Click count filter
    if (filters.minClicks) {
      filtered = filtered.filter(link => link.clicks >= parseInt(filters.minClicks));
    }
    if (filters.maxClicks) {
      filtered = filtered.filter(link => link.clicks <= parseInt(filters.maxClicks));
    }

    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(link => new Date(link.createdAt) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(link => new Date(link.createdAt) <= toDate);
    }

    // Status filter
    if (filters.status === 'active') {
      filtered = filtered.filter(link => link.clicks > 0);
    } else if (filters.status === 'inactive') {
      filtered = filtered.filter(link => link.clicks === 0);
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'mostClicks':
        filtered.sort((a, b) => b.clicks - a.clicks);
        break;
      case 'leastClicks':
        filtered.sort((a, b) => a.clicks - b.clicks);
        break;
    }

    setFilteredLinks(filtered);
  }, [searchQuery, links, filters]);

  const clearFilters = () => {
    setFilters({
      minClicks: '',
      maxClicks: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'newest',
      status: 'all'
    });
  };

  const hasActiveFilters = () => {
    return filters.minClicks || filters.maxClicks || filters.dateFrom || filters.dateTo || 
           filters.sortBy !== 'newest' || filters.status !== 'all';
  };

  // Add new link
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          customCode: customCode || undefined 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create link');
      }

      setSuccessMessage('Link created successfully!');
      setUrl('');
      setCustomCode('');
      await fetchLinks();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create link');
    } finally {
      setSubmitting(false);
    }
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

      await fetchLinks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete link');
    }
  };

  // Bulk selection handlers
  const toggleLinkSelection = (code: string) => {
    const newSelected = new Set(selectedLinks);
    if (newSelected.has(code)) {
      newSelected.delete(code);
    } else {
      newSelected.add(code);
    }
    setSelectedLinks(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const toggleSelectAll = () => {
    if (selectedLinks.size === filteredLinks.length) {
      setSelectedLinks(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedLinks(new Set(filteredLinks.map(link => link.code)));
      setShowBulkActions(true);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedLinks.size} links?`)) {
      return;
    }

    try {
      await Promise.all(
        Array.from(selectedLinks).map(code =>
          fetch(`/api/links/${code}`, { method: 'DELETE' })
        )
      );
      await fetchLinks();
      setSelectedLinks(new Set());
      setShowBulkActions(false);
    } catch (err) {
      alert('Failed to delete some links');
    }
  };

  const handleBulkExport = () => {
    const selectedData = filteredLinks.filter(link => selectedLinks.has(link.code));
    const csv = [
      ['Code', 'URL', 'Clicks', 'Created', 'Last Clicked'].join(','),
      ...selectedData.map(link => [
        link.code,
        link.url,
        link.clicks,
        new Date(link.createdAt).toLocaleDateString(),
        link.lastClickedAt ? new Date(link.lastClickedAt).toLocaleDateString() : 'Never'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `links-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Get status badge info
  const getStatusBadge = (clicks: number) => {
    if (clicks >= 100) {
      return { text: '🔥 Hot', class: 'bg-gradient-to-r from-orange-100 to-red-100 text-red-700 border-red-300' };
    } else if (clicks >= 10) {
      return { text: '👍 Active', class: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300' };
    } else if (clicks > 0) {
      return { text: '✨ New', class: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-300' };
    } else {
      return { text: '😴 Inactive', class: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-300' };
    }
  };

  // Mini Sparkline Component
  const MiniSparkline = ({ clicks, maxClicks }: { clicks: number; maxClicks: number }) => {
    // Generate fake 7-day data for visualization (in real app, this would come from backend)
    const generateFakeData = (totalClicks: number) => {
      const days = 7;
      const data = [];
      for (let i = 0; i < days; i++) {
        const variance = Math.random() * 0.3 + 0.85; // 85-115% variance
        data.push(Math.floor((totalClicks / days) * variance));
      }
      return data;
    };

    const data = generateFakeData(clicks);
    const max = Math.max(...data, 1);
    const width = 60;
    const height = 24;
    const pointWidth = width / data.length;

    return (
      <svg width={width} height={height} className="inline-block">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points={data
            .map((value, i) => {
              const x = i * pointWidth + pointWidth / 2;
              const y = height - (value / max) * height;
              return `${x},${y}`;
            })
            .join(' ')}
        />
        {data.map((value, i) => {
          const x = i * pointWidth + pointWidth / 2;
          const y = height - (value / max) * height;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="currentColor"
            />
          );
        })}
      </svg>
    );
  };

  // Quick stats calculator
  const getQuickStats = (link: LinkType) => {
    const daysSinceCreated = Math.floor(
      (new Date().getTime() - new Date(link.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const clicksPerDay = daysSinceCreated > 0 ? (link.clicks / daysSinceCreated).toFixed(2) : link.clicks;
    const performance = link.clicks >= 100 ? 'Excellent' : link.clicks >= 10 ? 'Good' : link.clicks > 0 ? 'Fair' : 'No Activity';
    
    return { daysSinceCreated, clicksPerDay, performance };
  };

  // Calculate stats
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
  const averageClicks = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : 0;
  const maxClicks = Math.max(...filteredLinks.map(l => l.clicks), 1);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-gradient relative overflow-hidden">
      {/* Animated Background - Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl relative z-10 py-6 sm:py-8">
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 animate-fade-in-up">
          <span className="gradient-text">Manage your links</span>
          <span className="text-gray-700"> and </span>
          <span className="gradient-text">track performance</span>
        </h2>

        {/* Statistics Overview - Responsive Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 animate-scale-in">
          <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-indigo-200/50 hover:border-indigo-300 card-hover shadow-lg hover:shadow-2xl transition-all bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg border-2 border-indigo-300">
                <Link2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 sm:px-3 py-1 rounded-full border border-indigo-200">Total</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">{totalLinks}</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Links</div>
          </div>

          <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-purple-200/50 hover:border-purple-300 card-hover shadow-lg hover:shadow-2xl transition-all bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg border-2 border-purple-300">
                <MousePointerClick className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 sm:px-3 py-1 rounded-full border border-purple-200">Clicks</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">{totalClicks}</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Clicks</div>
          </div>

          <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-pink-200/50 hover:border-pink-300 card-hover shadow-lg hover:shadow-2xl transition-all bg-gradient-to-br from-pink-50 to-rose-50 xs:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg border-2 border-pink-300">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-2 sm:px-3 py-1 rounded-full border border-pink-200">Average</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">{averageClicks}</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Avg Clicks/Link</div>
          </div>
        </div>

        <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-4 border-indigo-300 shadow-2xl bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30">
          {/* Add Link Form - Responsive */}
          <div className="rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border-2 border-indigo-300 hover:border-indigo-400 transition-all animate-fade-in-up bg-gradient-to-br from-white to-indigo-50" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center border-2 border-indigo-400 shadow-md">
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Create New Link</h2>
            </div>
            
            <form onSubmit={handleAddLink} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Original URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/very/long/url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-indigo-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-indigo-400 transition-all duration-300 shadow-sm"
                    required
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Custom Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="mycode (6-8 chars)"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-purple-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 hover:border-purple-400 transition-all duration-300 shadow-sm"
                    disabled={submitting}
                  />
                </div>
              </div>
              
              {formError && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-700 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3 animate-scale-in text-xs sm:text-sm shadow-md">
                  <div className="h-2 w-2 bg-red-500 rounded-full flex-shrink-0 mt-1"></div>
                  <span className="font-medium break-words">{formError}</span>
                </div>
              )}
              
              {successMessage && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-green-700 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 animate-scale-in text-xs sm:text-sm shadow-md">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">{successMessage}</span>
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full btn-gradient text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ripple shadow-lg"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="hidden xs:inline">Creating Link...</span>
                    <span className="xs:hidden">Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    Shorten URL
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Links List - Responsive */}
          <div className="glass rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border-2 border-purple-300 hover:border-purple-400 transition-all animate-fade-in-up bg-gradient-to-br from-white to-purple-50 overflow-visible" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col gap-4 mb-4 sm:mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">All Links</h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'} 
                    {searchQuery && ` found for "${searchQuery}"`}
                    {hasActiveFilters() && !searchQuery && ' (filtered)'}
                  </p>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all border-2 ${
                    showFilters || hasActiveFilters()
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-700 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {hasActiveFilters() && (
                    <span className="bg-white text-indigo-600 px-2 py-0.5 rounded-full text-xs font-bold">
                      {[filters.minClicks, filters.maxClicks, filters.dateFrom, filters.dateTo, filters.status !== 'all', filters.sortBy !== 'newest'].filter(Boolean).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="glass rounded-xl p-4 sm:p-6 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 animate-scale-in">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-indigo-600" />
                      <h3 className="text-lg font-bold text-gray-900">Advanced Filters</h3>
                    </div>
                    {hasActiveFilters() && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all border-2 border-red-200 hover:border-red-300"
                      >
                        <X className="h-4 w-4" />
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Click Range */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Click Range</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.minClicks}
                          onChange={(e) => setFilters({...filters, minClicks: e.target.value})}
                          className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.maxClicks}
                          onChange={(e) => setFilters({...filters, maxClicks: e.target.value})}
                          className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                        />
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Date From</label>
                      <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                        className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Date To</label>
                      <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                        className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Status</label>
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                        className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                      >
                        <option value="all">All Links</option>
                        <option value="active">Active (with clicks)</option>
                        <option value="inactive">Inactive (no clicks)</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Sort By</label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                        className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="mostClicks">Most Clicks</option>
                        <option value="leastClicks">Least Clicks</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  {hasActiveFilters() && (
                    <div className="mt-4 pt-4 border-t-2 border-indigo-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Active Filters:</p>
                      <div className="flex flex-wrap gap-2">
                        {filters.minClicks && (
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold border-2 border-indigo-300">
                            Min Clicks: {filters.minClicks}
                          </span>
                        )}
                        {filters.maxClicks && (
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold border-2 border-indigo-300">
                            Max Clicks: {filters.maxClicks}
                          </span>
                        )}
                        {filters.dateFrom && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold border-2 border-purple-300">
                            From: {new Date(filters.dateFrom).toLocaleDateString()}
                          </span>
                        )}
                        {filters.dateTo && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold border-2 border-purple-300">
                            To: {new Date(filters.dateTo).toLocaleDateString()}
                          </span>
                        )}
                        {filters.status !== 'all' && (
                          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold border-2 border-pink-300">
                            Status: {filters.status}
                          </span>
                        )}
                        {filters.sortBy !== 'newest' && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border-2 border-blue-300">
                            Sort: {filters.sortBy === 'oldest' ? 'Oldest' : filters.sortBy === 'mostClicks' ? 'Most Clicks' : 'Least Clicks'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="w-full">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search by code or URL..."
                />
              </div>

              {showBulkActions && (
                <div className="mb-4 p-4 glass rounded-xl border-2 border-indigo-300 shadow-lg animate-scale-in">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <CheckSquare className="h-5 w-5 text-indigo-600" />
                      <span className="font-bold text-gray-900">
                        {selectedLinks.size} {selectedLinks.size === 1 ? 'link' : 'links'} selected
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={handleBulkExport}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all border-2 border-green-600"
                      >
                        <Download className="h-4 w-4" />
                        Export
                      </button>
                      
                      <button
                        onClick={handleBulkDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all border-2 border-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedLinks(new Set());
                          setShowBulkActions(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all border-2 border-gray-300"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {loading ? (
              <div className="py-12 sm:py-20 flex flex-col items-center justify-center">
                <LoadingSpinner size="lg" />
                <p className="text-gray-500 mt-4 text-sm sm:text-base">Loading your links...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 sm:px-6 py-6 sm:py-8 rounded-xl text-center">
                <div className="text-lg sm:text-xl font-semibold mb-2">Error Loading Links</div>
                <div className="text-sm sm:text-base">{error}</div>
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="py-12 sm:py-20 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-gray-300">
                  <Link2 className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                </div>
                <div className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  {searchQuery ? 'No links found' : 'No links yet'}
                </div>
                <p className="text-sm sm:text-base text-gray-500">
                  {searchQuery 
                    ? 'Try adjusting your search criteria' 
                    : 'Create your first shortened link above'}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View - Hidden on mobile */}
                <div className="hidden lg:block overflow-x-auto rounded-xl border-2 border-indigo-200 shadow-md">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b-2 border-indigo-300">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r-2 border-indigo-200">
                            <input
                              type="checkbox"
                              checked={selectedLinks.size === filteredLinks.length}
                              onChange={toggleSelectAll}
                              className="h-4 w-4 text-indigo-600 border-2 border-indigo-300 rounded-lg"
                            />
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r-2 border-indigo-200">
                            Short Code
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r-2 border-indigo-200">
                            Target URL
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r-2 border-indigo-200">
                            Clicks
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r-2 border-indigo-200">
                            Last Clicked
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-indigo-200 bg-white/50">
                        {filteredLinks.map((link, index) => {
                          const rowColors = [
                            'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50',
                            'hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50',
                            'hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50',
                            'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50',
                          ];
                          return (
                            <tr 
                              key={link.code} 
                              className={`${rowColors[index % 4]} transition-all border-l-4 ${index % 4 === 0 ? 'border-l-indigo-400' : index % 4 === 1 ? 'border-l-purple-400' : index % 4 === 2 ? 'border-l-pink-400' : 'border-l-blue-400'}`}
                              style={{ animationDelay: `${index * 0.05}s` }}
                            >
                              <td className="px-6 py-5 whitespace-nowrap border-r-2 border-gray-200">
                                <input
                                  type="checkbox"
                                  checked={selectedLinks.has(link.code)}
                                  onChange={() => toggleLinkSelection(link.code)}
                                  className="h-4 w-4 text-indigo-600 border-2 border-indigo-300 rounded-lg"
                                />
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap border-r-2 border-gray-200">
                                <div className="flex items-center gap-3">
                                  <code className="text-indigo-600 font-mono font-bold text-base bg-indigo-100 px-3 py-1.5 rounded-lg border-2 border-indigo-300 shadow-sm">
                                    {link.code}
                                  </code>
                                  <CopyButton text={`${baseUrl}/${link.code}`} />
                                </div>
                              </td>
                              <td className="px-6 py-5 border-r-2 border-gray-200">
                                <div className="flex items-center gap-2">
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-700 max-w-md truncate hover:text-indigo-600 font-medium transition-colors"
                                    title={link.url}
                                  >
                                    {link.url}
                                  </a>
                                  <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 group-hover:text-indigo-500 transition-colors" />
                                </div>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap border-r-2 border-gray-200">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-lg border-2 border-purple-300 inline-flex">
                                  <MousePointerClick className="h-4 w-4 text-purple-600" />
                                  <span className="text-sm font-bold text-purple-900">
                                    {link.clicks}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap border-r-2 border-gray-200">
                                <div className="flex items-center gap-2 text-sm text-gray-600 px-3 py-1.5 bg-gray-100 rounded-lg border-2 border-gray-300 inline-flex">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  {link.lastClickedAt
                                    ? new Date(link.lastClickedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                      })
                                    : 'Never'}
                                </div>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap border-r-2 border-gray-200">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-indigo-300 inline-flex">
                                  <span className={`text-sm font-bold ${getStatusBadge(link.clicks).class}`}>
                                    {getStatusBadge(link.clicks).text}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <Link
                                    href={`/code/${link.code}`}
                                    className="p-2.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all border-2 border-indigo-200 hover:border-indigo-400 shadow-sm"
                                  >
                                    <BarChart3 className="h-5 w-5" />
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(link.code)}
                                    className="p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition-all border-2 border-red-200 hover:border-red-400 shadow-sm"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                  
                                  {/* Quick Stats Tooltip */}
                                  <div className="relative group">
                                    <button 
                                      className="p-2.5 text-purple-600 hover:bg-purple-100 rounded-lg transition-all border-2 border-purple-200 hover:border-purple-400 shadow-sm"
                                      onMouseEnter={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                        if (tooltip) {
                                          // Position tooltip above button, centered
                                          tooltip.style.left = `${rect.left + rect.width / 2}px`;
                                          tooltip.style.top = `${rect.top - 10}px`;
                                        }
                                      }}
                                    >
                                      <MousePointerClick className="h-5 w-5" />
                                    </button>
                                    
                                    {/* Tooltip Content */}
                                    <div className="fixed -translate-x-1/2 -translate-y-full hidden group-hover:block z-[9999] animate-scale-in pointer-events-none">
                                      <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 shadow-2xl border-3 border-purple-400 w-[280px] sm:w-[320px]">
                                        <div className="text-sm font-bold text-gray-900 mb-3 pb-2 flex items-center gap-2 border-b-2 border-purple-200">
                                          <MousePointerClick className="h-4 w-4 text-purple-600" />
                                          <span>Quick Stats</span>
                                        </div>
                                        <div className="space-y-2.5">
                                          <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg border border-indigo-200">
                                            <span className="text-xs font-semibold text-gray-700">Total Clicks:</span>
                                            <span className="text-sm font-extrabold text-indigo-600">{link.clicks}</span>
                                          </div>
                                          <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg border border-purple-200">
                                            <span className="text-xs font-semibold text-gray-700">Clicks/Day:</span>
                                            <span className="text-sm font-extrabold text-purple-600">{getQuickStats(link).clicksPerDay}</span>
                                          </div>
                                          <div className="flex items-center justify-between p-2 bg-pink-50 rounded-lg border border-pink-200">
                                            <span className="text-xs font-semibold text-gray-700">Link Age:</span>
                                            <span className="text-sm font-extrabold text-pink-600">{getQuickStats(link).daysSinceCreated} days</span>
                                          </div>
                                          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                                            <span className="text-xs font-semibold text-gray-700">Performance:</span>
                                            <span className={`text-sm font-extrabold ${
                                              getQuickStats(link).performance === 'Excellent' ? 'text-green-600' :
                                              getQuickStats(link).performance === 'Good' ? 'text-blue-600' :
                                              getQuickStats(link).performance === 'Fair' ? 'text-yellow-600' :
                                              'text-gray-600'
                                            }`}>
                                              {getQuickStats(link).performance}
                                            </span>
                                          </div>
                                        </div>
                                        
                                        {/* Arrow pointing down to button */}
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                                          <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-purple-400"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card View - Shown on small screens */}
                <div className="lg:hidden space-y-3 sm:space-y-4">
                  {filteredLinks.map((link, index) => {
                    const cardColors = [
                      'border-indigo-300 hover:border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50',
                      'border-purple-300 hover:border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50',
                      'border-pink-300 hover:border-pink-400 bg-gradient-to-br from-pink-50 to-rose-50',
                      'border-blue-300 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50',
                    ];
                    const codeBgColors = [
                      'bg-indigo-100 border-indigo-300 text-indigo-700',
                      'bg-purple-100 border-purple-300 text-purple-700',
                      'bg-pink-100 border-pink-300 text-pink-700',
                      'bg-blue-100 border-blue-300 text-blue-700',
                    ];
                    return (
                      <div 
                        key={link.code}
                        className={`rounded-lg sm:rounded-xl p-4 border-2 ${cardColors[index % 4]} shadow-md hover:shadow-xl transition-all`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {/* Header with code and copy */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <code className={`text-sm font-mono font-bold px-2.5 py-1.5 rounded-lg border-2 ${codeBgColors[index % 4]} shadow-sm`}>
                              {link.code}
                            </code>
                            <CopyButton text={`${baseUrl}/${link.code}`} />
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <Link
                              href={`/code/${link.code}`}
                              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all border-2 border-indigo-200 hover:border-indigo-400 shadow-sm"
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(link.code)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all border-2 border-red-200 hover:border-red-400 shadow-sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* URL */}
                        <div className="mb-3 p-2 bg-white/70 rounded-lg border border-gray-200">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm text-gray-700 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2 break-all"
                            title={link.url}
                          >
                            <span className="truncate">{link.url}</span>
                            <ExternalLink className="h-3 w-3 flex-shrink-0 text-gray-400" />
                          </a>
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 rounded-lg border-2 border-purple-300">
                            <MousePointerClick className="h-3.5 w-3.5 text-purple-600" />
                            <span className="text-sm font-bold text-purple-900">{link.clicks}</span>
                            <span className="text-purple-700">clicks</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg border-2 border-gray-300">
                            <Calendar className="h-3.5 w-3.5 text-gray-500" />
                            {link.lastClickedAt
                              ? new Date(link.lastClickedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'Never'}
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 rounded-lg border-2 border-indigo-300">
                            <span className={`text-sm font-bold ${getStatusBadge(link.clicks).class}`}>
                              {getStatusBadge(link.clicks).text}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs mt-2">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg border-2 border-gray-300">
                            <span className="text-sm font-bold text-gray-700">Clicks/Day: {getQuickStats(link).clicksPerDay}</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg border-2 border-gray-300">
                            <span className="text-sm font-bold text-gray-700">Age: {getQuickStats(link).daysSinceCreated} days</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg border-2 border-gray-300">
                            <span className="text-sm font-bold text-gray-700">Performance: {getQuickStats(link).performance}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

    </main>
  );
}
