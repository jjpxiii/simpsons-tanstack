import { Link } from "@tanstack/react-router";

const Header = () => {
  return (
    <header className="bg-simpsons-blue p-4 text-white shadow-md border-b-4 border-black relative z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-black group-hover:rotate-12 transition-transform">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-bold text-simpsons-yellow drop-shadow-[0_2px_0_rgba(0,0,0,1)] tracking-wide">
            Simpsons API
          </span>
        </Link>
        <nav className="hidden md:flex space-x-6 font-bold text-simpsons-yellow">
          <Link to="/" className="hover:text-white transition-colors drop-shadow-md">
            Home
          </Link>
          <a
            href="https://thesimpsonsapi.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors drop-shadow-md"
          >
            API
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
