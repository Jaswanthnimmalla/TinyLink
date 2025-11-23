import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 'h-6 w-6', text: 'text-xl' },
    md: { icon: 'h-8 w-8', text: 'text-2xl sm:text-3xl' },
    lg: { icon: 'h-12 w-12', text: 'text-4xl sm:text-5xl' },
  };

  return (
    <Link href="/" className={`flex items-center group ${className}`}>
      {/* Logo Icon - Link/Chain Symbol */}
      <svg 
        className={`${sizes[size].icon} mr-2 text-indigo-600 group-hover:text-purple-600 transition-colors duration-300`}
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Modern Link Icon */}
        <path 
          d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="group-hover:stroke-[3] transition-all"
        />
        <path 
          d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="group-hover:stroke-[3] transition-all"
        />
      </svg>
      
      {/* Text Logo */}
      {showText && (
        <span 
          className={`${sizes[size].text} font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-purple-600 transition-all duration-300`}
          style={{ letterSpacing: '-0.02em' }}
        >
          TinyLink
        </span>
      )}
    </Link>
  );
}