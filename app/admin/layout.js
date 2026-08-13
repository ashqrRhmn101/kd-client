"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { LayoutDashboard, Package, Receipt, Star, LogOut, Tag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/NotificationBell";

const NAV = [
  { href: "/admin", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { href: "/admin/products", label: "প্রোডাক্ট", icon: Package },
  { href: "/admin/categories", label: "ক্যাটাগরি", icon: Tag },
  { href: "/admin/orders", label: "অর্ডার", icon: Receipt },
  { href: "/admin/reviews", label: "রিভিউ", icon: Star },
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader color="#16a34a" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-60 bg-ink-900 text-white flex-shrink-0 p-4 hidden md:flex md:flex-col">
        <h2 className="font-bold text-lg mb-1">
          <span className="text-primary-400">Khalid&apos;s</span> <span className="text-secondary-400">Dreams</span>
        </h2>
        <p className="text-xs text-gray-400 mb-6">Admin Panel</p>
        <nav className="space-y-1 flex-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active ? "bg-primary-500 text-white" : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-red-300 hover:text-red-100 mt-4">
          <LogOut className="w-4 h-4" /> লগআউট
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-4 md:px-8 py-3 flex justify-between items-center">
          <Link href="/" target="_blank" className="text-xs text-gray-400 hover:text-primary-600">
            ← স্টোরফ্রন্টে ফিরে যান
          </Link>
          <NotificationBell />
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-auto pb-20 md:pb-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-ink-900 text-white flex justify-around py-2 z-40">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center text-[10px] gap-0.5 ${active ? "text-secondary-400" : "text-gray-300"}`}>
              <Icon className="w-5 h-5" /> {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
