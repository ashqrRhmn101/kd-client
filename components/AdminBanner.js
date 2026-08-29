"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminBanner() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user || user.role !== "admin") return null;
  if (pathname.startsWith("/admin")) return null; // already inside admin panel

  return (
    <Link
      href="/admin"
      className="block bg-secondary-500 hover:bg-secondary-600 text-white text-center text-xs md:text-sm py-1.5 md:py-2 px-3 transition-colors"
    >
      <span className="inline-flex items-center gap-1.5">
        <LayoutDashboard className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
        <span className="md:hidden">অ্যাডমিন ড্যাশবোর্ডে যান</span>
        <span className="hidden md:inline">আপনি অ্যাডমিন হিসেবে লগইন আছেন — ড্যাশবোর্ডে যেতে ক্লিক করুন</span>
      </span>
    </Link>
  );
}
