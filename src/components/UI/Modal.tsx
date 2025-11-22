'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in-up">
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-gradient-to-br from-indigo-900/60 via-purple-900/60 to-pink-900/60 backdrop-blur-md transition-opacity"
          onClick={onClose}
        />
        
        <div className="relative glass rounded-2xl shadow-rainbow-glow max-w-lg w-full p-8 border-4 border-transparent animate-scale-in" 
             style={{ 
               backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #667eea, #764ba2, #ec4899, #f093fb)',
               backgroundOrigin: 'padding-box, border-box',
               backgroundClip: 'padding-box, border-box'
             }}>
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gradient-indigo-purple">
            <h2 className="text-2xl font-bold gradient-text-vibrant flex items-center gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-red-300 hover:scale-110"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="text-gray-700">{children}</div>
        </div>
      </div>
    </div>
  );
}
