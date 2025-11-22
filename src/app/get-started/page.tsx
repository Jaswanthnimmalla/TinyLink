'use client';

import Link from 'next/link';
import Navbar from '@/components/Layout/Navbar';
import { Sparkles, Link2, Code, BarChart3, Zap, CheckCircle, ArrowRight } from 'lucide-react';

export default function GetStartedPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-5xl relative z-10 py-6 sm:py-8">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-8 sm:mb-12 animate-fade-in-up">
          <span className="gradient-text">Get Started</span>
        </h1>

        {/* Steps */}
        <div className="space-y-6 mb-12">
          {/* Step 1 */}
          <div className="glass rounded-xl sm:rounded-2xl p-6 md:p-8 border-2 border-indigo-200/50 hover:border-indigo-300 shadow-lg hover:shadow-2xl transition-all animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-indigo-300 flex-shrink-0">
                <Link2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Step 1: Create Your Short Link</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Simply paste your long URL into the input field on the home page. You can optionally customize your short code with 6-8 alphanumeric characters.
                </p>
                <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-200">
                  <code className="text-sm text-indigo-700 font-mono">
                    Example: https://example.com/very/long/url → tinylink.com/abc123
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass rounded-xl sm:rounded-2xl p-6 md:p-8 border-2 border-purple-200/50 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-purple-300 flex-shrink-0">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Step 2: Copy & Share</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Once created, your shortened URL is instantly ready to use. Click the copy button to copy it to your clipboard and share it anywhere.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border-2 border-gray-200 text-sm font-medium text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Social Media
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border-2 border-gray-200 text-sm font-medium text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Emails
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border-2 border-gray-200 text-sm font-medium text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    SMS
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border-2 border-gray-200 text-sm font-medium text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Anywhere!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass rounded-xl sm:rounded-2xl p-6 md:p-8 border-2 border-pink-200/50 hover:border-pink-300 shadow-lg hover:shadow-2xl transition-all animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-pink-300 flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Step 3: Track Analytics</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Visit the Dashboard or Statistics page to see real-time click tracking, performance metrics, and detailed analytics for all your links.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 border-2 border-gray-200 text-center">
                    <div className="text-2xl font-bold text-indigo-600">∞</div>
                    <div className="text-xs text-gray-600 mt-1">Clicks</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-2 border-gray-200 text-center">
                    <div className="text-2xl font-bold text-purple-600">📊</div>
                    <div className="text-xs text-gray-600 mt-1">Analytics</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border-2 border-gray-200 text-center">
                    <div className="text-2xl font-bold text-pink-600">📈</div>
                    <div className="text-xs text-gray-600 mt-1">Trends</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="glass rounded-xl sm:rounded-2xl p-6 md:p-8 mb-8 border-2 border-white/40 hover:border-green-200 shadow-lg hover:shadow-2xl transition-all animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-green-300">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Key Features</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900">Custom Short Codes</div>
                <div className="text-sm text-gray-600">Create memorable, branded short links</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900">Real-time Analytics</div>
                <div className="text-sm text-gray-600">Track every click instantly</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900">No Registration Required</div>
                <div className="text-sm text-gray-600">Start shortening immediately</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900">Lightning Fast</div>
                <div className="text-sm text-gray-600">Instant URL shortening</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="glass rounded-xl sm:rounded-2xl p-8 text-center border-2 border-white/40 hover:border-indigo-200 shadow-xl hover:shadow-2xl transition-all animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-6">
            Create your first short link now and experience the power of TinyLink
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all border-2 border-white/20"
            >
              <Link2 className="h-5 w-5" />
              Create Short Link
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-indigo-300 transition-all"
            >
              View Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
