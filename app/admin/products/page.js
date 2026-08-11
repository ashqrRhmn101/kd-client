"use client";
import { useEffect, useState } from "react";
import { alertSuccess, alertError, confirmDialog } from "@/lib/alert";
import api from "@/lib/api";

const EMPTY_FORM = {
  name: "",
  description: "",
  images: "",
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
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = () => api.get("/products", { params: { limit: 100 } }).then(({ data }) => setProducts(data.products));
  const loadCategories = () => api.get("/categories").then(({ data }) => setCategories(data.categories));

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      stock: Number(form.stock),
    };
    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload);
        alertSuccess("প্রোডাক্ট আপডেট হয়েছে");
      } else {
        await api.post("/admin/products", payload);
        alertSuccess("প্রোডাক্ট যোগ হয়েছে");
      }
      resetForm();
      loadProducts();
    } catch (err) {
      alertError(err.response?.data?.message || "সমস্যা হয়েছে");
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      images: p.images.join(", "),
      category: p.category?._id || p.category,
      price: p.price,
      discountPrice: p.discountPrice || "",
      stock: p.stock,
      isTopSelling: p.isTopSelling,
      isComboOffer: p.isComboOffer,
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const ok = await confirmDialog({ title: "প্রোডাক্ট ডিলিট করবেন?", text: "এই প্রোডাক্টটি আর দেখা যাবে না।" });
    if (!ok) return;
    await api.delete(`/admin/products/${id}`);
    alertSuccess("মুছে ফেলা হয়েছে");
    loadProducts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">প্রোডাক্ট ম্যানেজমেন্ট</h1>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary">
          {showForm ? "বন্ধ করুন" : "+ নতুন প্রোডাক্ট"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-4 mb-6 grid md:grid-cols-2 gap-3">
          <input required placeholder="প্রোডাক্টের নাম" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2" />
          <select required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2">
            <option value="">ক্যাটাগরি বাছাই করুন</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <input required type="number" placeholder="দাম (৳)" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2" />
          <input type="number" placeholder="ডিসকাউন্ট দাম (ঐচ্ছিক)" value={form.discountPrice} onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2" />
          <input required type="number" placeholder="স্টক পরিমাণ" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2" />
          <input required placeholder="ছবির URL (কমা দিয়ে আলাদা করুন)" value={form.images} onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 md:col-span-2" />
          <textarea required placeholder="প্রোডাক্ট বিবরণ" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 md:col-span-2" rows={3} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isTopSelling} onChange={(e) => setForm((f) => ({ ...f, isTopSelling: e.target.checked }))} />
            টপ সেলিং হিসেবে দেখান
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isComboOffer} onChange={(e) => setForm((f) => ({ ...f, isComboOffer: e.target.checked }))} />
            কম্বো অফার হিসেবে দেখান
          </label>
          <button type="submit" className="btn-primary md:col-span-2">
            {editingId ? "আপডেট করুন" : "প্রোডাক্ট যোগ করুন"}
          </button>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="p-3">নাম</th>
              <th>দাম</th>
              <th>স্টক</th>
              <th>একশন</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b last:border-0">
                <td className="p-3">{p.name}</td>
                <td>৳{p.price}</td>
                <td>{p.stock}</td>
                <td className="space-x-3">
                  <button onClick={() => handleEdit(p)} className="text-blue-600">এডিট</button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-600">ডিলিট</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        ক্যাটাগরি তৈরি করতে ব্যাকএন্ড API-তে POST /api/admin/categories কল করুন (Postman/Insomnia দিয়ে), অথবা পরবর্তীতে একটি ক্যাটাগরি ম্যানেজমেন্ট UI যোগ করা যাবে।
      </p>
    </div>
  );
}
