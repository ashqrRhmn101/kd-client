"use client";
import { useEffect, useState } from "react";
import { Tag, Pencil, Trash2, RotateCcw } from "lucide-react";
import api from "@/lib/api";
import { alertSuccess, alertError, confirmDialog } from "@/lib/alert";
import ImageUploader from "@/components/ImageUploader";
import SafeImage from "@/components/SafeImage";

const EMPTY_FORM = { name: "", image: "", isActive: true };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const load = () => api.get("/admin/categories").then(({ data }) => setCategories(data.categories));
  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alertError("ক্যাটাগরির নাম দিন");
    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, form);
        alertSuccess("ক্যাটাগরি আপডেট হয়েছে");
      } else {
        await api.post("/admin/categories", form);
        alertSuccess("নতুন ক্যাটাগরি তৈরি হয়েছে");
      }
      resetForm();
      load();
    } catch (err) {
      alertError(err.response?.data?.message || "সমস্যা হয়েছে");
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, image: cat.image || "", isActive: cat.isActive });
    setEditingId(cat._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (cat) => {
    const ok = await confirmDialog({ title: `"${cat.name}" নিষ্ক্রিয় করবেন?`, text: "এটি হোমপেজ থেকে আর দেখা যাবে না, তবে পরে আবার চালু করা যাবে।" });
    if (!ok) return;
    await api.delete(`/admin/categories/${cat._id}`);
    alertSuccess("ক্যাটাগরি নিষ্ক্রিয় করা হয়েছে");
    load();
  };

  const handleReactivate = async (cat) => {
    await api.put(`/admin/categories/${cat._id}`, { isActive: true });
    alertSuccess("ক্যাটাগরি আবার চালু করা হয়েছে");
    load();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Tag className="w-5 h-5 text-primary-600" /> ক্যাটাগরি ম্যানেজমেন্ট
      </h1>

      <form onSubmit={handleSubmit} className="card p-4 mb-6 max-w-md space-y-3">
        <h2 className="font-semibold">{editingId ? "ক্যাটাগরি এডিট করুন" : "নতুন ক্যাটাগরি যোগ করুন"}</h2>
        <input
          required
          placeholder="ক্যাটাগরির নাম (যেমন: ইলেকট্রনিক্স)"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="input-field"
        />
        <div>
          <label className="text-sm font-medium block mb-1.5">ক্যাটাগরির ছবি</label>
          <ImageUploader folder="categories" value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1">
            {editingId ? "আপডেট করুন" : "তৈরি করুন"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-outline">
              বাতিল
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.length === 0 && <p className="text-gray-400 text-sm col-span-full">এখনো কোনো ক্যাটাগরি নেই — উপরের ফর্ম দিয়ে প্রথমটি তৈরি করুন।</p>}
        {categories.map((cat) => (
          <div key={cat._id} className={`card p-3 ${!cat.isActive ? "opacity-50" : ""}`}>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 mb-2">
              {cat.image ? (
                <SafeImage src={cat.image} alt={cat.name} fill className="object-cover" sizes="150px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Tag className="w-8 h-8" />
                </div>
              )}
            </div>
            <p className="text-sm font-medium truncate">{cat.name}</p>
            {!cat.isActive && <p className="text-[10px] text-red-500">নিষ্ক্রিয়</p>}
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(cat)} className="flex-1 text-xs flex items-center justify-center gap-1 text-blue-600 border border-blue-200 rounded-lg py-1.5 hover:bg-blue-50">
                <Pencil className="w-3 h-3" /> এডিট
              </button>
              {cat.isActive ? (
                <button onClick={() => handleDelete(cat)} className="flex-1 text-xs flex items-center justify-center gap-1 text-red-600 border border-red-200 rounded-lg py-1.5 hover:bg-red-50">
                  <Trash2 className="w-3 h-3" /> ডিলিট
                </button>
              ) : (
                <button onClick={() => handleReactivate(cat)} className="flex-1 text-xs flex items-center justify-center gap-1 text-green-600 border border-green-200 rounded-lg py-1.5 hover:bg-green-50">
                  <RotateCcw className="w-3 h-3" /> চালু করুন
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
