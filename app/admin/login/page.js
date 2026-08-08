"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      if (data.user.role !== "admin") {
        toast.error("এই একাউন্টের অ্যাডমিন অ্যাক্সেস নেই");
        return;
      }
      setUser(data.user);
      router.push("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "লগইন ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-900">
      <div className="card p-6 w-full max-w-sm">
        <h1 className="text-lg font-bold mb-4 text-center">🔒 অ্যাডমিন লগইন</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input required type="email" placeholder="অ্যাডমিন ইমেইল" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          <input required type="password" placeholder="পাসওয়ার্ড" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          <button disabled={loading} type="submit" className="btn-primary w-full disabled:opacity-50">
            {loading ? "..." : "লগইন"}
          </button>
        </form>
      </div>
    </div>
  );
}
