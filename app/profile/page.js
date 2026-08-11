"use client";
import Link from "next/link";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) return <div className="container-page py-16 text-center"><ClipLoader color="#16a34a" /></div>;
  if (!user) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-gray-500 mb-4">প্রোফাইল দেখতে লগইন করুন</p>
        <Link href="/login" className="btn-primary">লগইন করুন</Link>
      </div>
    );
  }

  const initials = user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="container-page py-10 max-w-md">
      <div className="card p-6 text-center">
        {user.avatarUrl ? (
          <Image src={user.avatarUrl} alt={user.name} width={72} height={72} className="rounded-full mx-auto ring-4 ring-primary-100" />
        ) : (
          <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center text-2xl font-bold mx-auto ring-4 ring-primary-100">
            {initials}
          </div>
        )}
        <h1 className="text-lg font-bold mt-3">{user.name}</h1>
        {user.isVerified && (
          <p className="text-xs text-primary-600 flex items-center justify-center gap-1 mt-1">
            <ShieldCheck className="w-3.5 h-3.5" /> ভেরিফাইড একাউন্ট
          </p>
        )}

        <div className="text-left mt-6 space-y-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" /> {user.email}
          </div>
          {user.phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" /> {user.phone}
            </div>
          )}
        </div>

        <Link href="/orders/my-orders" className="btn-outline block mt-6 text-sm">
          আমার অর্ডার দেখুন
        </Link>
      </div>
    </div>
  );
}
