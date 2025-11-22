import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ 
  label, 
  error, 
  className = '', 
  ...props 
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        className={`w-full px-5 py-3.5 border-3 rounded-xl transition-all duration-300 font-medium shadow-md hover:shadow-lg ${
          error 
            ? 'border-red-400 bg-red-50 focus:ring-4 focus:ring-red-500/30 focus:border-red-500' 
            : 'border-indigo-300 bg-gradient-to-r from-white to-indigo-50/30 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-indigo-400'
        } disabled:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-300 ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm font-semibold text-red-600 flex items-center gap-2 animate-fade-in-up">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
}
