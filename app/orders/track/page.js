"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];
const STATUS_LABELS = {
  pending: "অর্ডার গৃহীত",
  confirmed: "কনফার্ম হয়েছে",
  processing: "প্রসেসিং",
  shipped: "শিপড",
  delivered: "ডেলিভারি সম্পন্ন",
  cancelled: "বাতিল হয়েছে",
};

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") || "");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const search = async (num) => {
    setError("");
    setOrder(null);
    try {
      const { data } = await api.get(`/orders/track/${num}`);
      setOrder(data.order);
    } catch {
      setError("এই অর্ডার নাম্বারে কোনো অর্ডার পাওয়া যায়নি");
    }
  };

  useEffect(() => {
    if (searchParams.get("orderNumber")) search(searchParams.get("orderNumber"));
  }, []);

  return (
    <div className="container-page py-10 max-w-xl mx-auto">
      <h1 className="text-lg font-bold mb-4">অর্ডার ট্র্যাক করুন</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search(orderNumber);
        }}
        className="flex gap-2 mb-6"
      >
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="অর্ডার নাম্বার লিখুন (যেমন: KD12345678)"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
        />
        <button type="submit" className="btn-primary">খুঁজুন</button>
      </form>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {order && (
        <div className="card p-4">
          <div className="flex justify-between mb-3">
            <span className="font-semibold">অর্ডার #{order.orderNumber}</span>
            <span className="text-primary-600 font-bold">৳{order.grandTotal}</span>
          </div>

          {order.status === "cancelled" ? (
            <p className="text-red-500 font-medium">এই অর্ডারটি বাতিল করা হয়েছে</p>
          ) : (
            <div className="flex justify-between mb-4">
              {STATUS_STEPS.map((s, i) => {
                const currentIdx = STATUS_STEPS.indexOf(order.status);
                const active = i <= currentIdx;
                return (
                  <div key={s} className="flex-1 text-center">
                    <div className={`w-6 h-6 mx-auto rounded-full text-xs flex items-center justify-center ${active ? "bg-primary-500 text-white" : "bg-gray-200"}`}>
                      {i + 1}
                    </div>
                    <p className="text-[10px] mt-1">{STATUS_LABELS[s]}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t pt-3 text-sm space-y-1">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>৳{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
