import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 border-2 shadow-lg hover:shadow-xl';
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 border-indigo-400 hover:border-indigo-500 shadow-indigo-glow ripple',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 border-gray-300 hover:border-gray-400',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 border-red-400 hover:border-red-500 shadow-pink-glow ripple',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
