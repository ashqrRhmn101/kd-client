"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { alertSuccess, alertError } from "@/lib/alert";
import api from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    fullAddress: "",
    city: "",
    area: "",
    paymentMethod: "cod",
  });
  const [placing, setPlacing] = useState(false);

  const deliveryCharge = form.city.trim().toLowerCase() === "dhaka" ? 60 : 120;
  const grandTotal = total + deliveryCharge;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return alertError("কার্ট খালি");
    setPlacing(true);
    try {
      const { data } = await api.post("/orders", {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          selectedVariant: i.selectedVariant,
        })),
        shippingAddress: { fullAddress: form.fullAddress, city: form.city, area: form.area, phone: form.phone },
        paymentMethod: form.paymentMethod,
        guestInfo: user ? undefined : { name: form.name, phone: form.phone, email: form.email },
      });
      clearCart();
      alertSuccess("অর্ডার সফল হয়েছে!");
      router.push(`/orders/track?orderNumber=${data.order.orderNumber}`);
    } catch (err) {
      alertError(err.response?.data?.message || "অর্ডার দিতে সমস্যা হয়েছে");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return <div className="container-page py-16 text-center text-gray-400">কার্ট খালি — আগে প্রোডাক্ট যোগ করুন।</div>;
  }

  return (
    <div className="container-page py-6">
      <h1 className="text-lg font-bold mb-4">চেকআউট</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {!user && (
            <div className="card p-4 space-y-3">
              <h2 className="font-semibold">যোগাযোগের তথ্য</h2>
              <input required name="name" placeholder="আপনার নাম" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              <input required name="phone" placeholder="ফোন নাম্বার" value={form.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              <input name="email" type="email" placeholder="ইমেইল (ঐচ্ছিক)" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              <p className="text-xs text-gray-400">লগইন ছাড়াই অর্ডার করা যাবে — অথবা <a href="/login" className="text-primary-600 underline">লগইন করুন</a></p>
            </div>
          )}

          <div className="card p-4 space-y-3">
            <h2 className="font-semibold">ডেলিভারি ঠিকানা</h2>
            {user && (
              <input required name="phone" placeholder="ফোন নাম্বার" value={form.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            )}
            <input required name="fullAddress" placeholder="সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা)" value={form.fullAddress} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            <div className="grid grid-cols-2 gap-3">
              <input required name="city" placeholder="শহর (যেমন: Dhaka)" value={form.city} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2" />
              <input name="area" placeholder="এলাকা" value={form.area} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2" />
            </div>
          </div>

          <div className="card p-4">
            <h2 className="font-semibold mb-3">পেমেন্ট মেথড</h2>
            <label className="flex items-center gap-2 mb-2">
              <input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === "cod"} onChange={handleChange} />
              💵 ক্যাশ অন ডেলিভারি
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="paymentMethod" value="bkash" checked={form.paymentMethod === "bkash"} onChange={handleChange} />
              📱 বিকাশ
            </label>
          </div>
        </div>

        <div className="card p-4 h-fit space-y-2">
          <h2 className="font-semibold mb-2">অর্ডার সারাংশ</h2>
          <div className="flex justify-between text-sm"><span>সাবটোটাল</span><span>৳{total}</span></div>
          <div className="flex justify-between text-sm"><span>ডেলিভারি চার্জ</span><span>৳{deliveryCharge}</span></div>
          <div className="flex justify-between font-bold border-t pt-2 mt-2"><span>সর্বমোট</span><span>৳{grandTotal}</span></div>
          <button disabled={placing} type="submit" className="btn-primary w-full mt-3 flex items-center justify-center gap-2 disabled:opacity-60">
            {placing ? <ClipLoader size={18} color="#fff" /> : "অর্ডার কনফার্ম করুন"}
          </button>
        </div>
      </form>
    </div>
  );
}
