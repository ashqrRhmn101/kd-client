"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

const STATUSES = ["", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/admin/orders", { params: { status: status || undefined, limit: 100 } }).then(({ data }) => setOrders(data.orders));
  }, [status]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">অর্ডার ম্যানেজমেন্ট</h1>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s || "সব স্ট্যাটাস"}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="p-3">অর্ডার নং</th>
              <th>গ্রাহক</th>
              <th>মোট</th>
              <th>পেমেন্ট</th>
              <th>স্ট্যাটাস</th>
              <th>তারিখ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b last:border-0">
                <td className="p-3">
                  <Link href={`/admin/orders/${o._id}`} className="text-primary-600 font-medium">{o.orderNumber}</Link>
                </td>
                <td>{o.user?.name || o.guestInfo?.name || "গেস্ট"}</td>
                <td>৳{o.grandTotal}</td>
                <td className="uppercase text-xs">{o.paymentMethod}</td>
                <td className="capitalize">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    o.status === "delivered" ? "bg-green-100 text-green-700" :
                    o.status === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>{o.status}</span>
                </td>
                <td className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString("bn-BD")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-4 text-gray-400 text-sm">কোনো অর্ডার নেই</p>}
      </div>
    </div>
  );
}
