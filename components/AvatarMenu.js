"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { User, Package, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AvatarMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link href="/login" className="btn-primary !px-4 !py-1.5 text-sm">
        লগইন
      </Link>
    );
  }

  const initials = user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 group">
        {user.avatarUrl ? (
          <SafeImage src={user.avatarUrl} alt={user.name} width={32} height={32} className="rounded-full ring-2 ring-primary-100" fallbackClassName="rounded-full ring-2 ring-primary-100" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center text-sm font-bold ring-2 ring-primary-100">
            {initials}
          </div>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          {user.role === "admin" && (
            <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-primary-700 font-medium bg-primary-50 hover:bg-primary-100">
              <LayoutDashboard className="w-4 h-4" /> অ্যাডমিন ড্যাশবোর্ড
            </Link>
          )}
          <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
            <User className="w-4 h-4" /> প্রোফাইল
          </Link>
          <Link href="/orders/my-orders" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
            <Package className="w-4 h-4" /> আমার অর্ডার
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" /> লগআউট
          </button>
        </div>
      )}
    </div>
  );
}
