"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { alertSuccess, alertError } from "@/lib/alert";
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
        alertError("এই একাউন্টের অ্যাডমিন অ্যাক্সেস নেই");
        return;
      }
      setUser(data.user);
      alertSuccess("স্বাগতম, অ্যাডমিন!");
      router.push("/admin");
    } catch (err) {
      alertError(err.response?.data?.message || "লগইন ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-900 bg-[radial-gradient(circle_at_top,_rgba(22,163,74,0.15),_transparent_60%)] px-4">
      <div className="card w-full max-w-sm p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-lg font-bold">অ্যাডমিন লগইন</h1>
          <p className="text-xs text-gray-400 mt-1">শুধুমাত্র অনুমোদিত অ্যাডমিনদের জন্য</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input required type="email" placeholder="অ্যাডমিন ইমেইল" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input-field pl-10" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input required type="password" placeholder="পাসওয়ার্ড" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="input-field pl-10" />
          </div>
          <button disabled={loading} type="submit" className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <ClipLoader size={18} color="#fff" /> : "লগইন"}
          </button>
        </form>
      </div>
    </div>
  );
}
