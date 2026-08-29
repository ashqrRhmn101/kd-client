"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { User, Mail, Phone, Lock } from "lucide-react";
import api from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alert";
import { useAuth } from "@/context/AuthContext";
import { useLoadingBar } from "@/context/LoadingBarContext";
import GoogleSignInButton from "@/components/GoogleSignInButton";

// NOTE: Email OTP verification is temporarily paused (Gmail App Password
// wasn't accepted yet — see README "Email OTP সমস্যা সমাধান"). This form
// registers the user directly with email + password. Once OTP is fixed,
// swap this to call /auth/send-otp then /auth/verify-otp instead of
// /auth/register — the backend already has both ready.
export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();
  const { start } = useLoadingBar();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      setUser(data.user);
      alertSuccess("একাউন্ট তৈরি হয়েছে!");
      start();
      router.push("/");
    } catch (err) {
      alertError(err.response?.data?.message || "একাউন্ট তৈরি করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-12">
      <div className="card w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-2xl font-bold mb-3">
            KD
          </div>
          <h1 className="text-xl font-bold text-ink-900">নতুন একাউন্ট তৈরি করুন</h1>
          <p className="text-sm text-gray-500 mt-1">কয়েক সেকেন্ডেই শুরু করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input required name="name" placeholder="পূর্ণ নাম" value={form.name} onChange={handleChange} className="input-field pl-10" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input required type="email" name="email" placeholder="ইমেইল" value={form.email} onChange={handleChange} className="input-field pl-10" />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input required name="phone" placeholder="ফোন নাম্বার" value={form.phone} onChange={handleChange} className="input-field pl-10" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input required type="password" name="password" minLength={6} placeholder="পাসওয়ার্ড (কমপক্ষে ৬ ক্যারেক্টার)" value={form.password} onChange={handleChange} className="input-field pl-10" />
          </div>
          <button disabled={loading} type="submit" className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <ClipLoader size={18} color="#fff" /> : "একাউন্ট তৈরি করুন"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">অথবা</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <GoogleSignInButton />

        <p className="text-sm text-center mt-6 text-gray-600">
          একাউন্ট আছে?{" "}
          <Link href="/login" className="text-primary-600 font-semibold hover:underline">
            লগইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}
