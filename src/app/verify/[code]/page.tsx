'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Layout/Navbar';
import { Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function VerifyPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/verify/${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid password');
        setLoading(false);
        return;
      }

      // Redirect to actual destination
      window.location.href = data.redirectUrl;
    } catch (err) {
      setError('Failed to verify password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <div className="container mx-auto px-4 py-20 max-w-md relative z-10">
        <div className="glass rounded-2xl shadow-2xl p-8 border-4 border-purple-200/50 animate-scale-in">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border-4 border-purple-300 animate-pulse-soft">
              <Lock className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Protected Link
          </h1>
          <p className="text-center text-gray-600 mb-6">
            This link requires a password to access
          </p>

          {/* Code Display */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6 border-2 border-indigo-200">
            <p className="text-sm text-gray-600 text-center mb-1">Link Code:</p>
            <code className="text-lg font-mono font-bold text-indigo-700 block text-center">
              /{code}
            </code>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                Enter Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full px-4 py-3 pr-12 bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all shadow-sm"
                  required
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-shake">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">{error}</p>
                  <p className="text-xs text-red-600 mt-1">
                    Please check your password and try again.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all border-2 border-purple-700 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  Unlock Link
                </>
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <p className="text-sm text-blue-700">
              <strong>💡 Tip:</strong> Don't have the password? Contact the person who shared this link with you.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium"
            >
              ← Return to Home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}