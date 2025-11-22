'use client';

import Navbar from '@/components/Layout/Navbar';
import { HelpCircle, MessageCircle, Book, Mail, ExternalLink } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      q: "How do I create a short link?",
      a: "Simply paste your long URL in the input field on the home page and click 'Shorten URL Now'. You can optionally add a custom code."
    },
    {
      q: "Can I customize my short links?",
      a: "Yes! You can create custom short codes with 6-8 alphanumeric characters when creating a link."
    },
    {
      q: "How do I track my links?",
      a: "Visit the Dashboard or Statistics page to see real-time analytics, click counts, and performance metrics for all your links."
    },
    {
      q: "Are there any limits?",
      a: "Currently, TinyLink offers unlimited link creation and click tracking at no cost."
    },
    {
      q: "How long do links last?",
      a: "Your shortened links are permanent and will continue to work indefinitely."
    },
    {
      q: "Can I delete my links?",
      a: "Yes, you can delete any link from the Dashboard page using the delete button next to each link."
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-4xl relative z-10 py-6 sm:py-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-8 sm:mb-10 animate-fade-in-up">
          <span className="gradient-text">Help & Support</span>
        </h1>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <a href="#faq" className="glass rounded-xl p-6 border-2 border-indigo-200/50 hover:border-indigo-300 shadow-lg hover:shadow-2xl transition-all text-center">
            <Book className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
            <div className="font-bold text-gray-900">FAQs</div>
          </a>
          <a href="#contact" className="glass rounded-xl p-6 border-2 border-purple-200/50 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all text-center">
            <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <div className="font-bold text-gray-900">Contact Us</div>
          </a>
          <a href="/get-started" className="glass rounded-xl p-6 border-2 border-pink-200/50 hover:border-pink-300 shadow-lg hover:shadow-2xl transition-all text-center">
            <ExternalLink className="h-8 w-8 text-pink-600 mx-auto mb-3" />
            <div className="font-bold text-gray-900">Get Started</div>
          </a>
        </div>

        {/* FAQs */}
        <div id="faq" className="glass rounded-xl sm:rounded-2xl p-6 md:p-8 mb-8 border-2 border-white/40 hover:border-indigo-200 shadow-lg hover:shadow-2xl transition-all">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 bg-white/50 rounded-lg border-2 border-gray-200 hover:border-indigo-200 transition-all">
                <div className="font-bold text-gray-900 mb-2">{faq.q}</div>
                <div className="text-gray-600">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div id="contact" className="glass rounded-xl sm:rounded-2xl p-6 md:p-8 border-2 border-purple-200/50 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-purple-300">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Contact Support</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <a 
            href="mailto:support@tinylink.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all border-2 border-white/20"
          >
            <Mail className="h-5 w-5" />
            Email Support
          </a>
        </div>
      </div>
    </main>
  );
}
