"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { Receipt, Clock, Wallet, Package, Bell } from "lucide-react";
import api from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then(({ data }) => {
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "মোট অর্ডার", value: stats?.totalOrders, icon: Receipt, color: "text-blue-600 bg-blue-50" },
    { label: "নতুন অর্ডার", value: stats?.newOrdersCount, icon: Bell, color: "text-secondary-600 bg-secondary-50" },
    { label: "পেন্ডিং অর্ডার", value: stats?.pendingOrders, icon: Clock, color: "text-yellow-600 bg-yellow-50" },
    { label: "মোট বিক্রয়", value: stats ? `৳${stats.totalRevenue}` : null, icon: Wallet, color: "text-primary-600 bg-primary-50" },
    { label: "সক্রিয় প্রোডাক্ট", value: stats?.totalProducts, icon: Package, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">ড্যাশবোর্ড</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card p-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.color}`}>
                <Icon className="w-[18px] h-[18px]" />
              </div>
              <div className="text-2xl font-bold mt-2">{c.value ?? (loading ? <ClipLoader size={16} color="#9ca3af" /> : 0)}</div>
              <div className="text-xs text-gray-500">{c.label}</div>
            </div>
          );
        })}
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">সাম্প্রতিক অর্ডার</h2>
          <Link href="/admin/orders" className="text-primary-600 text-sm">সব দেখুন →</Link>
        </div>
        {loading ? (
          <div className="py-8 text-center"><ClipLoader color="#16a34a" /></div>
        ) : (
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
                    <Link href={`/admin/orders/${o._id}`} className="text-primary-600">{o.orderNumber}</Link>
                  </td>
                  <td>৳{o.grandTotal}</td>
                  <td className="capitalize">{o.status}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={3} className="text-center text-gray-400 py-6">এখনো কোনো অর্ডার নেই</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
