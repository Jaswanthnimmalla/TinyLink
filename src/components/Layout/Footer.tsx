export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">TinyLink</h3>
            <p className="text-gray-400 text-sm">Fast and simple URL shortening</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              About
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} TinyLink. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
