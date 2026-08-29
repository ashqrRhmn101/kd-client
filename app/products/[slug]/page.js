"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { alertSuccess, alertError } from "@/lib/alert";
import api from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLoadingBar } from "@/context/LoadingBarContext";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";

const STORE_WHATSAPP = "8801XXXXXXXXX"; // TODO: replace with real WhatsApp business number
const STORE_PHONE = "+8801XXXXXXXXX"; // TODO: replace with real phone number

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { start } = useLoadingBar();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  const loadProduct = () => {
    api.get(`/products/${slug}`).then(({ data }) => {
      setProduct(data.product);
      setRelated(data.related);
    });
    // NOTE: reviews are fetched separately below using product._id once the
    // product loads (the reviews API needs the real Mongo ID, not the slug —
    // calling it with the slug here was a bug that caused a 404 every time).
  };

  useEffect(() => {
    loadProduct();
  }, [slug]);

  useEffect(() => {
    if (product) {
      api.get(`/products/${product._id}/reviews`).then(({ data }) => setReviews(data.reviews));
    }
  }, [product]);

  if (!product) return <div className="container-page py-16 text-center"><ClipLoader color="#16a34a" /></div>;

  const finalPrice = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    start();
    router.push("/checkout");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alertError("রিভিউ দিতে লগইন করুন");
    try {
      await api.post(`/products/${product._id}/reviews`, reviewForm);
      alertSuccess("রিভিউ জমা হয়েছে, অনুমোদনের অপেক্ষায় আছে");
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      alertError(err.response?.data?.message || "সমস্যা হয়েছে");
    }
  };

  return (
    <div className="container-page py-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden">
            <SafeImage
              src={product.images[activeImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
          <div className="flex gap-2 mt-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  i === activeImage ? "border-primary-500" : "border-transparent"
                }`}
              >
                <SafeImage src={img} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-2xl font-bold text-primary-600">৳{finalPrice}</span>
            {finalPrice < product.price && <span className="text-gray-400 line-through">৳{product.price}</span>}
          </div>
          <p className="text-sm text-gray-500 mt-1">{product.stock > 0 ? `স্টকে আছে (${product.stock})` : "স্টকে নেই"}</p>

          {product.variants?.map((variant) => (
            <div key={variant.name} className="mt-4">
              <label className="text-sm font-semibold block mb-1">{variant.name}</label>
              <div className="flex gap-2 flex-wrap">
                {variant.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVariant((prev) => ({ ...prev, [variant.name]: opt }))}
                    className={`px-3 py-1.5 rounded-lg border text-sm ${
                      selectedVariant[variant.name] === opt ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-3 mt-4">
            <label className="text-sm font-semibold">পরিমাণ</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-1">−</button>
              <span className="px-3">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-1">+</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              disabled={product.stock === 0}
              onClick={() => {
                addToCart(product, quantity, selectedVariant);
                alertSuccess("কার্টে যোগ হয়েছে");
              }}
              className="btn-outline disabled:opacity-40"
            >
              🛒 কার্টে যোগ করুন
            </button>
            <button disabled={product.stock === 0} onClick={handleBuyNow} className="btn-primary disabled:opacity-40">
              এখনই কিনুন
            </button>
          </div>

          <div className="flex gap-3 mt-3">
            <a
              href={`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(`আমি এই প্রোডাক্টে আগ্রহী: ${product.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium"
            >
              💬 WhatsApp
            </a>
            <a
              href={`tel:${STORE_PHONE}`}
              className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium"
            >
              📞 কল করুন
            </a>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold mb-2">বিস্তারিত</h2>
            <p className="text-sm text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-10">
        <h2 className="text-lg font-bold mb-4">রিভিউ ও রেটিং ({reviews.length})</h2>

        <form onSubmit={handleReviewSubmit} className="card p-4 mb-6 max-w-lg">
          <label className="text-sm font-semibold block mb-1">রেটিং দিন</label>
          <select
            value={reviewForm.rating}
            onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))}
            className="border border-gray-300 rounded-lg px-3 py-2 mb-3 w-full"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {"★".repeat(r)} ({r})
              </option>
            ))}
          </select>
          <textarea
            required
            value={reviewForm.comment}
            onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
            placeholder="আপনার অভিজ্ঞতা লিখুন..."
            className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-3"
            rows={3}
          />
          <button type="submit" className="btn-primary">রিভিউ জমা দিন</button>
        </form>

        <div className="space-y-4 max-w-lg">
          {reviews.length === 0 && <p className="text-gray-400 text-sm">এখনো কোনো রিভিউ নেই — প্রথম রিভিউটি আপনিই দিন!</p>}
          {reviews.map((r) => (
            <div key={r._id} className="card p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm">{r.name}</span>
                <span className="text-yellow-500 text-xs">{"★".repeat(r.rating)}</span>
              </div>
              <p className="text-sm text-gray-600">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold mb-4">সম্পর্কিত প্রোডাক্ট</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
