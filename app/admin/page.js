"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    api.get("/admin/dashboard").then(({ data }) => {
      setStats(data.stats);
      setRecentOrders(data.recentOrders);
    });
  }, []);

  const cards = [
    { label: "মোট অর্ডার", value: stats?.totalOrders ?? "-", icon: "🧾" },
    { label: "পেন্ডিং অর্ডার", value: stats?.pendingOrders ?? "-", icon: "⏳" },
    { label: "মোট বিক্রয়", value: stats ? `৳${stats.totalRevenue}` : "-", icon: "💰" },
    { label: "সক্রিয় প্রোডাক্ট", value: stats?.totalProducts ?? "-", icon: "📦" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">ড্যাশবোর্ড</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="card p-4">
            <div className="text-2xl">{c.icon}</div>
            <div className="text-2xl font-bold mt-1">{c.value}</div>
            <div className="text-sm text-gray-500">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">সাম্প্রতিক অর্ডার</h2>
          <Link href="/admin/orders" className="text-brand-600 text-sm">সব দেখুন →</Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="py-2">অর্ডার নং</th>
              <th>মোট</th>
              <th>স্ট্যাটাস</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o._id} className="border-b last:border-0">
                <td className="py-2">
                  <Link href={`/admin/orders/${o._id}`} className="text-brand-600">{o.orderNumber}</Link>
                </td>
                <td>৳{o.grandTotal}</td>
                <td className="capitalize">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
