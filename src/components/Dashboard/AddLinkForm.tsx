'use client';

import { useState } from 'react';
import Button from '../UI/Button';
import Input from '../UI/Input';

interface AddLinkFormProps {
  onAdd: (url: string, customCode?: string) => Promise<void>;
}

export default function AddLinkForm({ onAdd }: AddLinkFormProps) {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onAdd(url, customCode || undefined);
      setUrl('');
      setCustomCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="url"
          placeholder="Enter your long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <Input
          type="text"
          placeholder="Custom code (optional)"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          disabled={loading}
        />
      </div>
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Shorten URL'}
      </Button>
    </form>
  );
}
