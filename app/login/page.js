"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      setUser(data.user);
      toast.success("লগইন সফল হয়েছে");
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "লগইন ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-16 max-w-md mx-auto">
      <div className="card p-6">
        <h1 className="text-lg font-bold mb-4 text-center">লগইন করুন</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            type="email"
            placeholder="ইমেইল"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            required
            type="password"
            placeholder="পাসওয়ার্ড"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <button disabled={loading} type="submit" className="btn-primary w-full disabled:opacity-50">
            {loading ? "লগইন হচ্ছে..." : "লগইন"}
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          একাউন্ট নেই? <Link href="/signup" className="text-brand-600 font-medium">সাইন আপ করুন</Link>
        </p>
      </div>
    </div>
  );
}
