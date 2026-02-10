import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { searchCharacters } from "../server/search";

interface SearchResult {
  id: string | number;
  name: string;
  portrait_path: string;
}

const SearchTypeahead = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        fetchResults(query);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const fetchResults = async (searchQuery: string) => {
    setLoading(true);
    try {
      const data = await searchCharacters({ data: searchQuery });
      setResults(data as SearchResult[]);
      setIsOpen(true);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsOpen(false);
      navigate({ to: "/results", search: { q: query } });
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full text-left">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search for a character..."
          className="w-full pl-4 pr-10 py-3 rounded-full border-2 border-black focus:outline-none focus:border-simpsons-blue shadow-md text-lg transition-colors"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-simpsons-blue"></div>
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border-2 border-black max-h-60 overflow-y-auto">
          {results.map((char) => (
            <li key={char.id}>
              <button
                onClick={() => {
                  navigate({
                    to: "/character/$id",
                    params: { id: String(char.id) },
                  });
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-simpsons-yellow hover:text-black flex items-center space-x-3 transition-colors border-b last:border-b-0 border-gray-100"
              >
                <img
                  src={
                    char.portrait_path.startsWith("http")
                      ? char.portrait_path
                      : `https://cdn.thesimpsonsapi.com/500${char.portrait_path}`
                  }
                  alt={char.name}
                  className="w-8 h-8 object-contain"
                />
                <span className="font-semibold text-slate-700">{char.name}</span>
              </button>
            </li>
          ))}
          <li
            className="p-2 text-center bg-gray-50 text-sm text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate({ to: "/results", search: { q: query } })}
          >
            View all results for "{query}"
          </li>
        </ul>
      )}
    </div>
  );
};

export default SearchTypeahead;
