interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <div
          className={`animate-spin rounded-full border-transparent border-t-indigo-600 border-r-purple-600 border-b-pink-600 ${sizes[size]} shadow-purple-glow`}
        />
        <div
          className={`absolute inset-0 animate-spin rounded-full border-transparent border-t-indigo-400 border-r-purple-400 ${sizes[size]} opacity-50`}
          style={{ animationDirection: 'reverse', animationDuration: '1s' }}
        />
      </div>
    </div>
  );
}
