'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  LayoutDashboard, 
  BarChart3,
  Sparkles,
  Settings,
  HelpCircle
} from 'lucide-react';
import NotificationBell from '@/components/Notifications/NotificationBell';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/statistics', label: 'Statistics', icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="glass sticky top-0 z-50 border-b-2 border-white/30 shadow-xl backdrop-blur-xl">
      <nav className="container mx-auto px-3 sm:px-4 lg:px-6 relative">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo Section - Fixed to Far Left Corner */}
          <Link href="/" className="flex items-center group fixed left-0 z-[60]">
            {/* Logo Icon - Link/Chain Symbol */}
            <svg 
              className="h-8 w-8 mr-2 text-indigo-600 group-hover:text-purple-600 transition-colors duration-300" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Modern Link Icon */}
              <path 
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="group-hover:stroke-[3]"
              />
              <path 
                d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="group-hover:stroke-[3]"
              />
            </svg>
            
            {/* Text Logo */}
            <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 bg-clip-text text-transparent hover:from-indigo-500 hover:via-purple-500 hover:to-purple-600 transition-all duration-300" style={{ letterSpacing: '-0.02em' }}>
              TinyLink
            </span>
          </Link>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Desktop Navigation - Moved to Right */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-xl font-semibold text-sm lg:text-base
                    transition-all duration-300 border-2
                    ${active 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-700 shadow-lg' 
                      : 'text-gray-700 border-transparent hover:bg-white/60 hover:border-indigo-200 hover:text-indigo-600'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 lg:h-5 lg:w-5 ${active ? 'animate-pulse' : ''}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* Notification Bell */}
            <NotificationBell />
            
            <Link
              href="/help"
              className="p-2.5 lg:p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-indigo-200"
              title="Help"
            >
              <HelpCircle className="h-5 w-5" />
            </Link>
            <Link
              href="/settings"
              className="p-2.5 lg:p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>
            <Link
              href="/get-started"
              className="flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm lg:text-base hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/20"
            >
              <Sparkles className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="hidden lg:inline">Get Started</span>
              <span className="lg:hidden">Start</span>
            </Link>
          </div>

          {/* Mobile Menu Button and Notification Bell */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Notification Bell */}
            <NotificationBell />
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all border-2 border-transparent hover:border-indigo-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in-up">
            <div className="glass rounded-xl p-3 space-y-2 border-2 border-white/40 shadow-lg">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-base
                      transition-all duration-300 border-2
                      ${active 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-700 shadow-md' 
                        : 'text-gray-700 border-transparent hover:bg-white/60 hover:border-indigo-200 hover:text-indigo-600'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              
              <div className="pt-3 mt-3 border-t-2 border-gray-200 space-y-2">
                <Link 
                  href="/help"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all border-2 border-transparent hover:border-indigo-200"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span className="font-medium">Help & Support</span>
                </Link>
                <Link 
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-all border-2 border-transparent hover:border-purple-200"
                >
                  <Settings className="h-5 w-5" />
                  <span className="font-medium">Settings</span>
                </Link>
                <Link
                  href="/get-started"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all border-2 border-white/20"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Get Started</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
