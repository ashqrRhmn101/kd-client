"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { ClipLoader } from "react-spinners";
import api from "@/lib/api";
import { useLoadingBar } from "@/context/LoadingBarContext";
import SafeImage from "@/components/SafeImage";

// Debounced live search: fires a fresh request a beat after each keystroke,
// so results narrow down as the user types — this only works correctly
// because the backend now matches partial/prefix text (regex), not whole
// words ($text), otherwise typing "h" would return nothing.
export default function SearchAutocomplete({ compact = false }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  const router = useRouter();
  const { start } = useLoadingBar();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    setOpen(true);
    // 200ms after the last keystroke — snappy enough to feel "live" while
    // still avoiding a request on every single keypress.
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await api.get("/products", { params: { search: value, limit: 6 } });
        setResults(data.products);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    start();
    router.push(`/products?search=${encodeURIComponent(query)}`);
  };

  const goToProduct = (slug) => {
    setOpen(false);
    setQuery("");
    start();
    router.push(`/products/${slug}`);
  };

  return (
    <div ref={wrapperRef} className={`relative ${compact ? "w-full" : "flex-1"}`}>
      <form onSubmit={handleSubmit} className="flex">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={query}
            onChange={handleChange}
            onFocus={() => query && setOpen(true)}
            placeholder="প্রোডাক্ট খুঁজুন..."
            className="w-full border border-gray-300 rounded-l-lg pl-8 pr-7 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setOpen(false);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white px-3 rounded-r-lg text-sm">
          <Search className="w-3.5 h-3.5" />
        </button>
      </form>

      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="py-6 text-center"><ClipLoader size={20} color="#16a34a" /></div>
          ) : results.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">কোনো প্রোডাক্ট পাওয়া যায়নি</p>
          ) : (
            results.map((p) => (
              <button
                key={p._id}
                onClick={() => goToProduct(p.slug)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {p.images?.[0] && <SafeImage src={p.images[0]} alt={p.name} fill className="object-cover" sizes="40px" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{p.name}</p>
                  <p className="text-xs text-primary-600 font-semibold">৳{p.discountPrice || p.price}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
