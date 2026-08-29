"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { alertSuccess, alertError } from "@/lib/alert";
import api from "@/lib/api";
import ImageUploader from "@/components/ImageUploader";
import SafeImage from "@/components/SafeImage";

const EMPTY_FORM = {
  name: "",
  description: "",
  images: [],
  category: "",
  price: "",
  discountPrice: "",
  stock: "",
  isTopSelling: false,
  isComboOffer: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = () => api.get("/products", { params: { limit: 100 } }).then(({ data }) => setProducts(data.products));
  const loadCategories = () => api.get("/categories").then(({ data }) => setCategories(data.categories));

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) return alertError("অন্তত একটি ছবি আপলোড করুন");
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      stock: Number(form.stock),
    };
    try {
      await api.post("/admin/products", payload);
      alertSuccess("প্রোডাক্ট যোগ হয়েছে");
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadProducts();
    } catch (err) {
      alertError(err.response?.data?.message || "সমস্যা হয়েছে");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Package className="w-5 h-5 text-primary-600" /> প্রোডাক্ট ম্যানেজমেন্ট
        </h1>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> {showForm ? "বন্ধ করুন" : "নতুন প্রোডাক্ট"}
        </button>
      </div>

      {categories.length === 0 && (
        <div className="card p-4 mb-6 bg-secondary-50 border-secondary-200 text-sm">
          কোনো ক্যাটাগরি পাওয়া যায়নি — প্রোডাক্ট যোগ করার আগে{" "}
          <Link href="/admin/categories" className="text-secondary-600 font-semibold underline">
            প্রথমে একটি ক্যাটাগরি তৈরি করুন
          </Link>
          ।
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-4 mb-6 grid md:grid-cols-2 gap-3">
          <input required placeholder="প্রোডাক্টের নাম" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" />
          <select required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="input-field">
            <option value="">ক্যাটাগরি বাছাই করুন ({categories.length}টি পাওয়া গেছে)</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <input required type="number" placeholder="দাম (৳)" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="input-field" />
          <input type="number" placeholder="ডিসকাউন্ট দাম (ঐচ্ছিক)" value={form.discountPrice} onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))} className="input-field" />
          <input required type="number" placeholder="স্টক পরিমাণ" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="input-field" />
          <div className="md:col-span-2">
            <label className="text-sm font-medium block mb-1.5">প্রোডাক্টের ছবি (৩-৪টি)</label>
            <ImageUploader folder="products" values={form.images} onChange={(imgs) => setForm((f) => ({ ...f, images: imgs }))} max={4} />
          </div>
          <textarea required placeholder="প্রোডাক্ট বিবরণ" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input-field md:col-span-2" rows={3} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isTopSelling} onChange={(e) => setForm((f) => ({ ...f, isTopSelling: e.target.checked }))} />
            টপ সেলিং হিসেবে দেখান
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isComboOffer} onChange={(e) => setForm((f) => ({ ...f, isComboOffer: e.target.checked }))} />
            কম্বো অফার হিসেবে দেখান
          </label>
          <button type="submit" className="btn-primary md:col-span-2">প্রোডাক্ট যোগ করুন</button>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="p-3">প্রোডাক্ট</th>
              <th>দাম</th>
              <th>স্টক</th>
              <th>স্ট্যাটাস</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3">
                  <Link href={`/admin/products/${p._id}`} className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {p.images?.[0] && <SafeImage src={p.images[0]} alt={p.name} fill className="object-cover" sizes="40px" />}
                    </div>
                    <span className="group-hover:text-primary-600 group-hover:underline">{p.name}</span>
                  </Link>
                </td>
                <td>৳{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {p.stock > 0 ? "স্টকে আছে" : "স্টক নেই"}
                  </span>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={4} className="text-center text-gray-400 py-6">এখনো কোনো প্রোডাক্ট যোগ করা হয়নি</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-3">প্রোডাক্টের নামে ক্লিক করলে সেই প্রোডাক্টের এডিট/ডিলিট পেজে যাবেন।</p>
    </div>
  );
}
