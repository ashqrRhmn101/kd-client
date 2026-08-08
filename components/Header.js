"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { count } = useCart();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) router.push(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="container-page flex items-center gap-4 py-3">
        <Link href="/" className="text-xl font-extrabold text-brand-600 whitespace-nowrap">
          Khalid&apos;s Dreams
        </Link>

        <form onSubmit={handleSearch} className="flex-1 hidden sm:flex">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="প্রোডাক্ট খুঁজুন..."
            className="w-full border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white px-4 rounded-r-lg">
            খুঁজুন
          </button>
        </form>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/orders/track" className="hidden md:inline hover:text-brand-600">
            অর্ডার ট্র্যাক
          </Link>

          <Link href="/cart" className="relative hover:text-brand-600">
            🛒 কার্ট
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">হ্যালো, {user.name.split(" ")[0]}</span>
              <button onClick={logout} className="text-red-600 hover:underline">
                লগআউট
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary !px-4 !py-1.5">
              লগইন
            </Link>
          )}
        </nav>
      </div>

      <form onSubmit={handleSearch} className="sm:hidden container-page pb-3 flex">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="প্রোডাক্ট খুঁজুন..."
          className="w-full border border-gray-300 rounded-l-lg px-3 py-2 text-sm"
        />
        <button type="submit" className="bg-brand-500 text-white px-3 rounded-r-lg text-sm">
          🔍
        </button>
      </form>
    </header>
  );
}
