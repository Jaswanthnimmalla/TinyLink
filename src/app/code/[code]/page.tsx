'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Layout/Navbar';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { 
  ArrowLeft, ExternalLink, MousePointerClick, Calendar, Clock, TrendingUp, Link2, 
  Globe, Monitor, Smartphone, Tablet, Share2, Download, RefreshCw, BarChart3,
  Activity, Target, Zap, Eye, Timer, Percent, Users, MapPin, QrCode
} from 'lucide-react';

export default function CodeStatsPage() {
  const params = useParams();
  const code = params?.code as string;
  
  const [linkData, setLinkData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Auto-refresh state
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchLinkData = async () => {
    try {
      const res = await fetch(`/api/links/${code}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError('Link not found');
        } else {
          throw new Error('Failed to fetch link data');
        }
        return;
      }
      const data = await res.json();
      setLinkData(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch link data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLinkData();
  }, [code]);

  // Auto-refresh every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setRefreshing(true);
      fetchLinkData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, code]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchLinkData();
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </main>
    );
  }

  if (error || !linkData) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Navbar />
        <div className="text-center p-8">
          <div className="text-red-600 text-xl font-bold mb-4">Error</div>
          <div className="text-gray-600">{error || 'Link not found'}</div>
          <Link href="/dashboard" className="mt-4 inline-block text-indigo-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shortUrl = `${baseUrl}/${code}`;
  
  // Calculate advanced metrics
  const daysSinceCreated = Math.floor((new Date().getTime() - new Date(linkData.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const clicksPerDay = daysSinceCreated > 0 ? (linkData.clicks / daysSinceCreated).toFixed(2) : linkData.clicks;
  const isActive = linkData.clicks > 0;
  const lastClickedAgo = linkData.lastClickedAt 
    ? Math.floor((new Date().getTime() - new Date(linkData.lastClickedAt).getTime()) / (1000 * 60))
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-gradient relative overflow-hidden">
      {/* Animated Background - Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-5 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl relative z-10 py-6 sm:py-8">
        
        {/* Header with Real-Time Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-fade-in-up mb-2">
              Advanced Analytics
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Real-time insights for <code className="font-mono font-bold text-indigo-600">/{code}</code>
            </p>
          </div>
          
          {/* Real-Time Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl shadow-md border-2 border-indigo-200">
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {autoRefresh ? 'Live' : 'Paused'}
              </span>
            </div>
            
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all border-2 shadow-md ${
                autoRefresh 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-600 hover:shadow-lg' 
                  : 'glass text-gray-700 border-gray-300 hover:border-indigo-300'
              }`}
            >
              {autoRefresh ? 'Stop Live' : 'Start Live'}
            </button>
            
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="p-2 glass border-2 border-indigo-300 rounded-xl hover:bg-indigo-50 transition-all disabled:opacity-50 shadow-md"
              title="Manual Refresh"
            >
              <RefreshCw className={`h-5 w-5 text-indigo-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Last Updated Info */}
        <div className="mb-6 text-sm text-gray-600 flex items-center gap-2 glass inline-flex px-4 py-2 rounded-lg border-2 border-gray-200">
          <Clock className="h-4 w-4" />
          <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
        </div>

        {/* Short URL Card - Responsive */}
        <div className="glass rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border-2 border-indigo-200/50 hover:border-indigo-300 transition-all animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 border-2 border-indigo-300">
              <Link2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm font-semibold text-gray-600">Short URL</div>
              <div className="text-base sm:text-lg font-bold text-gray-900 truncate">/{code}</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-indigo-200">
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 xs:gap-4">
              <a 
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base sm:text-lg md:text-xl font-mono font-bold text-indigo-600 hover:text-indigo-700 transition-colors break-all"
              >
                {shortUrl}
              </a>
              <div className="flex-shrink-0 xs:self-center">
                <button 
                  className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all font-medium hover:scale-105 hover:border-indigo-300"
                  onClick={() => handleCopy(shortUrl)}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Original URL Card - Responsive */}
        <div className="glass rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border-2 border-purple-200/50 hover:border-purple-300 transition-all animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-purple-300 shadow-md">
              <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-600">Original URL</div>
          </div>
          <a 
            href={linkData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm sm:text-base md:text-lg break-all text-gray-700 hover:text-indigo-600 transition-colors block bg-white/50 p-3 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-300 shadow-sm"
          >
            {linkData.url}
          </a>
        </div>
        
        {/* Statistics Grid - Responsive */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Clicks */}
          <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-indigo-200/50 hover:border-indigo-300 shadow-xl card-hover hover:shadow-2xl transition-all animate-scale-in xs:col-span-2 lg:col-span-1" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border-2 border-indigo-300">
                <MousePointerClick className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">{linkData.clicks || 0}</div>
            <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Clicks</div>
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Tracking active</span>
              </div>
            </div>
          </div>
          
          {/* Created Date */}
          <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-purple-200/50 hover:border-purple-300 shadow-xl card-hover hover:shadow-2xl transition-all animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border-2 border-purple-300">
                <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {new Date(linkData.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Created
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 pt-3 sm:pt-4 border-t-2 border-gray-200 mt-3 sm:mt-4">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>
                {new Date(linkData.createdAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
          
          {/* Last Clicked */}
          <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-pink-200/50 hover:border-pink-300 shadow-xl card-hover hover:shadow-2xl transition-all animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border-2 border-pink-300">
                <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
            {linkData.lastClickedAt ? (
              <>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {new Date(linkData.lastClickedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Last Clicked
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 pt-3 sm:pt-4 border-t-2 border-gray-200 mt-3 sm:mt-4">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>
                    {new Date(linkData.lastClickedAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl sm:text-3xl font-bold text-gray-400 mb-2">—</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Last Clicked
                </div>
                <div className="text-xs sm:text-sm text-gray-400 pt-3 sm:pt-4 border-t-2 border-gray-200 mt-3 sm:mt-4">No clicks yet</div>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions - Responsive */}
        <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-white/40 hover:border-indigo-200 shadow-xl hover:shadow-2xl transition-all animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Ready to share?</h3>
              <p className="text-xs sm:text-sm text-gray-600">Use this link anywhere to track clicks automatically</p>
            </div>
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full xs:w-auto">
              <Link
                href="/dashboard"
                className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all font-medium hover:scale-105 hover:border-indigo-300 text-center shadow-sm"
              >
                View All Links
              </Link>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base btn-gradient text-white rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-2 ripple shadow-lg border-2 border-white/20"
              >
                <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Test Link
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
