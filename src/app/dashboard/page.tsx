'use client';

import { useState, useEffect } from 'react';
import { Link as LinkType } from '@/types';
import SearchBar from '@/components/Dashboard/SearchBar';
import { Trash2, ExternalLink, BarChart3, Plus, ArrowLeft, TrendingUp, MousePointerClick, Link2, Calendar } from 'lucide-react';
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

  // Search/filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLinks(links);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = links.filter(
      (link) =>
        link.code.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query)
    );
    setFilteredLinks(filtered);
  }, [searchQuery, links]);

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

  // Calculate stats
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
  const averageClicks = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : 0;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-gradient py-6 sm:py-8 md:py-12 relative overflow-hidden">
      {/* Animated Background - Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl relative z-10">
        {/* Header - Responsive */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between animate-fade-in-up">
          <Link 
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-all hover:gap-2 sm:hover:gap-3 group text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden xs:inline">Back to Home</span>
            <span className="xs:hidden">Back</span>
          </Link>
        </div>

        <div className="mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 sm:mb-3">
            <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">Manage your links and track performance</p>
        </div>

        {/* Statistics Overview - Responsive Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 animate-scale-in">
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 card-hover shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <Link2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 sm:px-3 py-1 rounded-full">Total</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">{totalLinks}</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Links Created</div>
          </div>

          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 card-hover shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <MousePointerClick className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 sm:px-3 py-1 rounded-full">Tracked</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">{totalClicks}</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Clicks</div>
          </div>

          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 card-hover shadow-lg xs:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-2 sm:px-3 py-1 rounded-full">Average</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">{averageClicks}</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Clicks per Link</div>
          </div>
        </div>

        {/* Add Link Form - Responsive */}
        <div className="glass rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-white/20 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
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
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300"
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
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300"
                  disabled={submitting}
                />
              </div>
            </div>
            
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3 animate-scale-in text-xs sm:text-sm">
                <div className="h-2 w-2 bg-red-500 rounded-full flex-shrink-0 mt-1"></div>
                <span className="font-medium break-words">{formError}</span>
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 animate-scale-in text-xs sm:text-sm">
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
        <div className="glass rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-white/20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-col gap-4 mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">All Links</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'} 
                {searchQuery && ` found for "${searchQuery}"`}
              </p>
            </div>
            <div className="w-full">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by code or URL..."
              />
            </div>
          </div>

          {loading ? (
            <div className="py-12 sm:py-20 flex flex-col items-center justify-center">
              <LoadingSpinner size="lg" />
              <p className="text-gray-500 mt-4 text-sm sm:text-base">Loading your links...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-6 sm:py-8 rounded-xl text-center">
              <div className="text-lg sm:text-xl font-semibold mb-2">Error Loading Links</div>
              <div className="text-sm sm:text-base">{error}</div>
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="py-12 sm:py-20 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
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
              <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Short Code
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Target URL
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Clicks
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Last Clicked
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white/50">
                    {filteredLinks.map((link, index) => (
                      <tr 
                        key={link.code} 
                        className="hover:bg-indigo-50/50 transition-colors group"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <code className="text-indigo-600 font-mono font-bold text-base bg-indigo-50 px-3 py-1 rounded-lg">
                              {link.code}
                            </code>
                            <CopyButton text={`${baseUrl}/${link.code}`} />
                          </div>
                        </td>
                        <td className="px-6 py-5">
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
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <MousePointerClick className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-bold text-gray-900">
                              {link.clicks}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {link.lastClickedAt
                              ? new Date(link.lastClickedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'Never'}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/code/${link.code}`}
                              className="p-2.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all hover:scale-110 tooltip"
                              title="View Stats"
                              data-tooltip="View Stats"
                            >
                              <BarChart3 className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(link.code)}
                              className="p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:scale-110 tooltip"
                              title="Delete"
                              data-tooltip="Delete Link"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View - Shown on small screens */}
              <div className="lg:hidden space-y-3 sm:space-y-4">
                {filteredLinks.map((link, index) => (
                  <div 
                    key={link.code}
                    className="glass rounded-lg sm:rounded-xl p-4 border border-white/20 card-hover"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Header with code and copy */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <code className="text-indigo-600 font-mono font-bold text-sm bg-indigo-50 px-2.5 py-1 rounded-lg">
                          {link.code}
                        </code>
                        <CopyButton text={`${baseUrl}/${link.code}`} />
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        <Link
                          href={`/code/${link.code}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(link.code)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* URL */}
                    <div className="mb-3">
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
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <MousePointerClick className="h-3.5 w-3.5 text-purple-500" />
                        <span className="font-bold text-gray-900">{link.clicks}</span>
                        <span>clicks</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span>
                          {link.lastClickedAt
                            ? new Date(link.lastClickedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'Never'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
