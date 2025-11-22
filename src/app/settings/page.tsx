'use client';

import Navbar from '@/components/Layout/Navbar';
import { Settings, Bell, Shield, Palette, Database, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-4xl relative z-10 py-6 sm:py-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-8 sm:mb-10 animate-fade-in-up">
          <span className="gradient-text">Settings</span>
        </h1>

        <div className="space-y-6">
          {/* Notifications */}
          <div className="glass rounded-xl sm:rounded-2xl p-6 border-2 border-indigo-200/50 hover:border-indigo-300 shadow-lg hover:shadow-2xl transition-all animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-indigo-300">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-white/50 rounded-lg border-2 border-gray-200 hover:border-indigo-200 transition-all cursor-pointer">
                <span className="text-gray-700 font-medium">Email notifications</span>
                <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" defaultChecked />
              </label>
              <label className="flex items-center justify-between p-3 bg-white/50 rounded-lg border-2 border-gray-200 hover:border-indigo-200 transition-all cursor-pointer">
                <span className="text-gray-700 font-medium">Link click alerts</span>
                <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
              </label>
            </div>
          </div>

          {/* Privacy */}
          <div className="glass rounded-xl sm:rounded-2xl p-6 border-2 border-purple-200/50 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-purple-300">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Privacy & Security</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-white/50 rounded-lg border-2 border-gray-200 hover:border-purple-200 transition-all cursor-pointer">
                <span className="text-gray-700 font-medium">Make links public</span>
                <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" defaultChecked />
              </label>
              <label className="flex items-center justify-between p-3 bg-white/50 rounded-lg border-2 border-gray-200 hover:border-purple-200 transition-all cursor-pointer">
                <span className="text-gray-700 font-medium">Track analytics</span>
                <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" defaultChecked />
              </label>
            </div>
          </div>

          {/* Appearance */}
          <div className="glass rounded-xl sm:rounded-2xl p-6 border-2 border-pink-200/50 hover:border-pink-300 shadow-lg hover:shadow-2xl transition-all animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-pink-300">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-white/50 rounded-lg border-2 border-gray-200">
                <label className="text-gray-700 font-medium block mb-2">Theme</label>
                <select className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="glass rounded-xl sm:rounded-2xl p-6 border-2 border-green-200/50 hover:border-green-300 shadow-lg hover:shadow-2xl transition-all animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-green-300">
                <Database className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Data Management</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full p-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 hover:border-green-300 transition-all">
                Export all data
              </button>
              <button className="w-full p-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg font-medium hover:bg-red-100 hover:border-red-300 transition-all">
                Delete all links
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
