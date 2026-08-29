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
        <div className="relative aspect-square bg-gray-50 p-2">
          {product.images?.[0] && (
            <SafeImage
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain group-hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 25vw, 200px"
            />
          )}
          {hasDiscount && (
            <span className="absolute top-1.5 left-1.5 md:top-2 md:left-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">
              -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs md:text-base font-bold">
              স্টক নেই
            </span>
          )}
        </div>
      </Link>
      <div className="p-2 md:p-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-xs md:text-sm font-medium text-ink-900 line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] hover:text-primary-600">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 md:gap-2 mt-1 flex-wrap">
          <span className="text-primary-600 font-bold text-sm md:text-base">৳{finalPrice}</span>
          {hasDiscount && <span className="text-gray-400 text-[10px] md:text-xs line-through">৳{product.price}</span>}
        </div>
        {product.ratingCount > 0 && (
          <div className="text-[10px] md:text-xs text-yellow-500 mt-0.5">
            {"★".repeat(Math.round(product.ratingAvg))}
            {"☆".repeat(5 - Math.round(product.ratingAvg))}
            <span className="text-gray-400 ml-1">({product.ratingCount})</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-1.5 mt-2">
          <button
            disabled={product.stock === 0}
            onClick={() => {
              addToCart(product, 1);
              alertSuccess("কার্টে যোগ হয়েছে");
            }}
            title="কার্টে যোগ করুন"
            aria-label="কার্টে যোগ করুন"
            className="flex items-center justify-center btn-outline !px-1 !py-1.5 md:!px-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
            <span className="hidden md:inline text-xs font-semibold ml-1 truncate">কার্টে</span>
          </button>
          <button
            disabled={product.stock === 0}
            onClick={handleBuyNow}
            title="এখনই কিনুন"
            aria-label="এখনই কিনুন"
            className="flex items-center justify-center btn-primary !px-1 !py-1.5 md:!px-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
            <span className="hidden md:inline text-xs font-semibold ml-1 truncate">কিনুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
