'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Layout/Navbar';
import { Link2, TrendingUp, Zap, Shield, Copy, Check, ArrowRight, Sparkles, QrCode, Download, Users, MousePointerClick, Globe, Activity } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  // New states for advanced features
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [livePreview, setLivePreview] = useState('');
  const [codeAvailable, setCodeAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  
  // Real-time stats
  const [liveStats, setLiveStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    linksToday: 0,
    clicksLastHour: 0,
    activeUsers: 0
  });

  // Fetch real-time stats
  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const res = await fetch('/api/stats/live');
        if (res.ok) {
          const data = await res.json();
          setLiveStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch live stats:', err);
      }
    };

    fetchLiveStats();
    // Refresh every 10 seconds for real-time feel
    const interval = setInterval(fetchLiveStats, 10000);
    return () => clearInterval(interval);
  }, []);

  // Generate live preview
  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    if (customCode) {
      setLivePreview(`${baseUrl}/${customCode}`);
      checkCodeAvailability(customCode);
    } else {
      setLivePreview(`${baseUrl}/abc123`);
      setCodeAvailable(null);
    }
  }, [customCode]);

  // Check code availability
  const checkCodeAvailability = async (code: string) => {
    if (!code || code.length < 6) {
      setCodeAvailable(null);
      return;
    }
    
    setCheckingAvailability(true);
    try {
      const res = await fetch(`/api/links/check?code=${code}`);
      const data = await res.json();
      setCodeAvailable(data.available);
    } catch (err) {
      setCodeAvailable(null);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Generate QR Code
  const generateQRCode = async (url: string) => {
    try {
      // Using QR Server API for QR code generation
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
      setQrCodeUrl(qrUrl);
      setShowQrModal(true);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }
  };

  // Download QR Code
  const downloadQRCode = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode-${customCode || 'link'}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download QR code:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setLoading(true);

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

      const baseUrl = window.location.origin;
      setShortUrl(`${baseUrl}/${data.code}`);
      setUrl('');
      setCustomCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-gradient relative overflow-hidden">
      {/* Animated Background Elements - Adjusted for different screens */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-48 sm:w-72 h-48 sm:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section - Responsive */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in-up">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              Transform Long URLs
              <br />
              <span className="gradient-text">Into Short Links</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Create powerful short links, track analytics in real-time, and boost your digital presence
            </p>

            {/* Quick Stats - Responsive */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12 px-4">
              <div className="text-center animate-scale-in min-w-[80px]" style={{ animationDelay: '0.1s' }}>
                <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{liveStats.totalLinks}</div>
                <div className="text-xs sm:text-sm text-gray-600">Links Created</div>
              </div>
              <div className="text-center animate-scale-in min-w-[80px]" style={{ animationDelay: '0.2s' }}>
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">{liveStats.totalClicks}</div>
                <div className="text-xs sm:text-sm text-gray-600">Clicks Tracked</div>
              </div>
              <div className="text-center animate-scale-in min-w-[80px]" style={{ animationDelay: '0.3s' }}>
                <div className="text-2xl sm:text-3xl font-bold text-pink-600">{liveStats.activeUsers}</div>
                <div className="text-xs sm:text-sm text-gray-600">Active Users</div>
              </div>
            </div>
          </div>
          
          {/* Real-Time Statistics Dashboard */}
          <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-8 sm:mb-10 border-2 border-purple-200/50 shadow-xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Live Statistics</h2>
                  <p className="text-xs sm:text-sm text-gray-600">Updated in real-time</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-full border-2 border-green-300">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-semibold text-green-700">LIVE</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Links Today */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Link2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-blue-700">Today</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-1">
                  {liveStats.linksToday}
                </div>
                <p className="text-xs text-blue-600">Links Created</p>
              </div>
              
              {/* Clicks Last Hour */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <MousePointerClick className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-purple-700">Last Hour</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 mb-1">
                  {liveStats.clicksLastHour}
                </div>
                <p className="text-xs text-purple-600">Clicks</p>
              </div>
              
              {/* Active Users */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-green-700">Active Now</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-green-700 mb-1">
                  {liveStats.activeUsers}
                </div>
                <p className="text-xs text-green-600">Users Online</p>
              </div>
              
              {/* Global Reach */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-orange-700">All Time</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-orange-700 mb-1">
                  {liveStats.totalLinks}
                </div>
                <p className="text-xs text-orange-600">Total Links</p>
              </div>
            </div>
          </div>
          
          {/* URL Shortening Form - Responsive */}
          <div className="glass rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 mb-10 sm:mb-12 md:mb-16 border-2 border-white/40 hover:border-indigo-200 transition-all animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="relative group">
                  <input
                    type="url"
                    placeholder="Paste your long URL here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white/50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 group-hover:border-indigo-300 shadow-sm"
                    required
                    disabled={loading}
                  />
                  <Link2 className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Custom code (optional, 6-8 chars)"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    pattern="[A-Za-z0-9]{6,8}"
                    title="6-8 alphanumeric characters"
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white/50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 group-hover:border-purple-300 shadow-sm"
                    disabled={loading}
                  />
                  <Sparkles className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-start sm:items-center gap-2 sm:gap-3 animate-scale-in text-sm sm:text-base shadow-sm">
                  <div className="h-2 w-2 bg-red-500 rounded-full flex-shrink-0 mt-1 sm:mt-0"></div>
                  <span className="break-words">{error}</span>
                </div>
              )}
              
              {livePreview && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg sm:rounded-xl p-4 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                        <Link2 className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-700">Link Preview:</p>
                        {customCode && (
                          <div className="flex items-center gap-1.5">
                            {checkingAvailability ? (
                              <>
                                <div className="h-4 w-4 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin"></div>
                                <span className="text-xs text-gray-500">Checking...</span>
                              </>
                            ) : codeAvailable === true ? (
                              <>
                                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-green-700 font-semibold">Available </span>
                              </>
                            ) : codeAvailable === false ? (
                              <>
                                <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-red-700 font-semibold">Already taken </span>
                              </>
                            ) : null}
                          </div>
                        )}
                      </div>
                      <p className="text-base sm:text-lg font-mono font-bold text-indigo-700 break-all">
                        {livePreview}
                      </p>
                      {!customCode && (
                        <p className="text-xs text-gray-500 mt-1">Random code will be generated</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {shortUrl && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 p-4 sm:p-6 rounded-lg sm:rounded-xl animate-scale-in shadow-md">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                    <p className="text-green-800 font-semibold text-sm sm:text-base">Link created successfully!</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-white/60 p-3 sm:p-4 rounded-lg border border-green-200">
                    <a 
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 font-mono font-semibold hover:underline flex-1 truncate text-sm sm:text-base lg:text-lg break-all sm:break-normal"
                    >
                      {shortUrl}
                    </a>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 text-sm sm:text-base flex-shrink-0 border-2 border-indigo-700 shadow-md"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => generateQRCode(shortUrl)}
                      className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 text-sm sm:text-base flex-shrink-0 border-2 border-indigo-700 shadow-md"
                    >
                      <QrCode className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>QR Code</span>
                    </button>
                  </div>
                </div>
              )}
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full btn-gradient text-white px-6 sm:px-8 py-4 sm:py-5 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 ripple shadow-xl border-2 border-white/20"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="hidden xs:inline">Creating your short link...</span>
                    <span className="xs:hidden">Creating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                    Shorten URL Now
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Features Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12 md:mb-16">
            <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 card-hover border-2 border-indigo-200/50 hover:border-indigo-300 animate-fade-in-up shadow-lg hover:shadow-2xl transition-all" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg border-2 border-indigo-300">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">Lightning Fast</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Generate short URLs instantly with our optimized infrastructure. No delays, just results.
              </p>
            </div>
            
            <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 card-hover border-2 border-purple-200/50 hover:border-purple-300 animate-fade-in-up shadow-lg hover:shadow-2xl transition-all" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg border-2 border-purple-300">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">Advanced Analytics</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Track every click with detailed analytics. Know when and how often your links are accessed.
              </p>
            </div>
            
            <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 card-hover border-2 border-pink-200/50 hover:border-pink-300 animate-fade-in-up shadow-lg hover:shadow-2xl transition-all sm:col-span-2 md:col-span-1" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg border-2 border-pink-300">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">Secure & Reliable</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Enterprise-grade security with 99.9% uptime. Your links are safe and always accessible.
              </p>
            </div>
          </div>

          {/* CTA Section - Responsive */}
          <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center border-2 border-white/40 hover:border-purple-200 shadow-xl hover:shadow-2xl animate-scale-in transition-all">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">
              Ready to optimize your links?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 px-2">
              Join thousands of users who trust TinyLink for their URL shortening needs
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold ripple border-2 border-white/20"
            >
              View Dashboard
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer - Responsive */}
      <footer className="glass border-t-2 border-white/40 mt-10 sm:mt-16 shadow-xl">
        <div className="container mx-auto px-4 py-6 sm:py-8 text-center text-gray-600">
          <p className="text-xs sm:text-sm font-medium">
            Simplify your links, amplify your reach
          </p>
          <p className="text-xs mt-2 text-gray-500">
            &copy; 2025 TinyLink. All rights reserved.
          </p>
        </div>
      </footer>

      {/* QR Code Modal */}
      {showQrModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full border-4 border-indigo-300 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <QrCode className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">QR Code Generated</h3>
                </div>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* QR Code Display */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 flex items-center justify-center">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="w-64 h-64 rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center">
                    <div className="h-12 w-12 border-4 border-indigo-400/30 border-t-indigo-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              {/* URL Display */}
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <p className="text-xs text-gray-600 mb-1 font-semibold">Short URL:</p>
                <p className="text-sm font-mono text-gray-800 break-all">{shortUrl}</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={downloadQRCode}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 border-2 border-indigo-700"
                >
                  <Download className="h-5 w-5" />
                  Download PNG
                </button>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Close
                </button>
              </div>
              
              {/* Info */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  <svg className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg> 
                  <strong>Tip:</strong> Scan this QR code with your phone to instantly access the link!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
