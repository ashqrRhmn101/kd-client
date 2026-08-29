"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { Package } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const STATUS_COLOR = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get("/orders/my-orders").then(({ data }) => setOrders(data.orders)).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  if (authLoading) return <div className="container-page py-16 text-center"><ClipLoader color="#16a34a" /></div>;
  if (!user) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-gray-500 mb-4">অর্ডার দেখতে লগইন করুন</p>
        <Link href="/login" className="btn-primary">লগইন করুন</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-lg font-bold mb-6 flex items-center gap-2">
        <Package className="w-5 h-5 text-primary-600" /> আমার অর্ডার
      </h1>

      {loading ? (
        <div className="text-center py-10"><ClipLoader color="#16a34a" /></div>
      ) : orders.length === 0 ? (
        <p className="text-gray-400">এখনো কোনো অর্ডার করেননি।</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link key={o._id} href={`/orders/track?orderNumber=${o.orderNumber}`} className="card p-4 flex justify-between items-center hover:shadow-md">
              <div>
                <p className="font-semibold">#{o.orderNumber}</p>
                <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString("bn-BD")} • {o.items.length} টি প্রোডাক্ট</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary-600">৳{o.grandTotal}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_COLOR[o.status] || "bg-gray-100"}`}>{o.status}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
