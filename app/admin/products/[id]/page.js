"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { ArrowLeft, Trash2, Save } from "lucide-react";
import api from "@/lib/api";
import { alertSuccess, alertError, confirmDialog } from "@/lib/alert";
import ImageUploader from "@/components/ImageUploader";

export default function AdminProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/admin/products/${id}`).then(({ data }) => {
      const p = data.product;
      setForm({
        name: p.name,
        description: p.description,
        images: p.images,
        category: p.category?._id || p.category,
        price: p.price,
        discountPrice: p.discountPrice || "",
        stock: p.stock,
        isTopSelling: p.isTopSelling,
        isComboOffer: p.isComboOffer,
        isActive: p.isActive,
      });
    });
    api.get("/categories").then(({ data }) => setCategories(data.categories));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/admin/products/${id}`, {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        stock: Number(form.stock),
      });
      alertSuccess("প্রোডাক্ট আপডেট হয়েছে");
    } catch (err) {
      alertError(err.response?.data?.message || "সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = await confirmDialog({ title: "প্রোডাক্ট ডিলিট করবেন?", text: "এটি স্টোরফ্রন্ট থেকে আর দেখা যাবে না।" });
    if (!ok) return;
    await api.delete(`/admin/products/${id}`);
    alertSuccess("প্রোডাক্ট মুছে ফেলা হয়েছে");
    router.push("/admin/products");
  };

  if (!form) return <div className="py-16 text-center"><ClipLoader color="#16a34a" /></div>;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/products" className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1 mb-4">
        <ArrowLeft className="w-4 h-4" /> প্রোডাক্ট তালিকায় ফিরে যান
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">{form.name}</h1>
        <button onClick={handleDelete} className="flex items-center gap-1.5 text-red-600 text-sm border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50">
          <Trash2 className="w-4 h-4" /> ডিলিট করুন
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 grid md:grid-cols-2 gap-3">
        <input required placeholder="প্রোডাক্টের নাম" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" />
        <select required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="input-field">
          <option value="">ক্যাটাগরি বাছাই করুন</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <input required type="number" placeholder="দাম (৳)" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="input-field" />
        <input type="number" placeholder="ডিসকাউন্ট দাম (ঐচ্ছিক)" value={form.discountPrice} onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))} className="input-field" />
        <input required type="number" placeholder="স্টক পরিমাণ" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="input-field" />
        <div className="md:col-span-2">
          <label className="text-sm font-medium block mb-1.5">প্রোডাক্টের ছবি</label>
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
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
          সক্রিয় (আনচেক করলে স্টোরফ্রন্ট থেকে লুকানো থাকবে)
        </label>
        <button disabled={saving} type="submit" className="btn-primary md:col-span-2 flex items-center justify-center gap-2 disabled:opacity-60">
          {saving ? <ClipLoader size={18} color="#fff" /> : <><Save className="w-4 h-4" /> পরিবর্তন সংরক্ষণ করুন</>}
        </button>
      </form>
    </div>
  );
}
