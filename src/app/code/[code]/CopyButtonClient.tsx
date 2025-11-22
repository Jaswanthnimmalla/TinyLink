'use client';

import { useState } from 'react';

interface CopyButtonClientProps {
  text: string;
}

export default function CopyButtonClient({ text }: CopyButtonClientProps) {
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
      className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
    >
      {copied ? '✓ Copied!' : 'Copy'}
    </button>
  );
}
