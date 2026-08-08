"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/admin", label: "📊 ড্যাশবোর্ড" },
  { href: "/admin/products", label: "📦 প্রোডাক্ট" },
  { href: "/admin/orders", label: "🧾 অর্ডার" },
  { href: "/admin/reviews", label: "⭐ রিভিউ" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage || loading) return;
    if (!user || user.role !== "admin") router.replace("/admin/login");
  }, [user, loading, isLoginPage]);

  if (isLoginPage) return children;
  if (loading || !user || user.role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">লোড হচ্ছে...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-56 bg-ink-900 text-white flex-shrink-0 p-4 hidden md:block">
        <h2 className="font-bold text-lg mb-6">Khalid&apos;s Dreams<br /><span className="text-xs text-gray-400">Admin Panel</span></h2>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={`block px-3 py-2 rounded-lg text-sm ${pathname === item.href ? "bg-brand-500" : "hover:bg-white/10"}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="mt-6 text-sm text-red-300 hover:text-red-100">লগআউট</button>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-x-auto">{children}</main>
    </div>
  );
}
