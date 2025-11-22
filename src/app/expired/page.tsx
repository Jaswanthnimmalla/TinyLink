'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Layout/Navbar';
import { AlertCircle, Clock, MousePointerClick, Ban } from 'lucide-react';

export default function ExpiredPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'unknown';
  const code = searchParams.get('code') || '';
  const maxClicks = searchParams.get('max') || '';

  const getReasonDetails = () => {
    switch (reason) {
      case 'date':
        return {
          icon: <Clock className="h-16 w-16 text-orange-500" />,
          title: 'Link Expired',
          message: 'This link has reached its expiration date and is no longer available.',
        };
      case 'clicks':
        return {
          icon: <MousePointerClick className="h-16 w-16 text-purple-500" />,
          title: 'Maximum Clicks Reached',
          message: `This link has reached its maximum click limit (${maxClicks} clicks) and is no longer available.`,
        };
      case 'inactive':
        return {
          icon: <Ban className="h-16 w-16 text-red-500" />,
          title: 'Link Deactivated',
          message: 'This link has been deactivated by the owner.',
        };
      default:
        return {
          icon: <AlertCircle className="h-16 w-16 text-gray-500" />,
          title: 'Link Unavailable',
          message: 'This link is no longer available.',
        };
    }
  };

  const details = getReasonDetails();

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <div className="container mx-auto px-4 py-20 max-w-2xl relative z-10">
        <div className="glass rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-red-200/50 text-center animate-scale-in">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {details.icon}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {details.title}
          </h1>

          {/* Message */}
          <p className="text-lg text-gray-600 mb-6">
            {details.message}
          </p>

          {/* Code Display */}
          {code && (
            <div className="bg-gray-100 rounded-lg p-4 mb-8 border-2 border-gray-300">
              <p className="text-sm text-gray-600 mb-1">Link Code:</p>
              <code className="text-lg font-mono font-bold text-gray-900">/{code}</code>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-8 text-left">
            <h3 className="font-bold text-blue-900 mb-2">💡 What happened?</h3>
            <p className="text-sm text-blue-700">
              {reason === 'date' && 'The link owner set an expiration date, and that date has passed.'}
              {reason === 'clicks' && 'The link owner set a maximum number of clicks, and that limit has been reached.'}
              {reason === 'inactive' && 'The link owner has manually deactivated this link.'}
              {reason === 'unknown' && 'The link is no longer accessible for security or administrative reasons.'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all border-2 border-indigo-700"
            >
              Return to Home
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all border-2 border-gray-300"
            >
              Go to Dashboard
            </Link>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 mt-8">
            If you believe this is an error, please contact the link owner.
          </p>
        </div>
      </div>
    </main>
  );
}