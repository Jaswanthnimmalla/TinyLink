'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2.5 rounded-lg transition-all duration-300 border-2 transform hover:scale-110 ${
        copied 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-700 shadow-md' 
          : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-300 text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 hover:border-indigo-400 hover:shadow-lg'
      } ${className}`}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="h-4 w-4 animate-scale-in" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}
