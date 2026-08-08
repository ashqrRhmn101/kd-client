"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const [step, setStep] = useState(1); // 1 = details, 2 = OTP
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", otp: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email: form.email, purpose: "signup" });
      toast.success("আপনার ইমেইলে OTP পাঠানো হয়েছে");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP পাঠাতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", form);
      setUser(data.user);
      toast.success("একাউন্ট তৈরি হয়েছে!");
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "ভুল OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-16 max-w-md mx-auto">
      <div className="card p-6">
        <h1 className="text-lg font-bold mb-4 text-center">নতুন একাউন্ট তৈরি করুন</h1>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <input required name="name" placeholder="পূর্ণ নাম" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            <input required type="email" name="email" placeholder="ইমেইল" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            <input required name="phone" placeholder="ফোন নাম্বার" value={form.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            <input required type="password" name="password" placeholder="পাসওয়ার্ড (কমপক্ষে ৬ ক্যারেক্টার)" minLength={6} value={form.password} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            <button disabled={loading} type="submit" className="btn-primary w-full disabled:opacity-50">
              {loading ? "পাঠানো হচ্ছে..." : "OTP পাঠান"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-3">
            <p className="text-sm text-gray-500 text-center">{form.email} এ পাঠানো ৬ ডিজিটের কোড দিন</p>
            <input
              required
              name="otp"
              maxLength={6}
              placeholder="৬ ডিজিটের OTP"
              value={form.otp}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center text-xl tracking-widest"
            />
            <button disabled={loading} type="submit" className="btn-primary w-full disabled:opacity-50">
              {loading ? "যাচাই হচ্ছে..." : "যাচাই করে একাউন্ট তৈরি করুন"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-500">
              ← তথ্য পরিবর্তন করুন
            </button>
          </form>
        )}

        <p className="text-sm text-center mt-4">
          একাউন্ট আছে? <Link href="/login" className="text-brand-600 font-medium">লগইন করুন</Link>
        </p>
      </div>
    </div>
  );
}
