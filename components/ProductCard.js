"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap } from "lucide-react";
import { alertSuccess } from "@/lib/alert";
import { useCart } from "@/context/CartContext";
import { useLoadingBar } from "@/context/LoadingBarContext";
import SafeImage from "@/components/SafeImage";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const { start } = useLoadingBar();
  const finalPrice = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const handleBuyNow = () => {
    addToCart(product, 1);
    start();
    router.push("/checkout");
  };

  return (
    <div className="card overflow-hidden group hover:shadow-md transition-shadow">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square bg-gray-50">
          {product.images?.[0] && (
            <SafeImage
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 50vw, 200px"
            />
          )}
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
              স্টক নেই
            </span>
          )}
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-ink-900 line-clamp-2 min-h-[2.5rem] hover:text-primary-600">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-primary-600 font-bold">৳{finalPrice}</span>
          {hasDiscount && <span className="text-gray-400 text-xs line-through">৳{product.price}</span>}
        </div>
        {product.ratingCount > 0 && (
          <div className="text-xs text-yellow-500 mt-1">
            {"★".repeat(Math.round(product.ratingAvg))}
            {"☆".repeat(5 - Math.round(product.ratingAvg))}
            <span className="text-gray-400 ml-1">({product.ratingCount})</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-1.5 mt-2.5">
          <button
            disabled={product.stock === 0}
            onClick={() => {
              addToCart(product, 1);
              alertSuccess("কার্টে যোগ হয়েছে");
            }}
            title="কার্টে যোগ করুন"
            className="flex items-center justify-center gap-1 text-[11px] sm:text-xs font-semibold btn-outline !px-1.5 !py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">কার্টে যোগ</span>
          </button>
          <button
            disabled={product.stock === 0}
            onClick={handleBuyNow}
            title="এখনই কিনুন"
            className="flex items-center justify-center gap-1 text-[11px] sm:text-xs font-semibold btn-primary !px-1.5 !py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Zap className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">এখনই কিনুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
