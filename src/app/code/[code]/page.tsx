import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { links } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import CopyButtonClient from './CopyButtonClient';
import { ArrowLeft, ExternalLink, MousePointerClick, Calendar, Clock, TrendingUp, Link2 } from 'lucide-react';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function CodeStatsPage({ params }: PageProps) {
  // Await params in Next.js 16
  const { code } = await params;
  
  // Get link data directly from database
  const result = await db.select().from(links).where(eq(links.code, code));
  
  if (result.length === 0) {
    notFound();
  }
  
  const linkData = result[0];
  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${code}`;
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-gradient py-6 sm:py-8 md:py-12 relative overflow-hidden">
      {/* Animated Background - Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-5 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-5xl relative z-10">
        {/* Back Button - Responsive */}
        <div className="mb-6 sm:mb-8 animate-fade-in-up">
          <Link 
            href="/dashboard"
            className="flex items-center gap-1.5 sm:gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-all hover:gap-2 sm:hover:gap-3 group text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden xs:inline">Back to Dashboard</span>
            <span className="xs:hidden">Back</span>
          </Link>
        </div>
        
        {/* Header - Responsive */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-100 rounded-full text-indigo-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Link Analytics</span>
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2 sm:mb-3 px-2">
            <span className="gradient-text">Link Statistics</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">Detailed analytics for your shortened link</p>
        </div>

        {/* Short URL Card - Responsive */}
        <div className="glass rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-white/20 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Link2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm font-semibold text-gray-600">Short URL</div>
              <div className="text-base sm:text-lg font-bold text-gray-900 truncate">/{code}</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-indigo-200">
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
                <CopyButtonClient text={shortUrl} />
              </div>
            </div>
          </div>
        </div>

        {/* Original URL Card - Responsive */}
        <div className="glass rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-white/20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-600">Original URL</div>
          </div>
          <a 
            href={linkData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm sm:text-base md:text-lg break-all text-gray-700 hover:text-indigo-600 transition-colors block bg-white/50 p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-indigo-300"
          >
            {linkData.url}
          </a>
        </div>
        
        {/* Statistics Grid - Responsive */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Clicks */}
          <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-white/20 shadow-xl card-hover animate-scale-in xs:col-span-2 lg:col-span-1" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <MousePointerClick className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">{linkData.clicks || 0}</div>
            <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Clicks</div>
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Tracking active</span>
              </div>
            </div>
          </div>
          
          {/* Created Date */}
          <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-white/20 shadow-xl card-hover animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
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
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
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
          <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-white/20 shadow-xl card-hover animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
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
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
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
                <div className="text-xs sm:text-sm text-gray-400">No clicks yet</div>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions - Responsive */}
        <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-white/20 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Ready to share?</h3>
              <p className="text-xs sm:text-sm text-gray-600">Use this link anywhere to track clicks automatically</p>
            </div>
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full xs:w-auto">
              <Link
                href="/dashboard"
                className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all font-medium hover:scale-105 text-center"
              >
                View All Links
              </Link>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base btn-gradient text-white rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-2 ripple shadow-lg"
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
