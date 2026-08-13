"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import { Upload, X } from "lucide-react";
import api from "@/lib/api";
import { alertError } from "@/lib/alert";

/**
 * Drag/click image uploader. Uploads directly to Cloudinary via our backend
 * (POST /api/admin/upload). Works in two modes:
 *  - single: pass `value` (a URL string) + `onChange(url)`
 *  - multiple: pass `values` (array of URLs) + `onChange(array)`, up to `max` images
 */
export default function ImageUploader({ folder = "products", value, onChange, values, max = 4 }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const isMultiple = Array.isArray(values);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await api.post(`/admin/upload?folder=${folder}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.url;
  };

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;
    setUploading(true);
    try {
      if (isMultiple) {
        const remaining = max - values.length;
        const toUpload = files.slice(0, remaining);
        const urls = await Promise.all(toUpload.map(uploadFile));
        onChange([...values, ...urls]);
      } else {
        const url = await uploadFile(files[0]);
        onChange(url);
      }
    } catch (err) {
      alertError(err.response?.data?.message || "ছবি আপলোড করতে সমস্যা হয়েছে");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (i) => onChange(values.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {isMultiple &&
          values.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

        {!isMultiple && value && (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
            <Image src={value} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {(isMultiple ? values.length < max : !value) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-400 flex flex-col items-center justify-center text-gray-400 hover:text-primary-500 transition-colors"
          >
            {uploading ? <ClipLoader size={18} color="#16a34a" /> : (
              <>
                <Upload className="w-5 h-5" />
                <span className="text-[10px] mt-1">আপলোড</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={isMultiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-[11px] text-gray-400 mt-1">
        {isMultiple ? `সর্বোচ্চ ${max}টি ছবি, প্রতিটি ৫MB পর্যন্ত` : "একটি ছবি, ৫MB পর্যন্ত"}
      </p>
    </div>
  );
}
