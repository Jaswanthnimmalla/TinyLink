'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Link2, TrendingUp, Zap, Shield, Copy, Check, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);

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

      {/* Header - Responsive */}
      <header className="glass sticky top-0 z-50 border-b border-white/20 shadow-lg">
        <nav className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link2 className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
            <span className="text-lg sm:text-2xl font-bold gradient-text">TinyLink</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/dashboard"
              className="px-3 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium flex items-center gap-1 sm:gap-2 ripple"
            >
              <span className="hidden xs:inline">Dashboard</span>
              <span className="xs:hidden">Dash</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section - Responsive */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-100 rounded-full text-indigo-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6 animate-pulse-soft">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Professional URL Shortening Service</span>
              <span className="xs:hidden">Professional Service</span>
            </div>
            
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
                <div className="text-2xl sm:text-3xl font-bold text-indigo-600">10K+</div>
                <div className="text-xs sm:text-sm text-gray-600">Links Created</div>
              </div>
              <div className="text-center animate-scale-in min-w-[80px]" style={{ animationDelay: '0.2s' }}>
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">50K+</div>
                <div className="text-xs sm:text-sm text-gray-600">Clicks Tracked</div>
              </div>
              <div className="text-center animate-scale-in min-w-[80px]" style={{ animationDelay: '0.3s' }}>
                <div className="text-2xl sm:text-3xl font-bold text-pink-600">99.9%</div>
                <div className="text-xs sm:text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
          
          {/* URL Shortening Form - Responsive */}
          <div className="glass rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 mb-10 sm:mb-12 md:mb-16 border border-white/20 animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="relative group">
                  <input
                    type="url"
                    placeholder="Paste your long URL here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white/50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 group-hover:border-indigo-300"
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
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white/50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 group-hover:border-purple-300"
                    disabled={loading}
                  />
                  <Sparkles className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-start sm:items-center gap-2 sm:gap-3 animate-scale-in text-sm sm:text-base">
                  <div className="h-2 w-2 bg-red-500 rounded-full flex-shrink-0 mt-1 sm:mt-0"></div>
                  <span className="break-words">{error}</span>
                </div>
              )}
              
              {shortUrl && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 sm:p-6 rounded-lg sm:rounded-xl animate-scale-in">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                    <p className="text-green-800 font-semibold text-sm sm:text-base">Link created successfully!</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-white/60 p-3 sm:p-4 rounded-lg">
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
                      className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 text-sm sm:text-base flex-shrink-0"
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
                  </div>
                </div>
              )}
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full btn-gradient text-white px-6 sm:px-8 py-4 sm:py-5 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 ripple shadow-xl"
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
            <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 card-hover border border-white/20 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">Lightning Fast</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Generate short URLs instantly with our optimized infrastructure. No delays, just results.
              </p>
            </div>
            
            <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 card-hover border border-white/20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">Advanced Analytics</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Track every click with detailed analytics. Know when and how often your links are accessed.
              </p>
            </div>
            
            <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 card-hover border border-white/20 animate-fade-in-up sm:col-span-2 md:col-span-1" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">Secure & Reliable</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Enterprise-grade security with 99.9% uptime. Your links are safe and always accessible.
              </p>
            </div>
          </div>

          {/* CTA Section - Responsive */}
          <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center border border-white/20 shadow-xl animate-scale-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">
              Ready to optimize your links?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 px-2">
              Join thousands of users who trust TinyLink for their URL shortening needs
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold ripple"
            >
              View Dashboard
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer - Responsive */}
      <footer className="glass border-t border-white/20 mt-10 sm:mt-16">
        <div className="container mx-auto px-4 py-6 sm:py-8 text-center text-gray-600">
          <p className="text-xs sm:text-sm">
            Simplify your links, amplify your reach
          </p>
          <p className="text-xs mt-2 text-gray-500">
            2025 TinyLink. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
