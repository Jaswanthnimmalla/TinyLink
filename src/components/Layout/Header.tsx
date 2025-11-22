import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            TinyLink
          </Link>
          <div className="flex gap-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
