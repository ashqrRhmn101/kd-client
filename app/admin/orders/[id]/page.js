"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { alertSuccess, alertError } from "@/lib/alert";
import api from "@/lib/api";

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: "", note: "", trackingId: "", courier: "" });

  const load = () => api.get(`/admin/orders/${id}`).then(({ data }) => {
    setOrder(data.order);
    setStatusForm((f) => ({ ...f, status: data.order.status, trackingId: data.order.trackingId || "", courier: data.order.courier || "" }));
  });

  useEffect(() => {
    load();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/admin/orders/${id}/status`, statusForm);
      alertSuccess("স্ট্যাটাস আপডেট হয়েছে");
      load();
    } catch (err) {
      alertError(err.response?.data?.message || "সমস্যা হয়েছে");
    }
  };

  if (!order) return <div className="py-16 text-center"><ClipLoader color="#16a34a" /></div>;

  const customer = order.user || order.guestInfo || {};

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold mb-1">অর্ডার #{order.orderNumber}</h1>
      <p className="text-sm text-gray-400 mb-6">{new Date(order.createdAt).toLocaleString("bn-BD")}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <h2 className="font-semibold mb-2">গ্রাহকের তথ্য</h2>
          <p className="text-sm">নাম: {customer.name}</p>
          <p className="text-sm">ফোন: {order.shippingAddress.phone}</p>
          {customer.email && <p className="text-sm">ইমেইল: {customer.email}</p>}
          <p className="text-sm mt-2">ঠিকানা: {order.shippingAddress.fullAddress}, {order.shippingAddress.area}, {order.shippingAddress.city}</p>
        </div>

        <div className="card p-4">
          <h2 className="font-semibold mb-2">পেমেন্ট</h2>
          <p className="text-sm uppercase">মেথড: {order.paymentMethod}</p>
          <p className="text-sm">স্ট্যাটাস: {order.paymentStatus}</p>
          <div className="border-t mt-3 pt-3 space-y-1 text-sm">
            <div className="flex justify-between"><span>সাবটোটাল</span><span>৳{order.itemsTotal}</span></div>
            <div className="flex justify-between"><span>ডেলিভারি</span><span>৳{order.deliveryCharge}</span></div>
            <div className="flex justify-between font-bold"><span>সর্বমোট</span><span>৳{order.grandTotal}</span></div>
          </div>
        </div>
      </div>

      <div className="card p-4 mt-6 overflow-x-auto">
        <h2 className="font-semibold mb-2">প্রোডাক্ট সমূহ</h2>
        <table className="w-full text-sm min-w-[420px]">
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-2">{item.name}</td>
                <td className="text-gray-400">{Object.entries(item.selectedVariant || {}).map(([k, v]) => `${k}: ${v}`).join(", ")}</td>
                <td>× {item.quantity}</td>
                <td className="text-right">৳{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleUpdate} className="card p-4 mt-6 space-y-3">
        <h2 className="font-semibold">স্ট্যাটাস আপডেট করুন</h2>
        <select value={statusForm.status} onChange={(e) => setStatusForm((f) => ({ ...f, status: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 w-full">
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input placeholder="কুরিয়ার (যেমন: Steadfast)" value={statusForm.courier} onChange={(e) => setStatusForm((f) => ({ ...f, courier: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
        <input placeholder="ট্র্যাকিং আইডি" value={statusForm.trackingId} onChange={(e) => setStatusForm((f) => ({ ...f, trackingId: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
        <textarea placeholder="নোট (ঐচ্ছিক)" value={statusForm.note} onChange={(e) => setStatusForm((f) => ({ ...f, note: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 w-full" rows={2} />
        <button type="submit" className="btn-primary">আপডেট করুন</button>
      </form>

      <div className="card p-4 mt-6">
        <h2 className="font-semibold mb-2">স্ট্যাটাস হিস্টোরি</h2>
        <ul className="text-sm space-y-1">
          {order.statusHistory.map((h, i) => (
            <li key={i} className="text-gray-500">
              {new Date(h.changedAt).toLocaleString("bn-BD")} — <span className="font-medium capitalize">{h.status}</span> {h.note && `(${h.note})`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
