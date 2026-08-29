"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { Mail, Lock } from "lucide-react";
import api from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alert";
import { useAuth } from "@/context/AuthContext";
import { useLoadingBar } from "@/context/LoadingBarContext";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();
  const { start } = useLoadingBar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      setUser(data.user);
      alertSuccess("লগইন সফল হয়েছে");
      start();
      router.push("/");
    } catch (err) {
      alertError(err.response?.data?.message || "লগইন ব্যর্থ হয়েছে");
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
          <h1 className="text-xl font-bold text-ink-900">আবার স্বাগতম!</h1>
          <p className="text-sm text-gray-500 mt-1">লগইন করে শপিং চালিয়ে যান</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input
              required
              type="email"
              placeholder="ইমেইল"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input
              required
              type="password"
              placeholder="পাসওয়ার্ড"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="input-field pl-10"
            />
          </div>
          <button disabled={loading} type="submit" className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <ClipLoader size={18} color="#fff" /> : "লগইন"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">অথবা</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <GoogleSignInButton />

        <p className="text-sm text-center mt-6 text-gray-600">
          একাউন্ট নেই?{" "}
          <Link href="/signup" className="text-primary-600 font-semibold hover:underline">
            সাইন আপ করুন
          </Link>
        </p>
      </div>
    </div>
  );
}
