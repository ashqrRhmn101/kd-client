"use client";
import { useEffect, useState } from "react";
import { alertSuccess, alertError } from "@/lib/alert";
import api from "@/lib/api";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);

  const load = () => api.get("/admin/reviews/pending").then(({ data }) => setReviews(data.reviews)).catch(() => {});
  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await api.patch(`/admin/reviews/${id}/approve`);
    alertSuccess("রিভিউ অনুমোদন হয়েছে");
    load();
  };
  const reject = async (id) => {
    await api.delete(`/admin/reviews/${id}`);
    alertSuccess("রিভিউ বাতিল হয়েছে");
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">রিভিউ মডারেশন ({reviews.length} টি অপেক্ষমান)</h1>
      <div className="space-y-3">
        {reviews.length === 0 && <p className="text-gray-400">কোনো পেন্ডিং রিভিউ নেই</p>}
        {reviews.map((r) => (
          <div key={r._id} className="card p-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{r.name} — {r.product?.name}</span>
              <span className="text-yellow-500">{"★".repeat(r.rating)}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{r.comment}</p>
            <div className="space-x-3">
              <button onClick={() => approve(r._id)} className="text-green-600 text-sm font-medium">✓ অনুমোদন করুন</button>
              <button onClick={() => reject(r._id)} className="text-red-600 text-sm font-medium">✕ বাতিল করুন</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
