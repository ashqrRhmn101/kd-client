"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import api from "@/lib/api";

export default function NotificationBell() {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const load = () => api.get("/admin/orders/notifications").then(({ data }) => setOrders(data.orders));

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // poll every 30s for new orders
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = async () => {
    setOpen((o) => !o);
  };

  const handleMarkAllSeen = async () => {
    await api.patch("/admin/orders/notifications/mark-seen");
    setOrders([]);
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={handleOpen} className="relative p-2 rounded-full hover:bg-gray-100">
        <Bell className="w-5 h-5 text-gray-600" />
        {orders.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-secondary-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {orders.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
            <span className="text-sm font-semibold">নতুন অর্ডার ({orders.length})</span>
            {orders.length > 0 && (
              <button onClick={handleMarkAllSeen} className="text-xs text-primary-600 hover:underline">
                সব দেখা হয়েছে চিহ্নিত করুন
              </button>
            )}
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">কোনো নতুন অর্ডার নেই 🎉</p>
          ) : (
            orders.map((o) => (
              <Link
                key={o._id}
                href={`/admin/orders/${o._id}`}
                onClick={() => setOpen(false)}
                className="flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 text-sm border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="font-medium">#{o.orderNumber}</p>
                  <p className="text-xs text-gray-400">{o.user?.name || o.guestInfo?.name || "গেস্ট"}</p>
                </div>
                <span className="font-semibold text-primary-600">৳{o.grandTotal}</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
